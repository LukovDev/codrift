//
// parser.js - лёгкий эвристический парсер C (.c/.h) для Codrift.
// Без препроцессора и без AST: корректно вырезает комментарии и литералы,
// собирает #include/#define, объявления/определения функций, типы, глобальные
// переменные и вызовы внутри тел функций. Работает и в браузере, и в Node.
//

(function (root) {
'use strict';

const SP = 32, NL = 10, CR = 13, TAB = 9;

// Ключевые слова, после которых '(' — не вызов функции:
const NOT_CALL = new Set([
    'if', 'for', 'while', 'switch', 'return', 'sizeof', 'alignof', '_Alignof', 'alignas', '_Alignas',
    'typeof', '__typeof__', '__typeof', 'typeof_unqual', '_Generic', 'defined', '__attribute__', '__attribute',
    '__declspec', '_Static_assert', 'static_assert', 'do', 'else', 'case', 'goto', '__asm__', 'asm', '__asm',
    '__volatile__', 'volatile', '_Pragma', '__pragma', '__extension__', '__builtin_expect', 'va_arg',
    'int', 'char', 'short', 'long', 'float', 'double', 'void', 'unsigned', 'signed', 'bool', '_Bool',
    'struct', 'union', 'enum', 'const', 'static', 'extern', 'inline', 'register', 'auto', 'restrict',
]);
// Атрибуты/спецификаторы, стоящие перед '(' — их группа скобок не является списком параметров:
const ATTR = new Set([
    '__attribute__', '__attribute', '__declspec', 'alignas', '_Alignas', '__asm__', 'asm', '__asm',
    '_Static_assert', 'static_assert', 'typeof', '__typeof__', 'typeof_unqual', '_Pragma', '__pragma',
]);
const TYPE_KW = new Set([
    'int', 'char', 'short', 'long', 'float', 'double', 'void', 'unsigned', 'signed', 'bool', '_Bool',
    'const', 'volatile', 'static', 'extern', 'inline', 'register', 'auto', 'restrict', 'struct', 'union',
    'enum', 'typedef', '_Complex', '_Atomic', '_Noreturn', 'noreturn', '__inline', '__inline__', '__restrict',
    'if', 'while', 'for', 'switch', 'return', 'sizeof', 'else', 'do', 'case', 'goto', 'default',
]);
const AGG = new Set(['struct', 'union', 'enum']);


// --- 1. Посимвольный проход: статистика строк + два «очищенных» текста ---
//   noComm: комментарии заменены пробелами (строки целы) — для препроцессора и сигнатур;
//   clean : ещё и содержимое литералов заменено пробелами — для разбора кода.
// opt: { backtick: JS-шаблоны `…`, verbatim: C# @"…", raw: C++ R"x(…)x" }
function scan(text, opt) {
    opt = opt || {};
    const n = text.length;
    const nc = new Uint16Array(n), cl = new Uint16Array(n);
    let code = 0, comment = 0, blank = 0, total = 0;
    let lineCode = false, lineComm = false, lineAny = false;
    const S_N = 0, S_LC = 1, S_BC = 2, S_STR = 3, S_CHR = 4, S_TPL = 5, S_VERB = 6;
    let rawEnd = -1; // конец raw-строки C++ (индекс последнего символа)
    let st = S_N, ln = 1, cur = null;
    const comments = []; // {s, e, l, el, trailing}
    const endLine = () => {
        total++;
        if (lineCode) code++; else if (lineComm) comment++; else blank++;
        lineCode = lineComm = lineAny = false;
    };
    for (let i = 0; i < n; i++) {
        const c = text.charCodeAt(i);
        nc[i] = c; cl[i] = c;
        if (c === NL) {
            if (st === S_LC) {
                // Продолжение однострочного комментария через '\'
                let j = i - 1; if (j >= 0 && text.charCodeAt(j) === CR) j--;
                if (!(j >= 0 && text.charCodeAt(j) === 92)) { st = S_N; cur.e = i; cur.el = ln; comments.push(cur); cur = null; }
            } else if ((st === S_STR || st === S_CHR) && rawEnd < 0) {
                let j = i - 1; if (j >= 0 && text.charCodeAt(j) === CR) j--;
                if (!(j >= 0 && text.charCodeAt(j) === 92)) st = S_N; // незакрытый литерал — сброс
            }
            endLine(); ln++;
            continue;
        }
        if (c === CR) continue;
        const ws = c === SP || c === TAB || c === 12 || c === 11;
        switch (st) {
            case S_N:
                if (c === 47 /* / */ && i + 1 < n) {
                    const d = text.charCodeAt(i + 1);
                    if (d === 47) { st = S_LC; nc[i] = cl[i] = SP; cur = { s: i, l: ln, trailing: lineCode }; lineComm = true; continue; }
                    if (d === 42) { st = S_BC; nc[i] = cl[i] = SP; nc[i + 1] = cl[i + 1] = SP; cur = { s: i, l: ln, trailing: lineCode }; i++; lineComm = true; continue; }
                }
                if (c === 34) {
                    const prev = i > 0 ? text.charCodeAt(i - 1) : 0;
                    if (opt.verbatim && prev === 64 /* @ */) st = S_VERB;
                    else if (opt.raw && prev === 82 /* R */ && !(i > 1 && /\w/.test(text[i - 2]))) {
                        // R"delim( ... )delim"
                        const open = text.indexOf('(', i);
                        const delim = open > i && open - i <= 17 ? text.slice(i + 1, open) : null;
                        const close = delim != null ? text.indexOf(')' + delim + '"', open) : -1;
                        if (close > 0) { rawEnd = close + delim.length + 1; st = S_STR; }
                        else st = S_STR;
                    } else st = S_STR;
                } else if (c === 39) st = S_CHR;
                else if (c === 96 && opt.backtick) st = S_TPL;
                if (!ws) lineCode = true;
                break;
            case S_TPL: case S_VERB:
                lineCode = true;
                if (st === S_TPL && c === 92 && i + 1 < n) { cl[i] = SP; const d = text.charCodeAt(i + 1); if (d !== NL) { cl[i + 1] = SP; nc[i + 1] = d; i++; } continue; }
                if (st === S_TPL && c === 96) { st = S_N; break; }
                if (st === S_VERB && c === 34) { if (text.charCodeAt(i + 1) === 34) { cl[i] = cl[i + 1] = SP; nc[i + 1] = 34; i++; continue; } st = S_N; break; }
                cl[i] = SP;
                break;
            case S_LC:
                nc[i] = cl[i] = SP;
                break;
            case S_BC:
                nc[i] = cl[i] = SP;
                if (!ws) lineComm = true;
                if (c === 42 && i + 1 < n && text.charCodeAt(i + 1) === 47) { nc[i + 1] = cl[i + 1] = SP; i++; st = S_N; cur.e = i + 1; cur.el = ln; comments.push(cur); cur = null; }
                break;
            case S_STR: case S_CHR:
                lineCode = true;
                if (rawEnd >= 0) { if (i >= rawEnd) { rawEnd = -1; st = S_N; } else cl[i] = SP; break; }
                if (c === 92 && i + 1 < n) { // экранирование
                    const d = text.charCodeAt(i + 1);
                    cl[i] = SP;
                    if (d !== NL && d !== CR) { cl[i + 1] = SP; nc[i + 1] = d; i++; }
                    continue;
                }
                if ((st === S_STR && c === 34) || (st === S_CHR && c === 39)) { st = S_N; break; }
                cl[i] = SP;
                break;
        }
    }
    // Последняя строка без '\n'
    if (n > 0 && text.charCodeAt(n - 1) !== NL) endLine();
    if (cur) { cur.e = n; cur.el = ln; comments.push(cur); }
    // Есть ли код после комментария на той же строке (тогда это не «комментарий над объявлением»)
    for (const cm of comments) {
        for (let k = cm.e; k < n; k++) {
            const ch = text.charCodeAt(k);
            if (ch === NL) break;
            if (ch !== SP && ch !== TAB && ch !== CR) { cm.codeAfter = true; break; }
        }
        cm.text = text.slice(cm.s, cm.e);
    }
    return { stats: { total, code, comment, blank }, noComm: u16str(nc), clean: u16str(cl), comments };
}


function u16str(arr) {
    if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-16le').decode(arr);
    let s = ''; for (let i = 0; i < arr.length; i += 8192) s += String.fromCharCode.apply(null, arr.subarray(i, i + 8192)); return s;
}


// --- 2. Препроцессор: #include/#define + вырезание директив и неактивных веток ---
function preprocess(noComm, clean) {
    const ncLines = noComm.split('\n');
    const clLines = clean.split('\n');
    const includes = [], macros = [];
    const stack = []; // {parent, state:'first'|'zero'|'else'|'taken', zeroSkip}
    let skip = false, zeroSkip = false;
    for (let i = 0; i < ncLines.length; i++) {
        const line = ncLines[i];
        const m = /^\s*#\s*([A-Za-z_]+)?(.*)$/.exec(line);
        if (!m) { if (skip) clLines[i] = blankLine(clLines[i]); continue; }
        // Склеиваем строки продолжения
        let full = line, j = i;
        while (/\\\s*\r?$/.test(ncLines[j]) && j + 1 < ncLines.length) { j++; full = full.replace(/\\\s*\r?$/, ' ') + ncLines[j]; }
        for (let k = i; k <= j; k++) clLines[k] = blankLine(clLines[k]);
        const dm = /^\s*#\s*([A-Za-z_]+)?\s*([\s\S]*)$/.exec(full);
        const dir = dm[1] || '', rest = (dm[2] || '').replace(/\r/g, '').trim();
        const line1 = i + 1;
        switch (dir) {
            case 'include': case 'include_next': case 'import': {
                if (zeroSkip) break;
                const im = /^(?:"([^"]+)"|<([^>]+)>)/.exec(rest);
                if (im) includes.push({ path: (im[1] || im[2]).trim(), sys: !!im[2], line: line1, cond: stack.length > 0 && !isGuard(stack) });
                break;
            }
            case 'define': {
                if (zeroSkip) break;
                const mm = /^([A-Za-z_]\w*)(\([^)]*\))?\s*([\s\S]*)$/.exec(rest);
                if (mm) macros.push({ name: mm[1], params: mm[2] ? mm[2].slice(1, -1).split(',').map(s => s.trim()).filter(Boolean) : null, body: mm[3].trim(), line: line1, endLine: j + 1 });
                break;
            }
            case 'if': case 'ifdef': case 'ifndef': {
                const isZero = dir === 'if' && /^(0|false)\b/.test(rest);
                stack.push({ parentSkip: skip, parentZero: zeroSkip, state: isZero ? 'zero' : 'first', guard: dir === 'ifndef' && i < 40 });
                if (isZero) { skip = true; zeroSkip = true; }
                break;
            }
            case 'elif': case 'elifdef': case 'elifndef': case 'else': {
                const f = stack[stack.length - 1];
                if (!f) break;
                if (f.state === 'zero') { f.state = 'taken'; skip = f.parentSkip; zeroSkip = f.parentZero; }
                else { f.state = 'else'; skip = true; zeroSkip = f.parentZero; }
                break;
            }
            case 'endif': {
                const f = stack.pop();
                if (f) { skip = f.parentSkip; zeroSkip = f.parentZero; }
                break;
            }
        }
        i = j;
    }
    return { includes, macros, clean: clLines.join('\n') };
}
// Пробелы той же длины: смещения токенов должны совпадать с исходным текстом
const blankLine = l => l.replace(/./g, ' ');
function isGuard(stack) { return stack.length === 1 && stack[0].guard; }

// --- 3. Токенизатор ---
const TOK_RE = /\n|[A-Za-z_]\w*|\d(?:[\w.]|[eEpP][+-])*|"[^"\n]*"?|'[^'\n]*'?|->|\.\.\.|::|[^\s]/g;
function tokenize(src) {
    const toks = [];
    let line = 1, m;
    TOK_RE.lastIndex = 0;
    while ((m = TOK_RE.exec(src))) {
        const v = m[0];
        if (v === '\n') { line++; continue; }
        const c = v.charCodeAt(0);
        let t = 'p';
        if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95) t = 'id';
        else if (c >= 48 && c <= 57) t = 'num';
        else if (c === 34 || c === 39) t = 'str';
        toks.push({ v, t, o: m.index, l: line });
    }
    return toks;
}


// Индекс парной скобки для всех { } (по токенам)
function braceMatch(toks) {
    const match = new Int32Array(toks.length).fill(-1), st = [];
    for (let i = 0; i < toks.length; i++) {
        const v = toks[i].v;
        if (v === '{') st.push(i);
        else if (v === '}' && st.length) { const o = st.pop(); match[o] = i; match[i] = o; }
    }
    return match;
}


// Поиск «имя ( параметры )» в верхнеуровневом высказывании
function matchFunc(stmt) {
    if (!stmt.length || stmt[0].v === 'typedef') return null;
    const groups = []; let depth = 0, open = -1, bdepth = 0;
    for (let i = 0; i < stmt.length; i++) {
        const v = stmt[i].v;
        if (v === '[') bdepth++; else if (v === ']') bdepth--;
        if (v === '(') { if (depth === 0 && bdepth === 0) open = i; depth++; }
        else if (v === ')') { depth--; if (depth === 0 && open >= 0 && bdepth === 0) { groups.push([open, i]); open = -1; } }
        else if (v === '=' && depth === 0 && bdepth === 0) return null;
    }
    for (let g = groups.length - 1; g >= 0; g--) {
        const [o, c] = groups[g];
        const prev = stmt[o - 1];
        if (!prev || prev.t !== 'id') return null;
        if (ATTR.has(prev.v)) continue;
        if (TYPE_KW.has(prev.v) || NOT_CALL.has(prev.v)) return null;
        if (o - 1 < 1) return null; // нужен хотя бы один токен типа перед именем
        for (let k = 0; k < o - 1; k++) if (stmt[k].v === '{}') return null;
        return { name: prev.v, nameIdx: o - 1, open: o, close: c };
    }
    return null;
}


function hasTok(stmt, from, to, v) { for (let i = from; i < to; i++) if (stmt[i].v === v) return true; return false; }


// --- 4. Разбор верхнего уровня ---
function parseTop(toks, noComm) {
    const funcs = [], decls = [], types = [], vars = [], inits = [];
    const match = braceMatch(toks);
    let stmt = [];
    const sig = (s, close) => noComm.slice(s[0].o, s[close].o + 1).replace(/\s+/g, ' ').trim();
    for (let i = 0; i < toks.length; i++) {
        const t = toks[i];
        if (t.v === '{') {
            const end = match[i] >= 0 ? match[i] : toks.length - 1;
            // extern "C" { ... } — прозрачный блок
            if (stmt.length === 2 && stmt[0].v === 'extern' && stmt[1].t === 'str') { stmt = []; continue; }
            const fn = matchFunc(stmt);
            if (fn && (fn.close === stmt.length - 1 || trailingOk(stmt, fn.close + 1))) {
                const mods = stmt.slice(0, fn.nameIdx).map(x => x.v);
                funcs.push({
                    name: fn.name, line: stmt[fn.nameIdx].l, startLine: stmt[0].l, endLine: toks[end] ? toks[end].l : t.l,
                    sig: sig(stmt, fn.close), isStatic: mods.includes('static'), isInline: mods.includes('inline') || mods.includes('__inline') || mods.includes('__inline__'),
                    ...bodyRefs(toks, i + 1, end),
                });
                stmt = []; i = end;
                continue;
            }
            // Агрегат (struct/union/enum) или инициализатор
            let aggIdx = -1;
            for (let k = stmt.length - 1; k >= 0; k--) {
                const v = stmt[k].v;
                if (v === '=' || v === '(' || v === ')') break;
                if (AGG.has(v)) { aggIdx = k; break; }
            }
            if (aggIdx >= 0) {
                const tag = stmt[aggIdx + 1] && stmt[aggIdx + 1].t === 'id' ? stmt[aggIdx + 1].v : null;
                const kind = stmt[aggIdx].v;
                const fields = kind === 'enum' ? null : structFields(toks, i + 1, end);
                if (tag) types.push({ name: tag, kind, line: stmt[aggIdx].l, endLine: toks[end] ? toks[end].l : t.l, def: true, tag: true, fields });
                const ph = { v: '{}', t: 'p', o: t.o, l: t.l, kind, tag, fields, startLine: stmt[aggIdx].l, endLine: toks[end] ? toks[end].l : t.l };
                stmt.push(ph);
            } else {
                // Инициализатор: Type name = { a, b, ... } — позиционные элементы пригодятся для указателей на функции
                const eq = stmt.findIndex(x => x.v === '=');
                if (eq > 1) {
                    let k = eq - 1; while (k > 0 && (stmt[k].v === ']' || stmt[k].v === '[' || stmt[k].t === 'num')) k--;
                    const typeTok = stmt.slice(0, k).reverse().find(x => x.t === 'id' && !TYPE_KW.has(x.v));
                    if (typeTok) inits.push({ type: typeTok.v, items: initItems(toks, i + 1, end), line: t.l });
                }
                stmt.push({ v: '{}', t: 'p', o: t.o, l: t.l });
            }
            i = end;
            continue;
        }
        if (t.v === '}') { stmt = []; continue; }
        if (t.v === ';') { topStatement(stmt, decls, types, vars, sig); stmt = []; continue; }
        stmt.push(t);
    }
    return { funcs, decls, types, vars, inits };
}


// Имена полей структуры по порядку (для позиционных инициализаторов)
function structFields(toks, from, to) {
    const out = []; let depth = 0, cur = [];
    const flush = () => {
        if (!cur.length) return;
        // void (*name)(...)
        for (let k = 0; k + 2 < cur.length; k++) if (cur[k].v === '(' && cur[k + 1].v === '*' && cur[k + 2].t === 'id') { out.push(cur[k + 2].v); cur = []; return; }
        let pd = 0, name = null;
        for (const x of cur) {
            if (x.v === '[' || x.v === '(') pd++; else if (x.v === ']' || x.v === ')') pd--;
            else if (pd === 0 && x.v === ':') break;
            else if (pd === 0 && x.v === ',') { if (name) out.push(name); name = null; }
            else if (pd === 0 && x.t === 'id' && !TYPE_KW.has(x.v)) name = x.v;
        }
        if (name) out.push(name);
        cur = [];
    };
    for (let i = from; i < to; i++) {
        const v = toks[i].v;
        if (v === '{') { depth++; continue; }
        if (v === '}') { depth--; if (depth === 0) cur.push({ v: '{}', t: 'p' }); continue; }
        if (depth > 0) continue;
        if (v === ';') flush(); else cur.push(toks[i]);
    }
    flush();
    return out;
}


// Элементы инициализатора верхнего уровня: имя функции (или &имя) либо null
function initItems(toks, from, to) {
    const items = []; let depth = 0, cur = [];
    const flush = () => {
        const c = cur[0] && cur[0].v === '&' ? cur.slice(1) : cur;
        items.push(c.length === 1 && c[0].t === 'id' ? c[0].v : null); cur = [];
    };
    for (let i = from; i < to; i++) {
        const v = toks[i].v;
        if (v === '{' || v === '(' || v === '[') depth++;
        else if (v === '}' || v === ')' || v === ']') depth--;
        if (depth === 0 && v === ',') { flush(); continue; }
        cur.push(toks[i]);
    }
    if (cur.length) flush();
    // Назначенные инициализаторы (.x = f) разбираются отдельно — здесь их не путаем с позиционными
    return items.some(Boolean) && !toks.slice(from, to).some(x => x.v === '=') ? items : [];
}


function trailingOk(stmt, from) {
    // После ')' допускаются только атрибуты/макросы-аннотации
    for (let i = from; i < stmt.length; i++) {
        const v = stmt[i].v;
        if (v === '=' || v === ',' || v === '{}' || v === ';') return false;
    }
    return true;
}


function topStatement(stmt, decls, types, vars, sig) {
    if (!stmt.length) return;
    const first = stmt[0].v;
    if (first === '_Static_assert' || first === 'static_assert') return;
    if (first === 'typedef') {
        let name = null, line = stmt[0].l;
        // typedef ... ( * Name ) ( ... );
        for (let k = 1; k + 2 < stmt.length; k++) {
            if (stmt[k].v === '(' && (stmt[k + 1].v === '*' || stmt[k + 1].v === '^') && stmt[k + 2].t === 'id') { name = stmt[k + 2].v; line = stmt[k + 2].l; break; }
        }
        if (!name) {
            let depth = 0;
            for (let k = stmt.length - 1; k > 0; k--) {
                const v = stmt[k].v;
                if (v === ']' || v === ')') depth++; else if (v === '[' || v === '(') depth--;
                else if (depth === 0 && stmt[k].t === 'id' && !TYPE_KW.has(v)) { name = v; line = stmt[k].l; break; }
            }
        }
        const ph = stmt.find(x => x.v === '{}' && x.kind);
        let kind = 'typedef', ref = null;
        if (ph) kind = ph.kind;
        else { const a = stmt.findIndex(x => AGG.has(x.v)); if (a >= 0 && stmt[a + 1] && stmt[a + 1].t === 'id') ref = stmt[a + 1].v; }
        if (name) types.push({ name, kind, line, endLine: ph ? ph.endLine : stmt[stmt.length - 1].l, startLine: ph ? stmt[0].l : line, def: !!ph, typedef: true, ref, fields: ph ? ph.fields : null, sig: ph ? null : sig(stmt, stmt.length - 1) });
        return;
    }
    // struct X;  — предварительное объявление
    if (stmt.length === 2 && AGG.has(first) && stmt[1].t === 'id') { types.push({ name: stmt[1].v, kind: first, line: stmt[0].l, def: false, tag: true }); return; }
    if (stmt.some(x => x.v === '{}' && x.kind) && stmt[stmt.length - 1].v === '{}') return; // struct X {...};
    const fn = matchFunc(stmt);
    if (fn) {
        const mods = stmt.slice(0, fn.nameIdx).map(x => x.v);
        decls.push({ name: fn.name, line: stmt[fn.nameIdx].l, startLine: stmt[0].l, sig: sig(stmt, fn.close), isStatic: mods.includes('static'), isExtern: mods.includes('extern') });
        return;
    }
    // Глобальная переменная: T name [= ...]
    let depth = 0, name = null, line = 0, eq = false;
    for (let k = 0; k < stmt.length; k++) {
        const v = stmt[k].v;
        if (v === '(' || v === '[') depth++; else if (v === ')' || v === ']') depth--;
        if (depth === 0 && (v === '=' || v === ',')) { eq = v === '='; break; }
        if (depth === 0 && stmt[k].t === 'id' && !TYPE_KW.has(v) && k > 0) { name = v; line = stmt[k].l; }
        if (depth > 0 && stmt[k].t === 'id' && stmt[k - 1] && stmt[k - 1].v === '*' && stmt[k - 2] && stmt[k - 2].v === '(') { name = v; line = stmt[k].l; }
    }
    if (name && stmt.length >= 2) {
        const isExtern = first === 'extern' || stmt.some(x => x.v === 'extern');
        vars.push({ name, line, startLine: stmt[0].l, isStatic: stmt.some(x => x.v === 'static'), isExtern, def: !isExtern, sig: sig(stmt, stmt.length - 1) });
    }
}


// Вызовы и ссылки на идентификаторы внутри тела функции
// notCall/skipIds — наборы ключевых слов конкретного языка (по умолчанию — C)
// Для языков с обобщениями: позиция '(' после «<...>» в вызове foo<T>(x) / foo<List<int>>(x), иначе -1
function genericCallOpen(toks, i, to) {
    let depth = 0;
    for (let k = i; k < to && k < i + 24; k++) {
        const v = toks[k].v;
        if (v === '<') depth++;
        else if (v === '>') depth--;
        else if (v === '>>') depth -= 2;
        else if (toks[k].t !== 'id' && !/^(,|\.|::|\[|\]|\?|\*)$/.test(v)) return -1;
        if (depth === 0) return toks[k + 1] && toks[k + 1].v === '(' ? k + 1 : -1;
        if (depth < 0) return -1;
    }
    return -1;
}


function bodyRefs(toks, from, to, notCall, skipIds, generics) {
    notCall = notCall || NOT_CALL; skipIds = skipIds || TYPE_KW;
    const calls = [], ids = new Map(), memberCalls = []; let indirect = 0;
    for (let i = from; i < to; i++) {
        const t = toks[i];
        if (t.t !== 'id') continue;
        let next = toks[i + 1], open = i + 1; const prev = toks[i - 1];
        if (generics && next && next.v === '<') { const k = genericCallOpen(toks, i + 1, to); if (k > 0) { next = toks[k]; open = k; } }
        if (prev && (prev.v === '.' || prev.v === '->' || prev.v === '?.')) {
            if (next && next.v === '(') { indirect++; const rv = toks[i - 2]; memberCalls.push({ field: t.v, line: t.l, argc: argCount(toks, open, to), recv: rv && rv.t === 'id' ? rv.v : null }); }
            continue;
        }
        if (next && next.v === '(') {
            if (!notCall.has(t.v)) calls.push({ name: t.v, line: t.l, isNew: !!(prev && prev.v === 'new') });
        } else if (!skipIds.has(t.v)) {
            if (!ids.has(t.v)) ids.set(t.v, t.l);
        }
    }
    return { calls, ids: [...ids], indirect, memberCalls };
}


// Число аргументов вызова: запятые верхнего уровня внутри скобок, начиная с '(' в позиции open
function argCount(toks, open, to) {
    let depth = 0, n = 0, any = false;
    for (let i = open; i < to; i++) {
        const v = toks[i].v;
        if (v === '(' || v === '[' || v === '{') { depth++; if (depth === 1) continue; }
        else if (v === ')' || v === ']' || v === '}') { depth--; if (depth === 0) return any ? n + 1 : 0; }
        if (depth === 1) { if (v === ',') n++; else any = true; }
    }
    return -1;
}


// Вызовы внутри тела макроса
function macroCalls(body) {
    const out = [];
    const re = /([A-Za-z_]\w*)\s*\(/g; let m;
    const clean = body.replace(/"(?:[^"\\]|\\.)*"/g, '""');
    while ((m = re.exec(clean))) {
        const pre = clean[m.index - 1];
        if (pre === '.' || pre === '>' || pre === '#') continue;
        if (!NOT_CALL.has(m[1])) out.push(m[1]);
    }
    const ids = new Set(); const re2 = /[A-Za-z_]\w*/g;
    while ((m = re2.exec(clean))) ids.add(m[0]);
    return { calls: out, ids: [...ids] };
}


// Текст комментария без маркеров /* */ // * ///
function cleanComment(raw) {
    let t = raw;
    if (t.startsWith('/*')) {
        t = t.replace(/^\/\*+!?/, '').replace(/\*+\/$/, '');
        t = t.split('\n').map(l => l.replace(/\r$/, '').replace(/^\s*\*(?!\/)\s?/, '')).join('\n');
    } else {
        t = t.split('\n').map(l => l.replace(/\r$/, '').replace(/^\s*\/\/[\/!<]?\s?/, '')).join('\n');
    }
    // Строки-разделители (====, ----, ****) не нужны
    t = t.split('\n').filter(l => !/^\s*([-=*#~_\/])\1{3,}\s*$/.test(l)).join('\n');
    return t.replace(/[ \t]+$/gm, '').replace(/^\n+|\n+$/g, '').trim();
}


// Индекс комментариев для поиска документации к объявлениям
function docIndex(comments) {
    const byEnd = new Map(), trailing = new Map();
    for (const c of comments) {
        if (c.trailing) { if (!trailing.has(c.l)) trailing.set(c.l, c); continue; }
        if (c.codeAfter) continue;
        byEnd.set(c.el, c);
    }
    return {
        // Блок комментариев, заканчивающийся прямо над строкой (подряд идущие // склеиваются)
        above(line) {
            const parts = []; let l = line - 1, c;
            while ((c = byEnd.get(l)) && parts.length < 60) { parts.unshift(cleanComment(c.text)); l = c.l - 1; }
            return parts.filter(Boolean).join('\n').trim();
        },
        trailing(line) { const c = trailing.get(line); return c ? cleanComment(c.text) : ''; },
    };
}


function fieldAssigns(toks) {
    const out = [];
    for (let i = 0; i + 3 < toks.length; i++) {
        const v = toks[i].v;
        if ((v !== '.' && v !== '->') || toks[i + 1].t !== 'id' || toks[i + 2].v !== '=') continue;
        let j = i + 3; if (toks[j].v === '&') j++;
        const f = toks[j], nx = toks[j + 1];
        if (f && f.t === 'id' && nx && (nx.v === ';' || nx.v === ',' || nx.v === '}' || nx.v === ')') && toks[i + 3].v !== '=')
            out.push({ field: toks[i + 1].v, fn: f.v, line: f.l });
    }
    return out;
}


function parseFile(path, text) {
    const s = scan(text);
    const pp = preprocess(s.noComm, s.clean);
    const toks = tokenize(pp.clean);
    const top = parseTop(toks, s.noComm);
    top.fieldAssigns = fieldAssigns(toks);
    for (const m of pp.macros) { const r = macroCalls(m.body); m.calls = r.calls; m.ids = r.ids; }
    // Документация из комментариев: блок прямо над объявлением или комментарий в конце строки
    const di = docIndex(s.comments);
    const doc = (start, line) => di.above(start) || di.trailing(line) || (line !== start ? di.above(line) : '');
    for (const f of top.funcs) f.doc = doc(f.startLine, f.line);
    for (const d of top.decls) d.doc = doc(d.startLine, d.line);
    for (const v of top.vars) v.doc = di.trailing(v.line) || doc(v.startLine, v.line);
    for (const ty of top.types) ty.doc = doc(ty.startLine || ty.line, ty.line);
    for (const m of pp.macros) m.doc = di.trailing(m.line) || di.above(m.line);
    // Шапка файла: подряд идущие комментарии в самом начале, до первого кода/директивы
    let fileDoc = '';
    const parts = []; let prevEnd = 0;
    for (const c of s.comments) {
        if (c.trailing || c.l > prevEnd + 2) break;
        parts.push(cleanComment(c.text)); prevEnd = c.el;
    }
    fileDoc = parts.filter(Boolean).join('\n').trim();
    return { path, stats: s.stats, includes: pp.includes, macros: pp.macros, fileDoc, ...top };
}

const api = { scan, preprocess, tokenize, parseFile, braceMatch, bodyRefs, docIndex, cleanComment, argCount, fieldAssigns, NOT_CALL, TYPE_KW };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else root.CParser = api;
})(typeof self !== 'undefined' ? self : this);
