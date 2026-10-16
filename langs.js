//
// langs.js - реестр языков Codrift и парсеры для C++, Java, C#, JavaScript/TypeScript, Python.
//
// Контракт плагина языка:
//   {
//     id, name, exts: ['.ext', ...],
//     parse(path, text) → ParsedFile,              // единый формат (см. ниже)
//     isHeader?(path) → bool,                      // заголовок/интерфейс (для вида API)
//     hasHeaders: bool,                            // есть ли у языка заголовки; иначе любой файл - «API»
//     oop: bool,                                   // методы классов: obj.method() разрешается по имени метода
//     resolveImport?(file, imp, ctx) → [{kind: 'project'|'vendor'|'external', path}] | null
//   }
// ParsedFile: { path, lang, stats{total,code,comment,blank}, fileDoc, includes[{path,sys,line}], macros[],
//   funcs[{name,line,startLine,endLine,sig,doc,isStatic,isInline,container,calls,ids,memberCalls}],
//   decls[{name,line,startLine,sig,doc,container}], types[{name,kind,line,startLine,endLine,def,doc}], vars[],
//   fieldAssigns[], inits[], namespace? }
// Новый язык подключается вызовом CodriftLangs.register({...}) - модель, виды и экспорт работают сами.

(function (root) {
'use strict';
const P = root.CParser;
const langs = [];
const byExt = new Map();
function register(plugin) {
    langs.push(plugin);
    for (const e of plugin.exts) byExt.set(e.toLowerCase(), plugin);
}
const extOf = p => { const b = p.slice(p.lastIndexOf('/') + 1); const i = b.lastIndexOf('.'); return i < 0 ? '' : b.slice(i).toLowerCase(); };
const dirname = p => { const i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i); };
function normPath(p) {
    const out = [];
    for (const seg of p.split('/')) { if (!seg || seg === '.') continue; if (seg === '..') { if (out.length) out.pop(); else return null; } else out.push(seg); }
    return out.join('/');
}


// Индекс номеров строк по смещению (быстрее, чем считать каждый раз)
function lineIndex(text) { const starts = [0]; for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1); return idx => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (starts[m] <= idx) lo = m; else hi = m - 1; } return lo + 1; }; }

/* ======================================================================
   C - существующий парсер
   ====================================================================== */
register({
    id: 'c', name: 'C', exts: ['.c', '.h'], hasHeaders: true, oop: false,
    isHeader: p => /\.h$/i.test(p),
    parse: (path, text) => P.parseFile(path, text),
});

/* ======================================================================
   Общий парсер языков с фигурными скобками: C++, Java, C#, JavaScript/TypeScript
   ====================================================================== */
const CONTROL = ['if', 'for', 'while', 'switch', 'catch', 'return', 'new', 'else', 'do', 'try', 'with', 'sizeof', 'typeof', 'await', 'yield', 'throw',
    'case', 'delete', 'in', 'of', 'instanceof', 'super', 'this', 'base', 'using', 'lock', 'synchronized', 'foreach', 'fixed', 'checked', 'unchecked',
    'default', 'nameof', 'is', 'as', 'when', 'where', 'void', 'decltype', 'alignof', 'static_assert', 'noexcept', 'requires', 'operator', 'assert', 'function', 'import', 'export'];
const TYPE_KWS = new Set(['class', 'struct', 'interface', 'enum', 'record', 'namespace', 'union', 'trait', 'module', 'annotation']);


function makeBraceLang(cfg) {
    const NOT_CALL = new Set([...CONTROL, ...(cfg.notCall || [])]);
    const SKIP_IDS = new Set([...CONTROL, ...(cfg.keywords || [])]);

    // Поиск «имя ( параметры )» - заголовка функции/метода в высказывании stmt (до '{' или ';')
    function funcHead(stmt, scope, forDecl) {
        // Группы скобок верхнего уровня (вне [] и <...>-генериков не различаем - достаточно скобок)
        const groups = []; let depth = 0, bdepth = 0, open = -1;
        for (let i = 0; i < stmt.length; i++) {
            const v = stmt[i].v;
            if (v === '[') bdepth++; else if (v === ']') bdepth = Math.max(0, bdepth - 1);
            else if (v === '(') { if (depth === 0 && bdepth === 0) open = i; depth++; }
            else if (v === ')') { depth--; if (depth === 0 && open >= 0) { groups.push([open, i]); open = -1; } }
        }
        if (depth !== 0) return null; // незакрытая скобка: '{' внутри вызова (лямбда/объект) - это не заголовок
        const has = (from, to, set) => { for (let i = from; i < to; i++) if (set.has(stmt[i].v)) return true; return false; };
        // JS/TS: «function name(», «name = (…) => {», «name: function(», «name = async (…) => {»
        if (cfg.js) {
            const fi = stmt.findIndex(x => x.v === 'function');
            if (fi >= 0) {
                let ni = fi + 1; if (stmt[ni] && stmt[ni].v === '*') ni++;
                if (stmt[ni] && stmt[ni].t === 'id' && stmt[ni + 1] && (stmt[ni + 1].v === '(' || stmt[ni + 1].v === '<')) return { name: stmt[ni].v, nameIdx: ni, close: groups.length ? groups[groups.length - 1][1] : ni };
                // анонимная function(...) - имя из присваивания «x = function»/«x: function»
                const eq = fi - 1; if (stmt[eq] && (stmt[eq].v === '=' || stmt[eq].v === ':') && stmt[eq - 1] && stmt[eq - 1].t === 'id') return { name: stmt[eq - 1].v, nameIdx: eq - 1, close: groups.length ? groups[groups.length - 1][1] : fi };
                return null;
            }
            const ai = stmt.findIndex((x, i) => x.v === '=' && stmt[i + 1] && stmt[i + 1].v === '>');
            if (ai >= 0) {
                // «… = (…) => {» или «name => {»: имя - перед ближайшим '=' или ':' слева от параметров
                let j = ai - 1; while (j >= 0 && stmt[j].v !== '=' && stmt[j].v !== ':') { if (stmt[j].v === ')' || stmt[j].v === '(' || stmt[j].t === 'id' || stmt[j].v === ',' || stmt[j].v === '.' || stmt[j].v === '?' || stmt[j].v === '<' || stmt[j].v === '>' || stmt[j].v === '[' || stmt[j].v === ']') j--; else break; }
                if (j > 0 && (stmt[j].v === '=' || stmt[j].v === ':') && stmt[j - 1].t === 'id' && !NOT_CALL.has(stmt[j - 1].v)) return { name: stmt[j - 1].v, nameIdx: j - 1, close: ai };
                return null;
            }
        }
        for (const [o, c] of groups) {
            let ni = o - 1;
            // TS/Java/C# генерики: name<T>(…)
            if (stmt[ni] && stmt[ni].v === '>') { let d = 0; for (; ni >= 0; ni--) { if (stmt[ni].v === '>') d++; else if (stmt[ni].v === '<') { d--; if (!d) { ni--; break; } } } }
            const nt = stmt[ni];
            if (!nt || nt.t !== 'id' || NOT_CALL.has(nt.v)) continue;
            const pv = stmt[ni - 1];
            if (pv && (pv.v === '@' || pv.v === '.' || pv.v === '->')) continue; // аннотация / вызов метода
            // После параметров - только «хвост» заголовка (const, throws X, : base(...), -> T, : Type …), без присваиваний
            let bad = false;
            for (let k = c + 1; k < stmt.length; k++) { const v = stmt[k].v; if (v === '=' && !(cfg.cpp && forDecl)) { bad = true; break; } }
            if (bad) continue;
            // Тип/модификаторы перед именем (или конструктор класса / метод в классе JS)
            const before = ni - (stmt[ni - 1] && stmt[ni - 1].v === '::' ? 2 : 0);
            if (cfg.js) { if (scope.kind !== 'class' && before < 1 && !forDecl) { if (scope.kind === 'block') return { name: nt.v, nameIdx: ni, close: c }; continue; } }
            else if (before < 1 && !(scope.kind === 'class' && nt.v === scope.name) && !(cfg.cpp && stmt[ni - 1] && stmt[ni - 1].v === '::')) continue;
            if (has(0, ni, new Set(['=', 'return']))) continue;
            const qual = cfg.cpp && stmt[ni - 1] && stmt[ni - 1].v === '::' && stmt[ni - 2] && stmt[ni - 2].t === 'id' ? stmt[ni - 2].v : null;
            return { name: nt.v, nameIdx: ni, close: c, qual };
        }
        return null;
    }
    // Объявление типа/пространства имён: последнее ключевое слово class/struct/… и имя после него
    function typeHead(stmt) {
        let depth = 0;
        for (let i = stmt.length - 1; i >= 0; i--) {
            const v = stmt[i].v;
            // template<class T> / Foo<T extends Bar> - ключевые слова внутри <...> не объявляют тип
            if (v === ')' || v === ']' || v === '>') depth++; else if (v === '>>') depth += 2; else if (v === '(' || v === '[' || v === '<') depth--;
            if (depth || !TYPE_KWS.has(v)) continue;
            // C#: class Foo<T> where T : class - ограничение, а не объявление
            if (cfg.cs && stmt[i - 1] && (stmt[i - 1].v === ':' || stmt[i - 1].v === ',')) continue;
            if (cfg.cpp && v === 'enum' && stmt[i + 1] && (stmt[i + 1].v === 'class' || stmt[i + 1].v === 'struct')) i++;
            if (cfg.js && (v === 'namespace' || v === 'module') && !(stmt[i + 1] && stmt[i + 1].t === 'id')) continue;
            let name = null, j = i + 1;
            // class SPDLOG_API logger / class DLL_EXPORT Foo - макрос экспорта перед именем пропускаем
            while (stmt[j] && stmt[j].t === 'id' && /^[A-Z][A-Z0-9_]{2,}$/.test(stmt[j].v) && stmt[j + 1] && stmt[j + 1].t === 'id' && !/^(extends|implements|final|sealed|abstract)$/.test(stmt[j + 1].v)) j++;
            if (stmt[j] && stmt[j].t === 'id') {
                name = stmt[j].v;
                while (stmt[j + 1] && (stmt[j + 1].v === '.' || stmt[j + 1].v === '::') && stmt[j + 2] && stmt[j + 2].t === 'id') { name += '.' + stmt[j + 2].v; j += 2; }
            } else if (cfg.js) { const eq = stmt.findIndex(x => x.v === '='); if (eq > 0 && stmt[eq - 1].t === 'id') name = stmt[eq - 1].v; }
            const kind = stmt[i].v === 'class' && stmt[i - 1] && stmt[i - 1].v === 'enum' ? 'enum' : stmt[i].v;
            return { kind: kind === 'module' ? 'namespace' : kind, name, idx: i };
        }
        return null;
    }

    function parse(path, text) {
        const s = P.scan(text, { backtick: !!cfg.js, verbatim: !!cfg.cs, raw: !!cfg.cpp });
        let clean = s.clean, includes = [], macros = [];
        if (cfg.cpp) { const pp = P.preprocess(s.noComm, s.clean); clean = pp.clean; includes = pp.includes; macros = pp.macros; for (const m of macros) { m.calls = []; m.ids = []; } }
        else clean = clean.replace(/^[ \t]*#.*$/gm, m => ' '.repeat(m.length)); // C# #region/#if, JS shebang
        if (cfg.imports) includes = includes.concat(cfg.imports(s.noComm));
        const toks = P.tokenize(clean);
        const match = P.braceMatch(toks);
        const di = P.docIndex(s.comments);
        const docAt = (start, line) => di.above(start) || di.trailing(line) || '';
        const funcs = [], decls = [], types = [], namespaces = [];
        const sigOf = (stmt, close) => s.noComm.slice(stmt[0].o, stmt[Math.min(close, stmt.length - 1)].o + 1).replace(/\s+/g, ' ').trim();
        const mods = (stmt, ni) => stmt.slice(0, ni).map(x => x.v);
        function walk(from, to, scope) {
            let stmt = [];
            for (let i = from; i < to; i++) {
                const t = toks[i];
                if (t.v === '{') {
                    const end = match[i] >= 0 ? match[i] : to;
                    const th = typeHead(stmt);
                    if (th && (th.name || cfg.js)) {
                        if (th.kind === 'namespace') { namespaces.push(th.name); walk(i + 1, end, { kind: 'ns', name: th.name, parent: scope }); }
                        else {
                            types.push({ name: th.name || '(anon)', kind: th.kind, line: stmt[th.idx].l, startLine: stmt[0].l, endLine: toks[end] ? toks[end].l : t.l, def: true, doc: docAt(stmt[0].l, stmt[th.idx].l), container: scope.kind === 'class' ? scope.name : null });
                            walk(i + 1, end, { kind: 'class', name: th.name || '(anon)', parent: scope });
                        }
                        stmt = []; i = end; continue;
                    }
                    const fh = funcHead(stmt, scope, false);
                    if (fh) {
                        const m = mods(stmt, fh.nameIdx);
                        const container = fh.qual || (scope.kind === 'class' ? scope.name : null);
                        funcs.push({
                            name: fh.name, line: stmt[fh.nameIdx].l, startLine: stmt[0].l, endLine: toks[end] ? toks[end].l : t.l,
                            sig: sigOf(stmt, fh.close), doc: docAt(stmt[0].l, stmt[fh.nameIdx].l), container,
                            isStatic: m.includes('static') && !cfg.oopStatic ? true : m.includes('private'), isInline: m.includes('inline'),
                            ...P.bodyRefs(toks, i + 1, end, NOT_CALL, SKIP_IDS, true),
                        });
                        // Вложенные классы/функции внутри тел (JS-замыкания и локальные классы) тоже видны
                        if (cfg.js) walk(i + 1, end, { kind: 'block', parent: scope });
                        stmt = []; i = end; continue;
                    }
                    // Прочие блоки: в JS заходим внутрь (объекты с методами, IIFE, export default {...}); в остальных - пропускаем
                    if (cfg.js || scope.kind === 'ns') walk(i + 1, end, scope.kind === 'class' ? scope : { kind: cfg.js ? 'block' : scope.kind, name: scope.name, parent: scope });
                    stmt = []; i = end; continue;
                }
                if (t.v === '}') { stmt = []; continue; }
                if (t.v === ';') {
                    // Объявление без тела: прототип C++ / метод интерфейса Java/C# / абстрактный метод
                    if (stmt.length && (cfg.cpp || scope.kind === 'class')) {
                        const fh = funcHead(stmt, scope, true);
                        if (fh && !stmt.some(x => x.v === 'return')) decls.push({ name: fh.name, line: stmt[fh.nameIdx].l, startLine: stmt[0].l, sig: sigOf(stmt, fh.close), doc: docAt(stmt[0].l, stmt[fh.nameIdx].l), container: fh.qual || (scope.kind === 'class' ? scope.name : null), isStatic: false });
                    }
                    stmt = []; continue;
                }
                stmt.push(t);
            }
        }
        walk(0, toks.length, { kind: 'file', name: null });
        // Шапка файла
        const parts = []; let prevEnd = 0;
        for (const c of s.comments) { if (c.trailing || c.l > prevEnd + 2) break; parts.push(P.cleanComment(c.text)); prevEnd = c.el; }
        const ns = (cfg.namespaceOf && cfg.namespaceOf(s.noComm)) || namespaces[0] || null;
        return { path, stats: s.stats, includes, macros, fileDoc: parts.filter(Boolean).join('\n').trim(), funcs, decls, types, vars: [], fieldAssigns: P.fieldAssigns(toks), inits: [], namespace: ns, namespaces };
    }
    return parse;
}


// Индекс файлов по пространствам имён/пакетам (строится один раз на модель)
function nsIndex(ctx) {
    if (ctx._ns) return ctx._ns;
    const m = new Map();
    for (const f of ctx.files.values()) for (const n of (f.namespaces && f.namespaces.length ? f.namespaces : f.namespace ? [f.namespace] : [])) { if (!m.has(n)) m.set(n, []); m.get(n).push(f.path); }
    return (ctx._ns = m);
}


// Поиск файла по «хвосту» пути среди файлов проекта / всех файлов репозитория
function bySuffix(ctx, suffix) {
    const sfx = '/' + suffix.toLowerCase();
    for (const p of ctx.files.keys()) if (('/' + p.toLowerCase()).endsWith(sfx)) return { kind: 'project', path: p };
    for (const p of ctx.allPaths) if (('/' + p.toLowerCase()).endsWith(sfx)) return { kind: 'vendor', path: p };
    return null;
}

/* ----- C++ ----- */
register({
    id: 'cpp', name: 'C++', exts: ['.cpp', '.cc', '.cxx', '.c++', '.hpp', '.hh', '.hxx', '.h++', '.ipp', '.tpp', '.inl', '.ixx', '.cppm'], hasHeaders: true, oop: true,
    isHeader: p => /\.(hpp|hh|hxx|h\+\+|ipp|tpp|inl|h)$/i.test(p),
    parse: makeBraceLang({ cpp: true, notCall: ['static_cast', 'dynamic_cast', 'reinterpret_cast', 'const_cast', 'template', 'typename'], keywords: ['auto', 'const', 'constexpr', 'static', 'virtual', 'override', 'final', 'public', 'private', 'protected', 'template', 'typename', 'class', 'struct', 'namespace', 'nullptr', 'true', 'false', 'int', 'char', 'bool', 'float', 'double', 'long', 'short', 'unsigned', 'signed'] }),
    // #include разрешается как в C (родная логика модели)
});

/* ----- Java ----- */
register({
    id: 'java', name: 'Java', exts: ['.java'], hasHeaders: false, oop: true,
    parse: makeBraceLang({
        oopStatic: true,
        keywords: ['public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface', 'enum', 'extends', 'implements', 'null', 'true', 'false', 'int', 'long', 'boolean', 'char', 'byte', 'short', 'float', 'double', 'var'],
        imports: src => { const out = []; const li = lineIndex(src); const re = /^\s*import\s+(static\s+)?([\w.]+)(\.\*)?\s*;/gm; let m; while ((m = re.exec(src))) out.push({ path: m[2] + (m[3] ? '.*' : ''), sys: false, line: li(m.index), kind: 'import' }); return out; },
        namespaceOf: src => { const m = /^\s*package\s+([\w.]+)\s*;/m.exec(src); return m ? m[1] : null; },
    }),
    resolveImport(f, imp, ctx) {
        const mod = imp.path;
        if (mod.endsWith('.*')) { const files = nsIndex(ctx).get(mod.slice(0, -2)); return files ? files.slice(0, 40).map(p => ({ kind: 'project', path: p })) : [{ kind: 'external', path: mod }]; }
        const parts = mod.split('.');
        // a.b.C → a/b/C.java; static импорт a.b.C.m → a/b/C.java
        for (let k = parts.length; k >= 2; k--) { const r = bySuffix(ctx, parts.slice(0, k).join('/') + '.java'); if (r) return [r]; }
        return [{ kind: 'external', path: mod }];
    },
});

/* ----- C# ----- */
register({
    id: 'cs', name: 'C#', exts: ['.cs'], hasHeaders: false, oop: true,
    parse: makeBraceLang({
        cs: true, oopStatic: true,
        keywords: ['public', 'private', 'protected', 'internal', 'static', 'readonly', 'sealed', 'abstract', 'virtual', 'override', 'async', 'partial', 'class', 'struct', 'interface', 'enum', 'record', 'namespace', 'null', 'true', 'false', 'var', 'int', 'long', 'bool', 'string', 'object', 'float', 'double', 'decimal', 'void', 'get', 'set', 'init', 'value'],
        notCall: ['nameof', 'typeof', 'sizeof', 'default', 'stackalloc'],
        imports: src => { const out = []; const li = lineIndex(src); const re = /^\s*(?:global\s+)?using\s+(?:static\s+)?(?:\w+\s*=\s*)?([\w.]+)\s*;/gm; let m; while ((m = re.exec(src))) out.push({ path: m[1], sys: false, line: li(m.index), kind: 'using' }); return out; },
        namespaceOf: src => { const m = /\bnamespace\s+([\w.]+)/.exec(src); return m ? m[1] : null; },
    }),
    resolveImport(f, imp, ctx) {
        const files = nsIndex(ctx).get(imp.path);
        if (files) return files.filter(p => p !== f.path).slice(0, 40).map(p => ({ kind: 'project', path: p }));
        return [{ kind: 'external', path: imp.path }];
    },
});

/* ----- JavaScript / TypeScript ----- */
const JS_EXTS = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'];
register({
    id: 'js', name: 'JS/TS', exts: [...JS_EXTS], hasHeaders: false, oop: true,
    isHeader: p => /\.d\.ts$/i.test(p),
    parse: makeBraceLang({
        js: true, oopStatic: true,
        keywords: ['const', 'let', 'var', 'async', 'static', 'get', 'set', 'public', 'private', 'protected', 'readonly', 'export', 'default', 'from', 'as', 'type', 'interface', 'enum', 'declare', 'abstract', 'implements', 'extends', 'null', 'undefined', 'true', 'false', 'arguments', 'console', 'window', 'document'],
        notCall: ['require'],
        imports: src => {
            const out = []; const li = lineIndex(src);
            const res = [/(?:^|[^\w$.])import\s+(?:type\s+)?(?:[\w$*{}\s,]+?\s+from\s+)?['"]([^'"]+)['"]/g, /\bexport\s+(?:type\s+)?(?:\*(?:\s+as\s+\w+)?|\{[^}]*\})\s*from\s*['"]([^'"]+)['"]/g, /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g, /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g];
            for (const re of res) { let m; while ((m = re.exec(src))) out.push({ path: m[1], sys: !/^[./]/.test(m[1]), line: li(m.index), kind: 'import' }); }
            return out;
        },
    }),
    resolveImport(f, imp, ctx) {
        const spec = imp.path;
        if (!/^[./]/.test(spec)) return [{ kind: 'external', path: spec.split('/').slice(0, spec.startsWith('@') ? 2 : 1).join('/') }];
        const base = normPath(spec.startsWith('/') ? spec.slice(1) : dirname(f.path) + '/' + spec);
        if (base == null) return [{ kind: 'external', path: spec }];
        const stripped = base.replace(/\.(js|mjs|cjs|jsx)$/, ''); // TS-импорты пишут .js, а файл - .ts
        const cands = [base, ...JS_EXTS.map(e => stripped + e), stripped + '.d.ts', ...JS_EXTS.map(e => base + '/index' + e)];
        for (const c of cands) if (ctx.files.has(c)) return [{ kind: 'project', path: c }];
        for (const c of cands) if (ctx.allPaths.has(c)) return [{ kind: 'vendor', path: c }];
        return [{ kind: 'external', path: spec }];
    },
});

/* ======================================================================
   Python - блоки по отступам
   ====================================================================== */
const PY_NOT_CALL = new Set(['if', 'elif', 'while', 'for', 'return', 'and', 'or', 'not', 'in', 'is', 'lambda', 'with', 'assert', 'del', 'yield', 'await', 'except', 'raise', 'print', 'class', 'def', 'async', 'import', 'from', 'as', 'global', 'nonlocal', 'pass', 'super', 'isinstance', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'bool', 'type', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'open', 'getattr', 'setattr', 'hasattr', 'min', 'max', 'sum', 'any', 'all', 'iter', 'next', 'repr', 'format', 'id', 'hash', 'abs', 'round', 'reversed', 'vars', 'callable']);
const PY_SKIP = new Set([...PY_NOT_CALL, 'self', 'cls', 'True', 'False', 'None', 'else', 'try', 'finally', 'break', 'continue']);
// Комментарии «#» и строки (в т.ч. тройные) → очищенный текст той же длины + статистика строк
function scanPython(text) {
    const n = text.length, nc = text.split(''), cl = text.split('');
    let code = 0, comment = 0, blank = 0, total = 0, lineCode = false, lineComm = false, ln = 1;
    const comments = [];
    const endLine = () => { total++; if (lineCode) code++; else if (lineComm) comment++; else blank++; lineCode = lineComm = false; };
    for (let i = 0; i < n; i++) {
        const c = text[i];
        if (c === '\n') { endLine(); ln++; continue; }
        if (c === '\r') continue;
        if (c === '#') {
            const e = text.indexOf('\n', i); const end = e < 0 ? n : e;
            comments.push({ s: i, e: end, l: ln, el: ln, trailing: lineCode, text: text.slice(i, end) });
            for (let k = i; k < end; k++) if (text[k] !== '\r') { nc[k] = ' '; cl[k] = ' '; }
            lineComm = true; i = end - 1; continue;
        }
        if (c === '"' || c === "'") {
            const triple = text.substr(i, 3) === c + c + c, q = triple ? c + c + c : c;
            let j = i + q.length;
            while (j < n) { if (text[j] === '\\') { j += 2; continue; } if (text.substr(j, q.length) === q) break; if (!triple && text[j] === '\n') break; j++; }
            const end = Math.min(n, j + q.length);
            for (let k = i + q.length; k < Math.min(j, n); k++) { if (text[k] === '\n') { endLine(); ln++; lineCode = true; } else if (text[k] !== '\r') cl[k] = ' '; }
            lineCode = true; i = end - 1; continue;
        }
        if (c !== ' ' && c !== '\t') lineCode = true;
    }
    if (n > 0 && text[n - 1] !== '\n') endLine();
    return { stats: { total, code, comment, blank }, noComm: nc.join(''), clean: cl.join(''), comments };
}


function docstringAt(noComm, lines, lineNo) {
    // Первая непустая строка тела: строковый литерал → docstring
    for (let i = lineNo; i < Math.min(lines.length, lineNo + 3); i++) {
        const L = lines[i]; if (!L.trim()) continue;
        const m = /^\s*[rRuUbBfF]{0,2}("""|'''|"|')/.exec(L);
        if (!m) return '';
        const q = m[1], start = L.indexOf(q) + q.length;
        let txt = L.slice(start), j = i;
        while (txt.indexOf(q) < 0 && j + 1 < lines.length && q.length === 3) txt += '\n' + lines[++j];
        const end = txt.indexOf(q);
        return (end >= 0 ? txt.slice(0, end) : txt).split('\n').map(x => x.trim()).join('\n').trim();
    }
    return '';
}


function parsePython(path, text) {
    const s = scanPython(text);
    const lines = s.clean.split('\n'), raw = s.noComm.split('\n');
    const funcs = [], types = [], includes = [], vars = [];
    const di = P.docIndex(s.comments);
    const stack = []; // {indent, kind, name, line, startLine, obj}
    const indentOf = L => { let w = 0; for (const ch of L) { if (ch === ' ') w++; else if (ch === '\t') w += 8; else break; } return w; };
    let lastCode = 0, decoStart = 0, depth = 0;
    const close = (uptoIndent, lineNo) => { while (stack.length && stack[stack.length - 1].indent >= uptoIndent) { const b = stack.pop(); b.obj.endLine = Math.max(b.obj.line, lastCode); } };
    for (let i = 0; i < lines.length; i++) {
        const L = lines[i], tr = L.trim(), lineNo = i + 1;
        if (!tr) continue;
        // Продолжение многострочного выражения (внутри скобок) - не начало нового оператора
        if (depth > 0) { for (const ch of L) { if ('([{'.includes(ch)) depth++; else if (')]}'.includes(ch)) depth--; } lastCode = lineNo; continue; }
        const ind = indentOf(L);
        close(ind, lineNo);
        for (const ch of L) { if ('([{'.includes(ch)) depth++; else if (')]}'.includes(ch)) depth--; }
        if (depth < 0) depth = 0;
        let m;
        if (tr.startsWith('@')) { if (!decoStart) decoStart = lineNo; lastCode = lineNo; continue; }
        if ((m = /^(async\s+)?def\s+([A-Za-z_]\w*)\s*\(/.exec(tr))) {
            const cls = stack.length && stack[stack.length - 1].kind === 'class' ? stack[stack.length - 1].name : null;
            const fn = { name: m[2], line: lineNo, startLine: decoStart || lineNo, endLine: lineNo, sig: raw[i].trim().replace(/:\s*$/, ''), container: cls, isStatic: m[2].startsWith('_') && !m[2].startsWith('__'), isInline: false, doc: '' };
            fn.doc = docstringAt(s.noComm, raw, i + 1) || di.above(fn.startLine);
            funcs.push(fn); stack.push({ indent: ind, kind: 'def', name: m[2], obj: fn, bodyFrom: i + 1 });
        } else if ((m = /^class\s+([A-Za-z_]\w*)/.exec(tr))) {
            const ty = { name: m[1], kind: 'class', line: lineNo, startLine: decoStart || lineNo, endLine: lineNo, def: true, doc: '' };
            ty.doc = docstringAt(s.noComm, raw, i + 1) || di.above(ty.startLine);
            types.push(ty); stack.push({ indent: ind, kind: 'class', name: m[1], obj: ty });
        } else if ((m = /^import\s+(.+)$/.exec(tr)) && !stack.some(b => b.kind === 'def')) {
            for (const part of m[1].split(',')) { const mod = part.trim().split(/\s+as\s+/)[0].trim(); if (mod) includes.push({ path: mod, sys: false, line: lineNo, kind: 'import' }); }
        } else if ((m = /^from\s+(\.*[\w.]*)\s+import\s+(.+)$/.exec(tr))) {
            const names = m[2].replace(/[()]/g, '').split(',').map(x => x.trim().split(/\s+as\s+/)[0].trim()).filter(x => x && x !== '\\');
            includes.push({ path: m[1], sys: false, line: lineNo, kind: 'from', names });
        } else if (!stack.length && (m = /^([A-Z_][A-Z0-9_]*)\s*(?::[^=]+)?=(?!=)/.exec(tr))) {
            vars.push({ name: m[1], line: lineNo, startLine: lineNo, isStatic: false, isExtern: false, def: true, sig: raw[i].trim().slice(0, 120), doc: di.trailing(lineNo) || di.above(lineNo) });
        }
        decoStart = 0; lastCode = lineNo;
    }
    lastCode = lines.length; close(-1);
    // Тела функций: вызовы и ссылки (вложенные функции - отдельные узлы, их строки из тела родителя не вычитаем)
    const toks = P.tokenize(s.clean);
    for (const fn of funcs) {
        let a = 0, b = toks.length;
        while (a < toks.length && toks[a].l <= fn.line) a++;
        b = a; while (b < toks.length && toks[b].l <= fn.endLine) b++;
        Object.assign(fn, P.bodyRefs(toks, a, b, PY_NOT_CALL, PY_SKIP));
    }
    const mdoc = docstringAt(s.noComm, raw, 0);
    return { path, stats: s.stats, includes, macros: [], fileDoc: mdoc, funcs, decls: [], types, vars, fieldAssigns: [], inits: [] };
}
register({
    id: 'py', name: 'Python', exts: ['.py', '.pyi', '.pyw'], hasHeaders: false, oop: true,
    isHeader: p => /\.pyi$/i.test(p),
    parse: parsePython,
    resolveImport(f, imp, ctx) {
        const tryMod = (dir, mod) => {
            const rel = mod.split('.').filter(Boolean).join('/');
            const base = normPath((dir ? dir + '/' : '') + rel);
            if (base == null) return null;
            for (const c of [base + '.py', base + '/__init__.py', base + '.pyi']) { if (ctx.files.has(c)) return { kind: 'project', path: c }; if (ctx.allPaths.has(c)) return { kind: 'vendor', path: c }; }
            return null;
        };
        const mod = imp.path;
        const dots = (/^\.+/.exec(mod) || [''])[0].length;
        const out = [];
        if (dots) {
            // Относительный импорт: от пакета текущего файла
            let dir = dirname(f.path); for (let k = 1; k < dots; k++) dir = dirname(dir);
            const rest = mod.slice(dots);
            if (imp.names && imp.names.length) for (const nm of imp.names) { const r = tryMod(dir, rest ? rest + '.' + nm : nm); if (r) out.push(r); }
            const r = rest ? tryMod(dir, rest) : null; if (r) out.push(r);
            return out.length ? out : [{ kind: 'external', path: mod }];
        }
        // Абсолютный: от корня и от src/, затем - по «хвосту» пути
        const roots = ['', 'src', 'lib', ...ctx.roots];
        if (imp.names) for (const nm of imp.names) for (const r of roots) { const x = tryMod(r, mod + '.' + nm); if (x) { out.push(x); break; } }
        for (const r of roots) { const x = tryMod(r, mod); if (x) { out.push(x); break; } }
        if (!out.length) {
            const rel = mod.split('.').join('/');
            const x = bySuffix(ctx, rel + '.py') || bySuffix(ctx, rel + '/__init__.py');
            if (x) out.push(x);
        }
        return out.length ? out : [{ kind: 'external', path: mod.split('.')[0] }];
    },
});

const api = {
    register, all: langs,
    forPath: p => byExt.get(extOf(p)) || (/\.d\.ts$/i.test(p) ? byExt.get('.ts') : null),
    byId: id => langs.find(l => l.id === id),
    extsOf: ids => langs.filter(l => ids.includes(l.id)).flatMap(l => l.exts),
};
root.CodriftLangs = api;
})(typeof self !== 'undefined' ? self : this);
