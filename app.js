//
// app.js - интерфейс, загрузка исходников (GitHub / локальная папка / zip), модель проекта и 3D-виды.
//

'use strict';

/* ======================================================================
   i18n
   ====================================================================== */
const I18N = {
    ru: {
        source: 'Источник', search: 'Поиск и список узлов', ss_az: 'А-Я', ss_len: 'Длина', ss_lines: 'Строки', ss_links: 'Связи', ssh_az: 'По алфавиту', ssh_len: 'По длине имени', ssh_lines: 'По числу строк кода', ssh_links: 'По числу связей', viewSettings: 'Настройки вида', fitAll: 'Показать всё (при выделении - узел)', closeBtn: 'Закрыть', expandBtn: 'Развернуть', views_includes: 'Подключения', views_calls: 'Вызовы', views_api: 'API',
        views_dirs: 'Директории', views_stats: 'Статистика', github: 'GitHub', local: 'Папка / zip', repo: 'Репозиторий (owner/repo или URL)',
        ref: 'Ветка / тег / коммит (пусто - по умолчанию)', token: 'Токен GitHub (необязательно, хранится только в памяти вкладки)',
        load: 'Загрузить и разобрать', pickDir: 'Выбрать папку…', pickZip: 'Открыть .zip…', pickFiles: 'Выбрать файлы…',
        filters: 'Фильтры файлов', ignore: 'Игнорировать (glob, по строке)', includeOnly: 'Искать только в (glob, пусто - везде)',
        exts: 'Расширения', incRoots: 'Каталоги подключаемых файлов C/C++ (через пробел, auto - сами)', maxSize: 'Макс. размер файла, КБ',
        resetDefaults: 'Сбросить по умолчанию', examples: 'Примеры:', welcomeTitle: '3D-карта кода проекта',
        welcomeText: 'Разбирает код прямо в браузере (C, C++, Java, C#, JS/TS, Python): граф подключений файлов, граф вызовов, API, дерево директорий и статистика строк. Ничего не отправляется на сервер, кроме запросов к GitHub.',
        openGithub: 'GitHub-репозиторий…', openLocal: 'Локальная папка…', listing: 'Получаю список файлов…', reading: 'Читаю файлы',
        parsing: 'Разбираю', building: 'Строю граф…', done: 'Готово', files: 'Файлы', lines: 'Строк', code: 'Код', comments: 'Комментарии',
        blank: 'Пустые', funcs: 'Функции', macros: 'Макросы', types: 'Типы', vars: 'Переменные', ignored: 'Пропущено (игнор)',
        layout: 'Раскладка', lay_force: 'Силы', lay_td: 'Дерево', lay_radial: 'Радиально', colorBy: 'Цвет',
        col_kind: 'по типу', col_module: 'по модулю', labelsAll: 'Подписи у всех узлов', showExt: 'Внешние (системные/сторонние)',
        showVendor: 'Файлы сторонних библиотек', showMacros: 'Макросы как узлы', showRefs: 'Ссылки на функции (callback)',
        hideIsolated: 'Скрыть изолированные', gran: 'Детализация', gran_fn: 'Функции', gran_file: 'Файлы', kinds: 'Показывать',
        includeC: 'Символы из .c файлов тоже', arrows: 'Стрелки', particles: 'Анимация связей у выделенного',
        includes: 'Подключает', includedBy: 'Подключён в', calls: 'Вызывает', calledBy: 'Вызывается из', declares: 'Объявляет',
        declaredIn: 'Объявлен в', definedIn: 'Определён в', children: 'Содержимое', parent: 'Родитель', definedHere: 'Функции в файле',
        path: 'Путь', kind: 'Тип', where: 'Где', length: 'Длина', flyTo: 'Камера к узлу', focus: 'Только окрестность', unfocus: 'Показать всё',
        openGH: 'Открыть на GitHub', showCode: 'Код', transIncl: 'Подключает транзитивно', usedBy: 'Используется в',
        noDef: 'нет определения', static: 'static', inline: 'inline', external: 'внешний', vendor: 'сторонняя библиотека',
        nodes: 'узлов', links: 'связей', dirStats: 'По директориям', fileStats: 'По файлам', filter: 'фильтр',
        longestFns: 'Самые длинные функции', mostIncluded: 'Чаще всего подключаемые', mostCalled: 'Чаще всего вызываемые',
        fanOut: 'Больше всего исходящих вызовов', diag: 'Диагностика', protoNoDef: 'Прототипы без определения',
        noProto: 'Не-static функции без прототипа в заголовке', unused: 'Функции, которые не вызываются внутри проекта',
        cycles: 'Циклы подключений', headersUnused: 'Заголовки, которые никто не подключает', ratio: 'Плотность комментариев',
        avgFn: 'средняя длина функции', maxFn: 'макс.', filterEmpty: 'Фильтр на лету скрыл все узлы - очистите его во вкладке «Вид».', rateFallback: 'Лимит GitHub API исчерпан - список файлов взят через jsDelivr.', rateBig: 'Запасной путь через jsDelivr не подходит: репозиторий больше 50 МБ.', rateLimit: 'Лимит GitHub API исчерпан. Укажите токен или подождите до',
        notFound: 'Репозиторий или ветка не найдены (или он приватный - нужен токен).', truncated: 'GitHub обрезал список файлов (очень большой репозиторий) - часть файлов не попала.',
        noFiles: 'Не найдено ни одного подходящего файла. Проверьте фильтры.', dagCycle: 'В графе есть циклы - иерархия приблизительная.',
        tooMany: 'Файлов слишком много, взяты первые', fsUnsupported: 'Браузер не поддерживает выбор папки - используйте zip или выбор файлов.',
        selectNode: 'Нажмите на узел, чтобы увидеть детали', more: 'ещё', total: 'Всего', dir: 'директория', file: 'файл', header: 'заголовок',
        func: 'функция', macro: 'макрос', type: 'тип', variable: 'переменная', proj: 'Проект', size: 'Размер', theme: 'Тема',
        includeEdges: 'связей между файлами', incCard: 'Подключения', extIncludes: 'Внешние подключения', arr_apiPub: 'файл → объявленные в нём классы и методы', depth: 'Глубина окрестности', cancel: 'Отмена', ok: 'ОК',
        implIn: 'Реализован в', params: 'Параметры', body: 'Тело', module: 'Модуль', other: 'Прочее', none: 'нет',
        clickHint: 'Тап по узлу - детали, один палец - вращение, два - масштаб/сдвиг', loadedFrom: 'Загружено', viaMacro: 'через макрос',
        o_view: 'Вид', o_phys: 'Физика', o_style: 'Стиль', o_export: 'Экспорт', col_metric: 'по метрике', sizeBy: 'Размер узлов',
        size_lines: 'строки', size_degree: 'связи', size_uniform: 'одинаковый', reheat: 'Перезапустить раскладку', reset: 'Сбросить',
        v_charge: 'Отталкивание', v_linkDist: 'Длина связей', v_gravity: 'Притяжение к центру', v_decay: 'Трение (затухание)', v_dagDist: 'Расстояние между уровнями', v_stopAt: 'Порог остановки',
        v_nodeSize: 'Размер узлов', v_nodeOpacity: 'Непрозрачность узлов', v_linkOpacity: 'Непрозрачность связей', v_quality: 'Качество сфер',
        v_labelCount: 'Число подписей', v_labelSize: 'Размер подписей', v_smooth: 'Плавность камеры', v_sens: 'Чувствительность',
        srcSnap: 'Снимок', snapSrcHint: 'Снимок проекта (.drift или .json) из вкладки «Экспорт» - открывается мгновенно, без разбора и без GitHub.',
        snapUrl: 'Ссылка на снимок', loadByUrl: 'Загрузить по ссылке', snapPlain: 'Без сжатия (.json - можно читать и править)',
        graphNotSnap: 'Это экспорт графа (для Gephi/скриптов), а не снимок проекта. Сохраните «Снимок проекта» во вкладке «Экспорт».',
        liveFilter: 'Фильтр файлов (сразу, без переоткрытия)', refreshing: 'Обновляю проект…', refreshed: 'Проект обновлён',
        watchFolder: 'Следить за изменениями в папке (обновлять граф сам)', refreshProject: 'Обновить проект (R)',
        size_both: 'строки + связи', freeRotate: 'Свободное вращение (без верха и низа)', projection: 'Проекция', proj_persp: 'Перспектива', proj_iso: 'Изометрия',
        isoView: 'Изометрический ракурс', labelNear: 'Подписывать ближайшие к камере узлы (иначе - самые связанные)',
        autoLangs: 'Файлов выбранных расширений нет - открываю как:', srcFile: 'файл кода', languages: 'Языки',
        msaa: 'Сглаживание (MSAA)', v_idleStop: 'Усыпить анимацию после бездействия', showFps: 'Показывать FPS', resetTab: 'Сбросить вкладку', resetAll: 'Сбросить всё', resetDone: 'Сброшено',
        resetAllConfirm: 'Сбросить все настройки (вид, стиль, экран, физика, фильтры) к значениям по умолчанию? Проект перезагрузится.',
        snapTitle: 'Снимок проекта (.drift)', snapHint: 'Результат разбора, раскладка и настройки в одном сжатом файле. Открывается здесь мгновенно - без повторного разбора и GitHub. Можно положить рядом с сайтом проекта и открывать ссылкой ?snap=файл.drift',
        snapWithSrc: 'С исходным кодом (для просмотра кода в деталях)', snapSave: 'Скачать снимок', snapBuilding: 'Собираю снимок…', snapSaved: 'Снимок готов:',
        snapOpening: 'Открываю снимок', bootRepo: 'Загружаю репозиторий', snapBad: 'Это не снимок Codrift', openSnap: 'Открыть файл снимка (.drift / .json)…', dropHint: 'Можно просто перетащить на страницу файл .drift или .zip.',
        graphExport: 'Граф текущего вида', graphExportHint: 'С позициями узлов и цветами: GLB - 3D-модель для Blender, GEXF - Gephi, GraphML - yEd/Cytoscape, DOT - Graphviz.', glbBuilding: 'Собираю 3D-модель…',
        nodeLink: 'Ссылка', nodeLinkHint: 'Скопировать ссылку на этот узел с текущими настройками и камерой', openFull: 'Открыть полностью',
        pngScale: 'Качество (масштаб)', png_labels: 'Подписи узлов', png_legend: 'Пояснение цветов (что каким цветом)', png_title: 'Заголовок (проект, вид)', pngSave: 'Сохранить PNG', pngRendering: 'Рендерю картинку…',
        o_screen: 'Экран', st_simple: 'Простой', st_cosmos: 'Космос', st_neon: 'Неон', presetEdited: 'Пресет изменён.', resetPreset: 'Вернуть пресет',
        palette: 'Палитра', pal_theme: 'Тема', pal_vivid: 'Сочная', pal_cosmos: 'Космос', pal_neon: 'Неон', pal_blueprint: 'Чертёж',
        shape: 'Форма узлов', sh_sphere: 'Сфера', sh_crystal: 'Кристалл', sh_wire: 'Каркас', material: 'Материал', m_flat: 'Матовый', m_soft: 'Мягкий', m_glow: 'Светящийся',
        v_rim: 'Ободок (контур)', effects: 'Эффекты', colorShade: 'Яркость по метрике', canceled: 'Отменено', video: 'Видео и GIF', vidFormat: 'Формат', vidSize: 'Размер (квадрат, px)', vidFps: 'Кадров в секунду', v_vidDur: 'Длительность', v_vidSpeed: 'Скорость вращения', vidLoop: 'Ровно один оборот (бесшовный повтор)', vidSave: 'Записать', vidRec: 'Запись: кадр', vidDone: 'Видео сохранено', vidNoMp4: 'Браузер не умеет кодировать MP4 (нет WebCodecs) - запишется GIF.', arr_includes: 'A → B: A подключает B (файл или модуль B нужен A)', arr_calls: 'A → B: A вызывает B', arr_callsFile: 'A → B: функции файла A вызывают функции B', arr_api: 'заголовок → объявление → файл реализации', arr_dirs: 'папка → содержимое', arrowHint: 'Направление связи: стрелки видны у выделенного узла, без выделения - градиент (темнее у источника, ярче у цели).', dirsFilter: 'Папки', g_nodes: 'Узлы', g_links: 'Связи', g_glow: 'Свечение', g_scene: 'Сцена', g_select: 'Выделение', v_linkGlow: 'Свечение связей', v_bloomRadius: 'Размер ореола', v_bloomThreshold: 'Порог свечения', c_orbits: 'Орбиты (оболочки)', c_fog: 'Туман глубины', c_additive: 'Сложение света (пучки ярче)',
        sky: 'Фон', sky_none: 'Нет', sky_gradient: 'Градиент', sky_stars: 'Звёзды', sky_nebula: 'Туманность', sky_grid: 'Сетка', v_skyAmt: 'Яркость фона', newSky: 'Сгенерировать новое небо',
        nearFade: 'Растворять узлы у камеры', perf: 'Производительность', fpsCap: 'Ограничение FPS', fps_auto: 'Нет', resScale: 'Разрешение рендера',
        res_low: 'Низкое', res_mid: 'Среднее', res_auto: 'Авто', res_high: 'Высокое', gpuLabel: 'Видеокарта', gpuIntegratedHint: 'Похоже, браузер рисует на встроенной видеокарте. Если в компьютере есть дискретная (NVIDIA / AMD): Параметры Windows → Система → Дисплей → Графика → браузер → «Высокая производительность», затем перезапустите браузер.', gpuSoftwareHint: 'Браузер рисует без видеокарты (программно): включите аппаратное ускорение в настройках браузера.', glLost: 'Видеокарта сбросила 3D-контекст (сбой драйвера или нехватка видеопамяти). Сцена вернётся сама; если нет - перезагрузите страницу.', glRestored: 'Видеокарта снова доступна', noWebGL: 'Браузер не дал WebGL - 3D-граф недоступен. Включите аппаратное ускорение в настройках браузера или обновите драйвер видеокарты; «Статистика» работает и без него.', gpuSlow: 'Не успевает видеокарта: FPS низкий, хотя сам сайт тратит на кадр несколько миллисекунд. Поможет разрешение «Авто» или выключенное свечение.', res_max: 'Максимум', perfHint: 'Кадры рисуются только при движении и анимации; без касаний - 30 к/с (автовращение - на полном FPS), после бездействия анимация засыпает (кроме автовращения). «Авто»-разрешение само снижается при просадке FPS. Больше всего нагрузки дают свечение, орбиты, импульсы и дрожание («Стиль»).',
        viaPtr: 'указатель', nodeMissing: 'Этого узла нет в текущем виде', showAll: 'Показать все', documented: 'Документировано', medianFn: 'Медиана функции', longFns: 'Функции > 50 строк', avgFile: 'Средний файл', codeLinesU: 'строк кода', ofProject: 'проекта',
        ch_tree: 'Карта кода', ch_treeHint: 'Площадь плитки - строки кода. Щелчок по папке - внутрь, по файлу - к файлу на графе; крупные папки сразу показывают содержимое.', tm_folders: 'папки', tm_comments: 'комментарии',
        ch_mix: 'Состав кода', ch_mixLang: 'Строки кода по языкам и из чего состоят все строки проекта.', ch_mixMod: 'Строки кода по модулям (папкам проекта) и из чего состоят все строки.',
        ch_mods: 'Модули', ch_modsHint: 'Объём кода и доля функций с описанием (комментарием над объявлением) в каждом модуле.', m_module: 'модуль', m_code: 'код', m_doc: 'с описанием',
        ch_fnLen: 'Длина функций', ch_fnLenHint: 'Сколько функций каждой длины. Оранжевые и красные - длинные: их труднее читать и тестировать. Щелчок по столбцу - список.',
        ch_fileSize: 'Размер файлов', ch_fileSizeHint: 'Сколько файлов каждого размера. Оранжевые и красные - больше 1000 строк. Щелчок по столбцу - список.',
        st_median: 'медиана', st_p90: '90% - не длиннее', st_over50: 'длиннее 50 строк', st_over1000: 'больше 1000 строк',
        ch_docs: 'Размер и комментарии', ch_docsHint: 'Точка - файл: правее - больше кода, выше - больше комментариев. Красная зона - крупные файлы почти без комментариев.', ax_comm: 'комментарии', zone_bigNoDoc: 'крупные без комментариев',
        ch_coupling: 'Связанность функций', ch_couplingHint: 'Точка - функция: правее - скольких вызывает она, выше - сколько функций вызывают её. Справа сверху - узлы, изменение которых затронет многое. Цвет - длина.',
        ax_callees: 'вызывает функций', ax_callers: 'её вызывают', q_hub: 'узлы', q_core: 'опорные: их вызывают многие', q_orch: 'дирижёры: вызывают многих',
        ch_pareto: 'Концентрация кода', ch_paretoHint: 'Какая доля кода сосредоточена в самых крупных файлах (кривая Парето). Пунктир - если бы все файлы были одинаковыми.', ax_files: 'доля файлов, от крупных', ax_codeShare: 'доля кода',
        pareto80: '80% кода - в {p} файлов', ch_deps: 'Зависимости файлов', ch_depsHint: 'Точка - файл: правее - сколько файлов подключает он, выше - сколько файлов подключают его. Справа сверху - узлы: правка такого файла пересобирает многое, и сам он тянет многое.', ax_incs: 'подключает файлов', ax_incBy: 'его подключают', q_stable: 'стабильные: их подключают многие', q_dependent: 'зависимые: подключают многое', pareto50: 'половина кода - в {p} файлов', maxFiles: 'Макс. файлов',
        tooManyHint: 'Сузьте выбор в «Искать только в».',
        c_bloom: 'Включить свечение (bloom)', c_stars: 'Звёзды и туманности',
        c_electrons: 'Электронные оболочки', c_pulses: 'Импульсы по связям', c_autoRotate: 'Автовращение', v_glow: 'Сила свечения',
        v_selfGlow: 'Светимость ядер', v_wobble: 'Тепловое дрожание', v_pulseSpeed: 'Скорость импульсов', v_rotateSpeed: 'Скорость вращения', v_rotateDelay: 'Начинать вращение через', v_pulseRate: 'Частота импульсов',
        pause: 'Пауза: раскладка и импульсы', resume: 'Продолжить раскладку и импульсы',
        showIndirect: 'Косвенные вызовы (через указатели на функции)',
        gradient: 'Направление связи градиентом', labels: 'Подписи', labelKinds: 'Подписывать типы узлов', camera: 'Камера',
        mdHint: 'Текстовая документация из того же разбора: дерево, связи, описания из комментариев.', mdAll: 'Markdown: весь проект', mdApi: 'Markdown: только заголовки (API)', mdApiPub: 'Markdown: только публичное (API)', mdApiMixed: 'Markdown: только API',
        png: 'Картинка PNG', copyLink: 'Скопировать ссылку на вид', switchProject: 'Открыть другой проект…', copied: 'Скопировано',
        md_title: 'документация кода', md_titleApi: 'справочник API', md_generated: 'Сгенерировано Codrift', md_fromComments: 'Описания взяты из комментариев в исходниках.',
        md_toc: 'Содержание', md_tree: 'Структура директорий', md_source: 'исходник', md_desc: 'Описание', md_value: 'Значение', md_decl: 'Объявление',
        md_download: 'Скачать .md', md_copy: 'Копировать', md_note: 'Файл формируется в браузере, ничего не отправляется.',
    },
    en: {
        source: 'Source', search: 'Search / list nodes', ss_az: 'A-Z', ss_len: 'Length', ss_lines: 'Lines', ss_links: 'Links', ssh_az: 'Alphabetical', ssh_len: 'By name length', ssh_lines: 'By lines of code', ssh_links: 'By number of links', viewSettings: 'View settings', fitAll: 'Fit all (the selected node, if any)', closeBtn: 'Close', expandBtn: 'Expand', views_includes: 'Imports', views_calls: 'Calls', views_api: 'API',
        views_dirs: 'Directories', views_stats: 'Statistics', github: 'GitHub', local: 'Folder / zip', repo: 'Repository (owner/repo or URL)',
        ref: 'Branch / tag / commit (empty - default)', token: 'GitHub token (optional, kept only in this tab\'s memory)',
        load: 'Load and parse', pickDir: 'Choose folder…', pickZip: 'Open .zip…', pickFiles: 'Choose files…',
        filters: 'File filters', ignore: 'Ignore (glob per line)', includeOnly: 'Search only in (glob, empty - everywhere)',
        exts: 'Extensions', incRoots: 'C/C++ include dirs (space-separated, auto - detect)', maxSize: 'Max file size, KB',
        resetDefaults: 'Reset to defaults', examples: 'Examples:', welcomeTitle: '3D map of a code project',
        welcomeText: 'Parses code right in your browser (C, C++, Java, C#, JS/TS, Python): file import graph, call graph, API, directory tree and line statistics. Nothing is sent anywhere except requests to GitHub.',
        openGithub: 'GitHub repository…', openLocal: 'Local folder…', listing: 'Listing files…', reading: 'Reading files',
        parsing: 'Parsing', building: 'Building graph…', done: 'Done', files: 'Files', lines: 'Lines', code: 'Code', comments: 'Comments',
        blank: 'Blank', funcs: 'Functions', macros: 'Macros', types: 'Types', vars: 'Variables', ignored: 'Skipped (ignored)',
        layout: 'Layout', lay_force: 'Force', lay_td: 'Tree', lay_radial: 'Radial', colorBy: 'Color',
        col_kind: 'by kind', col_module: 'by module', labelsAll: 'Labels on all nodes', showExt: 'External (system/3rd-party)',
        showVendor: '3rd-party library files', showMacros: 'Macros as nodes', showRefs: 'Function references (callbacks)',
        hideIsolated: 'Hide isolated', gran: 'Granularity', gran_fn: 'Functions', gran_file: 'Files', kinds: 'Show',
        includeC: 'Symbols from .c files too', arrows: 'Arrows', particles: 'Animate selected links',
        includes: 'Imports', includedBy: 'Imported by', calls: 'Calls', calledBy: 'Called by', declares: 'Declares',
        declaredIn: 'Declared in', definedIn: 'Defined in', children: 'Contents', parent: 'Parent', definedHere: 'Functions in file',
        path: 'Path', kind: 'Kind', where: 'Where', length: 'Length', flyTo: 'Fly to node', focus: 'Neighborhood only', unfocus: 'Show all',
        openGH: 'Open on GitHub', showCode: 'Code', transIncl: 'Imports transitively', usedBy: 'Used by',
        noDef: 'no definition', static: 'static', inline: 'inline', external: 'external', vendor: '3rd-party library',
        nodes: 'nodes', links: 'links', dirStats: 'By directory', fileStats: 'By file', filter: 'filter',
        longestFns: 'Longest functions', mostIncluded: 'Most imported files', mostCalled: 'Most called functions',
        fanOut: 'Largest fan-out', diag: 'Diagnostics', protoNoDef: 'Prototypes without definition',
        noProto: 'Non-static functions without a header prototype', unused: 'Functions never called inside the project',
        cycles: 'Import cycles', headersUnused: 'Headers nobody includes', ratio: 'Comment density',
        avgFn: 'avg function length', maxFn: 'max', filterEmpty: 'The live filter hid every node - clear it in the View tab.', rateFallback: 'GitHub API limit reached - the file list came from jsDelivr.', rateBig: 'The jsDelivr fallback cannot help: the repository is over 50 MB.', rateLimit: 'GitHub API rate limit exceeded. Add a token or wait until',
        notFound: 'Repository or ref not found (or it is private - a token is needed).', truncated: 'GitHub truncated the file list (very large repo) - some files are missing.',
        noFiles: 'No matching files found. Check the filters.', dagCycle: 'The graph has cycles - hierarchy is approximate.',
        tooMany: 'Too many files, took the first', fsUnsupported: 'This browser cannot pick folders - use zip or file selection.',
        selectNode: 'Tap a node to see details', more: 'more', total: 'Total', dir: 'directory', file: 'file', header: 'header',
        func: 'function', macro: 'macro', type: 'type', variable: 'variable', proj: 'Project', size: 'Size', theme: 'Theme',
        includeEdges: 'links between files', incCard: 'Imports', extIncludes: 'External imports', arr_apiPub: 'file → classes and methods declared in it', depth: 'Neighborhood depth', cancel: 'Cancel', ok: 'OK',
        implIn: 'Implemented in', params: 'Parameters', body: 'Body', module: 'Module', other: 'Other', none: 'none',
        clickHint: 'Tap a node for details, one finger rotates, two zoom/pan', loadedFrom: 'Loaded', viaMacro: 'via macro',
        o_view: 'View', o_phys: 'Physics', o_style: 'Style', o_export: 'Export', col_metric: 'by metric', sizeBy: 'Node size',
        size_lines: 'lines', size_degree: 'links', size_uniform: 'uniform', reheat: 'Restart layout', reset: 'Reset',
        v_charge: 'Repulsion', v_linkDist: 'Link length', v_gravity: 'Pull to center', v_decay: 'Friction (damping)', v_dagDist: 'Level distance', v_stopAt: 'Stop threshold',
        v_nodeSize: 'Node size', v_nodeOpacity: 'Node opacity', v_linkOpacity: 'Link opacity', v_quality: 'Sphere quality',
        v_labelCount: 'Label count', v_labelSize: 'Label size', v_smooth: 'Camera smoothness', v_sens: 'Sensitivity',
        srcSnap: 'Snapshot', snapSrcHint: 'A project snapshot (.drift or .json) from the Export tab - opens instantly, no parsing, no GitHub.',
        snapUrl: 'Snapshot URL', loadByUrl: 'Load from URL', snapPlain: 'Uncompressed (.json - readable and editable)',
        graphNotSnap: 'This is a graph export (for Gephi/scripts), not a project snapshot. Save “Project snapshot” in the Export tab.',
        liveFilter: 'File filter (live, no reload)', refreshing: 'Refreshing project…', refreshed: 'Project refreshed',
        watchFolder: 'Watch the folder for changes (auto-refresh)', refreshProject: 'Refresh project (R)',
        size_both: 'lines + links', freeRotate: 'Free rotation (no up/down)', projection: 'Projection', proj_persp: 'Perspective', proj_iso: 'Isometric',
        isoView: 'Isometric angle', labelNear: 'Label the nodes nearest to the camera (otherwise the most connected)',
        autoLangs: 'No files with the selected extensions - opening as:', srcFile: 'source file', languages: 'Languages',
        msaa: 'Anti-aliasing (MSAA)', v_idleStop: 'Sleep animation after inactivity', showFps: 'Show FPS', resetTab: 'Reset tab', resetAll: 'Reset everything', resetDone: 'Reset done',
        resetAllConfirm: 'Reset all settings (view, style, screen, physics, filters) to defaults? The project will reload.',
        snapTitle: 'Project snapshot (.drift)', snapHint: 'Parse result, layout and settings in one compressed file. Opens here instantly - no re-parsing, no GitHub. Put it next to your project site and open with ?snap=file.drift',
        snapWithSrc: 'Include source code (for code view in details)', snapSave: 'Download snapshot', snapBuilding: 'Building snapshot…', snapSaved: 'Snapshot ready:',
        snapOpening: 'Opening snapshot', bootRepo: 'Loading repository', snapBad: 'Not a Codrift snapshot', openSnap: 'Open snapshot file (.drift / .json)…', dropHint: 'You can also drop a .drift or .zip file onto the page.',
        graphExport: 'Current view graph', graphExportHint: 'With node positions and colors: GLB - 3D model for Blender, GEXF - Gephi, GraphML - yEd/Cytoscape, DOT - Graphviz.', glbBuilding: 'Building 3D model…',
        nodeLink: 'Link', nodeLinkHint: 'Copy a link to this node with current settings and camera', openFull: 'Open full view',
        pngScale: 'Quality (scale)', png_labels: 'Node labels', png_legend: 'Color key (what each color means)', png_title: 'Title (project, view)', pngSave: 'Save PNG', pngRendering: 'Rendering image…',
        o_screen: 'Screen', st_simple: 'Simple', st_cosmos: 'Cosmos', st_neon: 'Neon', presetEdited: 'Preset modified.', resetPreset: 'Restore preset',
        palette: 'Palette', pal_theme: 'Theme', pal_vivid: 'Vivid', pal_cosmos: 'Cosmos', pal_neon: 'Neon', pal_blueprint: 'Blueprint',
        shape: 'Node shape', sh_sphere: 'Sphere', sh_crystal: 'Crystal', sh_wire: 'Wireframe', material: 'Material', m_flat: 'Matte', m_soft: 'Soft', m_glow: 'Glowing',
        v_rim: 'Rim light', effects: 'Effects', colorShade: 'Brightness by metric', canceled: 'Cancelled', video: 'Video and GIF', vidFormat: 'Format', vidSize: 'Size (square, px)', vidFps: 'Frames per second', v_vidDur: 'Duration', v_vidSpeed: 'Rotation speed', vidLoop: 'Exactly one turn (seamless loop)', vidSave: 'Record', vidRec: 'Recording: frame', vidDone: 'Video saved', vidNoMp4: 'This browser cannot encode MP4 (no WebCodecs) - a GIF will be recorded.', arr_includes: 'A → B: A imports B (file or module B is needed by A)', arr_calls: 'A → B: A calls B', arr_callsFile: 'A → B: functions of A call functions of B', arr_api: 'header → declaration → implementation file', arr_dirs: 'folder → contents', arrowHint: 'Link direction: arrows appear on the selected node, otherwise a gradient (darker at the source, brighter at the target).', dirsFilter: 'Folders', g_nodes: 'Nodes', g_links: 'Links', g_glow: 'Glow', g_scene: 'Scene', g_select: 'Selection', v_linkGlow: 'Link glow', v_bloomRadius: 'Glow radius', v_bloomThreshold: 'Glow threshold', c_orbits: 'Orbits (shells)', c_fog: 'Depth fog', c_additive: 'Additive light (bundles glow)',
        sky: 'Background', sky_none: 'None', sky_gradient: 'Gradient', sky_stars: 'Stars', sky_nebula: 'Nebula', sky_grid: 'Grid', v_skyAmt: 'Background brightness', newSky: 'Generate new sky',
        nearFade: 'Dissolve nodes near camera', perf: 'Performance', fpsCap: 'FPS limit', fps_auto: 'None', resScale: 'Render resolution',
        res_low: 'Low', res_mid: 'Medium', res_auto: 'Auto', res_high: 'High', gpuLabel: 'Graphics card', gpuIntegratedHint: 'The browser seems to render on the integrated GPU. If the computer has a discrete one (NVIDIA / AMD): Windows Settings → System → Display → Graphics → your browser → "High performance", then restart the browser.', gpuSoftwareHint: 'The browser renders without a GPU (software): enable hardware acceleration in the browser settings.', glLost: 'The GPU reset the 3D context (driver failure or out of video memory). The scene will come back by itself; if not, reload the page.', glRestored: 'The GPU is available again', noWebGL: 'The browser gave no WebGL, so the 3D graph is unavailable. Enable hardware acceleration in the browser settings or update the GPU driver; Statistics works without it.', gpuSlow: 'The GPU cannot keep up: FPS is low although the site itself spends only a few ms per frame. Try Auto resolution or turn off glow.', res_max: 'Max', perfHint: 'Frames are drawn only while something moves or animates. Glow, orbits, pulses, jitter and rotation cost the most - turn them off in Style.',
        viaPtr: 'pointer', nodeMissing: 'This node is not in the current view', showAll: 'Show all', documented: 'Documented', medianFn: 'Median function', longFns: 'Functions > 50 lines', avgFile: 'Average file', codeLinesU: 'lines of code', ofProject: 'of the project',
        ch_tree: 'Code map', ch_treeHint: 'Tile area is lines of code. Click a folder to zoom in, a file to open it on the graph; large folders show their contents.', tm_folders: 'folders', tm_comments: 'comments',
        ch_mix: 'Code mix', ch_mixLang: 'Lines of code by language and what all project lines consist of.', ch_mixMod: 'Lines of code by module (project folder) and what all lines consist of.',
        ch_mods: 'Modules', ch_modsHint: 'Code volume and share of documented functions (a comment above the declaration) per module.', m_module: 'module', m_code: 'code', m_doc: 'documented',
        ch_fnLen: 'Function length', ch_fnLenHint: 'How many functions of each length. Orange and red are long: harder to read and test. Click a bar for the list.',
        ch_fileSize: 'File size', ch_fileSizeHint: 'How many files of each size. Orange and red are over 1000 lines. Click a bar for the list.',
        st_median: 'median', st_p90: '90% are at most', st_over50: 'longer than 50 lines', st_over1000: 'over 1000 lines',
        ch_docs: 'Size and comments', ch_docsHint: 'Each dot is a file: right = more code, up = more comments. The red zone holds big files with almost no comments.', ax_comm: 'comments', zone_bigNoDoc: 'big, uncommented',
        ch_coupling: 'Function coupling', ch_couplingHint: 'Each dot is a function: right = how many it calls, up = how many call it. Top right are hubs: changing them affects a lot. Color is length.',
        ax_callees: 'calls functions', ax_callers: 'called by', q_hub: 'hubs', q_core: 'core: called by many', q_orch: 'orchestrators: call many',
        ch_pareto: 'Code concentration', ch_paretoHint: 'How much of the code sits in the largest files (Pareto curve). Dashed: if all files were equal.', ax_files: 'share of files, largest first', ax_codeShare: 'share of code',
        pareto80: '80% of the code is in {p} of files', ch_deps: 'File dependencies', ch_depsHint: 'Each dot is a file: right = how many files it imports, up = how many import it. Top right are hubs: editing one rebuilds a lot, and it pulls in a lot.', ax_incs: 'includes files', ax_incBy: 'included by', q_stable: 'stable: included by many', q_dependent: 'dependent: include many', pareto50: 'half of the code is in {p} of files', maxFiles: 'Max files',
        tooManyHint: 'Narrow it down with “Search only in”.',
        c_bloom: 'Enable glow (bloom)', c_stars: 'Stars and nebulae',
        c_electrons: 'Electron shells', c_pulses: 'Pulses along links', c_autoRotate: 'Auto-rotation', v_glow: 'Glow strength',
        v_selfGlow: 'Core luminosity', v_wobble: 'Thermal jitter', v_pulseSpeed: 'Pulse speed', v_rotateSpeed: 'Rotation speed', v_rotateDelay: 'Start rotating after', v_pulseRate: 'Pulse rate',
        pause: 'Pause layout and pulses', resume: 'Resume layout and pulses',
        showIndirect: 'Indirect calls (via function pointers)',
        gradient: 'Link direction as gradient', labels: 'Labels', labelKinds: 'Label these node kinds', camera: 'Camera',
        mdHint: 'Text documentation from the same parse: tree, relations, descriptions from comments.', mdAll: 'Markdown: whole project', mdApi: 'Markdown: headers only (API)', mdApiPub: 'Markdown: public only (API)', mdApiMixed: 'Markdown: API only',
        png: 'PNG screenshot', copyLink: 'Copy link', switchProject: 'Open another project…', copied: 'Copied',
        md_title: 'code documentation', md_titleApi: 'API reference', md_generated: 'Generated by Codrift', md_fromComments: 'Descriptions are taken from source comments.',
        md_toc: 'Contents', md_tree: 'Directory structure', md_source: 'source', md_desc: 'Description', md_value: 'Value', md_decl: 'Declaration',
        md_download: 'Download .md', md_copy: 'Copy', md_note: 'Generated in your browser, nothing is uploaded.',
    },
};
const store = {
    get(k, d) { try { const v = localStorage.getItem('drift.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('drift.' + k, JSON.stringify(v)); } catch { /* приватный режим */ } },
};
// Перенос настроек со старым префиксом ключей «ccv.*» на «drift.*»
try {
    for (const k of Object.keys(localStorage)) {
        if (!k.startsWith('ccv.')) continue;
        const nk = 'drift.' + k.slice(4);
        if (localStorage.getItem(nk) == null) localStorage.setItem(nk, localStorage.getItem(k));
        localStorage.removeItem(k);
    }
} catch { /* приватный режим */ }
let LANG = store.get('lang', 'en');
const t = k => (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k;

/* ======================================================================
   Утилиты
   ====================================================================== */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const _nf = {};
const fmt = n => (n == null ? '-' : (_nf[LANG] || (_nf[LANG] = new Intl.NumberFormat(LANG === 'ru' ? 'ru-RU' : 'en-US'))).format(Number(n)));
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + '%' : '-');
const dirname = p => { const i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i); };
const basename = p => p.slice(p.lastIndexOf('/') + 1);
const extOf = p => { const b = basename(p); const i = b.lastIndexOf('.'); return i < 0 ? '' : b.slice(i).toLowerCase(); };
const isHeader = p => /\.(h|hh|hpp|hxx|inl|inc)$/i.test(p);
function normPath(p) {
    const out = [];
    for (const seg of p.split('/')) {
        if (!seg || seg === '.') continue;
        if (seg === '..') { if (out.length) out.pop(); else return null; } else out.push(seg);
    }
    return out.join('/');
}
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const sleep0 = () => new Promise(r => setTimeout(r, 0));
// Быстрая передышка для браузера (отрисовать шкалу, принять клик «Отмена»): MessageChannel не урезается до 4 мс,
// как setTimeout, и не засыпает до секунды во фоновой вкладке
const _yc = new MessageChannel(), _yq = [];
_yc.port1.onmessage = () => { const f = _yq.shift(); if (f) f(); };
const yieldNow = () => new Promise(r => { _yq.push(r); _yc.port2.postMessage(0); });
// Передышка с отрисовкой страницы: ждёт кадр (requestAnimationFrame), чтобы при долгой работе (запись GIF) шкала хода
// успевала перерисоваться; в фоновой вкладке кадров нет - тогда срабатывает таймер
const yieldPaint = () => new Promise(r => { let done = false; const go = () => { if (!done) { done = true; r(); } }; requestAnimationFrame(() => setTimeout(go, 0)); setTimeout(go, 120); });
// Отмена долгих операций (загрузка / обновление проекта, запись ролика)
const CANCELED = 'drift-canceled';
let loadCancel = false, videoCancel = false;
function cancelOps() { if (videoRec) videoCancel = true; else if (busy) loadCancel = true; }


function hexToRgba(hex, a) {
    const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
// Показать/скрыть элемент с анимацией (появление - CSS-анимация, скрытие - класс .leaving)
const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)');
function setShown(el, show) {
    if (!el) return;
    if (el.id === 'opts') document.body.classList.toggle('opts-open', !!show);
    if (show) { el.classList.remove('leaving'); el.hidden = false; return; }
    if (el.hidden || el.classList.contains('leaving')) return;
    if (REDUCED_MOTION.matches) { el.hidden = true; return; }
    el.classList.add('leaving');
    setTimeout(() => { if (el.classList.contains('leaving')) { el.hidden = true; el.classList.remove('leaving'); } }, 170);
}
const isShown = el => !el.hidden && !el.classList.contains('leaving');
let toastTimer = 0;
function toast(msg, ms = 3500) {
    const el = $('#toast'); el.textContent = msg; setShown(el, true);
    clearTimeout(toastTimer); toastTimer = setTimeout(() => setShown(el, false), ms);
}

/* ======================================================================
   Glob-фильтры
   ====================================================================== */
const DEFAULT_IGNORE = [
    '# Служебные каталоги: системы контроля версий, IDE, кэши, виртуальные окружения',
    '.git', '.svn', '.hg', '.idea', '.vscode', '.vs', '.gradle', '.venv', 'venv', '__pycache__', '.pytest_cache', '.mypy_cache', '.tox',
    '# Сборка и её результаты',
    'build', 'builds', 'dist', 'out', 'bin', 'obj', 'target', 'cmake-build-*', 'CMakeFiles', 'Debug', 'Release', 'x64', '.next', '.nuxt', 'coverage',
    '# Зависимости и сторонний код',
    'node_modules', 'bower_components', 'site-packages', 'Pods', 'vendor', 'vendors', 'third_party', 'thirdparty', 'third-party', '3rdparty', 'external', 'extern', 'deps', 'libs',
    '# Сгенерированный и минифицированный код',
    '*.min.js', '*.bundle.js', '*.pb.h', '*.pb.cc', '*_pb2.py', '*.g.cs', '*.Designer.cs', '*.generated.*',
    '# Встраиваемые библиотеки, которые часто лежат прямо в исходниках (папки - с «/» на конце: файлы самой библиотеки в её репозитории не задеваются)',
    'glad', 'KHR', 'khrplatform.h', 'stb_*', 'miniaudio.h', 'dr_*.h', 'cgltf.h', 'sokol_*.h', 'nuklear.h',
    'SDL*/', 'glfw/', 'GLFW/', 'cglm/', 'glm/', 'imgui/', 'Eigen/',
].join('\n');
// Языки по умолчанию не заданы - определяются по файлам проекта (самые частые)
const DEFAULTS = { ignore: DEFAULT_IGNORE, only: '', exts: '', roots: 'auto', maxKB: 1024, maxFiles: 5000 };
// Сохранённые старые значения по умолчанию заменяются текущими (изменённые вручную не трогаются)
if (store.get('exts', null) === '.c .h') store.set('exts', '');
{ const ig = store.get('ignore', null); if (ig && ((ig.startsWith('# Каталоги сторонних библиотек и сборки') && ig.trim().endsWith('cJSON_Utils.*')) || (ig.startsWith('# Служебные каталоги') && !ig.includes('SDL*/')))) store.set('ignore', DEFAULT_IGNORE); }


function compileGlobs(text) {
    const out = [];
    for (let raw of String(text || '').split(/\r?\n/)) {
        raw = raw.trim();
        if (!raw || raw.startsWith('#')) continue;
        let p = raw.replace(/\\/g, '/'); const dirOnly = p.endsWith('/'); p = p.replace(/^\/+|\/+$/g, '').replace(/^\.\//, '');
        if (!p) continue;
        const rx = p.split('/').map(seg => seg === '**' ? '\u0000' : seg.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]')).join('/')
            .replace(/\u0000\//g, '(?:.*/)?').replace(/\/\u0000/g, '(?:/.*)?').replace(/\u0000/g, '.*');
        const anchored = raw.replace(/\/+$/, '').includes('/');
        const re = anchored ? new RegExp('^' + rx + (dirOnly ? '/' : '(?:/|$)'), 'i') : new RegExp('(?:^|/)' + rx + (dirOnly ? '/' : '(?:/|$)'), 'i');
        out.push(re);
    }
    return out;
}
const anyMatch = (res, path) => res.some(r => r.test(path));


function readCfg() {
    return Object.assign({
        ignore: store.get('ignore', DEFAULTS.ignore), only: store.get('only', DEFAULTS.only), exts: store.get('exts', DEFAULTS.exts),
        roots: store.get('roots', DEFAULTS.roots), maxKB: store.get('maxKB', DEFAULTS.maxKB), maxFiles: store.get('maxFiles', DEFAULTS.maxFiles),
    }, typeof cfgOverride === 'object' ? cfgOverride : {});
}

/* ======================================================================
   Источники: GitHub, локальная папка, zip
   ====================================================================== */
let ghToken = ''; // только в памяти


function parseRepoSpec(s) {
    s = String(s || '').trim().replace(/\.git$/, '');
    let m = /github\.com[/:]([^/\s]+)\/([^/\s#?]+)(?:\/(?:tree|blob)\/([^?#]+))?/.exec(s);
    if (m) return { owner: m[1], repo: m[2], ref: m[3] ? decodeURIComponent(m[3]) : '' };
    m = /^([\w.-]+)\/([\w.-]+)(?:@(.+))?$/.exec(s);
    if (m) return { owner: m[1], repo: m[2], ref: m[3] || '' };
    return null;
}


async function ghApi(path) {
    const headers = { Accept: 'application/vnd.github+json' };
    if (ghToken) headers.Authorization = 'Bearer ' + ghToken;
    const r = await fetch('https://api.github.com' + path, { headers });
    if (r.status === 403 || r.status === 429) {
        const reset = r.headers.get('x-ratelimit-reset');
        if (r.headers.get('x-ratelimit-remaining') === '0') throw new Error(t('rateLimit') + ' ' + (reset ? new Date(reset * 1000).toLocaleTimeString() : '…'));
    }
    if (r.status === 404 || r.status === 422) throw new Error(t('notFound'));
    if (!r.ok) throw new Error('GitHub API ' + r.status + ': ' + (await r.text()).slice(0, 200));
    return r.json();
}


function makeWeb(owner, repo, ref) {
    const enc = p => p.split('/').map(encodeURIComponent).join('/');
    return (p, a, b) => `https://github.com/${owner}/${repo}/blob/${enc(ref)}/${enc(p)}` + (a ? `#L${a}` + (b && b !== a ? `-L${b}` : '') : '');
}


// Список файлов без GitHub API (когда исчерпан лимит 60 запросов в час): jsDelivr отдаёт дерево репозитория.
// Ветка по умолчанию неизвестна - пробуем main и master
async function jsdelivrTree(owner, repo, ref) {
    for (const r of ref && ref !== 'HEAD' ? [ref] : ['main', 'master']) {
        try {
            const res = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${owner}/${repo}@${encodeURIComponent(r)}?structure=flat`);
            if (res.status === 403) return { tooBig: true }; // jsDelivr не отдаёт репозитории больше 50 МБ
            if (!res.ok) continue;
            const j = await res.json();
            if (j && Array.isArray(j.files)) return { ref: r, entries: j.files.map(f => ({ path: f.name.replace(/^\/+/, ''), size: f.size || 0 })) };
        } catch { /* следующая ветка */ }
    }
    return null;
}


async function sourceGitHub(spec, refIn) {
    const { owner, repo } = spec;
    // Один запрос к API: дерево по ветке (или HEAD = ветка по умолчанию); содержимое - через raw (без лимита API)
    let ref = refIn || spec.ref || 'HEAD';
    // Ветка с '/' в имени: если URL вида tree/feature/x/dir - пробуем сокращать
    let tree = null, refTry = ref, subdir = '', entries = null;
    for (let k = 0; k < 6; k++) {
        try { tree = await ghApi(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(refTry)}?recursive=1`); break; } catch (e) {
            if (e.message.startsWith(t('rateLimit')) && !ghToken) {
                const alt = await jsdelivrTree(owner, repo, refTry);
                if (alt && alt.tooBig) throw new Error(e.message + ' ' + t('rateBig'));
                if (!alt) throw e;
                toast(t('rateFallback'), 5000); refTry = alt.ref; entries = alt.entries; break;
            }
            if (!refTry.includes('/') || e.message.startsWith(t('rateLimit'))) throw e;
            subdir = refTry.slice(refTry.lastIndexOf('/') + 1) + (subdir ? '/' + subdir : ''); refTry = refTry.slice(0, refTry.lastIndexOf('/'));
        }
    }
    if (!tree && !entries) throw new Error(t('notFound'));
    ref = refTry;
    if (!entries) entries = tree.tree.filter(e => e.type === 'blob').map(e => ({ path: e.path, size: e.size || 0, sha: e.sha }));
    const enc = p => p.split('/').map(encodeURIComponent).join('/');
    return {
        name: `${owner}/${repo}`, ref, subdir, truncated: !!(tree && tree.truncated), entries, repoSpec: { owner, repo, ref },
        web: makeWeb(owner, repo, ref),
        async read(e) {
            let r;
            if (ghToken && e.sha) r = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${e.sha}`, { headers: { Accept: 'application/vnd.github.raw', Authorization: 'Bearer ' + ghToken } });
            else r = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${enc(ref)}/${enc(e.path)}`);
            if (!r.ok) throw new Error(e.path + ': HTTP ' + r.status);
            return r.text();
        },
    };
}


function stripCommonRoot(entries) {
    if (!entries.length) return '';
    const first = entries[0].path.split('/')[0];
    if (entries.every(e => e.path.startsWith(first + '/'))) { for (const e of entries) e.path = e.path.slice(first.length + 1); return first; }
    return '';
}


function sourceFileList(fileList) {
    const entries = [...fileList].map(f => ({ path: (f.webkitRelativePath || f.name).replace(/\\/g, '/'), size: f.size, file: f }));
    const root = stripCommonRoot(entries);
    return { name: root || (LANG === 'ru' ? 'локальные файлы' : 'local files'), entries, read: e => e.file.text() };
}


async function sourceDirHandle(handle, ignoreRes) {
    let entries = [];
    async function walk(dir, prefix) {
        for await (const [name, h] of dir.entries()) {
            const path = prefix ? prefix + '/' + name : name;
            if (h.kind === 'directory') {
                if (name === '.git' || name === 'node_modules') continue;
                if (anyMatch(ignoreRes, path + '/')) { entries.push({ path: path + '/', size: 0, dirOnly: true }); continue; }
                await walk(h, path);
            } else entries.push({ path, size: 0, handle: h });
        }
    }
    await walk(handle, '');
    // listAgain - повторный обход папки (наблюдатель замечает новые и удалённые файлы)
    const listAgain = async () => { const keep = entries; entries = []; try { await walk(handle, ''); return entries; } finally { entries = keep; } };
    return { name: handle.name, entries, watchable: true, listAgain, async read(e) { const f = await e.handle.getFile(); return f.text(); } };
}


async function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); });
}


async function sourceZip(file) {
    if (!window.fflate) await loadScript('https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js');
    const buf = new Uint8Array(await file.arrayBuffer());
    // Распаковываем файлы всех поддерживаемых языков - иначе автоопределение языка не сработает
    const cfg = readCfg();
    const exts = new Set(cfg.exts.split(/[\s,]+/).filter(Boolean).map(s => (s.startsWith('.') ? s : '.' + s).toLowerCase()));
    if (window.CodriftLangs) for (const L of CodriftLangs.all) for (const e of L.exts) exts.add(e);
    const files = window.fflate.unzipSync(buf, { filter: f => exts.has(extOf(f.name)) && f.originalSize < cfg.maxKB * 1024 });
    const entries = Object.keys(files).filter(p => !p.endsWith('/')).map(p => ({ path: p, size: files[p].length, data: files[p] }));
    const root = stripCommonRoot(entries);
    const dec = new TextDecoder();
    return { name: root || file.name.replace(/\.zip$/i, ''), entries, read: async e => dec.decode(e.data) };
}

/* ======================================================================
   Загрузка и разбор
   ====================================================================== */
let model = null;
let busy = false;


function setProgress(text, frac, isErr) {
    // Строка хода в панели источника (если панель открывали); экран загрузки и шкала обновления - независимо от неё
    const el = $('#progress');
    if (el) el.innerHTML = `<div class="${isErr ? 'err' : ''}">${esc(text)}</div>` + (frac != null ? `<div class="bar"><div style="width:${Math.round(frac * 100)}%"></div></div><button class="chip" data-cancel style="margin-top:6px">✕ ${esc(t('cancel'))}</button>` : '');
    const ld = $('#loading'); if (ld && !isErr && !refreshing) { ld.hidden = frac == null && !busy; ld.textContent = text; }
    if (!$('#boot').hidden && !isErr) { $('#bootText').textContent = text; if (frac != null) $('#bootBar').style.width = Math.round(frac * 100) + '%'; }
    // Обновление проекта: граф остаётся на экране, ход показывает тонкая шкала сверху
    const rb = $('#rbar'); bindCancelButtons();
    if (rb) { if (refreshing && !isErr) { rb.hidden = false; $('#rbarText').textContent = `${t('refreshing')} ${text}`; if (frac != null) $('#rbarFill').style.width = Math.round(frac * 100) + '%'; } else rb.hidden = true; }
    if (isErr && ld) ld.hidden = true;
}


// Открытие по ссылке (?repo= / ?snap=): экран загрузки поверх всего интерфейса - пока граф не готов, кликать нечего
function bindCancelButtons() {
    for (const id of ['#rbarCancel', '#bootCancel']) { const b = $(id); if (b) { b.textContent = '✕ ' + t('cancel'); b.onclick = cancelOps; } }
}


function bootShow(title) { bindCancelButtons(); $('#bootTitle').textContent = title; $('#bootText').textContent = ''; $('#bootBar').style.width = '0'; $('#boot').hidden = false; }


// Ошибка загрузки по ссылке: экран убирается, для репозитория открывается панель источника (там видна ошибка и можно повторить)
function bootFail() {
    if ($('#boot').hidden) return;
    $('#boot').hidden = true;
    const repo = START_QUERY.get('repo');
    if (repo && !START_QUERY.get('snap') && !document.body.classList.contains('embed')) { openSource(true); $('#inRepo').value = repo; $('#inRef').value = START_QUERY.get('ref') || ''; }
}


let lastSource = null, watchTimer = 0, refreshing = false;
async function runSource(makeSource, opts) {
    if (busy) return; busy = true;
    refreshing = !!(opts && opts.refresh);
    const cfg = readCfg();
    const ignoreRes = compileGlobs(cfg.ignore), onlyRes = compileGlobs(cfg.only);
    let exts = cfg.exts.split(/[\s,]+/).filter(Boolean).map(s => (s.startsWith('.') ? s : '.' + s).toLowerCase());
    // Выбрано хоть одно расширение языка - берём все его расширения (.cpp без .hpp потерял бы заголовки)
    if (window.CodriftLangs) for (const L of CodriftLangs.all) if (L.exts.some(e => exts.includes(e))) exts = [...new Set([...exts, ...L.exts])];
    try {
        setProgress(t('listing'), 0);
        loadCancel = false;
        const src = await makeSource(ignoreRes);
        if (loadCancel) throw new Error(CANCELED);
        let allPaths, ignoredDirs, picked, ignoredCount, large;
        const pre = src.subdir ? src.subdir.replace(/\/+$/, '') + '/' : '';
        const pickFiles = extList => {
            allPaths = new Set(); ignoredDirs = []; picked = []; ignoredCount = 0; large = 0;
            for (const e of src.entries) {
                if (e.dirOnly) { ignoredDirs.push(e.path); continue; }
                if (!extList.includes(extOf(e.path))) continue;
                allPaths.add(e.path);
                if (pre && !e.path.startsWith(pre)) continue;
                if (anyMatch(ignoreRes, e.path)) { ignoredCount++; continue; }
                if (onlyRes.length && !anyMatch(onlyRes, e.path)) continue;
                if (e.size > cfg.maxKB * 1024) { large++; continue; }
                picked.push(e);
            }
        };
        pickFiles(exts);
        const cppL = window.CodriftLangs && CodriftLangs.byId('cpp');
        // Проект на C++ с заголовками .h: файлов .c нет, а .cpp/.hpp есть - открываем как C++
        if (cppL && picked.length && !picked.some(e => extOf(e.path) === '.c') && src.entries.some(e => !e.dirOnly && cppL.exts.includes(extOf(e.path)) && !anyMatch(ignoreRes, e.path))) {
            pickFiles([...new Set([...exts, ...cppL.exts])]); toast(t('autoLangs') + ' C++', 4000);
        }
        if (!picked.length && window.CodriftLangs) {
            // Нет файлов выбранных расширений - определяем языки проекта сами (самые частые)
            const cnt = new Map();
            for (const e of src.entries) { if (e.dirOnly || anyMatch(ignoreRes, e.path)) continue; const L = CodriftLangs.forPath(e.path); if (L) cnt.set(L, (cnt.get(L) || 0) + 1); }
            const max = Math.max(0, ...cnt.values());
            const chosen = [...cnt].filter(([, n]) => n >= Math.max(1, max * 0.15)).map(([L]) => L);
            if (chosen.length) { pickFiles(chosen.flatMap(L => L.exts)); toast(`${t('autoLangs')} ${chosen.map(L => L.name).join(', ')}`, 4000); }
        }
        if (src.truncated) toast(t('truncated'), 6000);
        if (!picked.length) throw new Error(t('noFiles'));
        const LIMIT = Math.max(50, cfg.maxFiles | 0);
        if (picked.length > LIMIT) { toast(`${t('tooMany')} ${fmt(LIMIT)} / ${fmt(picked.length)}. ${t('tooManyHint')}`, 9000); picked = picked.slice(0, LIMIT); }
        // Чтение с ограничением параллельности
        const texts = new Array(picked.length); let doneN = 0, next = 0, readErr = null;
        const conc = src.web ? 12 : 24; // сеть - меньше параллельных запросов, локальные файлы - больше
        async function worker() {
            while (next < picked.length && !loadCancel) {
                const i = next++;
                try { texts[i] = await src.read(picked[i]); } catch (err) { texts[i] = null; readErr = readErr || err; console.warn(err); }
                doneN++; if (doneN % 4 === 0 || doneN === picked.length) setProgress(`${t('reading')} ${doneN}/${picked.length}`, doneN / picked.length * 0.7);
            }
        }
        await Promise.all(Array.from({ length: Math.min(conc, picked.length) }, worker));
        if (loadCancel) throw new Error(CANCELED);
        const files = [];
        const hasCpp = !!cppL && picked.some(e => cppL.exts.includes(extOf(e.path)) && !/\.h$/i.test(e.path));
        for (let i = 0; i < picked.length; i++) {
            if (texts[i] == null) continue;
            try {
                // Парсер выбирается по расширению файла (плагины языков - langs.js)
                let L = window.CodriftLangs && CodriftLangs.forPath(picked[i].path);
                if (L && L.id === 'c' && hasCpp && /\.h$/i.test(picked[i].path)) L = cppL; // .h в C++-проекте - заголовок C++
                const pf = L ? L.parse(picked[i].path, texts[i]) : CParser.parseFile(picked[i].path, texts[i]);
                pf.lang = L ? L.id : 'c'; pf.text = texts[i]; files.push(pf);
            } catch (err) { console.warn('parse', picked[i].path, err); }
            if (i % 20 === 0) { setProgress(`${t('parsing')} ${i + 1}/${picked.length}`, 0.7 + 0.25 * i / picked.length); await sleep0(); if (loadCancel) throw new Error(CANCELED); }
        }
        if (!files.length) throw readErr || new Error(t('noFiles'));
        setProgress(t('building'), 0.97); await sleep0();
        model = buildModel(files, { allPaths, ignoredDirs, ignoreRes, roots: cfg.roots, name: src.name, ref: src.ref, web: src.web, ignoredCount, large });
        model.parsed = files; model.repoSpec = src.repoSpec || null;
        model.ctxRaw = { allPaths: [...allPaths], ignoredDirs, roots: cfg.roots, ignoredCount, large };
        lastSource = makeSource; lastSource.src = src; // для обновления (⟳, R) и наблюдателя - только удачная загрузка
        setProgress(`${t('done')}: ${files.length} ${t('files').toLowerCase()}, ${fmt(model.totals.total)} ${t('lines').toLowerCase()}`, null);
        $('#loading').hidden = true;
        busy = false;
        onModelReady();
    } catch (err) {
        busy = false; bootFail(); refreshing = false; $('#rbar').hidden = true; $('#loading').hidden = true;
        // Отмена - не ошибка: открытый проект остаётся прежним
        if (err.message === CANCELED) { loadCancel = false; setProgress(t('canceled'), null); toast(t('canceled'), 2000); return; }
        console.error(err);
        setProgress(err.message || String(err), null, true);
        toast(err.message || String(err), 6000);
    }
}

/* ======================================================================
   Модель проекта
   ====================================================================== */
// Имена параметров функции (из сигнатуры)
function paramNames(fn) {
    const sig = fn.sig || '', i = sig.indexOf('('); if (i < 0) return new Set();
    let d = 0, j = i; for (; j < sig.length; j++) { if (sig[j] === '(') d++; else if (sig[j] === ')') { d--; if (!d) break; } }
    const inner = sig.slice(i + 1, j); const out = new Set();
    // Делим по запятым верхнего уровня: void (*cb)(int, int) - один параметр
    const parts = []; let depth = 0, from = 0;
    for (let k = 0; k <= inner.length; k++) {
        const ch = inner[k];
        if (ch === '(' || ch === '<' || ch === '[' || ch === '{') depth++;
        else if (ch === ')' || (ch === '>' && inner[k - 1] !== '=' && inner[k - 1] !== '-') || ch === ']' || ch === '}') depth--;
        else if ((ch === ',' && depth <= 0) || k === inner.length) { parts.push(inner.slice(from, k)); from = k + 1; }
    }
    for (let part of parts) {
        part = part.replace(/=.*$/s, '').trim();
        const fp = part.match(/\(\s*[*&^]\s*([A-Za-z_]\w*)\s*\)/); // указатель на функцию (C/C++)
        if (fp) { out.add(fp[1]); continue; }
        part = part.replace(/\[[^\]]*\]\s*$/, '').replace(/\?$/, '');
        const m = part.match(/([A-Za-z_]\w*)\s*\??\s*(?::.*)?$/s);
        if (m && !/^(void|const|int|char|float|double|long|short|unsigned|signed|bool)$/.test(m[1])) out.add(m[1]);
    }
    return out;
}
const langOf = f => (window.CodriftLangs && f && (CodriftLangs.byId(f.lang) || CodriftLangs.forPath(f.path))) || null;
function buildModel(parsed, ctx) {
    const M = {
        name: ctx.name, ref: ctx.ref, web: ctx.web, files: new Map(), dirs: new Map(), fns: new Map(), fnByName: new Map(),
        macros: new Map(), macroByName: new Map(), types: new Map(), vars: new Map(), declsByName: new Map(),
        totals: { total: 0, code: 0, comment: 0, blank: 0 }, ignoredCount: ctx.ignoredCount, large: ctx.large,
    };
    // Файлы
    for (const p of parsed) {
        const L = langOf(p);
        M.files.set(p.path, { ...p, lang: p.lang || 'c', id: 'f:' + p.path, dir: dirname(p.path), isH: L && L.isHeader ? L.isHeader(p.path) : isHeader(p.path), api: !L || !L.hasHeaders || (L.isHeader ? L.isHeader(p.path) : isHeader(p.path)), fnIds: [], incOut: [], incIn: [] });
        (M.langs || (M.langs = new Set())).add(p.lang || 'c');
        for (const k of ['total', 'code', 'comment', 'blank']) M.totals[k] += p.stats[k];
    }
    // Директории (агрегированная статистика)
    const ensureDir = d => {
        if (M.dirs.has(d)) return M.dirs.get(d);
        const o = { id: 'd:' + d, path: d, stats: { total: 0, code: 0, comment: 0, blank: 0 }, files: [], subdirs: [], nFiles: 0 };
        M.dirs.set(d, o);
        if (d !== '') { const par = ensureDir(dirname(d)); par.subdirs.push(o); }
        return o;
    };
    ensureDir('');
    for (const f of M.files.values()) {
        const d = ensureDir(f.dir); d.files.push(f);
        for (let x = d; x; x = x.path === '' ? null : M.dirs.get(dirname(x.path))) { for (const k in x.stats) x.stats[k] += f.stats[k]; x.nFiles++; }
    }
    // Модули - для раскраски: группы по первым значимым сегментам пути
    computeModules(M);

    // Корни include
    const allDirs = new Set();
    for (const p of ctx.allPaths) { let d = dirname(p); while (d && !allDirs.has(d)) { allDirs.add(d); d = dirname(d); } }
    let roots = [''];
    if (!ctx.roots || ctx.roots.trim() === 'auto') {
        for (const d of allDirs) if (/(^|\/)(include|src|source|inc)$/i.test(d)) roots.push(d);
    } else roots = roots.concat(ctx.roots.split(/\s+/).filter(Boolean).map(s => s.replace(/^\.?\/+|\/+$/g, '')));
    const byBase = new Map(), allByBase = new Map();
    const addBase = (m, p) => { const b = basename(p).toLowerCase(); if (!m.has(b)) m.set(b, []); m.get(b).push(p); };
    for (const p of M.files.keys()) addBase(byBase, p);
    for (const p of ctx.allPaths) addBase(allByBase, p);
    const commonLen = (a, b) => { let i = 0; const A = a.split('/'), B = b.split('/'); while (i < A.length && i < B.length && A[i] === B[i]) i++; return i; };
    const isVendorPath = p => ctx.allPaths.has(p) && !M.files.has(p) || ctx.ignoredDirs.some(d => p.startsWith(d));
    function resolve(from, inc) {
        const cands = [];
        if (!inc.sys) cands.push(normPath(dirname(from) + '/' + inc.path));
        for (const r of roots) cands.push(normPath((r ? r + '/' : '') + inc.path));
        for (const c of cands) if (c != null && M.files.has(c)) return { kind: 'project', path: c };
        for (const c of cands) if (c != null && isVendorPath(c)) return { kind: 'vendor', path: c };
        if (!inc.sys || inc.path.includes('/')) {
            const suf = '/' + inc.path.replace(/^(\.\.?\/)+/, '').toLowerCase();
            const pick = (m) => {
                const list = (m.get(basename(inc.path).toLowerCase()) || []).filter(p => ('/' + p.toLowerCase()).endsWith(suf));
                if (!list.length) return null;
                return list.sort((a, b) => commonLen(b, from) - commonLen(a, from))[0];
            };
            const p1 = pick(byBase); if (p1) return { kind: 'project', path: p1 };
            const p2 = pick(allByBase); if (p2) return { kind: 'vendor', path: p2 };
        }
        return { kind: 'external', path: inc.path, sys: inc.sys };
    }
    M.ext = new Map(); // внешние/сторонние заголовки и модули
    const langCtx = { files: M.files, allPaths: ctx.allPaths, roots };
    for (const f of M.files.values()) {
        const L = langOf(f);
        for (const inc of f.includes) {
            // #include - общая логика C/C++; импорты других языков - правило плагина
            let rs = L && L.resolveImport && inc.kind !== undefined ? L.resolveImport(f, inc, langCtx) : null;
            if (!rs || !rs.length) rs = [resolve(f.path, inc)];
            inc.res = rs[0];
            for (const r of rs) {
                if (r.kind === 'project') {
                    const g = M.files.get(r.path);
                    if (g && g !== f && !f.incOut.some(e => e.file === g)) { f.incOut.push({ file: g, line: inc.line }); g.incIn.push({ file: f, line: inc.line }); }
                } else {
                    const id = 'x:' + r.path;
                    if (!M.ext.has(id)) M.ext.set(id, { id, name: r.path, kind: r.kind, sys: !!r.sys, users: [] });
                    M.ext.get(id).users.push({ file: f, line: inc.line });
                }
            }
        }
    }

    // Функции
    for (const f of M.files.values()) {
        for (const fn of f.funcs) {
            const list = M.fnByName.get(fn.name) || []; M.fnByName.set(fn.name, list);
            const qual = fn.container ? fn.container + '.' + fn.name : fn.name;
            let id = 'fn:' + qual;
            if (fn.isStatic || M.fns.has(id)) id = 'fn:' + qual + '@' + f.path;
            if (M.fns.has(id)) id += ':' + fn.line;
            const o = { ...fn, qual, id, file: f, kind: 'fn', out: [], inn: [], declaredIn: [] };
            M.fns.set(id, o); list.push(o); f.fnIds.push(id);
            if (!M.fnByQual) M.fnByQual = new Map();
            if (!M.fnByQual.has(qual)) M.fnByQual.set(qual, o);
        }
        for (const d of f.decls) {
            const list = M.declsByName.get(d.name) || []; M.declsByName.set(d.name, list); list.push({ ...d, file: f });
        }
        for (const m of f.macros) {
            const list = M.macroByName.get(m.name) || []; M.macroByName.set(m.name, list);
            let id = 'm:' + m.name; if (M.macros.has(id)) id += '@' + f.path + ':' + m.line;
            const o = { ...m, id, file: f, kind: 'macro', out: [], inn: [] };
            M.macros.set(id, o); list.push(o);
        }
        for (const ty of f.types) {
            const id = 't:' + ty.name;
            if (!M.types.has(id)) M.types.set(id, { id, name: ty.name, kind: 'type', tkind: ty.kind, defs: [], decls: [] });
            const T = M.types.get(id);
            (ty.def ? T.defs : T.decls).push({ ...ty, file: f });
            if (ty.def && ty.kind !== 'typedef') T.tkind = ty.kind;
        }
        for (const v of f.vars) {
            const id = 'v:' + v.name + (v.isStatic ? '@' + f.path : '');
            if (!M.vars.has(id)) M.vars.set(id, { id, name: v.name, kind: 'var', defs: [], decls: [] });
            (v.def ? M.vars.get(id).defs : M.vars.get(id).decls).push({ ...v, file: f });
        }
    }
    for (const [name, decls] of M.declsByName) {
        const defs = M.fnByName.get(name);
        if (defs) for (const fn of defs) if (!fn.isStatic || decls.some(d => d.file === fn.file)) for (const d of decls) fn.declaredIn.push(d);
    }
    for (const fn of M.fns.values()) {
        // Описание: из заголовка → у определения → у прототипа в том же .c (там часто общий «// Объявление функций:»)
        const hd = fn.declaredIn.find(d => d.doc && d.file.isH), ld = fn.declaredIn.find(d => d.doc);
        fn.implDoc = fn.doc; fn.doc = (hd && hd.doc) || fn.doc || (ld && ld.doc) || '';
    }
    for (const T of M.types.values()) { const d = T.defs.concat(T.decls).find(x => x.doc); T.doc = d ? d.doc : ''; }
    for (const V of M.vars.values()) { const d = V.decls.concat(V.defs).find(x => x.doc); V.doc = d ? d.doc : ''; }

    // Разрешение вызовов
    // Семейство языка: C и C++ видят друг друга, остальные - только свой язык
    const family = f => (f.lang === 'c' || f.lang === 'cpp' ? 'c' : f.lang === 'js' ? 'js' : f.lang);
    function resolveFn(name, from, container) {
        let defs = M.fnByName.get(name); if (!defs) return null;
        if (M.langs && M.langs.size > 1) { const fam = family(from); defs = defs.filter(d => family(d.file) === fam); if (!defs.length) return null; }
        if (container) { const own = defs.find(d => d.container === container && d.file === from) || defs.find(d => d.container === container); if (own) return own; }
        const free = defs.filter(d => !d.container);
        return free.find(d => d.file === from) || free.find(d => !d.isStatic) || free.find(d => d.file.isH)
            // Метод другого класса - только если он единственный с таким именем
            || (defs.length === 1 && !defs[0].isStatic && defs[0].container && langOf(from) && langOf(from).oop ? defs[0] : null)
            || defs.find(d => d.file === from) || null;
    }
    // Конструктор класса: Foo.Foo (C++/Java/C#), Foo.constructor (JS), Foo.__init__ (Python)
    const ctorOf = (name, from) => { const c = M.fnByQual && (M.fnByQual.get(name + '.' + name) || M.fnByQual.get(name + '.constructor') || M.fnByQual.get(name + '.__init__')); return c && (!from || family(c.file) === family(from)) ? c : null; };
    function resolveMacro(name, from) {
        const list = M.macroByName.get(name); if (!list) return null;
        return list.find(m => m.file === from) || list.find(m => m.file.isH) || list[0];
    }
    M.resolveFn = resolveFn; M.resolveMacro = resolveMacro;
    const addEdge = (src, map, key, data, line) => {
        let e = map.get(key); if (!e) { e = { ...data, count: 0, lines: [] }; map.set(key, e); }
        e.count++; if (line && e.lines.length < 50) e.lines.push(line);
    };
    // Указатели на функции: какие функции присваиваются какому полю структуры.
    // Источники: x->field = fn; x.field = &fn; { .field = fn }; и позиционные { fn1, fn2 } по порядку полей типа.
    const fieldsOfType = new Map();
    for (const f of M.files.values()) for (const ty of f.types) if (ty.fields && ty.fields.length && !fieldsOfType.has(ty.name)) fieldsOfType.set(ty.name, ty.fields);
    M.fieldFns = new Map();
    const addField = (field, name, file, line) => {
        const fn = resolveFn(name, file); if (!fn) return;
        if (!M.fieldFns.has(field)) M.fieldFns.set(field, new Map());
        M.fieldFns.get(field).set(fn.id, { fn, file, line });
    };
    for (const f of M.files.values()) {
        for (const a of f.fieldAssigns || []) addField(a.field, a.fn, f, a.line);
        for (const ini of f.inits || []) {
            const fl = fieldsOfType.get(ini.type); if (!fl) continue;
            ini.items.forEach((name, k) => { if (name && fl[k]) addField(fl[k], name, f, ini.line); });
        }
    }
    for (const fn of M.fns.values()) {
        const map = new Map(); const called = new Set();
        const oop = langOf(fn.file) && langOf(fn.file).oop;
        // Вызов параметра-колбэка (fn(), cb(), handler()) - это не вызов одноимённой функции проекта
        const params = paramNames(fn);
        for (const c of fn.calls) {
            if (params.has(c.name)) { called.add(c.name); continue; }
            const tf = (c.isNew && ctorOf(c.name, fn.file)) || resolveFn(c.name, fn.file, fn.container) || (oop && ctorOf(c.name, fn.file));
            if (tf) { addEdge(fn, map, tf.id, { kind: 'call', target: tf }, c.line); called.add(c.name); continue; }
            const mc = resolveMacro(c.name, fn.file);
            if (mc) { addEdge(fn, map, mc.id, { kind: 'macro', target: mc }, c.line); called.add(c.name); continue; }
            addEdge(fn, map, 'x:' + c.name, { kind: 'ext', name: c.name }, c.line);
        }
        for (const [name, line] of fn.ids) {
            if (called.has(name) || name === fn.name || params.has(name)) continue;
            const tf = resolveFn(name, fn.file, fn.container);
            if (tf) addEdge(fn, map, tf.id, { kind: 'ref', target: tf }, line);
            else { const mc = M.macroByName.get(name) && resolveMacro(name, fn.file); if (mc && mc.params == null && mc.calls.length) addEdge(fn, map, mc.id, { kind: 'macro', target: mc }, line); }
        }
        // Методы объектов (ООП-языки): this.f()/self.f() - метод своего класса; obj.f() - метод с таким именем, если он почти уникален
        if (oop) for (const mc of fn.memberCalls || []) {
            let targets = [];
            if (fn.container && (mc.recv === 'this' || mc.recv === 'self' || mc.recv === 'cls' || mc.recv === 'base' || mc.recv === 'super')) { const own = resolveFn(mc.field, fn.file, fn.container); if (own && own.container) targets = [own]; }
            if (!targets.length) { const ms = (M.fnByName.get(mc.field) || []).filter(d => d.container && family(d.file) === family(fn.file)); if (ms.length && ms.length <= 3) targets = ms; }
            for (const tf of targets) if (tf !== fn) addEdge(fn, map, tf.id, { kind: 'call', target: tf }, mc.line);
        }
        // Косвенные вызовы: obj->field(...) → все функции, когда-либо присвоенные полю field
        for (const mc of fn.memberCalls || []) {
            const targets = M.fieldFns.get(mc.field); if (!targets || targets.size > 40) continue;
            for (const { fn: tf } of targets.values()) if (!argsFit(tf, mc.argc)) continue; else if (!map.has(tf.id)) addEdge(fn, map, tf.id + '|ind', { kind: 'indirect', target: tf, field: mc.field }, mc.line);
            else if (map.get(tf.id) && map.get(tf.id).kind === 'ref') { map.get(tf.id).kind = 'indirect'; map.get(tf.id).field = mc.field; }
        }
        fn.out = [...map.values()];
        for (const e of fn.out) if (e.target) e.target.inn.push({ kind: e.kind, from: fn, count: e.count });
    }
    for (const m of M.macros.values()) {
        const map = new Map();
        for (const name of m.calls) {
            if (name === m.name) continue;
            const tf = resolveFn(name, m.file);
            if (tf) { addEdge(m, map, tf.id, { kind: 'call', target: tf }); continue; }
            const mc = resolveMacro(name, m.file);
            if (mc && mc !== m) { addEdge(m, map, mc.id, { kind: 'macro', target: mc }); continue; }
            addEdge(m, map, 'x:' + name, { kind: 'ext', name });
        }
        for (const name of m.ids) {
            if (map.has('fn:' + name) || name === m.name) continue;
            const tf = resolveFn(name, m.file);
            if (tf && !m.calls.includes(name)) addEdge(m, map, tf.id, { kind: 'ref', target: tf });
        }
        m.out = [...map.values()];
        for (const e of m.out) if (e.target) e.target.inn.push({ kind: e.kind, from: m, count: e.count });
    }
    return M;
}


// Подходит ли функция под вызов с argc аргументами (по сигнатуре; f(void) - 0, «...» - не меньше)
function paramInfo(fn) {
    if (fn._params) return fn._params;
    const sig = fn.sig || ''; const close = sig.lastIndexOf(')'); let depth = 0, open = -1;
    for (let i = close; i >= 0; i--) { if (sig[i] === ')') depth++; else if (sig[i] === '(') { depth--; if (depth === 0) { open = i; break; } } }
    const inner = open >= 0 ? sig.slice(open + 1, close).trim() : '';
    let n = 0, d = 0, variadic = /\.\.\./.test(inner);
    if (inner && inner !== 'void') { n = 1; for (const ch of inner) { if (ch === '(' || ch === '[') d++; else if (ch === ')' || ch === ']') d--; else if (ch === ',' && d === 0) n++; } }
    if (variadic) n--;
    return (fn._params = { n, variadic });
}


function argsFit(fn, argc) {
    if (argc == null || argc < 0) return true;
    const p = paramInfo(fn); return p.variadic ? argc >= p.n : argc === p.n;
}


function computeModules(M) {
    // Убираем общий префикс путей, группируем по 1-2 сегментам так, чтобы групп было не больше 7
    const paths = [...M.files.keys()];
    const segs = paths.map(p => dirname(p).split('/').filter(Boolean));
    let common = 0;
    if (segs.length) {
        outer: for (; ; common++) {
            const s = segs[0][common]; if (s == null) break;
            for (const x of segs) if (x[common] !== s) break outer;
        }
    }
    let depth = 2, groups;
    const make = d => { const g = new Map(); paths.forEach((p, i) => { const k = segs[i].slice(common, common + d).join('/') || '/'; g.set(k, (g.get(k) || 0) + M.files.get(p).stats.code); }); return g; };
    groups = make(depth);
    if (groups.size > 7) { depth = 1; groups = make(1); }
    if (groups.size <= 2) { const g3 = make(3); if (g3.size <= 7) { depth = 3; groups = g3; } }
    const order = [...groups.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]);
    const top = order.slice(0, 7);
    M.modules = top.concat(order.length > 7 ? ['…'] : []);
    M.moduleOf = p => { const k = dirname(p).split('/').filter(Boolean).slice(common, common + depth).join('/') || '/'; return top.includes(k) ? k : '…'; };
}

/* ======================================================================
   Построение данных графа для видов
   ====================================================================== */
const VIEW_IDS = ['includes', 'calls', 'api', 'dirs', 'stats'];
const viewOpts = store.get('viewOpts', {});
const defOpts = {
    includes: { layout: 'force', color: 'module', showExt: false, showVendor: false, hideIsolated: false },
    calls: { layout: 'force', color: 'module', gran: 'fn', showMacros: true, showExt: true, showRefs: true, showIndirect: true, hideIsolated: false },
    api: { layout: 'td', color: 'kind', fn: true, macro: true, type: true, var: true, includeC: false },
    dirs: { layout: 'td', color: 'module' },
};
for (const v in defOpts) viewOpts[v] = Object.assign({}, defOpts[v], viewOpts[v] || {});
// «Дерево →» убрано (камера свободная - направление ничего не меняет): сохранённое и из ссылок становится «Деревом»
const normLayouts = () => { for (const v in viewOpts) if (viewOpts[v].layout === 'lr') viewOpts[v].layout = 'td'; };
normLayouts();
// Обновление значений по умолчанию в сохранённых настройках (каждое - один раз): «Скрыть изолированные» в «Вызовах»
// выключено; «Сложение света» в «Неоне» выключено (если стиль не меняли вручную); «Дерево» - раскладка «API»
// и «Директорий»; «Яркость по метрике» выключена
if (!store.get('defaults8', false)) {
    for (const v of ['api', 'dirs']) if (viewOpts[v].layout === 'force') viewOpts[v].layout = 'td';
    store.set('viewOpts', viewOpts);
    const v0 = store.get('vis', null); if (v0 && v0.colorShade) { v0.colorShade = false; store.set('vis', v0); }
    store.set('defaults8', true);
}
if (!store.get('defaults7', false)) { const v0 = store.get('vis', null); if (v0 && v0.style === 'neon' && !v0.styleEdited && v0.additive) { v0.additive = false; store.set('vis', v0); } store.set('defaults7', true); }
if (!store.get('defaults6', false)) { viewOpts.calls.hideIsolated = false; store.set('viewOpts', viewOpts); store.set('defaults6', true); }
const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
// Сглаживание MSAA 4x по умолчанию на компьютерах (один раз и для сохранённых настроек): без него тысячи
// однопиксельных линий плотного графа мерцают при повороте камеры
if (!store.get('defaults9', false)) { const v0 = store.get('vis', null); if (v0 && !IS_TOUCH && !v0.msaa) { v0.msaa = 4; store.set('vis', v0); } store.set('defaults9', true); }
const VIS_DEF = {
    sizeBy: 'both', colorShade: false, nodeSize: 1, nodeOpacity: 1, linkOpacity: 0.5, linkGlow: 1, bloomRadius: 0.45, bloomThreshold: 0.24, quality: 8, gradient: true, arrows: true, particles: true,
    labelCount: 100, labelSize: 10, labelKinds: { ext: true, vendor: true, macro: true },
    smooth: 0.5, sens: 1, charge: 1, linkDist: 1, gravity: 1, decay: 0.2, stopAt: 1, dagDist: 1,
    // Стиль сцены (значения пресета «Простой»; см. STYLE_PRESETS)
    style: 'neon', styleEdited: false, palette: 'neon', shape: 'crystal', material: 'glow', sky: 'stars', skySeed: 20261015, skyAmt: 1,
    orbits: false, electrons: false, pulses: true, bloom: true, glow: 1, selfGlow: 1, rim: 2, wobble: 1, autoRotate: true, rotateSpeed: 1, rotateDelay: 5, fog: false, additive: false,
    // Импульсы: скорость (единиц в секунду) и частота (импульсов в секунду на связь)
    pulseSpeed: 60, pulseRate: 1,
    // Производительность
    fps: IS_TOUCH ? 30 : 60, res: 'mid', nearFade: true, msaa: IS_TOUCH ? 0 : 4, idleStop: 60, showFps: true,
    freeRotate: true, proj: 'persp', labelNear: false,
    png: { scale: 2, labels: true, legend: true, title: true },
    vidFmt: 'mp4', vidSize: 720, vidFps: 30, vidDur: 8, vidSpeed: 45, vidLoop: true, vidLabels: true, vidLegend: true, vidTitle: true,
};
const vis = Object.assign(JSON.parse(JSON.stringify(VIS_DEF)), store.get('vis', {}));
vis.labelKinds = Object.assign({}, VIS_DEF.labelKinds, vis.labelKinds || {});
vis.png = Object.assign({}, VIS_DEF.png, vis.png || {});
// Старый стиль «Классика» → пресет «Простой»
if (vis.style === 'classic') Object.assign(vis, { style: 'simple', palette: 'theme', shape: 'sphere', material: 'flat', sky: 'none', orbits: false, electrons: false, pulses: false, bloom: false, wobble: 0, autoRotate: false, fog: false, additive: false });
// Новые значения по умолчанию (свободное вращение, подписи внешних узлов и макросов) - один раз и для уже сохранённых настроек
// Меньше трения, сон через 60 с, подписи самых связанных узлов, скорость вращения до ×5
if (!store.get('defaults5', false)) {
    if (vis.decay === 0.3) vis.decay = 0.2;
    if (vis.idleStop === 45) vis.idleStop = 60;
    vis.labelNear = false;
    vis.rotateSpeed = Math.min(5, vis.rotateSpeed);
    store.set('defaults5', true); store.set('vis', vis);
}
if (!store.get('defaults4', false)) {
    if (vis.pulseSpeed === 48) vis.pulseSpeed = 60;
    store.set('defaults4', true); store.set('vis', vis);
}
if (!store.get('defaults3', false)) {
    vis.freeRotate = true; Object.assign(vis.labelKinds, { ext: true, vendor: true, macro: true });
    store.set('defaults3', true); store.set('vis', vis);
}
const saveVis = () => { store.set('vis', vis); if (typeof syncUrl === 'function') syncUrl(); };
let curView = 'calls';
let focus = null; // {id, depth}

const KIND_COLORS = { c: '--s1', h: '--s2', fn: '--s3', macro: '--s4', type: '--s5', dir: '--s6', var: '--s7', ext: '--ext', vendor: '--ext', nodef: '--s8' };
const KIND_LABEL = () => ({ c: model && model.langs && [...model.langs].some(l => l !== 'c') ? t('srcFile') : '.c ' + t('file'), h: model && model.langs && [...model.langs].some(l => l !== 'c') ? t('header') : '.h ' + t('header'), fn: t('func'), macro: t('macro'), type: t('type'), dir: t('dir'), var: t('variable'), ext: t('external'), nodef: t('noDef') });


function fileKind(f) { return f.isH ? 'h' : 'c'; }


function fileNode(f) {
    return { id: f.id, label: basename(f.path), sub: f.path, kind: fileKind(f), mod: model.moduleOf(f.path), val: 1 + Math.sqrt(f.stats.code) / 3, lines: f.stats.code, doc: f.fileDoc, ref: f };
}


function fnNode(fn) {
    const len = fn.endLine - fn.startLine + 1;
    return { id: fn.id, label: fn.qual || fn.name, sub: fn.file.path + ':' + fn.line, kind: 'fn', mod: model.moduleOf(fn.file.path), val: 1 + Math.sqrt(len) / 2, lines: len, doc: fn.doc, ref: fn };
}


function macroNode(m) { return { id: m.id, label: m.name, sub: m.file.path + ':' + m.line, kind: 'macro', mod: model.moduleOf(m.file.path), val: 1.2, lines: m.endLine - m.line + 1, doc: m.doc, ref: m }; }


function extNode(id, name, kind) { return { id, label: name, sub: kind === 'vendor' ? t('vendor') : t('external'), kind: kind === 'vendor' ? 'vendor' : 'ext', mod: '…', val: 0.8, ref: null }; }

// Живой фильтр: «src/core !tests» - показывать только совпадения, «!» исключает; скрытые модули - по чипам
// Фильтр относится к проекту: другой проект открывается без него
const liveFilter = { text: store.get('lfText', ''), hidden: new Set(store.get('lfHidden', [])), dirs: new Set(store.get('lfDirs', [])), _res: null, _text: null, fromUrl: false };
function liveTerms() {
    if (liveFilter._text !== liveFilter.text) {
        const terms = liveFilter.text.split(/[\s,;]+/).filter(Boolean);
        liveFilter._res = { inc: terms.filter(x => !x.startsWith('!')).flatMap(x => compileGlobs(x)), exc: terms.filter(x => x.startsWith('!')).flatMap(x => compileGlobs(x.slice(1))) };
        liveFilter._text = liveFilter.text;
    }
    return liveFilter._res;
}
const liveFilterActive = () => !!liveFilter.text.trim() || liveFilter.hidden.size > 0 || liveFilter.dirs.size > 0;
function liveKeep(path, mod) {
    if (mod && liveFilter.hidden.has(mod)) return false;
    if (liveFilter.dirs.size) for (const d of liveFilter.dirs) if (path === d || path.startsWith(d + '/')) return false; // скрытые папки (дерево)
    const r = liveTerms(); if (!r) return true;
    if (r.exc.some(re => re.test(path))) return false;
    return !r.inc.length || r.inc.some(re => re.test(path));
}


function nodePath(n) {
    const r = n.ref; if (!r) return null;
    if (n.kind === 'dir') return r.path;
    if (n.kind === 'c' || n.kind === 'h') return r.path;
    if (r.file && r.file.path) return r.file.path;
    if (r.defs && r.defs[0] && r.defs[0].file) return r.defs[0].file.path;
    if (r.decls && r.decls[0] && r.decls[0].file) return r.decls[0].file.path;
    return null;
}
let liveTimer = 0;
function setLiveFilter(text, hidden, dirs) {
    if (text != null) { liveFilter.text = text; store.set('lfText', text); }
    if (hidden) { liveFilter.hidden = hidden; store.set('lfHidden', [...hidden]); }
    if (dirs) { liveFilter.dirs = dirs; store.set('lfDirs', [...dirs]); }
    clearTimeout(liveTimer); liveTimer = setTimeout(() => { if (model && curView !== 'stats') applyView(true); else if (model) renderStats(); syncUrl(); }, 280);
}


function buildView(view) {
    const o = viewOpts[view];
    const nodes = new Map(), links = [];
    const add = n => { if (!nodes.has(n.id)) nodes.set(n.id, n); return nodes.get(n.id); };
    if (view === 'includes') {
        for (const f of model.files.values()) add(fileNode(f));
        for (const f of model.files.values()) {
            for (const e of f.incOut) links.push({ source: f.id, target: e.file.id, kind: 'inc' });
            if (o.showExt || o.showVendor) {
                for (const inc of f.includes) {
                    const r = inc.res; if (!r || r.kind === 'project') continue;
                    if ((r.kind === 'vendor' && o.showVendor) || (r.kind === 'external' && o.showExt)) {
                        const id = 'x:' + r.path; const x = model.ext.get(id);
                        const n = add(extNode(id, r.path, r.kind)); n.ref = x; n.val = 0.8 + Math.sqrt(x.users.length) / 3;
                        links.push({ source: f.id, target: id, kind: 'ext' });
                    }
                }
            }
        }
    } else if (view === 'calls') {
        if (o.gran === 'file') {
            const agg = new Map();
            for (const fn of model.fns.values()) {
                add(fileNode(fn.file));
                for (const e of expandOut(fn, o)) {
                    if (e.kind === 'ext') continue;
                    const tf = e.target.file; if (tf === fn.file) continue;
                    add(fileNode(tf));
                    const k = fn.file.id + '|' + tf.id; agg.set(k, (agg.get(k) || 0) + e.count);
                }
            }
            for (const [k, c] of agg) { const [s, tg] = k.split('|'); links.push({ source: s, target: tg, kind: 'call', count: c }); }
        } else {
            for (const fn of model.fns.values()) add(fnNode(fn));
            if (o.showMacros) for (const m of model.macros.values()) if (m.inn.length || m.out.some(e => e.kind !== 'ext')) add(macroNode(m));
            const srcs = [...model.fns.values()].concat(o.showMacros ? [...model.macros.values()].filter(m => nodes.has(m.id)) : []);
            for (const s of srcs) {
                for (const e of (s.kind === 'fn' ? expandOut(s, o) : s.out)) {
                    if (e.kind === 'ref' && !o.showRefs) continue;
                    if (e.kind === 'indirect' && !o.showIndirect) continue;
                    if (e.kind === 'ext') {
                        if (!o.showExt) continue;
                        const id = 'x:' + e.name; const n = add(extNode(id, e.name, 'ext')); n.users = (n.users || 0) + 1; n.val = 0.8 + Math.sqrt(n.users) / 3;
                        links.push({ source: s.id, target: id, kind: 'ext', count: e.count });
                        continue;
                    }
                    if (e.kind === 'macro' && !o.showMacros) continue;
                    if (!nodes.has(e.target.id)) continue;
                    links.push({ source: s.id, target: e.target.id, kind: e.kind === 'indirect' ? 'indirect' : e.via ? 'call' : e.kind, count: e.count, via: e.via, field: e.field });
                }
            }
        }
    } else if (view === 'api') {
        const symOf = new Map();
        const addSym = (h, n, kind) => {
            const sn = add(n); links.push({ source: h.id, target: sn.id, kind: kind || 'decl' }); return sn;
        };
        for (const f of model.files.values()) {
            if (!f.api && !o.includeC) continue; // «API» - заголовки (C/C++) или любой файл в языках без заголовков
            const hn = add(fileNode(f)); let any = false;
            if (o.fn) {
                const seen = new Set();
                for (const d of f.decls) {
                    if (seen.has(d.name) || (d.isStatic && !f.isH)) continue; seen.add(d.name);
                    const fn = model.resolveFn(d.name, f);
                    if (fn) { addSym(f, fnNode(fn)); if (fn.file !== f) { add(fileNode(fn.file)); links.push({ source: fn.id, target: fn.file.id, kind: 'impl' }); } }
                    else addSym(f, { id: 'fd:' + d.name, label: d.name, sub: f.path + ':' + d.line, kind: 'nodef', mod: model.moduleOf(f.path), val: 1, lines: 1, doc: d.doc, ref: { kind: 'nodef', name: d.name, decl: d, file: f } });
                    any = true;
                }
                for (const fid of f.fnIds) {
                    const fn = model.fns.get(fid); if (seen.has(fn.name)) continue;
                    if (!f.isH && (fn.isStatic || fn.name === 'main')) continue;
                    seen.add(fn.name); addSym(f, fnNode(fn), 'def'); any = true;
                }
            }
            if (o.macro) for (const m of f.macros) {
                if (!m.body && /(_H|_H_|_INCLUDED|_HPP|_H__)$/.test(m.name)) continue; // include guard
                const mo = model.macroByName.get(m.name).find(x => x.file === f && x.line === m.line); if (!mo) continue;
                addSym(f, macroNode(mo), 'def'); any = true;
            }
            if (o.type) for (const ty of f.types) {
                const T = model.types.get('t:' + ty.name); if (!T) continue;
                addSym(f, { id: T.id, label: T.name, sub: T.tkind, kind: 'type', mod: model.moduleOf(f.path), val: 1.2, lines: T.defs[0] ? (T.defs[0].endLine || T.defs[0].line) - (T.defs[0].startLine || T.defs[0].line) + 1 : 1, doc: T.doc, ref: T }, ty.def ? 'def' : 'decl'); any = true;
            }
            if (o.var) for (const v of f.vars) {
                if (!f.isH && (v.isStatic || !v.def)) continue;
                const id = 'v:' + v.name + (v.isStatic ? '@' + f.path : ''); const V = model.vars.get(id); if (!V) continue;
                addSym(f, { id, label: v.name, sub: f.path + ':' + v.line, kind: 'var', mod: model.moduleOf(f.path), val: 1, lines: 1, doc: V.doc, ref: V }, v.def ? 'def' : 'decl'); any = true;
                if (!v.def) for (const d of V.defs) if (d.file !== f) { add(fileNode(d.file)); links.push({ source: id, target: d.file.id, kind: 'impl' }); }
            }
            if (!any && !f.api) nodes.delete(f.id);
        }
        // Убираем дубли связей
        const seen = new Set();
        for (let i = links.length - 1; i >= 0; i--) { const k = links[i].source + '|' + links[i].target; if (seen.has(k)) links.splice(i, 1); else seen.add(k); }
    } else if (view === 'dirs') {
        for (const d of model.dirs.values()) {
            if (d.nFiles === 0) continue;
            add({ id: d.id, label: d.path === '' ? model.name : basename(d.path), sub: d.path || '/', kind: 'dir', mod: d.path ? model.moduleOf(d.path + '/x') : '…', val: 2 + Math.sqrt(d.stats.code) / 4, lines: d.stats.code, ref: d });
            if (d.path !== '') links.push({ source: 'd:' + dirname(d.path), target: d.id, kind: 'tree' });
            for (const f of d.files) { add(fileNode(f)); links.push({ source: d.id, target: f.id, kind: 'tree' }); }
        }
    }
    // Живой фильтр файлов: узлы из отфильтрованных файлов/модулей убираются, внешние - если не осталось связей
    if (liveFilterActive()) {
        const keptDirs = new Set(['']);
        for (const [id, n] of nodes) {
            const path = nodePath(n);
            if (path == null || n.kind === 'dir') continue;
            if (!liveKeep(path, n.mod)) nodes.delete(id);
            else if (n.kind === 'c' || n.kind === 'h') { let d = dirname(path); while (d && !keptDirs.has(d)) { keptDirs.add(d); d = dirname(d); } }
        }
        for (const [id, n] of nodes) if (n.kind === 'dir' && !keptDirs.has(n.ref.path)) nodes.delete(id);
        const linked = new Set(); for (const l of links) if (nodes.has(l.source) && nodes.has(l.target)) { linked.add(l.source); linked.add(l.target); }
        for (const [id, n] of nodes) if (isExtNode(n) && !linked.has(id)) nodes.delete(id);
    }
    let nodeArr = [...nodes.values()];
    let linkArr = links.filter(l => nodes.has(l.source) && nodes.has(l.target) && l.source !== l.target);
    // Только окрестность выбранного узла
    if (focus && nodes.has(focus.id)) {
        const keep = new Set([focus.id]); let frontier = new Set([focus.id]);
        for (let d = 0; d < focus.depth; d++) {
            const nx = new Set();
            for (const l of linkArr) {
                if (frontier.has(l.source) && !keep.has(l.target)) { keep.add(l.target); nx.add(l.target); }
                if (frontier.has(l.target) && !keep.has(l.source)) { keep.add(l.source); nx.add(l.source); }
            }
            frontier = nx;
        }
        nodeArr = nodeArr.filter(n => keep.has(n.id)); linkArr = linkArr.filter(l => keep.has(l.source) && keep.has(l.target));
    } else if (o.hideIsolated) {
        const used = new Set(); for (const l of linkArr) { used.add(l.source); used.add(l.target); }
        nodeArr = nodeArr.filter(n => used.has(n.id));
    }
    // Свежие объекты, чтобы движок не тянул старые координаты между видами
    return { nodes: nodeArr.map(n => ({ ...n })), links: linkArr.map(l => ({ ...l })) };
}


// Исходящие вызовы функции; без «макросов как узлов» вызовы через макрос разворачиваются в реальные функции
function expandOut(fn, o) {
    if (o.showMacros) return fn.out;
    const res = [], seen = new Map();
    const push = (e, via) => {
        const key = e.kind === 'ext' ? 'x:' + e.name : e.target.id + '|' + (e.kind === 'ref' ? 'r' : 'c');
        const ex = seen.get(key); if (ex) { ex.count += e.count; return; }
        const n = { ...e, via }; seen.set(key, n); res.push(n);
    };
    const walk = (m, depth, visited, count) => {
        if (depth > 5 || visited.has(m.id)) return; visited.add(m.id);
        for (const e of m.out) {
            if (e.kind === 'macro') walk(e.target, depth + 1, visited, count);
            else if (e.kind !== 'ext') push({ ...e, count }, m.name);
            else push({ ...e, count }, m.name);
        }
    };
    for (const e of fn.out) {
        if (e.kind === 'macro') walk(e.target, 0, new Set(), e.count);
        else push(e, null);
    }
    return res;
}

/* ======================================================================
   3D-граф
   ====================================================================== */
let G = null, gdata = { nodes: [], links: [] }, adj = { out: new Map(), inn: new Map() };
let selId = null, hlNodes = new Set(), hlLinks = new Set();
// Выделенные связи рисует библиотека по позициям раскладки, а узлы во время сборки графа ещё растут: до конца
// сборки эти связи (и их импульсы) не показываются
let hlHeld = false; // был ли рост на прошлом кадре: по окончании роста связи показываются заново
let paused = false, fitPending = false;
const colorCache = {};

/* ----- Палитры и пресеты стилей -----
   Пресет задаёт набор параметров сцены; любой из них потом можно поменять вручную. */
const PALETTES = {
    vivid: { '--s1': '#5aa9ff', '--s2': '#ff8a5c', '--s3': '#38e0a8', '--s4': '#ffd166', '--s5': '#ff6fae', '--s6': '#8be36a', '--s7': '#b39dff', '--s8': '#ff5c5c', '--ext': '#6b7280', '--graph-bg': '#0a0e19', '--hl': '#ffe066', '--muted': '#7f8bb0', neb: ['#3949ab', '#00838f', '#6a1b9a'] },
    cosmos: { '--s1': '#4da3ff', '--s2': '#ff7a45', '--s3': '#2ef2b0', '--s4': '#ffc93c', '--s5': '#ff5fa2', '--s6': '#7cff4f', '--s7': '#a78bfa', '--s8': '#ff4d4d', '--ext': '#5b6378', '--graph-bg': '#03040a', '--hl': '#ffe066', '--muted': '#6f7da8', neb: ['#5b3fd1', '#1b6fd8', '#c2306f'] },
    neon: { '--s1': '#3987e5', '--s2': '#ff2bd6', '--s3': '#39ff14', '--s4': '#ffe600', '--s5': '#ff6b00', '--s6': '#7d5cff', '--s7': '#00ffa3', '--s8': '#ff3355', '--ext': '#4b4b6a', '--graph-bg': '#050008', '--hl': '#ffffff', '--muted': '#8a5cff', neb: ['#7a00ff', '#ff00aa', '#00b3ff'] },
    blueprint: { '--s1': '#e8f4ff', '--s2': '#9fd3ff', '--s3': '#ffd28a', '--s4': '#bdf5d9', '--s5': '#ffb3d1', '--s6': '#c9c2ff', '--s7': '#7fe0ff', '--s8': '#ff8f8f', '--ext': '#6c8bb0', '--graph-bg': '#0f2d4d', '--hl': '#ffd28a', '--muted': '#8fb6dd', neb: ['#1f5f99', '#2a7ab8', '#174a7a'] },
};
// Примеры для быстрого старта: разные языки и размеры (свой движок автора - первым)
const EXAMPLES = [['LukovDev/CGDF', 'C'], ['Anuken/Mindustry', 'Java'], ['DaveGamble/cJSON', 'C'], ['antirez/kilo', 'C'], ['lua/lua', 'C'], ['raysan5/raylib', 'C'], ['redis/redis', 'C'], ['curl/curl', 'C'],
    ['ocornut/imgui', 'C++'], ['google/leveldb', 'C++'], ['google/gson', 'Java'], ['JamesNK/Newtonsoft.Json', 'C#'], ['expressjs/express', 'JS'], ['sindresorhus/ky', 'TS'], ['pallets/flask', 'Python'], ['psf/requests', 'Python']];
const exampleChips = () => EXAMPLES.map(([r, l]) => `<button class="chip" data-repo="${r}">${r} <span class="muted">${l}</span></button>`).join('');
const STYLE_KEYS = ['palette', 'shape', 'material', 'sky', 'orbits', 'electrons', 'pulses', 'bloom', 'glow', 'selfGlow', 'rim', 'wobble', 'autoRotate', 'fog', 'additive', 'gradient', 'linkOpacity', 'nodeOpacity', 'skyAmt', 'linkGlow', 'bloomRadius', 'bloomThreshold'];
const STYLE_PRESETS = {
    simple: { palette: 'theme', shape: 'sphere', material: 'flat', sky: 'none', orbits: false, electrons: false, pulses: false, bloom: false, glow: 0.6, selfGlow: 0, rim: 0, wobble: 1, autoRotate: false, fog: false, additive: false, gradient: true, linkOpacity: 0.55, nodeOpacity: 0.95, skyAmt: 1, linkGlow: 1, bloomRadius: 0.45, bloomThreshold: 0.24 },
    cosmos: { palette: 'cosmos', shape: 'crystal', material: 'glow', sky: 'nebula', orbits: true, electrons: true, pulses: true, bloom: true, glow: 0.8, selfGlow: 0.8, rim: 1, wobble: 1, autoRotate: true, fog: false, additive: true, gradient: true, linkOpacity: 0.4, nodeOpacity: 1, skyAmt: 1, linkGlow: 1, bloomRadius: 0.5, bloomThreshold: 0.35 },
    neon: { palette: 'neon', shape: 'crystal', material: 'glow', sky: 'stars', orbits: false, electrons: false, pulses: true, bloom: true, glow: 1, selfGlow: 1, rim: 2, wobble: 1, autoRotate: true, fog: false, additive: false, gradient: true, linkOpacity: 0.5, nodeOpacity: 1, skyAmt: 1, linkGlow: 1, bloomRadius: 0.45, bloomThreshold: 0.24 },
};
// Пресеты «Атомы», «Нейро» и «Чертёж» убраны: сохранённый такой стиль становится «Неоном»
if (!STYLE_PRESETS[vis.style]) { Object.assign(vis, STYLE_PRESETS.neon); vis.style = 'neon'; vis.styleEdited = false; store.set('vis', vis); }
const darkScene = () => vis.palette !== 'theme';
function readColors() {
    for (const k of ['--s1', '--s2', '--s3', '--s4', '--s5', '--s6', '--s7', '--s8', '--ext', '--hl', '--graph-bg', '--muted', '--ink', '--line-2']) colorCache[k] = cssVar(k);
    colorCache.dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (document.documentElement.getAttribute('data-theme') !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
    // Палитра сцены (кроме «как у темы») - граф всегда на своём тёмном фоне
    const pal = PALETTES[vis.palette];
    if (pal) { Object.assign(colorCache, pal); colorCache.dark = true; }
    // Внешние и «прочие» узлы (каркасы) на тёмном фоне - светло-серые: заметные, но не спорят с яркими узлами кода
    if (colorCache.dark) colorCache['--ext'] = '#' + new THREE.Color(colorCache['--ext']).lerp(new THREE.Color('#9aa1ad'), 0.8).getHexString();
}
const MOD_SLOTS = ['--s1', '--s2', '--s3', '--s4', '--s5', '--s6', '--s7'];
// Последовательная шкала (один оттенок): в тёмной теме малые значения тёмные, в светлой - светлые
const SEQ_RAMP = ['#cde2fb', '#b7d3f6', '#9ec5f4', '#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'];


// Метрика узла для размера/цвета
function nodeMetric(n, by) {
    if (by === 'degree') return (adj.out.get(n.id) || []).length + (adj.inn.get(n.id) || []).length;
    return n.lines || 0;
}
let metricMax = 1;
// Максимум метрики (размер и цвет «по метрике») - циклом: Math.max(...массив) на огромных проектах переполнял стек
function calcMetricMax() {
    const by = vis.sizeBy === 'degree' ? 'degree' : 'lines'; let m = 1; for (const n of gdata.nodes) { const v = nodeMetric(n, by); if (v > m) m = v; }
    shadeRanks();
    return m;
}


// Ранг узла для «яркости по метрике» (0 - самый мелкий, 1 - самый крупный) - по той же величине, что и размер.
// Ранг, а не доля от максимума: один гигантский узел не сжимает шкалу всех остальных
function shadeRanks() {
    const ns = gdata.nodes, N = ns.length; if (!N) return;
    const val = n => (vis.sizeBy === 'uniform' ? n.val : nodeVal(n));
    const sorted = Float64Array.from(ns, val).sort();
    for (const n of ns) {
        const v = val(n); let lo = 0, hi = N; while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < v) lo = mid + 1; else hi = mid; }
        let up = lo; while (up < N && sorted[up] === v) up++;
        n.__sk = N > 1 ? (lo + up - 1) / 2 / (N - 1) : 1; // одинаковые значения - средний ранг
    }
}
const isExtNode = n => n.kind === 'ext' || n.kind === 'vendor';
function baseColor(n) {
    const o = viewOpts[curView] || {};
    if (isExtNode(n)) return colorCache['--ext'];
    if (n.kind === 'nodef') return colorCache['--s8'];
    if (o.color === 'module') { const i = model.modules.indexOf(n.mod); return i >= 0 && i < 7 ? colorCache[MOD_SLOTS[i]] : colorCache['--ext']; }
    if (o.color === 'metric') {
        const t01 = Math.log1p(nodeMetric(n, vis.sizeBy === 'degree' ? 'degree' : 'lines')) / Math.log1p(metricMax);
        const r = colorCache.dark ? SEQ_RAMP.slice(0, 11).reverse() : SEQ_RAMP.slice(3);
        return r[Math.min(r.length - 1, Math.round(t01 * (r.length - 1)))];
    }
    return colorCache[KIND_COLORS[n.kind] || '--ext'];
}


function nodeVal(n) {
    const k = vis.sizeBy;
    if (k === 'uniform') return isExtNode(n) ? 0.8 : 1.5;
    if (k === 'degree') return 0.8 + Math.sqrt(nodeMetric(n, 'degree'));
    if (k === 'both') return n.val + 0.8 + Math.sqrt(nodeMetric(n, 'degree')); // сумма размеров «по строкам» и «по связям»
    return n.val;
}
// Яркость по метрике (галочка, выключена по умолчанию): цвет модуля / типа ведёт себя как раскраска «по метрике» -
// у мелких и малосвязанных узлов тёмный оттенок своего цвета, у крупных и важных - яркий, с лёгким светом.
// На светлой теме мелкие узлы бледнее (к фону), а не темнее. Внешние узлы и раскраска «по метрике» - без изменений
const _shBg = new THREE.Color(), _shW = new THREE.Color(1, 1, 1);
const shadeK = n => (!vis.colorShade || isExtNode(n) || (viewOpts[curView] || {}).color === 'metric' ? -1 : n.__sk != null ? n.__sk : 0.5);
// Множитель яркости узла на тёмной сцене. Узлам он применяется в шейдере уже после освещения: нормировка пересвета
// возвращала притемнённому цвету полную яркость, и все узлы выглядели одинаково яркими
function shadeMul(n) { const k = shadeK(n); return k < 0 || !colorCache.dark ? 1 : 0.2 + 0.8 * k; }


function shadeColor(n, c, noMul) {
    const k = shadeK(n); if (k < 0) return c;
    if (colorCache.dark) { if (!noMul) c.multiplyScalar(0.2 + 0.8 * k); c.lerp(_shW, 0.15 * k * k * k); }
    else c.lerp(_shBg.set(colorCache['--graph-bg']), 0.65 * (1 - k));
    return c;
}
const LINK_KIND_COLOR = { ref: '--s7', macro: '--s4', impl: '--s1', ext: '--ext', indirect: '--s5' };
function linkBase(l) { return colorCache[LINK_KIND_COLOR[l.kind]] || colorCache['--muted']; }


// Цвет выделенных связей (их рисует сама библиотека - со стрелками и частицами)
function hlLinkColor(l) { return (l.source.id || l.source) === selId ? colorCache['--hl'] : colorCache['--s1']; }

/* ----- Рендер только по необходимости -----
   Собственный цикл библиотеки остановлен: ровно один кадр (шаг раскладки + рендер) рисуется,
   когда что-то меняется: камера, раскладка, анимация, выделение. */
let needRender = true, engineActive = false, lastRender = 0;
const requestRender = () => { needRender = true; };
// Анимация с плавной остановкой: ts - масштаб времени (1 - идёт, 0 - уснула), animT - «время анимации»
const anim = { ts: 1, t: 0 };
const wantsAnimation = () => vis.wobble > 0 || vis.orbits || vis.pulses || vis.autoRotate || (!!selId && vis.particles);
let growUntil = 0, growOrder = null;
const GROW_DUR = 0.7;
// Сборка графа: узел вырастает почти на своём месте (выезжает из родителя лишь на долю GROW_TRAVEL пути), а связь
// проявляется, когда оба её конца выросли больше чем на LINK_GROW_FROM: связи не тянутся к ещё пустым местам
const GROW_TRAVEL = 0.3, LINK_GROW_FROM = 0.4;
function linkGrow(a, b, t) {
    const g = Math.min(growOf(a, t), growOf(b, t)); if (g <= LINK_GROW_FROM) return 0;
    const k = (g - LINK_GROW_FROM) / (1 - LINK_GROW_FROM); return k * k * (3 - 2 * k);
}
const isGrowing = () => performance.now() / 1000 < growUntil;
// Коэффициент роста узла (0 → 1): у каждого узла своё время рождения n.__born (секунды)
function growOf(n, t) {
    if (t >= growUntil || n.__born == null) return 1;
    const k = Math.min(1, Math.max(0, (t - n.__born) / GROW_DUR));
    return 1 - Math.pow(1 - k, 3);
}


// Порядок появления при построении вида: волнами от «главного» узла каждой компоненты по связям.
// Узел «вырастает» из своего родителя в обходе и выезжает на своё место - граф разворачивается, как кристалл
function planGrowth(nodes, t0) {
    const byId = new Map(nodes.map((n, i) => [n.id, i])), N = nodes.length;
    const deg = i => (adj.out.get(nodes[i].id) || []).length + (adj.inn.get(nodes[i].id) || []).length;
    const depth = new Int32Array(N).fill(-1), order = [];
    // Рост начинается с «главного» узла: в «Директориях» - с корня дерева папок, в API - с заголовка, где больше всего
    // объявлений, в подключениях и вызовах - с узла, к которому ведёт больше всего связей (общий заголовок, базовая
    // функция). Остальные компоненты - так же, по убыванию
    const inDeg = i => (adj.inn.get(nodes[i].id) || []).length, outDeg = i => (adj.out.get(nodes[i].id) || []).length;
    const key = curView === 'dirs' ? (i => (inDeg(i) ? 0 : 1e9) + deg(i)) : curView === 'api' ? (i => outDeg(i) * 1e4 + deg(i)) : (i => inDeg(i) * 1e4 + deg(i));
    const kv = Float64Array.from({ length: N }, (_, i) => key(i));
    const roots = [...Array(N).keys()].sort((a, b) => kv[b] - kv[a]);
    for (const r of roots) {
        if (depth[r] >= 0) continue;
        depth[r] = 0; nodes[r].__par = -1; order.push(r);
        for (let q = order.length - 1; q < order.length; q++) {
            const i = order[q], n = nodes[i];
            for (const l of [...(adj.out.get(n.id) || []), ...(adj.inn.get(n.id) || [])]) {
                const ls = l.source.id || l.source, lt = l.target.id || l.target, mid = ls === n.id ? lt : ls, j = byId.get(mid);
                if (j == null || depth[j] >= 0) continue;
                depth[j] = depth[i] + 1; nodes[j].__par = i; order.push(j);
            }
        }
    }
    // Время рождения - по месту в обходе (волна идёт плавно при любой «глубине» графа); родитель всегда раньше ребёнка
    const total = N < 50 ? 0.8 : N < 300 ? 1.4 : 1.9;
    order.forEach((i, q) => {
        const n = nodes[i], base = t0 + total * Math.pow(q / Math.max(1, N - 1), 0.85);
        n.__born = n.__par >= 0 ? Math.max(base, nodes[n.__par].__born + 0.05) : base;
    });
    let last = t0;
    for (const n of nodes) last = Math.max(last, n.__born);
    growUntil = last + GROW_DUR;
    return Int32Array.from(order);
}


// Начальные места узлов для раскладки - от «главного» узла в порядке роста: каждый рядом со своим родителем, на
// сфере тем большей, чем больше у родителя детей (иначе d3 ставит узлы без координат на регулярную решётку).
// Места уходят только в поток раскладки (n.__seed), а не в узлы: камера ждёт первых позиций раскладки
function seedPositions(nodes, order) {
    const kids = new Int32Array(nodes.length), R = 20 * Math.cbrt(Math.max(1, nodes.length)), rnd = () => Math.random() * 2 - 1;
    for (const n of nodes) if (n.__par >= 0) kids[n.__par]++;
    const at = n => (n.x != null ? [n.x, n.y, n.z || 0] : n.__seed || [0, 0, 0]);
    for (const i of order) {
        const n = nodes[i]; n.__seed = null; if (n.x != null) continue;
        let x, y, z, d; do { x = rnd(); y = rnd(); z = rnd(); d = x * x + y * y + z * z; } while (d > 1 || d < 1e-4);
        d = Math.sqrt(d);
        const p = n.__par >= 0 ? at(nodes[n.__par]) : [0, 0, 0];
        const r = n.__par >= 0 ? 20 * (1 + Math.sqrt(kids[n.__par]) / 3) * (0.7 + Math.random() * 0.6) : i === order[0] ? 0 : R; // корни других компонент - поодаль
        n.__seed = [p[0] + x / d * r, p[1] + y / d * r, p[2] + z / d * r];
    }
}

/* ----- Камера -----
   Ориентация - кватернион (свободное вращение без «верха/низа»), расстояние и цель - отдельно.
   Ввод меняет только цели, текущие значения догоняют их экспоненциально, как в CameraOrbitController3D CGDF:
   alpha = 1 - exp(-dt / (1 - friction)). Программный перелёт к узлу - отдельная плавная кривая (ease-in-out).
   Проекция плавно переходит от перспективы к изометрии («долли-зум»: угол обзора уменьшается,
   камера отъезжает так, что масштаб в центре не меняется). */
const DEG = Math.PI / 180, FOV_PERSP = 50, FOV_ISO = 1.2;
const orbit = {
    q: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, -0.6, 0, 'YXZ')), gq: new THREE.Quaternion(),
    dist: 900, gdist: 600, t: new THREE.Vector3(), gt: new THREE.Vector3(), sx: 0, sy: 0, p: 0, last: 0, fly: null, deff: 900,
};
orbit.gq.copy(orbit.q);
const projGoal = () => (vis.proj === 'iso' ? 1 : 0);
const camFov = p => Math.exp(Math.log(FOV_PERSP) + (Math.log(FOV_ISO) - Math.log(FOV_PERSP)) * p);
// Куда сдвинуть изображение, чтобы центр оказался в видимой части (слева от панели деталей / над ней на телефоне)
function viewShiftGoal() {
    if (!document.body.classList.contains('has-details') || !G) return [0, 0];
    const w = G.width(), h = G.height();
    if (innerWidth > 760) return [Math.min(380, w * 0.5) / 2, 0];
    return [0, h * (document.body.classList.contains('det-expanded') ? 0.44 : 0.23)];
}
// Плавный перелёт к цели (target/distance) за dur мс
const easeInOut = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function flyCamera(target, dist, dur = 1000) {
    const o = orbit;
    o.fly = { t0: performance.now(), dur, ft: o.t.clone(), fd: o.dist, tt: target.clone(), td: dist };
    o.gt.copy(target); o.gdist = dist;
    requestRender();
}
const cancelFly = () => { orbit.fly = null; };
const _fv = new THREE.Vector3();
// Изометрический ракурс: поворот 45° и наклон 35.26° (arctan(1/√2))
function isoOrientation() { return new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.atan(1 / Math.SQRT2), -Math.PI / 4, 0, 'YXZ')); }

// Динамическое разрешение: при просадке FPS pixel ratio понижается (до ×0.5), при запасе - возвращается
const dyn = { scale: 1, ema: 0, lastAdj: 0, good: 0, chain: false };
const fpsMeter = { n: 0, t: 0, val: 0, ms: 0 };
const pace = { last: 0, acc: 0 }; // такты монитора и накопленное время для ограничения кадров
function adaptResolution(interval, targetMs, now) {
    if (interval > 250) return; // пауза, фоновая вкладка, отладка - это не нехватка GPU
    dyn.ema = dyn.ema ? dyn.ema * 0.9 + interval * 0.1 : interval;
    if (vis.res !== 'auto' || now - dyn.lastAdj < 1000) return;
    dyn.lastAdj = now;
    if (dyn.ema > targetMs * 1.35 && dyn.scale > 0.5) { dyn.scale = Math.max(0.5, dyn.scale * 0.85); dyn.good = 0; applyRenderScale(); }
    else if (dyn.ema < targetMs * 1.12 && dyn.scale < 1) { if (++dyn.good >= 3) { dyn.scale = Math.min(1, dyn.scale * 1.1); dyn.good = 0; applyRenderScale(); } }
    else dyn.good = 0;
}
const _wy = new THREE.Vector3(0, 1, 0), _off = new THREE.Vector3(), _qa = new THREE.Quaternion();
function orbitFrame(now) {
    requestAnimationFrame(orbitFrame);
    renderStep(now);
}
// Один шаг: камера, анимация, отсечение, кадр библиотеки (если что-то изменилось)
const _eq = new THREE.Euler(), _eg = new THREE.Euler();
function renderStep(now) {
    if (!G || curView === 'stats' || document.hidden || G.width() < 2 || G.height() < 2 || videoRec) { orbit.last = now; dyn.chain = false; return; }
    const dt = Math.max(0, Math.min(0.1, (now - (orbit.last || now)) / 1000)); orbit.last = Math.max(orbit.last, now);
    const tick = Math.max(0, now - (pace.last || now)); pace.last = Math.max(pace.last, now);
    const o = orbit;
    const idle = (now - cz.lastInput) / 1000;
    // Энергосбережение: после долгого бездействия анимация плавно замедляется и засыпает (любое движение мыши будит)
    // Автовращение не засыпает: сцена должна крутиться и дальше, пока её не тронут
    const sleeping = vis.idleStop > 0 && idle > vis.idleStop && !isGrowing() && !vis.autoRotate;
    const tsGoal = sleeping || !wantsAnimation() ? 0 : 1;
    const animating = isGrowing() || anim.ts > 0.002 || tsGoal > 0;
    // Автовращение, когда пользователь ничего не трогает rotateDelay секунд
    const rotating = vis.autoRotate && idle > vis.rotateDelay && anim.ts > 0.002;
    // Свободная камера - вокруг её вертикали (граф крутится по горизонтали экрана, как бы камеру ни повернули);
    // классическая - вокруг вертикали мира (горизонт и так ровный)
    if (rotating) { _qa.setFromAxisAngle(_wy, dt * 0.045 * vis.rotateSpeed * anim.ts); if (vis.freeRotate) o.gq.multiply(_qa); else o.gq.premultiply(_qa); }
    // Камера не заходит внутрь узла, на который смотрит: изнутри сферы не видны ни узел, ни его свечение
    if (o.gdist < 400) { const md = minOrbitDist(); if (o.gdist < md) { o.gdist = md; if (o.fly) o.fly.td = Math.max(o.fly.td, md); } }
    const [gsx, gsy] = viewShiftGoal();
    const moving = !!o.fly || 1 - Math.abs(o.q.dot(o.gq)) > 1e-9 || Math.abs(Math.log(o.gdist / o.dist)) > 1e-4 ||
        o.t.distanceTo(o.gt) > o.dist * 1e-4 || Math.abs(gsx - o.sx) > 0.3 || Math.abs(gsy - o.sy) > 0.3 || Math.abs(projGoal() - o.p) > 1e-3;
    const fading = selFade.v !== selGoal();
    if (!(needRender || moving || engineActive || posDirty || animating || fading || pinterp.active || hlHeld)) { dyn.chain = false; pace.acc = 0; return; } // простой - ничего не рисуем
    // Пока сцену не трогают, фоновая анимация идёт на 30 к/с; автовращение - на полном FPS (движется вся сцена)
    let cap = vis.fps > 0 ? vis.fps : 0;
    if (idle > 3 && !engineActive && !needRender && !o.fly && !rotating) cap = cap ? Math.min(cap, 30) : 30;
    // Ограничение кадров «бюджетом»: время между тактами монитора копится, кадр рисуется, когда набрался интервал,
    // остаток переносится - предел точный при любой частоте монитора
    if (cap) {
        const iv = 1000 / cap;
        pace.acc += tick;
        if (pace.acc < iv - 1) return;
        pace.acc = Math.min(pace.acc - iv, iv);
    } else pace.acc = 0;
    const t0 = performance.now();
    if (dyn.chain) adaptResolution(now - lastRender, cap ? 1000 / cap : 1000 / 60, now);
    dyn.chain = true;
    // Счётчик: кадры в секунду и сколько миллисекунд кадр занимает у самого сайта (JS + отправка в GPU).
    // Если FPS низкий, а миллисекунд мало - время уходит не сюда (браузер, композитинг, вкладка в фоне)
    if (fpsMeter.val && fpsMeter.val < 40 && idle < 1 && fpsMeter.ms < 8 && (!cap || cap > 40)) { gpu.lowSince = gpu.lowSince || now; if (!gpu.warned && now - gpu.lowSince > 4000) { gpu.warned = true; toast(t('gpuSlow') + (gpu.kind === 'integrated' || gpu.kind === 'software' ? ' ' + t(gpu.kind === 'software' ? 'gpuSoftwareHint' : 'gpuIntegratedHint') : ''), 12000); } }
    else gpu.lowSince = 0;
    // FPS считается всегда (нужен для уведомления); на экран выводится, только если показ включён (#fpsVal есть в легенде)
    fpsMeter.n++;
    { if (now - fpsMeter.t > 500) { fpsMeter.val = Math.round(fpsMeter.n * 1000 / (now - fpsMeter.t)); fpsMeter.n = 0; fpsMeter.t = now; const el = $('#fpsVal'); if (el) el.textContent = `${fpsMeter.val} FPS · ${fpsMeter.ms.toFixed(1)} ${LANG === 'ru' ? 'мс' : 'ms'} · ×${(G.renderer().getPixelRatio()).toFixed(2)}`; } }
    const rdt = Math.max(0, Math.min(0.1, (now - (lastRender || now)) / 1000)); // таймер может «скакнуть» назад - шаг не бывает отрицательным
    lastRender = Math.max(lastRender, now); needRender = false;
    // Время анимации: плавно замедляется до остановки и так же плавно разгоняется
    anim.ts += (tsGoal - anim.ts) * Math.min(1, rdt * 2.2); if (anim.ts < 0.002 && tsGoal === 0) anim.ts = 0;
    { const g = selGoal(); if (selFade.v !== g) { selFade.v += (g - selFade.v) * Math.min(1, rdt * 9); if (Math.abs(g - selFade.v) < 0.004) selFade.v = g; selFade.dirty = true; posDirty = true; if (selId) setHlLibOpacity(selFade.v); } }
    anim.t += rdt * anim.ts;
    const fr = 1 - vis.smooth;
    const a = fr > 0.001 ? 1 - Math.exp(-rdt / (fr * 0.6)) : 1;
    if (vis.freeRotate) o.q.slerp(o.gq, a);
    else {
        // Классическое вращение: поворот и наклон сглаживаются по отдельности - slerp кватернионов наклонял бы горизонт на полпути
        levelQuat(o.gq);
        _eq.setFromQuaternion(o.q, 'YXZ'); _eg.setFromQuaternion(o.gq, 'YXZ');
        const dyaw = Math.atan2(Math.sin(_eg.y - _eq.y), Math.cos(_eg.y - _eq.y));
        _eq.set(_eq.x + (_eg.x - _eq.x) * a, _eq.y + dyaw * a, 0, 'YXZ');
        if (a >= 1 || (Math.abs(dyaw) < 1e-6 && Math.abs(_eg.x - _eq.x) < 1e-6)) o.q.copy(o.gq); else o.q.setFromEuler(_eq);
    }
    // Слежение: выделенный узел, к которому подлетели, двигается раскладкой - цель камеры едет вместе с ним
    if (o.follow && o.follow === selId && o.followNode && o.followNode.x != null) {
        const fn = o.followNode; _fv.set(fn.x, fn.y, fn.z || 0);
        if (o.fly) o.fly.tt.copy(_fv); else if (o.gt.distanceToSquared(_fv) > 1e-6) { o.gt.copy(_fv); }
    } else if (o.follow) o.follow = null;
    if (o.fly) {
        const k = Math.min(1, (now - o.fly.t0) / o.fly.dur), e = easeInOut(k);
        o.t.copy(o.fly.ft).lerp(o.fly.tt, e);
        o.dist = Math.exp(Math.log(o.fly.fd) + (Math.log(o.fly.td) - Math.log(o.fly.fd)) * e);
        if (k >= 1) { o.fly = null; scheduleLabels(); }
    } else {
        // Дистанцию сглаживаем в логарифме - зум ощущается равномерным на любом масштабе
        o.dist = Math.exp(Math.log(o.dist) + (Math.log(o.gdist) - Math.log(o.dist)) * a);
        o.t.lerp(o.gt, a);
    }
    o.p += (projGoal() - o.p) * Math.min(1, rdt * 3.2); if (Math.abs(projGoal() - o.p) < 1e-3) o.p = projGoal();
    const cam = G.camera();
    const fov = camFov(o.p);
    // «Долли-зум»: в изометрии камера далеко и с узким углом - масштаб в точке цели тот же
    o.deff = o.dist * Math.tan(FOV_PERSP * DEG / 2) / Math.tan(fov * DEG / 2);
    cam.fov = fov;
    cam.quaternion.copy(o.q);
    cam.position.copy(o.t).add(_off.set(0, 0, o.deff).applyQuaternion(o.q));
    cam.near = Math.max(0.5, o.deff - o.dist * 8); cam.far = o.deff + Math.max(50000, o.dist * 20);
    // Плавный сдвиг кадра под панель деталей (вместо резкого сжатия холста)
    o.sx += (gsx - o.sx) * Math.min(1, a * 1.4); o.sy += (gsy - o.sy) * Math.min(1, a * 1.4);
    if (Math.abs(o.sx) > 0.3 || Math.abs(o.sy) > 0.3) cam.setViewOffset(G.width(), G.height(), o.sx, o.sy, G.width(), G.height()); else if (cam.view && cam.view.enabled) cam.clearViewOffset();
    cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const ctr = G.controls(); if (ctr && ctr.target) ctr.target.copy(o.t);
    if (cz.stars) cz.stars.position.copy(cam.position);
    const fog = G.scene().fog; if (fog) fog.density = 0.42 / Math.max(50, o.deff);
    fadeUniform.value = vis.nearFade ? o.dist * 0.22 * (1 - o.p) : 0;
    if (moving) scheduleLabels(vis.labelNear && !selId ? 150 : 400);
    physInterpStep(now);
    frameSync(anim.t, rdt, cam);
    G.resumeAnimation(); G.pauseAnimation(); // ровно один кадр библиотеки
    const spent = performance.now() - t0; fpsMeter.ms = fpsMeter.ms ? fpsMeter.ms * 0.9 + spent * 0.1 : spent;
}
// Без крена и с наклоном в пределах ±89° (классическое вращение: «верх» всегда сверху)
const _el = new THREE.Euler();
function levelQuat(q) { _el.setFromQuaternion(q, 'YXZ'); if (Math.abs(_el.z) < 1e-9 && Math.abs(_el.x) <= 1.55) return q; _el.z = 0; _el.x = Math.max(-1.55, Math.min(1.55, _el.x)); return q.setFromEuler(_el); }


const MAX_LEAD = 2.6; // рад, ~150°


function orbitSnap() { const o = orbit; o.q.copy(o.gq); o.dist = o.gdist; o.t.copy(o.gt); o.fly = null; }


function bindOrbitInput(el) {
    const ptrs = new Map(); let mode = null, lastSpan = 0, lastC = null, down = null, hoverRaf = 0, lastHover = null;
    const span = () => { const p = [...ptrs.values()]; return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };
    const centroid = () => { const p = [...ptrs.values()]; return { x: p.reduce((s, q) => s + q.x, 0) / p.length, y: p.reduce((s, q) => s + q.y, 0) / p.length }; };
    const pan = (dx, dy) => {
        cancelFly(); orbit.follow = null; orbit.camInput = performance.now();
        const cam = G.camera(); const e = cam.matrixWorld.elements;
        const k = 2 * orbit.dist * Math.tan(FOV_PERSP * DEG / 2) / Math.max(1, el.clientHeight);
        orbit.gt.x += (-e[0] * dx + e[4] * dy) * k; orbit.gt.y += (-e[1] * dx + e[5] * dy) * k; orbit.gt.z += (-e[2] * dx + e[6] * dy) * k;
    };
    const rotate = (dx, dy) => {
        orbit.camInput = performance.now(); // камеру двигали - подгонка после раскладки не нужна
        const k = 0.0055 * vis.sens;
        if (vis.freeRotate) {
            // Свободное вращение: вокруг локальных осей камеры - нет «верха» и «низа», можно перевернуть граф как угодно
            orbit.gq.multiply(_qa.setFromAxisAngle(_wy, -dx * k)).multiply(_qa.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -dy * k)).normalize();
        } else {
            // Классическое: горизонт сохраняется, наклон ограничен ±89°
            const eu = new THREE.Euler().setFromQuaternion(levelQuat(orbit.gq), 'YXZ');
            eu.y -= dx * k; eu.x = Math.max(-1.55, Math.min(1.55, eu.x - dy * k)); eu.z = 0;
            orbit.gq.setFromEuler(eu);
        }
        // Быстрое вращение: цель уходила от камеры больше чем на 180°, и сглаживание (кратчайшим путём) крутило
        // камеру в обратную сторону. Отрыв цели ограничен - камера подтягивается вслед, ввод не теряется
        const ang = orbit.q.angleTo(orbit.gq);
        if (ang > MAX_LEAD) orbit.q.slerp(orbit.gq, 1 - MAX_LEAD / ang);
    };
    // Сброс ввода: палец, отпущенный над кнопкой или панелью, иначе «остаётся» на экране - следующее касание
    // считается вторым пальцем, и камера залипает в режиме щипка
    const resetInput = () => { ptrs.clear(); mode = null; down = null; };
    el.addEventListener('pointerdown', e => {
        cz.lastInput = performance.now();
        if (e.isPrimary) resetInput(); // первый палец нового жеста - старых касаний быть не может
        try { el.setPointerCapture(e.pointerId); } catch { /* */ } // отпускание придёт сюда, где бы ни был палец
        ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (ptrs.size === 1) { mode = (e.button === 2 || e.button === 1 || e.shiftKey || e.ctrlKey) ? 'pan' : 'rot'; down = { x: e.clientX, y: e.clientY, moved: false, type: e.pointerType }; }
        if (ptrs.size === 2) { mode = 'pinch'; lastSpan = span(); lastC = centroid(); if (down) down.moved = true; }
        hideTip();
    });
    el.addEventListener('pointermove', e => {
        const p = ptrs.get(e.pointerId);
        if (!p) { // наведение мышью без нажатия - подсказка
            if (e.pointerType === 'mouse' && !hoverRaf) {
                const x = e.clientX, y = e.clientY;
                hoverRaf = requestAnimationFrame(() => { hoverRaf = 0; const n = pickNode(x, y, 4); if (n !== lastHover) { lastHover = n; el.style.cursor = n ? 'pointer' : ''; } if (n) showTip(n, x, y); else hideTip(); });
            }
            return;
        }
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        cz.lastInput = performance.now();
        if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) down.moved = true;
        if (mode === 'pinch' && ptrs.size >= 2) {
            p.x = e.clientX; p.y = e.clientY;
            const s = span(), c = centroid();
            if (lastSpan > 0 && s > 0) { cancelFly(); orbit.gdist = clampDist(orbit.gdist * lastSpan / s); orbit.camInput = performance.now(); }
            pan(c.x - lastC.x, c.y - lastC.y);
            lastSpan = s; lastC = c; return;
        }
        p.x = e.clientX; p.y = e.clientY;
        if (mode === 'rot') rotate(dx, dy);
        else if (mode === 'pan') pan(dx, dy);
    });
    const up = e => {
        const had = ptrs.delete(e.pointerId);
        // Клик/тап без сдвига - выбор узла (или снятие выделения по фону)
        if (had && e.type === 'pointerup' && !ptrs.size && down && !down.moved) {
            // Открыты настройки - простой тап по графу только закрывает их (как у остальных меню), узел не выбирается
            if (isShown($('#opts'))) { setShown($('#opts'), false); down = null; mode = null; return; }
            const n = pickNode(e.clientX, e.clientY, down.type === 'touch' ? 16 : 6);
            // Клик по узлу - камера плавно подлетает к нему; клик по фону - выделение снимается, камера остаётся и чуть отъезжает
            if (n) selectNode(n.id, true);
            else if (selId) dropFocus();
        }
        if (ptrs.size === 1) mode = 'rot'; else if (!ptrs.size) { mode = null; down = null; }
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    // Захват потерян (системный жест, уведомление, сворачивание) - касание считается законченным
    el.addEventListener('lostpointercapture', e => {
        if (!ptrs.delete(e.pointerId)) return;
        if (ptrs.size === 1) mode = 'rot'; else if (!ptrs.size) { mode = null; down = null; }
    });
    window.addEventListener('blur', resetInput);
    document.addEventListener('visibilitychange', () => { if (document.hidden) resetInput(); });
    el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { up(e); hideTip(); } });
    el.addEventListener('wheel', e => {
        e.preventDefault(); cz.lastInput = orbit.camInput = performance.now();
        if (orbit.fly) { orbit.gdist = orbit.dist; cancelFly(); }
        const d = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
        orbit.gdist = clampDist(orbit.gdist * Math.exp(d * 0.0012 * vis.sens));
    }, { passive: false });
    el.addEventListener('contextmenu', e => e.preventDefault());
}
const clampDist = d => Math.max(5, Math.min(60000, d));
// Минимальное расстояние камеры: если цель внутри узла (или рядом с его поверхностью) - не ближе 2.4 радиуса от центра
// (узел тогда почти во весь кадр); выделенный узел учитывается всегда, даже если цель чуть сдвинута панорамой
const _md = new THREE.Vector3();
function minOrbitDist() {
    let md = 5;
    const t = orbit.gt;
    for (const n of gdata.nodes) {
        if (n.x == null || n.__hidden) continue;
        const r = nodeRadius(n);
        dispPos(n, _md);
        const d = _md.distanceTo(t);
        if (d < r * 1.3 || n.id === selId && d < r * 2) md = Math.max(md, r * 2.4 + d);
    }
    return md;
}


// Отображаемая (с «дрожанием») позиция узла
function dispPos(n, out) {
    const D = cz.disp, i = n.__i;
    if (i != null && i * 3 + 2 < D.length) return out.set(D[i * 3], D[i * 3 + 1], D[i * 3 + 2]);
    return out.set(n.x || 0, n.y || 0, n.z || 0);
}

// Выбор узла по экранным координатам: проекция центров + экранный радиус сферы (без рейкаста по сотням мешей)
const pickVec = new THREE.Vector3();
function pickNode(clientX, clientY, tol) {
    if (!G || !gdata.nodes.length) return null;
    const el = G.renderer().domElement, rect = el.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top, w = rect.width, h = rect.height;
    const cam = G.camera(); const cp = cam.position; const k = (h / 2) / Math.tan(cam.fov * DEG / 2);
    let best = null, bestScore = Infinity;
    for (const n of gdata.nodes) {
        if (n.x == null || n.__hidden) continue;
        dispPos(n, pickVec);
        const dist = pickVec.distanceTo(cp);
        pickVec.project(cam);
        if (pickVec.z < -1 || pickVec.z > 1) continue;
        const sx = (pickVec.x + 1) / 2 * w, sy = (1 - pickVec.y) / 2 * h;
        const rpx = nodeRadius(n) / Math.max(1e-3, dist) * k;
        const d = Math.hypot(sx - x, sy - y);
        if (d > rpx + tol) continue;
        // Внутри сферы - побеждает ближайший к камере; в зоне допуска - ближайший к курсору
        const score = d <= rpx ? dist : 1e9 + d;
        if (score < bestScore) { bestScore = score; best = n; }
    }
    return best;
}

let tipEl = null;
function showTip(n, x, y) {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'gtip'; document.body.appendChild(tipEl); }
    tipEl.className = 'gtip';
    tipEl.innerHTML = `<b>${esc(n.label)}</b><br><span class="muted">${esc(n.sub || '')}</span>` + (n.doc ? `<br>${esc(n.doc.split('\n')[0].slice(0, 140))}` : '');
    tipEl.hidden = false;
    const r = tipEl.getBoundingClientRect();
    tipEl.style.left = Math.min(x + 14, innerWidth - r.width - 8) + 'px';
    tipEl.style.top = Math.min(y + 14, innerHeight - r.height - 8) + 'px';
}


function hideTip() { if (tipEl) tipEl.hidden = true; }


// Подсказка графика статистики: многострочный текст рядом с курсором
function showStatTip(text, x, y) {
    if (!tipEl) { tipEl = document.createElement('div'); document.body.appendChild(tipEl); }
    tipEl.className = 'gtip stip'; tipEl.textContent = text; tipEl.hidden = false;
    const r = tipEl.getBoundingClientRect();
    tipEl.style.left = Math.max(8, Math.min(x + 14, innerWidth - r.width - 8)) + 'px';
    tipEl.style.top = (y + 16 + r.height > innerHeight - 8 ? y - r.height - 10 : y + 16) + 'px';
}

/* ----- Узлы: InstancedMesh (одна отрисовка на все узлы проекта + одна на внешние) ----- */
let nodesObj = null, extObj = null;
// Радиус считается редко (поиск степени в Map + кубический корень), а нужен в каждом кадре для каждого узла -
// кэш сбрасывается при перестройке узлов (вид, размер, «размер по»)
let radVer = 1;
const nodeRadius = n => n.__rv === radVer ? n.__r : (n.__rv = radVer, n.__r = Math.cbrt(Math.max(0.01, nodeVal(n))) * 3.2 * vis.nodeSize * (isExtNode(n) ? 0.8 : 1));
// Для библиотеки (стрелки выделенных связей упираются в поверхность узла) - тот же радиус, что у общего меша узлов
const nodeValLib = n => nodeVal(n) * (isExtNode(n) ? 0.512 : 1);
const fadeUniform = { value: 0 }, rimUniform = { value: 0 };
// Материал узлов: Ламберт + (по стилю) свечение цветом экземпляра, ободок (rim), растворение у камеры
function makeNodeMaterial() {
    const wire = vis.shape === 'wire';
    const mat = new THREE.MeshLambertMaterial({ flatShading: vis.shape === 'crystal', wireframe: wire, transparent: vis.nodeOpacity < 0.999, opacity: vis.nodeOpacity });
    const glow = vis.material === 'flat' ? (wire ? 0.6 : 0) : vis.selfGlow;
    if (glow > 0) { mat.emissive.set(0xffffff); mat.emissiveIntensity = glow; }
    rimUniform.value = vis.rim;
    mat.onBeforeCompile = sh => {
        sh.uniforms.uFadeNear = fadeUniform; sh.uniforms.uRim = rimUniform;
        // aDim - гашение экземпляра при выделении другого узла: ободок и свечение уходят почти в ноль
        // aShade - яркость по метрике (множитель после освещения и ободка)
        sh.vertexShader = 'attribute float aDim;\nattribute float aShade;\nvarying float vDim;\nvarying float vShade;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n    vDim = aDim; vShade = aShade;');
        sh.fragmentShader = 'uniform float uFadeNear;\nuniform float uRim;\nvarying float vDim;\nvarying float vShade;\n' + sh.fragmentShader
            .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
    // Узлы у самой камеры «растворяются» (дизеринг), чтобы не загораживать обзор
    if (uFadeNear > 0.0 && vViewPosition.z < uFadeNear) {
        const float B[16] = float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);
        ivec2 bp = ivec2(mod(gl_FragCoord.xy, 4.0));
        if (vViewPosition.z / uFadeNear < (B[bp.y * 4 + bp.x] + 0.5) / 16.0) discard;
    }
    // Погашенный (не сосед выделенного) - полупрозрачный: часть пикселей по шаблону Байера отбрасывается (~85%)
    if (vDim > 0.01) {
        const float D[16] = float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);
        ivec2 dp = ivec2(mod(gl_FragCoord.xy, 4.0));
        if ((D[dp.y * 4 + dp.x] + 0.5) / 16.0 < vDim * 0.85) discard;
    }`)
            .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n#ifdef USE_COLOR\n  totalEmissiveRadiance *= vColor.rgb;\n#endif\n  totalEmissiveRadiance *= 1.0 - vDim * 0.9;')
            .replace('#include <opaque_fragment>', `// Защита постобработки: NaN/Inf bloom размазывает в чёрные прямоугольники
    if (any(isnan(outgoingLight)) || any(isinf(outgoingLight))) outgoingLight = vec3(0.0);
    // Пересвет без сдвига оттенка: каналы не обрезаются по отдельности (иначе бирюзовый «становится» голубым
    // в центре, а свечение вокруг остаётся зелёным) - весь цвет масштабируется, пока максимум не станет 1
    { float mx = max(max(outgoingLight.r, outgoingLight.g), outgoingLight.b); if (mx > 1.0) outgoingLight /= mx; }
    // Ободок - уже после нормировки (иначе она его съедала): к краю цвет узла светлеет до почти белого.
    // У крошечных (дальних) граней нормаль из производных бывает нулевой - тогда ободка нет (иначе NaN)
    if (uRim > 0.0 && dot(normal, normal) > 1e-12) {
        vec3 vp = vViewPosition + vec3(0.0, 0.0, 1e-5);
        float rim = pow(clamp(1.0 - abs(dot(normalize(normal), normalize(vp))), 0.0, 1.0), 3.0) * min(uRim, 2.0) * 0.8 * (1.0 - vDim * 0.95);
        vec3 edge = mix(diffuseColor.rgb, vec3(1.0), 0.3);
        outgoingLight = mix(outgoingLight, max(outgoingLight, edge), clamp(rim, 0.0, 1.0));
    }
    outgoingLight *= vShade;
    // Ещё раз - последней строкой: что бы ни посчитали выше, в постобработку NaN не уйдёт
    if (any(isnan(outgoingLight)) || any(isinf(outgoingLight))) outgoingLight = vec3(0.0);
#include <opaque_fragment>`);
    };
    mat.customProgramCacheKey = () => 'drift-node-dim';
    return mat;
}


function nodeGeometry() {
    const q = Math.round(vis.quality);
    if (vis.shape === 'crystal') return new THREE.IcosahedronGeometry(1, q >= 12 ? 2 : 1);
    if (vis.shape === 'wire') return new THREE.IcosahedronGeometry(1, q >= 12 ? 2 : 1);
    return new THREE.SphereGeometry(1, q, Math.max(3, Math.round(q * 0.75)));
}
// Цвета узлов и связей хранятся на CPU - в GPU уходят только видимые (отсечение по пирамиде камеры)
let nodeCol = new Float32Array(0), nodeShade = new Float32Array(0), linkCol = new Float32Array(0), lineColVer = 1;
// Гашение невыделенного: v плавно идёт к 1 при выделении и к 0 без него; hl / hlL - узлы и связи, которые не гаснут
// (остаются от последнего выделения, пока идёт обратное проявление)
const selFade = { v: 0, hl: null, hlL: null, dirty: false };
// Погашенный узел в основном прозрачен (85% пикселей отброшены), а оставшиеся - приглушены, но не чёрные
const SEL_DIM_NODE = 0.85, SEL_DIM_LINK = 0.95;
// Выделенные связи библиотека рисует отдельным объектом каждую и пересчитывает их в каждом кадре - для узла с сотнями
// связей это дорого. Больше HL_LIB_MAX связей - их рисует один слой линий (hlLinesObj) со своей непрозрачностью
const HL_LIB_MAX = 120;
// Гашение остального графа при выделении - только когда граф собрался (во время сборки выделенные связи ещё
// не показаны). После сборки остальное гаснет, а выделенные связи (библиотеки, слой hlLinesObj, импульсы)
// проявляются вместе с этим гашением - одной плавной анимацией
const selGoal = () => (selId && !isGrowing() ? 1 : 0);
function setHlLibOpacity(f) {
    for (const l of hlLinks) {
        const lo = l.__lineObj, ao = l.__arrowObj;
        if (lo && lo.material) { lo.material.transparent = true; lo.material.opacity = 0.9 * f; }
        if (ao && ao.material) { ao.material.transparent = true; ao.material.opacity = Math.min(1, 2.7 * f); }
    }
}
function rebuildNodeMesh() {
    radVer++;
    disposeObj(nodesObj); disposeObj(extObj); nodesObj = extObj = null;
    let np = 0, ne = 0;
    gdata.nodes.forEach((n, i) => { n.__i = i; if (isExtNode(n)) { n.__m = 1; ne++; } else { n.__m = 0; np++; } });
    nodesObj = new THREE.InstancedMesh(nodeGeometry(), makeNodeMaterial(), Math.max(1, np));
    nodesObj.count = 0; nodesObj.frustumCulled = false; nodesObj.raycast = () => {};
    nodesObj.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    nodesObj.geometry.setAttribute('aDim', new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, np)), 1).setUsage(THREE.DynamicDrawUsage));
    nodesObj.geometry.setAttribute('aShade', new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, np)).fill(1), 1).setUsage(THREE.DynamicDrawUsage));
    G.scene().add(nodesObj);
    // Внешние функции и заголовки - полупрозрачные каркасы, чтобы их не путать с кодом проекта
    const extMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.6, depthWrite: false });
    // Погашенный каркас - почти прозрачный, а не тёмный
    extMat.onBeforeCompile = sh => {
        sh.vertexShader = 'attribute float aDim;\nvarying float vDim;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n    vDim = aDim;');
        sh.fragmentShader = 'varying float vDim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', 'diffuseColor.a *= 1.0 - vDim * 0.85;\n#include <opaque_fragment>');
    };
    extMat.customProgramCacheKey = () => 'drift-ext-dim';
    extObj = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), extMat, Math.max(1, ne));
    extObj.geometry.setAttribute('aDim', new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, ne)), 1).setUsage(THREE.DynamicDrawUsage));
    extObj.count = 0; extObj.frustumCulled = false; extObj.raycast = () => {};
    extObj.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    G.scene().add(extObj);
    // Заранее создаём атрибут цвета экземпляров
    nodesObj.setColorAt(0, _white); extObj.setColorAt(0, _white);
    recolorNodes(); syncPositions();
}
const _mat4 = new THREE.Matrix4(), _col = new THREE.Color(), _bg = new THREE.Color(), _white = new THREE.Color(1, 1, 1);
function meshOf(n) { return n.__m === 1 ? extObj : nodesObj; }


function recolorNodes() {
    if (!nodesObj) return;
    _bg.set(colorCache['--graph-bg']);
    if (nodeCol.length < gdata.nodes.length * 3) nodeCol = new Float32Array(gdata.nodes.length * 3);
    if (nodeShade.length < gdata.nodes.length) nodeShade = new Float32Array(gdata.nodes.length);
    for (const n of gdata.nodes) {
        const bc = baseColor(n); shadeColor(n, _col.set(bc), true);
        // Серые «прочие» узлы на тёмной сцене приглушаются уже после освещения: нормировка пересвета сохраняет только
        // оттенок, и серый цвет со свечением иначе становится почти белым
        nodeShade[n.__i] = shadeMul(n) * (colorCache.dark && bc === colorCache['--ext'] ? 0.6 : 1);
        if (isExtNode(n) && !colorCache.dark) _col.lerp(_bg, 0.35); // на тёмной сцене внешние - светло-серые, без притемнения
        nodeCol[n.__i * 3] = _col.r; nodeCol[n.__i * 3 + 1] = _col.g; nodeCol[n.__i * 3 + 2] = _col.b;
    }
    recolorCosmos(); posDirty = true; requestRender();
}


// Позиции узлов и связей переносятся в буферы (каждый кадр при анимации, иначе - когда что-то сдвинулось)
function syncPositions() { posDirty = true; requestRender(); }

/* ----- Все связи одним буфером LineSegments (вместо сотен отдельных мешей) ----- */
let linesObj = null;
function ensureLines() {
    if (linesObj) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(6), 3));
    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: vis.linkOpacity, depthWrite: false });
    linesObj = new THREE.LineSegments(geo, mat);
    linesObj.frustumCulled = false; linesObj.renderOrder = -1;
    linesObj.raycast = () => {};
    // Вызывается в каждом кадре рендера с той же камерой - подписи всегда синхронны с узлами
    linesObj.onBeforeRender = (renderer, scene, camera) => placeLabels(camera);
    G.scene().add(linesObj);
}


function rebuildLineBuffers() {
    ensureLines();
    const n = Math.max(1, gdata.links.length);
    const geo = linesObj.geometry;
    if (geo.attributes.position.count < n * 2) {
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 6), 3).setUsage(THREE.DynamicDrawUsage));
        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 6), 3).setUsage(THREE.DynamicDrawUsage));
    }
    geo.setDrawRange(0, 0);
    // Встречные связи - дуги из CURVE_SEG отрезков в отдельном буфере (тот же материал, что у прямых связей)
    let m = 0; for (const l of gdata.links) l.__mi = l.__mutual ? m++ : -1;
    if (mutCP.length < n * 3) mutCP = new Float32Array(n * 3);
    if (!curveObj) {
        curveObj = new THREE.LineSegments(new THREE.BufferGeometry(), linesObj.material);
        curveObj.frustumCulled = false; curveObj.renderOrder = -1; curveObj.raycast = () => {};
        G.scene().add(curveObj);
    }
    const cg = curveObj.geometry, cv = Math.max(1, m) * CURVE_SEG * 2;
    if (!cg.attributes.position || cg.attributes.position.count < cv) {
        cg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cv * 3), 3).setUsage(THREE.DynamicDrawUsage));
        cg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cv * 3), 3).setUsage(THREE.DynamicDrawUsage));
    }
    cg.setDrawRange(0, m * CURVE_SEG * 2);
    recolorLines();
}
// Дуга встречной связи - квадратичная кривая Безье, как у библиотеки (linkCurvature): вершина смещена от середины
// на (AB × кривизна) × ось Z - выделенная дуга библиотеки ложится точно на неё
const CURVE_SEG = 10, CURVE_K = 0.22;
let curveObj = null, mutCP = new Float32Array(0);


function recolorLines() {
    if (!linesObj) return;
    if (linkCol.length < gdata.links.length * 6) linkCol = new Float32Array(gdata.links.length * 6);
    const col = linkCol;
    const bg = _bg.set(colorCache['--graph-bg']); const c = new THREE.Color(), s = new THREE.Color();
    // Связь окрашена цветами своих концов - градиент от узла A к узлу B (как химическая связь)
    let i = 0;
    for (const l of gdata.links) {
        const src = typeof l.source === 'object' ? l.source : null, tgt = typeof l.target === 'object' ? l.target : null;
        if (src && tgt) { shadeColor(tgt, c.set(baseColor(tgt))); shadeColor(src, s.set(baseColor(src))); }
        else { c.set(linkBase(l)); s.copy(c); }
        if (vis.gradient && l.kind !== 'tree') s.lerp(bg, 0.5); // источник тусклее цели - направление видно без стрелок
        col[i++] = s.r; col[i++] = s.g; col[i++] = s.b; col[i++] = c.r; col[i++] = c.g; col[i++] = c.b;
    }
    lineColVer++;
    // Плотный граф (десятки связей на узел, как подключения Java-проекта): чтобы десятки тысяч линий не сливались
    // в сплошное пятно, каждая линия тем тусклее, чем больше связей на узел
    const perNode = gdata.links.length / Math.max(1, gdata.nodes.length), denseDim = Math.max(0.15, Math.min(1, Math.sqrt(4 / Math.max(1e-6, perNode))));
    linesObj.material.opacity = vis.linkOpacity * (vis.additive ? 0.75 : 1) * denseDim;
    // Свечение связей: цвет ярче 1 (кадр считается в буфере с плавающей точкой) - при сложении света густые пучки
    // дают яркие пятна, а bloom размывает их в «облака»
    linesObj.material.color.setScalar(vis.linkGlow);
    const blend = vis.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (linesObj.material.blending !== blend) { linesObj.material.blending = blend; linesObj.material.needsUpdate = true; }
    posDirty = true; requestRender();
}

/* ======================================================================
   Сцена: небо (градиент / звёзды / процедурная туманность / сетка), свечение,
   атомы с оболочками, импульсы по связям, «тепловое» дрожание
   ====================================================================== */
const cz = { stars: null, background: null, grid: null, rings: null, ringDefs: [], electrons: null, elDefs: [], pulses: null, hlPulses: null, pv: 1, bloom: null, lastInput: 0, disp: new Float32Array(0), rad: new Float32Array(0) };
let posDirty = true;


// Детерминированный генератор случайных чисел - одно и то же небо для одного зерна
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// Мягкое круглое пятно для точек
let dotTex = null;
function radialTexture(size, stops) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d'); const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [o, a] of stops) gr.addColorStop(o, `rgba(255,255,255,${a})`);
    g.fillStyle = gr; g.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const getDotTex = () => dotTex || (dotTex = radialTexture(64, [[0, 1], [0.25, 0.85], [0.6, 0.18], [1, 0]]));


function disposeObj(o) {
    if (!o || !G) return;
    G.scene().remove(o);
    o.traverse && o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); });
    if (o.dispose) o.dispose();
}


function buildStars(rand) {
    const g = new THREE.Group();
    const tints = [[1, 1, 1], [0.75, 0.85, 1], [1, 0.9, 0.75], [0.85, 0.8, 1]];
    for (const [count, size, rad] of [[2200, 1.4, 18000], [420, 2.6, 16500]]) {
        const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Равномерно по сфере
            const u = rand() * 2 - 1, th = rand() * Math.PI * 2, r = rad * (0.85 + rand() * 0.15), s = Math.sqrt(1 - u * u);
            pos[i * 3] = Math.cos(th) * s * r; pos[i * 3 + 1] = u * r; pos[i * 3 + 2] = Math.sin(th) * s * r;
            const tn = tints[(rand() * tints.length) | 0], b = (0.35 + rand() * 0.65) * vis.skyAmt;
            col[i * 3] = tn[0] * b; col[i * 3 + 1] = tn[1] * b; col[i * 3 + 2] = tn[2] * b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size, sizeAttenuation: false, vertexColors: true, map: getDotTex(), transparent: true, depthWrite: false, fog: false }));
        pts.frustumCulled = false; g.add(pts);
    }
    g.renderOrder = -10;
    return g;
}

// Процедурная туманность: шейдер с fbm-шумом рисует равнопромежуточную (equirect) карту один раз в текстуру
const NEB_FRAG = `
uniform float uSeed, uAmt; uniform vec3 uBg, uC1, uC2, uC3; varying vec2 vUv;
// Хэш без «квадратных» артефактов (Dave Hoskins, hash13)
float hash13(vec3 p3) { p3 = fract(p3 * 0.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float n3(vec3 x) {
    vec3 i = floor(x), f = fract(x);
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // квинтика - без «рёбер» сетки
    return mix(mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y),
                          mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), u.x), u.y), u.z);
}
float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * n3(p); p = p * 2.02 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s / 0.97; }
void main() {
    float th = vUv.x * 6.2831853, ph = (vUv.y - 0.5) * 3.14159265;
    vec3 d = vec3(cos(ph) * cos(th), sin(ph), cos(ph) * sin(th));
    vec3 q = d * 1.35 + vec3(uSeed, uSeed * 0.61, uSeed * 1.37);
    // Искажение координат (domain warping) даёт плавные «облачные» формы без рваных краёв
    vec3 w = vec3(fbm(q), fbm(q + vec3(5.2, 1.3, 2.8)), fbm(q + vec3(1.7, 9.2, 4.1)));
    float dens = fbm(q * 1.2 + w * 1.6);
    float neb = smoothstep(0.38, 0.9, dens); neb *= neb;                       // мягкая плотность
    float glow = smoothstep(0.25, 0.85, fbm(q * 0.6 + w * 0.8 + 7.0)) * 0.35;  // широкое слабое свечение
    float tint = smoothstep(0.3, 0.7, fbm(q * 0.8 + 3.0));
    vec3 nc = mix(uC1, uC2, tint);
    nc = mix(nc, uC3, smoothstep(0.55, 0.8, fbm(q * 1.9 + 11.0)) * 0.55);
    float detail = mix(0.8, 1.12, fbm(q * 3.2 + w * 2.0));                    // тонкие волокна - только модуляция
    float dust = smoothstep(0.5, 0.85, fbm(q * 2.3 + w + 20.0)) * 0.3 * neb;  // едва заметная пыль
    vec3 col = uBg + nc * (neb * detail * 0.30 + glow * 0.10) * uAmt;
    col *= 1.0 - dust;
    gl_FragColor = vec4(max(col, 0.0), 1.0);
}`;
function buildNebula(seed) {
    const rt = new THREE.WebGLRenderTarget(2048, 1024, { depthBuffer: false, type: THREE.HalfFloatType }); // float - без полос на плавных градиентах
    const pal = PALETTES[vis.palette] || PALETTES.cosmos;
    const c = x => new THREE.Color(x);
    const mat = new THREE.ShaderMaterial({
        uniforms: { uSeed: { value: (seed % 1000) * 0.137 }, uAmt: { value: vis.skyAmt }, uBg: { value: c(pal['--graph-bg']) }, uC1: { value: c(pal.neb[0]) }, uC2: { value: c(pal.neb[1]) }, uC3: { value: c(pal.neb[2]) } },
        vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: NEB_FRAG, depthTest: false, depthWrite: false,
    });
    const scene = new THREE.Scene(); const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); scene.add(quad);
    const r = G.renderer(), prev = r.getRenderTarget();
    r.setRenderTarget(rt); r.render(scene, new THREE.Camera()); r.setRenderTarget(prev);
    quad.geometry.dispose(); mat.dispose();
    // Цвета-униформы уже в линейном пространстве (THREE.Color), поэтому и текстура линейная
    rt.texture.mapping = THREE.EquirectangularReflectionMapping; rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
    return rt;
}


function buildGradient() {
    const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512;
    const g = cv.getContext('2d'); const pal = PALETTES[vis.palette];
    const bg = colorCache['--graph-bg'], top = new THREE.Color(bg).lerp(new THREE.Color(pal ? pal.neb[0] : colorCache['--s1']), 0.22 * vis.skyAmt);
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#' + top.getHexString()); gr.addColorStop(1, bg);
    g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}


function rebuildSky() {
    if (!G) return;
    const scene = G.scene();
    disposeObj(cz.stars); cz.stars = null;
    disposeObj(cz.grid); cz.grid = null;
    if (cz.background) {
        // Освобождаем и кубическую карту, в которую three конвертирует equirect-фон (иначе копится видеопамять)
        if (cz.background.texture) cz.background.texture.dispose();
        if (cz.background.dispose) cz.background.dispose();
        cz.background = null;
    }
    // Фон всегда задан явно: при «пустом» фоне bloom иначе считает альфу по-другому и светит втрое сильнее,
    // и при смене фона сцена резко меняла вид
    scene.background = new THREE.Color(colorCache['--graph-bg']);
    const sky = vis.sky, rand = mulberry32(vis.skySeed);
    if (sky === 'stars' || sky === 'nebula') { cz.stars = buildStars(rand); scene.add(cz.stars); }
    if (sky === 'nebula') { cz.background = buildNebula(vis.skySeed); scene.background = cz.background.texture; }
    if (sky === 'gradient') { cz.background = buildGradient(); scene.background = cz.background; }
    if (sky === 'grid') {
        const c1 = new THREE.Color(colorCache['--muted']), c2 = new THREE.Color(colorCache['--muted']).lerp(new THREE.Color(colorCache['--graph-bg']), 0.5);
        cz.grid = new THREE.GridHelper(1, 48, c1, c2);
        cz.grid.material.transparent = true; cz.grid.material.opacity = 0.35 * vis.skyAmt; cz.grid.material.depthWrite = false;
        scene.add(cz.grid); placeGrid();
    }
    requestRender();
}


function placeGrid() {
    if (!cz.grid || !gdata.nodes.length) return;
    let minY = Infinity, r = 0;
    for (const n of gdata.nodes) { if (n.y == null) continue; minY = Math.min(minY, n.y); r = Math.max(r, Math.hypot(n.x, n.z || 0)); }
    if (!isFinite(minY)) return;
    cz.grid.scale.setScalar(Math.max(400, r * 3)); cz.grid.position.set(0, minY - 60, 0);
}


function ensureBloom() {
    if (!G || !window.UnrealBloomPass) return;
    const want = vis.bloom;
    if (!cz.bloom && want) {
        const el = $('#graph');
        const pass = new window.UnrealBloomPass(new THREE.Vector2(el.clientWidth || 512, el.clientHeight || 512), vis.glow, vis.bloomRadius, vis.bloomThreshold);
        // Свечение: на экранах до 1080p - в полном разрешении (в половинном размытие даёт «квадратные» пятна), на больших - с понижением.
        // На телефонах (высокая плотность пикселей, слабый GPU) - в 0.75: там ступеньки не видны
        const orig = pass.setSize.bind(pass);
        pass.setSize = (w, h) => {
            // До ~2.2 Мпикс (1080p) - полное разрешение; больше - масштаб так, чтобы считалось примерно столько же пикселей
            const big = Math.max(0.5, Math.min(1, Math.sqrt(2.2e6 / Math.max(1, w * h))));
            const k = vis.res === 'max' ? 1 : Math.min(big, IS_TOUCH ? 0.75 : 1);
            orig(Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
        };
        G.postProcessingComposer().addPass(pass);
        cz.bloom = pass; applyRenderScale(); applyMsaa();
    }
    if (cz.bloom) { cz.bloom.enabled = want; cz.bloom.strength = vis.glow; cz.bloom.radius = vis.bloomRadius; cz.bloom.threshold = vis.bloomThreshold; }
    requestRender();
}


// Сменить pixel ratio, сохранив размеры, которые знает библиотека (а не DOM - они могут временно расходиться)
function setPixelRatio(pr) {
    const r = G.renderer(), comp = G.postProcessingComposer(), w = G.width(), h = G.height();
    if (Math.abs(r.getPixelRatio() - pr) < 1e-3) return;
    r.setPixelRatio(pr); r.setSize(w, h); comp.setPixelRatio(pr); comp.setSize(w, h);
    requestRender();
}


// Разрешение рендера (pixel ratio): авто = min(DPR, 1.5) и динамически ниже при просадке FPS
function applyRenderScale() {
    if (!G) return;
    const dpr = window.devicePixelRatio || 1;
    // «Максимум» - родное разрешение экрана (у телефонов ×3)
    const pr = vis.res === 'low' ? Math.min(dpr, 1) * 0.75 : vis.res === 'mid' ? Math.min(dpr, 1) : vis.res === 'high' ? Math.min(dpr, 2) : vis.res === 'max' ? Math.min(dpr, 3) : Math.min(dpr, 1.5);
    setPixelRatio(pr * (vis.res === 'auto' ? dyn.scale : 1));
    applyMsaa();
    requestRender();
}


// Сглаживание: при постобработке (bloom) сцена рисуется во внутренние буферы, у которых по умолчанию нет MSAA -
// отсюда «лесенки». Включаем мультисэмплинг на буферах композитора.
function applyMsaa() {
    if (!G) return;
    const comp = G.postProcessingComposer(), n = Math.min(Number(vis.msaa) || 0, r_maxSamples());
    for (const rt of [comp.renderTarget1, comp.renderTarget2]) if (rt && rt.samples !== n) { rt.samples = n; rt.dispose(); }
    requestRender();
}


function r_maxSamples() { try { const gl = G.renderer().getContext(); return gl.getParameter(gl.MAX_SAMPLES) || 4; } catch { return 4; } }


// Применить стиль целиком: цвета, фон, туман, небо, свечение, атомы
function applyStyle() {
    readColors();
    document.body.classList.toggle('scene-dark', darkScene());
    if (!G) return;
    G.backgroundColor(colorCache['--graph-bg']);
    G.scene().fog = vis.fog ? new THREE.FogExp2(colorCache['--graph-bg'], 0.0005) : null;
    rebuildSky();
    ensureBloom();
    if (model && gdata.nodes.length) { rebuildNodeMesh(); rebuildCosmos(); recolorLines(); updateLabels(); renderLegend(); }
    requestRender();
}


function applyPreset(name) {
    const p = STYLE_PRESETS[name]; if (!p) return;
    vis.style = name; for (const k of STYLE_KEYS) if (k in p) vis[k] = p[k];
    saveVis(); applyStyle();
}


// Атомы (оболочки + электроны) и импульсы по связям
function rebuildCosmos() {
    disposeObj(cz.rings); disposeObj(cz.electrons);
    cz.rings = cz.electrons = null; cz.ringDefs = []; cz.elDefs = [];
    if (!G) return;
    const N = gdata.nodes.length;
    if (vis.orbits && N) {
        const ns = gdata.nodes.filter(n => !isExtNode(n)).sort((a, b) => nodeVal(b) - nodeVal(a)).slice(0, N > 1500 ? 260 : N > 600 ? 420 : 600);
        const rand = mulberry32(12345);
        ns.forEach((n, i) => {
            const shells = i < 30 ? 3 : i < 120 ? 2 : 1;
            for (let s = 0; s < shells; s++) {
                const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(), rand() * Math.PI);
                cz.ringDefs.push({ n, q, speed: (0.15 + rand() * 0.35) * (rand() < 0.5 ? -1 : 1), k: 1.75 + s * 0.6, phase: rand() * 6.28, _q: new THREE.Quaternion(), _r: 0, vis: false });
            }
        });
        cz.rings = new THREE.InstancedMesh(new THREE.TorusGeometry(1, 0.012, 3, 56), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false }), Math.max(1, cz.ringDefs.length));
        cz.rings.count = 0; cz.rings.frustumCulled = false; cz.rings.raycast = () => {};
        cz.rings.setColorAt(0, _white);
        G.scene().add(cz.rings);
        if (vis.electrons) {
            for (const d of cz.ringDefs) {
                const ne = d.k < 2 ? 2 : 1;
                for (let e = 0; e < ne; e++) cz.elDefs.push({ d, phase: rand() * 6.28, speed: (1.2 + rand() * 1.6) * (rand() < 0.5 ? -1 : 1), col: [1, 1, 1] });
            }
            cz.electrons = makePointsObj(cz.elDefs.length, 2.6);
        }
    }
    if (!cz.pulses) cz.pulses = makePointsObj(1024, 3.2);
    if (!cz.hlPulses) cz.hlPulses = makePointsObj(256, 4.4);
    recolorCosmos();
    posDirty = true; requestRender();
}


function makePointsObj(capacity, size) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Math.max(1, capacity) * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(Math.max(1, capacity) * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setDrawRange(0, 0);
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size, map: getDotTex(), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    pts.frustumCulled = false; pts.raycast = () => {};
    G.scene().add(pts);
    return pts;
}


// Буфер точек нужного размера (растёт по необходимости)
function ensurePointsCapacity(obj, count) {
    const g = obj.geometry, cap = g.attributes.position.count;
    if (count <= cap) return;
    const n = Math.max(count, cap * 2);
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage));
}

/* ----- Импульсы по связям -----
   Каждая связь испускает vis.pulseRate импульсов в секунду (со своей случайной фазой), импульс идёт
   с постоянной скоростью vis.pulseSpeed независимо от длины связи и гаснет у её концов.
   Фоновые импульсы плавно скрываются при выделении узла и при сильном отдалении камеры.
   Пауза останавливает рождение новых импульсов: уже летящие долетают до конца связи. */
let pulsePhase = new Float32Array(0), pulseBase = new Float32Array(0);
// Интервалы времени анимации, в которые импульсы не рождаются (to = Infinity - пауза ещё идёт)
const pulseGaps = [];
function setPulseSpawn(on) {
    const t = anim.t, last = pulseGaps[pulseGaps.length - 1];
    if (!on && !(last && last.to === Infinity)) pulseGaps.push({ from: t, to: Infinity });
    if (on && last && last.to === Infinity) last.to = t;
    // Старые паузы больше не влияют: импульсы того времени давно долетели
    while (pulseGaps.length > 1 && pulseGaps[0].to < t - 120) pulseGaps.shift();
    requestRender();
}
const bornInGap = tb => { for (const g of pulseGaps) if (tb >= g.from && tb < g.to) return true; return false; };
function rebuildHlPulses() { recolorCosmos(); requestRender(); }


function recolorCosmos() {
    _bg.set(colorCache['--graph-bg']);
    if (cz.rings) for (const d of cz.ringDefs) { shadeColor(d.n, _col.set(baseColor(d.n))); if (selId && !hlNodes.has(d.n.id)) _col.lerp(_bg, 0.9); d.col = [_col.r, _col.g, _col.b]; }
    for (const e of cz.elDefs) { shadeColor(e.d.n, _col.set(baseColor(e.d.n))).lerp(_white, 0.45); if (selId && !hlNodes.has(e.d.n.id)) _col.lerp(_bg, 0.92); e.col = [_col.r, _col.g, _col.b]; }
    // Фаза и базовый цвет импульсов каждой связи
    const L = gdata.links.length;
    if (pulsePhase.length < L) { pulsePhase = new Float32Array(L); for (let i = 0; i < L; i++) pulsePhase[i] = Math.random(); }
    if (pulseBase.length < L * 3) pulseBase = new Float32Array(L * 3);
    gdata.links.forEach((l, i) => {
        const tgt = typeof l.target === 'object' ? l.target : null;
        (tgt ? shadeColor(tgt, _col.set(baseColor(tgt))) : _col.set(linkBase(l))).lerp(_white, 0.3);
        pulseBase[i * 3] = _col.r; pulseBase[i * 3 + 1] = _col.g; pulseBase[i * 3 + 2] = _col.b;
    });
}

// Пирамида видимости камеры
const _frustum = new THREE.Frustum(), _pm = new THREE.Matrix4(), _sph = new THREE.Sphere(), _cv = new THREE.Vector3();
let nodeVis = new Uint8Array(0), linkVis = new Uint8Array(0);
const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _yAxis = new THREE.Vector3(0, 1, 0);


// Слой выделенных связей (когда их больше HL_LIB_MAX): только они, цветами своих концов, чуть светлее
let hlLinesObj = null;
function syncHlLines(Lk, D, fl, fv) {
    if (!hlLinesObj) {
        hlLinesObj = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }));
        hlLinesObj.frustumCulled = false; hlLinesObj.raycast = () => {};
        G.scene().add(hlLinesObj);
    }
    const geo = hlLinesObj.geometry, need = fl.size * CURVE_SEG * 2;
    if (!geo.attributes.position || geo.attributes.position.count < need) {
        const n = Math.max(need, 512);
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage));
        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage));
    }
    const P = geo.attributes.position.array, C = geo.attributes.color.array, br = x => x + (1 - x) * 0.25;
    let v = 0;
    const put = (x, y, z, c, u) => {
        P[v * 3] = x; P[v * 3 + 1] = y; P[v * 3 + 2] = z;
        for (let ch = 0; ch < 3; ch++) C[v * 3 + ch] = br((linkCol[c + ch] || 0) * (1 - u) + (linkCol[c + 3 + ch] || 0) * u);
        v++;
    };
    for (let li = 0; li < Lk.length; li++) {
        const l = Lk[li]; if (!fl.has(l)) continue;
        const a = l.source, b = l.target;
        if (typeof a !== 'object' || typeof b !== 'object' || a.__i == null || b.__i == null || a.__hidden || b.__hidden) continue;
        const ia = a.__i * 3, ib = b.__i * 3, c = li * 6;
        if (l.__mi >= 0 && curveObj) {
            // Встречная связь - по той же дуге, что в буфере дуг (вершина - mutCP этого кадра)
            const px = mutCP[li * 3], py = mutCP[li * 3 + 1], pz = mutCP[li * 3 + 2];
            const at = u => { const w0 = (1 - u) * (1 - u), w1 = 2 * (1 - u) * u, w2 = u * u; return [w0 * D[ia] + w1 * px + w2 * D[ib], w0 * D[ia + 1] + w1 * py + w2 * D[ib + 1], w0 * D[ia + 2] + w1 * pz + w2 * D[ib + 2]]; };
            for (let sg = 0; sg < CURVE_SEG; sg++) { const u0 = sg / CURVE_SEG, u1 = (sg + 1) / CURVE_SEG; put(...at(u0), c, u0); put(...at(u1), c, u1); }
        } else { put(D[ia], D[ia + 1], D[ia + 2], c, 0); put(D[ib], D[ib + 1], D[ib + 2], c, 1); }
    }
    geo.setDrawRange(0, v);
    for (const at of [geo.attributes.position, geo.attributes.color]) { at.clearUpdateRanges(); at.addUpdateRange(0, v * 3); at.needsUpdate = true; }
    hlLinesObj.material.opacity = 0.9 * fv; hlLinesObj.material.color.setScalar(vis.linkGlow);
    hlLinesObj.visible = true;
}


// Дуга встречной связи li в её место буфера дуг; вершина кривой - в mutCP (по ней же бегут импульсы)
function writeCurve(l, li, ia, ib, D, colDirty, growing, tNow, fl, kl, bgc) {
    const ax = D[ia], ay = D[ia + 1], az = D[ia + 2], vx = D[ib] - ax, vy = D[ib + 1] - ay, vz = D[ib + 2] - az;
    // (v × кривизна) × ось - точно как в three-forcegraph (calcLinkCurve): ось (0, 0, 1), а для связи вдоль Z - (0, 1, 0);
    // выделенная дуга библиотеки и её стрелки ложатся точно на эту дугу
    let cx, cy, cz2;
    if (vx !== 0 || vy !== 0) { cx = vy * CURVE_K; cy = -vx * CURVE_K; cz2 = 0; } else { cx = -vz * CURVE_K; cy = 0; cz2 = vx * CURVE_K; }
    const px = ax + vx / 2 + cx, py = ay + vy / 2 + cy, pz = az + vz / 2 + cz2;
    mutCP[li * 3] = px; mutCP[li * 3 + 1] = py; mutCP[li * 3 + 2] = pz;
    const pos = curveObj.geometry.attributes.position.array, col = curveObj.geometry.attributes.color.array, base = l.__mi * CURVE_SEG * 6;
    let lx = ax, ly = ay, lz = az;
    for (let sg = 1; sg <= CURVE_SEG; sg++) {
        const u = sg / CURVE_SEG, w0 = (1 - u) * (1 - u), w1 = 2 * (1 - u) * u, w2 = u * u, o = base + (sg - 1) * 6;
        const x = w0 * ax + w1 * px + w2 * D[ib], y = w0 * ay + w1 * py + w2 * D[ib + 1], z = w0 * az + w1 * pz + w2 * D[ib + 2];
        pos[o] = lx; pos[o + 1] = ly; pos[o + 2] = lz; pos[o + 3] = x; pos[o + 4] = y; pos[o + 5] = z; lx = x; ly = y; lz = z;
    }
    if (!colDirty) return;
    // Цвет вдоль дуги - от цвета начала к цвету конца (как градиент прямой связи)
    const c6 = li * 6, g = growing ? linkGrow(l.source, l.target, tNow) : 1, dim = fl && !fl.has(l) ? kl : 0;
    for (let sg = 0; sg < CURVE_SEG; sg++) for (let e = 0; e < 2; e++) {
        const u = (sg + e) / CURVE_SEG, o = base + sg * 6 + e * 3;
        for (let ch = 0; ch < 3; ch++) {
            let v = ((linkCol[c6 + ch] || 0) * (1 - u) + (linkCol[c6 + 3 + ch] || 0) * u) * g;
            if (dim) v += ((ch === 0 ? bgc.r : ch === 1 ? bgc.g : bgc.b) - v) * dim;
            col[o + ch] = v;
        }
    }
}


// Кадр: позиции («дрожание», рост) → отсечение невидимого → компактная выгрузка в GPU узлов, связей, оболочек, импульсов
function frameSync(t, dt, cam) {
    if (!G || !gdata.nodes.length || !nodesObj) return;
    cam = cam || G.camera();
    const ns = gdata.nodes, N = ns.length, Lk = gdata.links;
    if (cz.disp.length < N * 3) cz.disp = new Float32Array(N * 3);
    if (cz.rad.length < N) cz.rad = new Float32Array(N);
    const D = cz.disp, R = cz.rad, wob = vis.wobble, spin = darkScene() && vis.shape !== 'sphere', tNow = performance.now() / 1000, growing = tNow < growUntil;
    if (growing !== hlHeld) { hlHeld = growing; if (selId) { G.linkVisibility(G.linkVisibility()); setHlLibOpacity(selFade.v); requestRender(); } }
    dt = dt || 0;
    const order = growing && growOrder && growOrder.length === N ? growOrder : null;
    // 1. Позиции и радиусы (во время роста - родители раньше детей: ребёнок выезжает из позиции родителя)
    for (let q = 0; q < N; q++) {
        const i = order ? order[q] : q;
        const n = ns[i]; let x = n.x || 0, y = n.y || 0, z = n.z || 0;
        if (wob) {
            const w = n.__w || (n.__w = [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28, 0.6 + Math.random() * 0.9, 1]);
            // Выделенный узел и соседи не дрожат: их связи рисует библиотека по точным координатам раскладки
            const target = selId && hlNodes.has(n.id) ? 0 : 1;
            w[4] += (target - w[4]) * Math.min(1, dt * 8);
            const a = wob * (0.35 + nodeRadius(n) * 0.06) * w[4];
            x += Math.sin(t * w[3] + w[0]) * a; y += Math.sin(t * w[3] * 1.13 + w[1]) * a; z += Math.sin(t * w[3] * 0.87 + w[2]) * a;
        }
        const g = growing ? growOf(n, tNow) : 1;
        if (g < 1 && n.__par >= 0 && n.__par < N) {
            const pi = n.__par * 3, k = 1 - (1 - g) * GROW_TRAVEL; x = D[pi] + (x - D[pi]) * k; y = D[pi + 1] + (y - D[pi + 1]) * k; z = D[pi + 2] + (z - D[pi + 2]) * k;
        }
        D[i * 3] = x; D[i * 3 + 1] = y; D[i * 3 + 2] = z;
        R[i] = n.__hidden ? 0 : nodeRadius(n) * Math.max(1e-3, g);
    }
    posDirty = false;
    // 2. Отсечение по пирамиде камеры: невидимые узлы и связи вообще не попадают в GPU
    _frustum.setFromProjectionMatrix(_pm.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    if (nodeVis.length < N) nodeVis = new Uint8Array(N);
    let jp = 0, je = 0;
    const fv = selFade.v, fhl = fv > 0 ? selFade.hl : null, bgc = _bg.set(colorCache['--graph-bg']);
    const dimA = nodesObj.geometry.attributes.aDim ? nodesObj.geometry.attributes.aDim.array : null;
    const dimE = extObj.geometry.attributes.aDim ? extObj.geometry.attributes.aDim.array : null;
    const shA = nodesObj.geometry.attributes.aShade ? nodesObj.geometry.attributes.aShade.array : null;
    for (let i = 0; i < N; i++) {
        const n = ns[i], r = R[i];
        let v = 0;
        if (r > 0) { _sph.center.set(D[i * 3], D[i * 3 + 1], D[i * 3 + 2]); _sph.radius = r * 2.6; v = _frustum.intersectsSphere(_sph) ? 1 : 0; }
        nodeVis[i] = v;
        if (!v) continue;
        const m = n.__m === 1 ? extObj : nodesObj, j = n.__m === 1 ? je++ : jp++;
        if (spin) {
            _q.setFromAxisAngle(_yAxis, t * 0.3 + i);
            _mat4.compose(_v.set(D[i * 3], D[i * 3 + 1], D[i * 3 + 2]), _q, _s.set(r, r, r));
            m.setMatrixAt(j, _mat4);
        } else {
            // Без вращения матрица - масштаб и сдвиг: пишем напрямую (compose + setMatrixAt на 10к узлов - миллисекунды)
            const e = m.instanceMatrix.array, o = j * 16;
            e[o] = r; e[o + 1] = 0; e[o + 2] = 0; e[o + 3] = 0; e[o + 4] = 0; e[o + 5] = r; e[o + 6] = 0; e[o + 7] = 0;
            e[o + 8] = 0; e[o + 9] = 0; e[o + 10] = r; e[o + 11] = 0; e[o + 12] = D[i * 3]; e[o + 13] = D[i * 3 + 1]; e[o + 14] = D[i * 3 + 2]; e[o + 15] = 1;
        }
        let cr = nodeCol[i * 3], cg = nodeCol[i * 3 + 1], cb = nodeCol[i * 3 + 2], dim = 0;
        if (fhl && !fhl.has(n.id)) { dim = fv; const k = fv * SEL_DIM_NODE; cr += (bgc.r - cr) * k; cg += (bgc.g - cg) * k; cb += (bgc.b - cb) * k; }
        if (m === nodesObj) { if (dimA) dimA[j] = dim; if (shA) shA[j] = nodeShade[i]; } else if (dimE) dimE[j] = dim;
        if (m.instanceColor) { const c = m.instanceColor.array, o = j * 3; c[o] = cr; c[o + 1] = cg; c[o + 2] = cb; }
        else m.setColorAt(j, _col.setRGB(cr, cg, cb));
    }
    if (dimA) { const at = nodesObj.geometry.attributes.aDim; at.clearUpdateRanges(); at.addUpdateRange(0, jp); at.needsUpdate = true; }
    if (shA) { const at = nodesObj.geometry.attributes.aShade; at.clearUpdateRanges(); at.addUpdateRange(0, jp); at.needsUpdate = true; }
    if (dimE) { const at = extObj.geometry.attributes.aDim; at.clearUpdateRanges(); at.addUpdateRange(0, je); at.needsUpdate = true; }
    for (const [m, c] of [[nodesObj, jp], [extObj, je]]) {
        m.count = c;
        m.instanceMatrix.clearUpdateRanges(); m.instanceMatrix.addUpdateRange(0, c * 16); m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) { m.instanceColor.clearUpdateRanges(); m.instanceColor.addUpdateRange(0, c * 3); m.instanceColor.needsUpdate = true; }
    }
    // Связи: видима, если её ограничивающая сфера пересекает пирамиду. При росте узлов связи проявляются вместе с ними
    if (linkVis.length < Lk.length) linkVis = new Uint8Array(Lk.length);
    // Каждая связь - на своём месте буфера (без отсечения: 30к отрезков видеокарта рисует почти даром, а сфера
    // отсечения и перекладка цветов на каждую связь стоили миллисекунды кадра). Скрытая связь - отрезок нулевой длины.
    // Цвета выгружаются, только когда изменились (перекраска, рост узлов)
    if (linesObj) {
        const pos = linesObj.geometry.attributes.position.array, col = linesObj.geometry.attributes.color.array;
        const colDirty = growing || linesObj.__cv !== lineColVer || linesObj.__grow || selFade.dirty;
        const fl = fv > 0 ? selFade.hlL : null, kl = fv * SEL_DIM_LINK;
        selFade.dirty = false;
        linesObj.__cv = lineColVer; linesObj.__grow = growing;
        for (let li = 0, k = 0; li < Lk.length; li++, k += 6) {
            const l = Lk[li], a = l.source, b = l.target;
            linkVis[li] = 0;
            if (typeof a !== 'object' || typeof b !== 'object' || a.__i == null || b.__i == null) { pos.fill(0, k, k + 6); continue; }
            const ia = a.__i * 3, ib = b.__i * 3;
            if (a.__hidden || b.__hidden) {
                pos[k] = pos[k + 3] = D[ia]; pos[k + 1] = pos[k + 4] = D[ia + 1]; pos[k + 2] = pos[k + 5] = D[ia + 2];
                if (l.__mi >= 0 && curveObj) curveObj.geometry.attributes.position.array.fill(0, l.__mi * CURVE_SEG * 6, (l.__mi + 1) * CURVE_SEG * 6); // дуга скрытой связи не висит на старом месте
                continue;
            }
            linkVis[li] = nodeVis[a.__i] || nodeVis[b.__i] ? 1 : 0; // для импульсов: хотя бы один конец на экране
            if (growing && linkGrow(a, b, tNow) === 0) {
                pos.fill(0, k, k + 6); linkVis[li] = 0;
                if (l.__mi >= 0 && curveObj) curveObj.geometry.attributes.position.array.fill(0, l.__mi * CURVE_SEG * 6, (l.__mi + 1) * CURVE_SEG * 6);
                continue;
            }
            if (l.__mi >= 0 && curveObj) { pos[k] = pos[k + 3] = D[ia]; pos[k + 1] = pos[k + 4] = D[ia + 1]; pos[k + 2] = pos[k + 5] = D[ia + 2]; writeCurve(l, li, ia, ib, D, colDirty, growing, tNow, fl, kl, bgc); continue; }
            pos[k] = D[ia]; pos[k + 1] = D[ia + 1]; pos[k + 2] = D[ia + 2]; pos[k + 3] = D[ib]; pos[k + 4] = D[ib + 1]; pos[k + 5] = D[ib + 2];
            if (colDirty) {
                const g = growing ? linkGrow(a, b, tNow) : 1;
                for (let z = 0; z < 6; z++) col[k + z] = (linkCol[k + z] || 0) * g; // без NaN: он размазался бы свечением в чёрный прямоугольник
                if (fl && !fl.has(l)) for (let z = 0; z < 6; z++) col[k + z] += ((z % 3 === 0 ? bgc.r : z % 3 === 1 ? bgc.g : bgc.b) - col[k + z]) * kl;
            }
        }
        if (curveObj) {
            const cg = curveObj.geometry, cn = cg.drawRange.count * 3;
            const cp = cg.attributes.position; cp.clearUpdateRanges(); cp.addUpdateRange(0, cn); cp.needsUpdate = true;
            if (colDirty) { const cc = cg.attributes.color; cc.clearUpdateRanges(); cc.addUpdateRange(0, cn); cc.needsUpdate = true; }
        }
        const geo = linesObj.geometry, n = Lk.length * 6;
        geo.setDrawRange(0, Lk.length * 2);
        const at = geo.attributes.position; at.clearUpdateRanges(); at.addUpdateRange(0, n); at.needsUpdate = true;
        if (colDirty) { const ac = geo.attributes.color; ac.clearUpdateRanges(); ac.addUpdateRange(0, n); ac.needsUpdate = true; }
        // Много выделенных связей (их не рисует библиотека) - свой слой поверх общего буфера со своей непрозрачностью:
        // в плотном графе общий буфер почти прозрачен (denseDim)
        if (fl && fl.size > HL_LIB_MAX && !growing) syncHlLines(Lk, D, fl, fv);
        else if (hlLinesObj) hlLinesObj.visible = false;
    }
    // 3. Оболочки и электроны - только у видимых узлов
    if (cz.rings) {
        let j = 0;
        for (const d of cz.ringDefs) {
            const i = d.n.__i; d.vis = !!nodeVis[i] && R[i] > 0; if (!d.vis) continue;
            const r = R[i] * d.k;
            _q.copy(d.q).multiply(_q2.setFromAxisAngle(_yAxis, d.phase + t * d.speed));
            _mat4.compose(_v.set(D[i * 3], D[i * 3 + 1], D[i * 3 + 2]), _q, _s.set(r, r, r));
            cz.rings.setMatrixAt(j, _mat4); _col.setRGB(d.col[0], d.col[1], d.col[2]); cz.rings.setColorAt(j, _col); j++;
            d._q.copy(_q); d._r = r;
        }
        cz.rings.count = j; cz.rings.instanceMatrix.needsUpdate = true; if (cz.rings.instanceColor) cz.rings.instanceColor.needsUpdate = true;
    }
    if (cz.electrons) {
        const pos = cz.electrons.geometry.attributes.position.array, col = cz.electrons.geometry.attributes.color.array; let j = 0;
        for (const e of cz.elDefs) {
            const d = e.d; if (!d.vis) continue;
            const i = d.n.__i, a = e.phase + t * e.speed;
            _v.set(Math.cos(a) * d._r, Math.sin(a) * d._r, 0).applyQuaternion(d._q);
            pos[j * 3] = D[i * 3] + _v.x; pos[j * 3 + 1] = D[i * 3 + 1] + _v.y; pos[j * 3 + 2] = D[i * 3 + 2] + _v.z;
            col[j * 3] = e.col[0]; col[j * 3 + 1] = e.col[1]; col[j * 3 + 2] = e.col[2]; j++;
        }
        cz.electrons.geometry.setDrawRange(0, j);
        cz.electrons.geometry.attributes.position.needsUpdate = true; cz.electrons.geometry.attributes.color.needsUpdate = true;
    }
    // 4. Импульсы
    const far = lastFitDist ? orbit.deff / lastFitDist : 1;
    const ambientGoal = vis.pulses && !selId ? Math.max(0, Math.min(1, 1 - (far - 1.4) / 0.9)) : 0;
    cz.pv += (ambientGoal - cz.pv) * Math.min(1, dt * 3);
    if (cz.pv < 0.003 && ambientGoal === 0) cz.pv = 0;
    emitPulses(cz.pulses, D, t, cz.pv * anim.ts, li => linkVis[li], null, dt);
    emitPulses(cz.hlPulses, D, t, selId && vis.particles && !hlHeld ? anim.ts * fv : 0, li => linkVis[li] && hlLinks.has(Lk[li]), li => {
        const out = (Lk[li].source.id || Lk[li].source) === selId; return out ? colorCache['--hl'] : colorCache['--s1'];
    });
}
// Импульсы на видимых связях: vis.pulseRate в секунду на связь, постоянная скорость, затухание у концов
const _pc = new THREE.Color();
// Бюджет точек импульсов: на огромных графах их понадобились бы сотни тысяч. Сверх бюджета импульсы идут
// по постоянной части связей
const PULSE_BUDGET = 30000;
function emitPulses(obj, D, t, gain, accept, colorFn, dt) {
    if (!obj) return;
    if (gain <= 0.001) { obj.geometry.setDrawRange(0, 0); return; }
    const Lk = gdata.links, speed = Math.max(1, vis.pulseSpeed), period = 1 / Math.max(0.05, vis.pulseRate), step = speed * period;
    // Доля связей с импульсами - по оценке прошлого кадра (сколько точек понадобилось бы всем связям). Она меняется
    // плавно (набор видимых связей зависит от камеры), а у порога доли импульсы связи плавно гаснут
    const goal = Math.min(1, PULSE_BUDGET / Math.max(1, obj.__need || 0));
    obj.__frac = obj.__frac == null ? goal : obj.__frac + (goal - obj.__frac) * Math.min(1, (dt || 0.016) * 1.5);
    if (goal === 1 && obj.__frac > 0.995) obj.__frac = 1;
    const frac = obj.__frac;
    ensurePointsCapacity(obj, Math.min(obj.__need || 0, PULSE_BUDGET * 1.3) + 64);
    const pos = obj.geometry.attributes.position.array, col = obj.geometry.attributes.color.array, cap = obj.geometry.attributes.position.count;
    let j = 0, need = 0;
    for (let li = 0; li < Lk.length; li++) {
        if (!accept(li)) continue;
        const a = Lk[li].source, b = Lk[li].target, ia = a.__i * 3, ib = b.__i * 3;
        const dx = D[ib] - D[ia], dy = D[ib + 1] - D[ia + 1], dz = D[ib + 2] - D[ia + 2], curved = Lk[li].__mi >= 0 && !!curveObj; // встречная - по дуге
        const len = Math.hypot(dx, dy, dz); if (len < 1) continue;
        need += Math.ceil(len / step) + 1;
        const edge = frac >= 1 ? 1 : Math.min(1, (frac - pulsePhase[li]) / 0.08);
        if (edge <= 0 || j + len / step + 2 > cap) continue;
        let cr, cg, cb;
        if (colorFn) { _pc.set(colorFn(li)).lerp(_white, 0.25); cr = _pc.r; cg = _pc.g; cb = _pc.b; } else {
            const kd = selFade.v > 0 && selFade.hlL && !selFade.hlL.has(Lk[li]) ? 1 - selFade.v * 0.95 : 1;
            cr = pulseBase[li * 3] * kd; cg = pulseBase[li * 3 + 1] * kd; cb = pulseBase[li * 3 + 2] * kd;
        }
        const fade = Math.min(10, len / 3);
        // Расстояние первого импульса от начала связи; следующие - через speed * period
        for (let s = ((t / period + pulsePhase[li]) % 1) * step; s < len; s += step) {
            if (pulseGaps.length && bornInGap(t - s / speed)) continue; // родился бы во время паузы
            const k = Math.min(1, s / fade, (len - s) / fade) * gain * edge, f = s / len;
            if (curved) { const w0 = (1 - f) * (1 - f), w1 = 2 * (1 - f) * f, w2 = f * f; pos[j * 3] = w0 * D[ia] + w1 * mutCP[li * 3] + w2 * D[ib]; pos[j * 3 + 1] = w0 * D[ia + 1] + w1 * mutCP[li * 3 + 1] + w2 * D[ib + 1]; pos[j * 3 + 2] = w0 * D[ia + 2] + w1 * mutCP[li * 3 + 2] + w2 * D[ib + 2]; }
            else { pos[j * 3] = D[ia] + dx * f; pos[j * 3 + 1] = D[ia + 1] + dy * f; pos[j * 3 + 2] = D[ia + 2] + dz * f; }
            col[j * 3] = cr * k; col[j * 3 + 1] = cg * k; col[j * 3 + 2] = cb * k; j++;
        }
    }
    obj.__need = need;
    const g = obj.geometry; g.setDrawRange(0, j);
    for (const at of [g.attributes.position, g.attributes.color]) { at.clearUpdateRanges(); at.addUpdateRange(0, j * 3); at.needsUpdate = true; }
}


// Стрелки выделенных связей: стоят ближе к цели, но не упираются в узел; при множестве связей мельче
function arrowLen(l) {
    if (!vis.arrows || l.kind === 'tree') return 0;
    const n = hlLinks.size;
    return n > 80 ? 0 : n > 30 ? 2.2 : 3;
}
// Какая видеокарта рисует сайт. Браузер на ноутбуке/ПК с двумя видеокартами часто берёт встроенную -
// тогда сам сайт тратит на кадр пару миллисекунд, а FPS низкий: не успевает видеокарта
const gpu = { name: '', kind: 'unknown', warned: false, lowSince: 0 };
function detectGpu() {
    try {
        const gl = G.renderer().getContext(), ext = gl.getExtension('WEBGL_debug_renderer_info');
        let raw = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
        raw = String(raw || '');
        // «ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 …)» → «NVIDIA GeForce RTX 4060»
        const m = /ANGLE \(([^,]+),\s*(.+?)(?:\s*\(0x[0-9a-f]+\))?(?:\s+Direct3D|\s+OpenGL|\s+Vulkan|,|\)$)/i.exec(raw);
        gpu.name = (m ? m[2] : raw).trim();
        gpu.kind = /SwiftShader|llvmpipe|Basic Render|Software/i.test(raw) ? 'software'
            : /NVIDIA|GeForce|RTX|GTX|Quadro|Radeon RX|Radeon Pro|Arc A\d/i.test(raw) ? 'discrete'
            : /Intel|UHD|Iris|Radeon\(TM\) Graphics|Radeon Graphics|Vega \d+|Adreno|Mali/i.test(raw) ? 'integrated' : 'unknown';
    } catch { /* без сведений о видеокарте */ }
}


// Раскладка считается в отдельном потоке: на больших графах шаг физики занимает десятки миллисекунд и не должен
// мешать камере и отрисовке. Поток шлёт позиции ~60 раз в секунду, основной поток только переносит их
const PHYS_WORKER_SRC = `
import { forceSimulation, forceManyBody, forceLink, forceCollide, forceY, forceRadial } from 'https://cdn.jsdelivr.net/npm/d3-force-3d@3.0.5/+esm';
let sim = null, nodes = [], gen = 0, cfg = {}, t0 = 0, softUntil = 0, running = false, timer = 0, pinAlpha = 0;
// Мягкий старт: трение плавно спадает от SOFT к обычному. Остановка: когда узлы SLOW_TICKS шагов подряд движутся
// медленнее порога (STILL от размера графа × ползунок «Порог остановки») или сила раскладки иссякла - трение за FADE
// шагов плавно (по S-кривой) растёт до 1, узлы тормозят до нуля.
// Остывание: в самом конце (сила ниже COOL_AT) трение подрастает до COOL - плотный ком не колышется, как капля
const SOFT = 0.88, FADE = 60, STILL = 1.5e-4, COOL_AT = 0.05, COOL = 0.5, SLOW_TICKS = 30, MOVE_EPS = 0.02;
let maxV = 0, idlePosts = 0;
let softFrom = 0, fade = 0, ticks = 0, still = 0.01, slow = 0, chgK = new Float32Array(0), radA = null;
// Слабая гравитация к центру - как в основном потоке
function gravity() { let ns = []; const f = a => { const k = cfg.gravity; if (!k) return; for (const n of ns) { n.vx -= n.x * k * a; n.vy -= n.y * k * a; n.vz -= n.z * k * a; } }; f.initialize = x => (ns = x); return f; }


function post(type) {
    const a = new Float32Array(nodes.length * 3);
    for (let i = 0; i < nodes.length; i++) { const n = nodes[i]; a[i * 3] = n.x; a[i * 3 + 1] = n.y; a[i * 3 + 2] = n.z; }
    postMessage({ type, gen, pos: a }, [a.buffer]);
}


function decayNow(t) {
    const c = Math.max(0, 1 - (sim ? sim.alpha() : 1) / COOL_AT), base = cfg.decay + Math.max(0, COOL - cfg.decay) * c * c;
    if (fade) { const k = Math.min(1, fade / FADE); return base + (1 - base) * k * k * (3 - 2 * k); }
    if (!softUntil) return base;
    const k = Math.min(1, (t - softFrom) / Math.max(1, softUntil - softFrom));
    if (k >= 1) { softUntil = 0; return base; }
    return SOFT + (base - SOFT) * k * k * (3 - 2 * k);
}


// Разведение пересечений по позициям (сетка ячеек): столкновения в силах иногда проигрывают сильным связям, а в конце
// трение замораживало узлы внутри друг друга. Во время торможения и после остановки пары раздвигаются напрямую
function separate(iters) {
    if (!radA || radA.length !== nodes.length) return;
    let maxR = 0; for (let i = 0; i < nodes.length; i++) maxR = Math.max(maxR, radA[i]);
    const cell = Math.max(1, maxR * 2), key = (x, y, z) => ((x + 4096) * 8192 + (y + 4096)) * 8192 + (z + 4096);
    for (let it = 0; it < iters; it++) {
        const grid = new Map();
        for (let i = 0; i < nodes.length; i++) { const n = nodes[i], k = key(Math.floor(n.x / cell), Math.floor(n.y / cell), Math.floor(n.z / cell)); let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(i); }
        let moved = 0;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i], gx = Math.floor(a.x / cell), gy = Math.floor(a.y / cell), gz = Math.floor(a.z / cell);
            for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
                const list = grid.get(key(gx + dx, gy + dy, gz + dz)); if (!list) continue;
                for (const j of list) {
                    if (j <= i) continue;
                    const b = nodes[j], min = radA[i] + radA[j];
                    let vx = b.x - a.x, vy = b.y - a.y, vz = b.z - a.z, d = Math.hypot(vx, vy, vz);
                    if (d >= min) continue;
                    if (d < 1e-6) { vx = Math.random() - 0.5; vy = Math.random() - 0.5; vz = Math.random() - 0.5; d = Math.hypot(vx, vy, vz); }
                    const fa = a.fx != null, fb = b.fx != null; if (fa && fb) continue;
                    const push = (min - d) / d, ka = fa ? 0 : fb ? 1 : 0.5, kb = fb ? 0 : fa ? 1 : 0.5;
                    a.x -= vx * push * ka; a.y -= vy * push * ka; a.z -= vz * push * ka;
                    b.x += vx * push * kb; b.y += vy * push * kb; b.z += vz * push * kb; moved++;
                }
            }
        }
        if (!moved) break;
    }
}


function meanSpeed() {
    let v = 0; maxV = 0;
    for (const n of nodes) { const s = Math.abs(n.vx) + Math.abs(n.vy) + Math.abs(n.vz); v += s; if (s > maxV) maxV = s; }
    return v / Math.max(1, nodes.length);
}


function rmsRadius() { let r = 0; for (const n of nodes) r += n.x * n.x + n.y * n.y + n.z * n.z; return Math.sqrt(r / Math.max(1, nodes.length)); }


function loop() {
    timer = 0; if (!running) return;
    const t = performance.now();
    if (fade) fade++;
    sim.velocityDecay(decayNow(t));
    sim.tick(); ticks++;
    if (fade && fade % 3 === 0) separate(1);
    if (fade > FADE) { separate(6); running = false; post('end'); return; }
    if (ticks % 30 === 1) still = Math.max(0.005, rmsRadius() * STILL * (cfg.stopK == null ? 1 : cfg.stopK));
    const ms = meanSpeed();
    if (!fade && !softUntil) {
        slow = cfg.stopK > 0 && ticks > 60 && ms < still ? slow + 1 : 0;
        if (slow >= SLOW_TICKS || sim.alpha() < sim.alphaMin() || t - t0 > cfg.cooldown) fade = 1;
    }
    // Узлы не сдвинулись заметно - позиции не шлём (основной поток не пересчитывает кадр впустую), изредка - для верности
    if (maxV > MOVE_EPS || ++idlePosts >= 20) { idlePosts = 0; post('pos'); }
    timer = setTimeout(loop, Math.max(0, 16 - (performance.now() - t)));
}


function go() { running = true; t0 = performance.now(); if (!timer) timer = setTimeout(loop, 0); }


function applyCfg() {
    sim.force('charge').strength((n, i) => cfg.charge * (chgK[i] || 1));
    sim.velocityDecay(decayNow(performance.now())).alphaDecay(cfg.alphaDecay);
}
onmessage = e => {
    const m = e.data;
    if (m.type === 'start') {
        running = false; pinAlpha = 0; if (timer) { clearTimeout(timer); timer = 0; }
        gen = m.gen; cfg = m.cfg;
        nodes = new Array(m.n);
        for (let i = 0; i < m.n; i++) {
            const n = { index: i };
            const x = m.pos[i * 3];
            if (x === x) { n.x = x; n.y = m.pos[i * 3 + 1]; n.z = m.pos[i * 3 + 2]; }
            if (m.fixed[i]) { n.fx = n.x; n.fy = n.y; n.fz = n.z; }
            nodes[i] = n;
        }
        const links = []; for (let i = 0; i < m.links.length; i += 2) links.push({ source: m.links[i], target: m.links[i + 1] });
        softFrom = performance.now(); softUntil = cfg.soft ? softFrom + cfg.soft : 0; fade = 0; ticks = 0; slow = 0; chgK = m.chg; radA = m.rad;
        // Отталкивание по Барнсу-Хату: на больших графах грубее (theta больше) - шаг заметно быстрее, вид тот же.
        // Столкновения: узлы не входят друг в друга сферами
        sim = forceSimulation(nodes, 3).stop()
            .force('charge', forceManyBody().theta(m.n > 3000 ? 1.2 : 0.9))
            .force('link', forceLink(links).distance((l, i) => m.dist[i]).strength((l, i) => m.str[i]))
            .force('gravity', gravity())
            .force('collide', forceCollide((n, i) => radA[i]).strength(1).iterations(m.n > 3000 ? 2 : 3));
        // Дерево и радиально - мягкие силы к уровню (высота или радиус сферы), а не жёсткая фиксация: переходы между
        // раскладками плавные, а остальные силы (столкновения, связи) продолжают работать
        if (cfg.layout === 'td') sim.force('level', forceY((n, i) => m.lv[i]).strength(1));
        else if (cfg.layout === 'radial') sim.force('level', forceRadial((n, i) => m.lv[i]).strength(1));
        applyCfg();
        // Прогрев - не дольше 150 мс: на огромном виде шаг тяжёлый, а граф должен появиться сразу; дальше он
        // разворачивается на глазах
        const tw = performance.now();
        for (let i = 0; i < (cfg.warmup || 0) && performance.now() - tw < 150; i++) sim.tick();
        post('pos');
        go();
    } else if (!sim) return;
    else if (m.type === 'params') { Object.assign(cfg, m.cfg); applyCfg(); }
    else if (m.type === 'radii') { const r = m.rad; radA = r; sim.force('collide').radius((n, i) => r[i]); }
    else if (m.type === 'reheat') {
        if (m.cooldown) cfg.cooldown = m.cooldown;
        if (m.alphaDecay) { cfg.alphaDecay = m.alphaDecay; softUntil = 0; applyCfg(); }
        // Продолжение после паузы - с того же места раскладки, а не новый «взрыв» с полной силой
        // (узлы после паузы стоят - короткий мягкий разгон с сильным трением, чтобы не сорвались с места)
        fade = 0; ticks = 0; slow = 0;
        if (m.resume) { if (pinAlpha < sim.alphaMin()) { post('end'); return; } sim.alpha(pinAlpha); softFrom = performance.now(); softUntil = softFrom + 1000; applyCfg(); } else sim.alpha(m.alpha || 1);
        go();
    }
    else if (m.type === 'pin') { pinAlpha = running ? sim.alpha() : 0; running = false; for (const n of nodes) { n.fx = n.x; n.fy = n.y; n.fz = n.z; n.vx = n.vy = n.vz = 0; } post('end'); }
    else if (m.type === 'unpin') { for (const n of nodes) { n.fx = n.fy = n.fz = undefined; } }
    else if (m.type === 'stop') { running = false; }
};
`;
const physics = { worker: null, ok: typeof Worker !== 'undefined', active: false, gen: 0, startedGen: -1, growShift: null, lastLabels: 0 };
// Все раскладки (силы, дерево, радиально) считает поток; библиотека - только если поток не запустился
const workerLayout = () => physics.ok && !!viewOpts[curView];
function physicsWorker() {
    if (physics.worker || !physics.ok) return physics.worker;
    try {
        // Страница, открытая как файл (file://), не может создать поток из blob-адреса («cross-origin redirects of the
        // top-level worker script») - там поток из data:-адреса; не вышло и так - раскладка уходит в основной поток
        const url = location.protocol === 'file:' ? 'data:text/javascript;charset=utf-8,' + encodeURIComponent(PHYS_WORKER_SRC)
            : URL.createObjectURL(new Blob([PHYS_WORKER_SRC], { type: 'text/javascript' }));
        physics.worker = new Worker(url, { type: 'module' });
        physics.worker.onmessage = onPhysicsMessage;
        // Поток не поднялся (нет модулей в воркерах, CDN недоступен) - раскладка возвращается в основной поток
        physics.worker.onerror = e => { console.warn('physics worker', e.message || e); physicsFallback(); };
    } catch (err) { console.warn('physics worker', err); physics.ok = false; }
    return physics.worker;
}


// Затухание раскладки: полная - около 600 шагов (на 60 шагах в секунду ~10 с), чтобы граф успел разрастись и
// распределиться; мягкая доводка после фильтра - быстрая. Остановку по времени держим лишь как страховку
const ALPHA_FULL = 0.0115, ALPHA_GENTLE = 0.03, COOL_FULL = 60000, COOL_GENTLE = 30000;
function physicsFallback() {
    if (!physics.ok) return;
    physics.ok = false; physics.active = false; releaseGrowth();
    if (physics.worker) { try { physics.worker.terminate(); } catch { /* */ } physics.worker = null; }
    if (!G || !gdata.nodes.length) return;
    applyPhysics();
    G.cooldownTime(COOL_FULL).cooldownTicks(Infinity).d3AlphaDecay(ALPHA_FULL).d3VelocityDecay(vis.decay);
    reheat();
}


// Параметры сил - те же, что задаются библиотеке в applyPhysics
function physicsCfg() {
    const N = gdata.nodes.length;
    return {
        charge: (N > 1500 ? -25 : N > 500 ? -45 : -80) * vis.charge,
        gravity: vis.gravity > 0 ? (N > 500 ? 0.03 : 0.05) * vis.gravity : 0,
        decay: vis.decay, stopK: vis.stopAt,
        layout: { td: 'td', radialout: 'radial' }[viewOpts[curView].layout] || 'force',
    };
}


// Уровни для дерева и радиальной раскладки: обход в ширину от корней (узлов без входящих связей); узлы в циклах -
// от самых связанных непройденных, на уровень ниже их уже пройденных предков. Цель - высота (дерево) или радиус сферы
function levelTargets(lay) {
    const ns = gdata.nodes, N = ns.length, idx = new Map(ns.map((n, i) => [n.id, i])), lvl = new Int32Array(N).fill(-1);
    const end = l => idx.get(l.target.id || l.target), start = l => idx.get(l.source.id || l.source);
    let q = [];
    const bfs = () => { for (let h = 0; h < q.length; h++) { const i = q[h]; for (const l of adj.out.get(ns[i].id) || []) { const j = end(l); if (j != null && lvl[j] < 0) { lvl[j] = lvl[i] + 1; q.push(j); } } } q = []; };
    ns.forEach((n, i) => { if (!(adj.inn.get(n.id) || []).length) { lvl[i] = 0; q.push(i); } });
    bfs();
    const rest = [...ns.keys()].filter(i => lvl[i] < 0).sort((a, b) => (adj.out.get(ns[b].id) || []).length - (adj.out.get(ns[a].id) || []).length);
    for (const i of rest) {
        if (lvl[i] >= 0) continue;
        let p = -1; for (const l of adj.inn.get(ns[i].id) || []) { const j = start(l); if (j != null && lvl[j] > p) p = lvl[j]; }
        lvl[i] = p + 1; q.push(i); bfs();
    }
    let maxL = 0; for (let i = 0; i < N; i++) maxL = Math.max(maxL, lvl[i]);
    const dist = (N > 400 ? 40 : 50) * vis.dagDist * Math.max(1, Math.sqrt(N) / 15);
    // Радиально: корни - на своей сфере, а не в центре (иначе никем не вызываемые функции сбиваются в яркий ком)
    return Float32Array.from(lvl, v => lay === 'radial' ? (v + 0.8) * dist * 1.3 : (maxL / 2 - v) * dist * 1.4);
}


// Радиус столкновения: сфера узла с запасом на «тепловое дрожание» - узлы не пересекаются даже при дрожании
const collideRadius = n => { const r = nodeRadius(n); return r * 1.08 + 1 + vis.wobble * (0.35 + r * 0.06); };


// Новые размеры узлов (ползунок размера, «размер по», дрожание) - в раскладку, чтобы сразу растолкнуть пересёкшиеся
function physicsRadii() {
    if (!G || !gdata.nodes.length) return;
    if (paused) return; // на паузе узлы закреплены - раздвинутся после «продолжить»
    if (workerLayout() && physics.startedGen === physics.gen) {
        physicsSend('radii', { rad: Float32Array.from(gdata.nodes, collideRadius) });
        physicsSend('reheat', { cooldown: COOL_FULL, alphaDecay: ALPHA_GENTLE, alpha: 0.3 }); physics.active = true; engineActive = true; requestRender();
        return;
    }
    if (!workerLayout() && G.d3Force('collide')) G.d3Force('collide').radius(collideRadius);
    reheat();
}


function physicsStart(opts) {
    const w = physicsWorker(); if (!w) return false;
    const ns = gdata.nodes, N = ns.length, idx = new Map(ns.map((n, i) => [n.id, i]));
    const pos = new Float32Array(N * 3), fixed = new Uint8Array(N), rad = new Float32Array(N);
    ns.forEach((n, i) => {
        const sd = n.x == null && n.__seed; // узел без места - на место из seedPositions (иначе d3 поставит его на решётку)
        pos[i * 3] = sd ? sd[0] : n.x == null ? NaN : n.x; pos[i * 3 + 1] = sd ? sd[1] : n.y == null ? NaN : n.y; pos[i * 3 + 2] = sd ? sd[2] : n.z == null ? NaN : (n.z || 0);
        fixed[i] = n.fx != null ? 1 : 0;
        rad[i] = collideRadius(n);
    });
    const deg = id => { const a = adj.inn.get(id), b = adj.out.get(id); return (a ? a.length : 0) + (b ? b.length : 0) || 1; };
    const L = gdata.links, links = new Int32Array(L.length * 2), dist = new Float32Array(L.length), str = new Float32Array(L.length);
    // Плотность: у узла с сотней связей и в графе «все со всеми» связи длиннее, а отталкивание сильнее, чтобы такие
    // места не слипались в ком. Степень - под корнем, чтобы хабы не разлетались слишком далеко
    const dens = Math.max(1, Math.sqrt(L.length / Math.max(1, N)) / 1.3), hier = viewOpts[curView].layout !== 'force' && curView !== 'dirs' ? 0.3 : 1;
    const chg = Float32Array.from(ns, n => dens * (1 + Math.sqrt(deg(n.id)) * 0.2));
    L.forEach((l, i) => {
        const s = l.source.id || l.source, t = l.target.id || l.target;
        links[i * 2] = idx.get(s); links[i * 2 + 1] = idx.get(t);
        dist[i] = (l.kind === 'tree' ? 18 : l.kind === 'decl' || l.kind === 'def' ? 16 : 32) * vis.linkDist * (1 + Math.sqrt(deg(s) + deg(t)) * 0.12) * Math.sqrt(dens);
        str[i] = hier / Math.min(deg(s), deg(t)); // в дереве и радиально связи мягче - уровни расходятся
    });
    physics.gen++; physics.startedGen = physics.gen; physics.active = true; engineActive = true;
    const cfg = Object.assign(physicsCfg(), { alphaDecay: opts.alphaDecay || ALPHA_FULL, cooldown: opts.cooldown || COOL_FULL, warmup: opts.warmup || 0, soft: opts.soft || 0 });
    const lv = cfg.layout === 'force' ? new Float32Array(0) : levelTargets(cfg.layout);
    w.postMessage({ type: 'start', gen: physics.gen, n: N, pos, fixed, rad, links, dist, str, lv, chg, cfg }, [pos.buffer, fixed.buffer, rad.buffer, links.buffer, dist.buffer, str.buffer, lv.buffer, chg.buffer]);
    return true;
}


function physicsSend(type, extra) { if (physics.worker) physics.worker.postMessage(Object.assign({ type }, extra || {})); }


// Отложенный до первых позиций рост начинается сейчас. Волна - пространственная: шар, расширяющийся от «главного»
// узла (узел вырастает, когда фронт доходит до его места), поэтому видимая часть графа всегда компактна.
// Без позиций - волна по обходу связей, сдвинутая во времени
function releaseGrowth() {
    if (physics.growShift == null) return;
    const now = performance.now() / 1000, ns = gdata.nodes, N = ns.length, root = growOrder && growOrder.length ? growOrder[0] : -1;
    if (root < 0 || ns.some(n => n.x == null)) {
        const d = now - physics.growShift; physics.growShift = null;
        for (const n of ns) if (n.__born != null) n.__born += d;
        growUntil += d; return;
    }
    physics.growShift = null;
    const r = ns[root], dist = Float64Array.from(ns, n => Math.hypot(n.x - r.x, n.y - r.y, (n.z || 0) - (r.z || 0)));
    let dmax = 1; for (const d of dist) if (d > dmax) dmax = d;
    const t0 = now + 0.05, total = N < 50 ? 0.8 : N < 300 ? 1.4 : 1.9;
    // Узел выезжает из «главного» на небольшую долю пути (GROW_TRAVEL) - лёгкий радиальный «взрыв»
    ns.forEach((n, i) => { n.__born = t0 + total * Math.pow(dist[i] / dmax, 0.8); n.__par = i === root ? -1 : root; });
    growOrder = Int32Array.from([root, ...[...Array(N).keys()].filter(i => i !== root)]);
    growUntil = t0 + total + GROW_DUR;
}


function physicsStop() { if (physics.active) physicsSend('stop'); physics.active = false; }


// Сглаживание позиций из потока: поток присылает их неравномерно (перегружен - реже и рывками), а кадры идут чаще.
// Каждый кадр узел проходит долю оставшегося пути к последней присланной позиции (экспонента с постоянной времени
// порядка интервала между сообщениями): движение не замирает между сообщениями, а новое сообщение меняет только
// направление, без скачка. Отставание - примерно один интервал. Первое сообщение раскладки - сразу на место
const pinterp = { next: null, dur: 50, last: 0, gen: -1, active: false, t: 0 };
function onPhysicsMessage(e) {
    const m = e.data;
    if (m.gen !== physics.gen) return; // ответ для прежнего вида
    const ns = gdata.nodes, a = m.pos, N = ns.length, now0 = performance.now(), P = pinterp;
    if (a.length !== N * 3) return;
    if (P.gen !== m.gen || !P.next || P.next.length !== N * 3 || REDUCED_MOTION.matches) {
        for (let i = 0; i < N; i++) { const n = ns[i]; n.x = a[i * 3]; n.y = a[i * 3 + 1]; n.z = a[i * 3 + 2]; }
        P.next = new Float32Array(a); P.gen = m.gen; P.active = false; P.last = now0;
    } else {
        // Средний интервал между сообщениями (не короче кадра и не длиннее четверти секунды)
        P.dur = Math.max(16, Math.min(250, P.dur * 0.8 + (now0 - P.last) * 0.2)); P.last = now0;
        P.next.set(a); if (!P.active) { P.active = true; P.t = now0; }
    }
    for (const n of ns) n.vx = n.vy = n.vz = 0; // библиотека сама узлы не двигает
    // Рост узлов начинается, когда пришли первые позиции (до этого рост «отложен» далеко в будущее)
    releaseGrowth();
    if (fitDeferred) fitView(fitDeferred === 'snap' ? true : undefined);
    posDirty = true; requestRender();
    // Ближайшие к камере узлы меняются, пока граф раскладывается
    const now = performance.now();
    if (now - physics.lastLabels > 500) { physics.lastLabels = now; scheduleLabels(100); }
    if (m.type === 'end') { physics.active = false; layoutStopped(); }
}


// Шаг сглаживания (каждый кадр, пока узлы едут к присланным позициям)
function physInterpStep(now) {
    const P = pinterp; if (!P.active) return;
    const ns = gdata.nodes, N = ns.length;
    if (!P.next || P.next.length !== N * 3 || P.gen !== physics.gen) { P.active = false; return; }
    const dt = Math.max(0, Math.min(250, now - P.t)); P.t = now;
    const k = 1 - Math.exp(-dt / (P.dur * 0.75)), B = P.next;
    let far = 0;
    for (let i = 0; i < N; i++) {
        const n = ns[i], o = i * 3, dx = B[o] - n.x, dy = B[o + 1] - n.y, dz = B[o + 2] - n.z;
        n.x += dx * k; n.y += dy * k; n.z += dz * k;
        const d = Math.abs(dx) + Math.abs(dy) + Math.abs(dz); if (d > far) far = d;
    }
    // Догнали (и новых позиций нет) - сглаживание засыпает до следующего сообщения
    if (far < 0.01) { for (let i = 0; i < N; i++) { const n = ns[i]; n.x = B[i * 3]; n.y = B[i * 3 + 1]; n.z = B[i * 3 + 2]; } P.active = false; }
    posDirty = true;
}


// Раскладка остановилась (поток или библиотека): камера подстраивается под граф, если её не трогали и ничего не выделено
function layoutStopped() {
    engineActive = false; posDirty = true; placeGrid();
    if (paused) { scheduleLabels(); return; } // пауза - не конец раскладки: подгонка камеры подождёт продолжения
    if (fitPending && !selId && (orbit.camInput || 0) <= fitStamp && !orbit.fly) fitView();
    fitPending = false; scheduleLabels();
}


function initGraph() {
    readColors();
    const el = $('#graph');
    G = ForceGraph3D({ controlType: 'orbit', rendererConfig: { antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true } })(el)
        .backgroundColor(colorCache['--graph-bg'])
        .showNavInfo(false)
        .enableNodeDrag(false)
        .enableNavigationControls(false)
        .enablePointerInteraction(false) // свой выбор узлов: без рейкаста по сцене каждый кадр
        .nodeVisibility(false)           // узлы рисует общий InstancedMesh
        .nodeRelSize(3.2 * vis.nodeSize)
        .nodeVal(nodeValLib)
        // Библиотека рисует только выделенные связи (толще, со стрелками и частицами), остальные - общий буфер
        .linkVisibility(l => !!selId && !isGrowing() && hlLinks.size <= HL_LIB_MAX && hlLinks.has(l))
        .linkColor(hlLinkColor)
        .linkOpacity(0.9)
        .linkWidth(0.3)
        .linkResolution(8)
        .linkDirectionalArrowLength(arrowLen)
        .linkDirectionalArrowRelPos(0.62)
        .linkCurvature(l => (l.__mutual ? CURVE_K : 0))
        .linkDirectionalArrowColor(hlLinkColor)
        .linkDirectionalParticles(0) // импульсы выделения рисуем сами (rebuildHlPulses)
        .onEngineTick(() => {
            if (workerLayout()) return; // раскладку считает поток - библиотека лишь переносит позиции в свои объекты
            posDirty = true;
            if (fitDeferred && gdata.nodes.some(n => n.x != null)) fitView(fitDeferred === 'snap' ? true : undefined);
            libPhysicsTick();
        })
        .onEngineStop(() => { if (!workerLayout()) layoutStopped(); })
        .cooldownTime(COOL_FULL);
    G.pauseAnimation(); // кадры даёт orbitFrame - только когда нужно
    // Камерой управляет только orbit: встроенные OrbitControls библиотеки в каждом кадре делают camera.lookAt(target)
    // и срезают крен, поэтому они отключены
    { const ctr = G.controls(); if (ctr) { ctr.enabled = false; ctr.update = () => false; } }
    // Силы библиотеки - на случай иерархических раскладок (для «сил» их отключаем: считает поток)
    libForces = { charge: G.d3Force('charge'), link: G.d3Force('link') };
    if (G.onDagError) G.onDagError(() => { if (!dagWarned) { dagWarned = true; toast(t('dagCycle')); } });
    const ro = new ResizeObserver(() => syncGraphSize());
    ro.observe(el);
    bindOrbitInput(G.renderer().domElement);
    detectGpu();
    // Браузер рисует без видеокарты (SwiftShader, llvmpipe и т.п.) - всё будет медленным, предупреждаем сразу
    if (gpu.kind === 'software') toast(t('gpuSoftwareHint'), 15000);
    // Сбой видеокарты (драйвер, нехватка памяти): браузер забирает контекст WebGL и потом может вернуть - тогда
    // сцена (небо, свечение, буферы) строится заново
    const glCanvas = G.renderer().domElement;
    glCanvas.addEventListener('webglcontextlost', e => { e.preventDefault(); toast(t('glLost'), 12000); });
    glCanvas.addEventListener('webglcontextrestored', () => { applyStyle(); requestRender(); toast(t('glRestored'), 3000); });
    ensureLines();
    applyRenderScale();
    applyStyle();
}
let dagWarned = false, libForces = null, d3f = null;
// Размер холста - по контейнеру графа (во время записи ролика холст квадратный - подгонка после записи)
function syncGraphSize() {
    if (!G || videoRec) return;
    const el = $('#graph'), w = el.clientWidth, h = el.clientHeight;
    if (w < 2 || h < 2) return; // свёрнутое окно / скрытая вкладка - иначе у камеры aspect = NaN
    if (w !== G.width() || h !== G.height()) { G.width(w).height(h); G.postProcessingComposer().setSize(w, h); }
    requestRender();
}
import('https://cdn.jsdelivr.net/npm/d3-force-3d@3.0.5/+esm').then(m => { d3f = m; if (G && gdata.nodes.length && !workerLayout()) { applyPhysics(); reheat(); } }).catch(() => { /* без столкновений в иерархии */ });


function applyPhysics() {
    if (!G) return;
    const o = viewOpts[curView]; const N = gdata.nodes.length;
    const wl = workerLayout(), lay = wl || o.layout === 'force' ? null : o.layout;
    // Иерархия библиотеки - только запасной путь (поток не запустился). Радиально: шаг уровней растёт с числом узлов
    G.dagMode(lay).dagLevelDistance(lay ? (N > 400 ? 30 : 45) * vis.dagDist * (lay === 'radialout' ? Math.max(1, Math.sqrt(N) / 12) : 1) : null);
    dagEase.axis = lay === 'td' ? 'y' : null;
    if (wl) {
        // У библиотеки сил нет: её шаг только переносит позиции в объекты (выделенные связи и стрелки)
        for (const f of ['charge', 'link', 'center', 'gravity', 'collide']) G.d3Force(f, null);
        if (physics.active) physicsSend('params', { cfg: physicsCfg() });
        return;
    }
    if (!G.d3Force('dagEase')) G.d3Force('dagEase', dagEaseForce());
    if (libForces) { if (!G.d3Force('charge')) G.d3Force('charge', libForces.charge); if (!G.d3Force('link')) G.d3Force('link', libForces.link); }
    G.d3Force('charge').strength((N > 1500 ? -25 : N > 500 ? -45 : -80) * vis.charge);
    const lf = G.d3Force('link').distance(l => (l.kind === 'tree' ? 18 : l.kind === 'decl' || l.kind === 'def' ? 16 : 32) * vis.linkDist);
    // Сила связи как в d3 по умолчанию (1/min(степеней)), в иерархии - слабее, чтобы слои расходились
    const deg = id => { const a = adj.inn.get(id), b = adj.out.get(id); return (a ? a.length : 0) + (b ? b.length : 0) || 1; };
    const lk = lay && curView !== 'dirs' ? 0.09 : 1;
    lf.strength(l => lk / Math.min(deg(l.source.id || l.source), deg(l.target.id || l.target)));
    // Встроенная центровка библиотеки сдвигала весь граф разом, когда фильтр убирал часть узлов («мигание»);
    // граф к центру держит мягкая гравитация ниже
    G.d3Force('center', null);
    G.d3Force('gravity', lay || vis.gravity <= 0 ? null : gravityForce((N > 500 ? 0.03 : 0.05) * vis.gravity));
    G.d3Force('collide', d3f ? d3f.forceCollide(collideRadius).strength(1).iterations(N > 3000 ? 1 : 2) : null);
    G.d3Force('charge').theta(N > 3000 ? 1.2 : 0.9);
    G.d3VelocityDecay(vis.decay);
}


// Раскладка библиотеки ведёт себя как поток: трение плавно спадает после мягкого старта, а когда узлы почти
// не движутся - плавно растёт до 1, и раскладка останавливается сама, а не по таймауту
const SOFT_DECAY = 0.88, PHYS_FADE = 45, STILL_K = 1.5e-4;
const lib = { ticks: 0, fade: 0 };
function libPhysicsTick() {
    lib.ticks++;
    if (lib.fade) {
        lib.fade++;
        G.d3VelocityDecay(Math.min(1, vis.decay + (1 - vis.decay) * lib.fade / PHYS_FADE));
        if (lib.fade > PHYS_FADE) { lib.fade = 0; G.cooldownTicks(0); } // следующий шаг библиотеки остановит раскладку
        return;
    }
    if (softUntil) {
        const k = Math.min(1, (performance.now() - softFrom) / Math.max(1, softUntil - softFrom));
        G.d3VelocityDecay(SOFT_DECAY + (vis.decay - SOFT_DECAY) * k * k * (3 - 2 * k));
        if (k >= 1) softUntil = 0;
        return;
    }
    // Остывание (как в потоке): сила раскладки ~ (1 - затухание)^шаг; ниже 0.15 трение растёт до 0.6
    const c = Math.max(0, 1 - Math.pow(1 - ALPHA_FULL, lib.ticks) / 0.15);
    if (c > 0) G.d3VelocityDecay(vis.decay + Math.max(0, 0.6 - vis.decay) * c * c);
    if (lib.ticks < 40 || dagEase.t0) return;
    const ns = gdata.nodes; let v = 0, r = 0;
    for (const n of ns) { v += Math.abs(n.vx || 0) + Math.abs(n.vy || 0) + Math.abs(n.vz || 0); r += n.x * n.x + n.y * n.y + (n.z || 0) * (n.z || 0); }
    const N = Math.max(1, ns.length);
    if (v / N < Math.max(0.01, Math.sqrt(r / N) * STILL_K)) lib.fade = 1;
}


function libPhysicsRestart() { lib.ticks = 0; lib.fade = 0; G.cooldownTicks(Infinity); }


// resume - продолжение после паузы: поток продолжает с той силы, на которой остановился
function reheat(resume) {
    if (!G) return;
    if (workerLayout()) {
        // Поток уже считает этот вид - просто «встряхнуть»; иначе (пауза, снимок, другой вид) - начать заново с текущих мест
        if (physics.startedGen === physics.gen) { physicsSend('reheat', { cooldown: COOL_FULL, alphaDecay: ALPHA_FULL, resume: !!resume }); physics.active = true; }
        else physicsStart({ warmup: 0 });
        engineActive = true; requestRender(); return;
    }
    // после паузы - короткий мягкий разгон: узлы стоят, без него они срывались бы с места
    softFrom = performance.now(); softUntil = resume ? softFrom + 1000 : 0;
    libPhysicsRestart();
    G.cooldownTime(COOL_FULL).d3AlphaDecay(ALPHA_FULL).d3VelocityDecay(resume ? SOFT_DECAY : vis.decay);
    G.d3ReheatSimulation(); engineActive = true; requestRender();
}


// Снять закрепление узлов (пауза, снимок). В иерархической раскладке координата уровня остаётся закреплённой,
// чтобы после «продолжить» дерево не расползалось
function unpinNodes() {
    const fk = dagEase.axis && !workerLayout() ? 'f' + dagEase.axis : null;
    for (const n of gdata.nodes) { delete n.fx; delete n.fy; delete n.fz; if (fk && n.__dfix != null) n[fk] = n.__dfix; }
}


// Смена иерархической раскладки: библиотека сразу ставит узлам координату уровня (fx / fy). Эта «сила» запоминает
// цели уровней и первые DAG_EASE мс плавно ведёт закреплённую координату от старого места к цели
const DAG_EASE = 1200;
const dagEase = { axis: null, grab: false, t0: 0 };
function dagEaseForce() {
    let ns = [];
    const f = () => {
        const c = dagEase.axis; if (!c) return;
        const fk = 'f' + c;
        if (dagEase.grab) { dagEase.grab = false; for (const n of ns) { n.__dfix = n[fk]; n.__d0 = n[c]; } }
        if (!dagEase.t0 || paused) return;
        const p = Math.min(1, (performance.now() - dagEase.t0) / DAG_EASE), e = p * p * (3 - 2 * p);
        for (const n of ns) if (n.__dfix != null && n.__d0 != null) n[fk] = n.__d0 + (n.__dfix - n.__d0) * e;
        if (p >= 1) dagEase.t0 = 0;
    };
    f.initialize = x => (ns = x);
    return f;
}


function applyView(keepSel) {
    if (!model) return;
    const isStats = curView === 'stats';
    $('#stats').hidden = !isStats; $('#graph').style.visibility = isStats ? 'hidden' : ''; $('#labels').hidden = isStats;
    $('#gtools').hidden = isStats; $('#legend').hidden = isStats;
    // Панель настроек остаётся открытой при перестройке графа (закрывается только на «Статистике», где она не нужна)
    // Перерисовываем её только при смене вида (иначе фильтр/галочки пересобирали бы панель - дёргание и потеря фокуса)
    if (isStats) setShown($('#opts'), false); else if (isShown($('#opts')) && $('#opts').dataset.view !== curView) setTimeout(renderOpts, 0);
    if (isStats) { renderStats(true); closeDetails(); return; }
    const first = !G;
    if (!G) {
        try { initGraph(); } catch (err) { console.error(err); G = null; toast(t('noWebGL'), 20000); return; }
    }
    // Перестройка того же вида (опции, фильтр, обновление файлов) сохраняет позиции узлов и камеру
    const viewChanged = lastAppliedView !== curView || first; lastAppliedView = curView;
    // Другой проект или перечитанный тот же - после раскладки камера показывает граф целиком
    const modelChanged = lastAppliedModel !== model; lastAppliedModel = model;
    // Пауза держится, пока это тот же вид того же проекта (фильтр, опции); другой вид или проект - раскладка снова идёт
    if (paused && (viewChanged || modelChanged)) { paused = false; setPauseIcon(); setPulseSpawn(true); }
    const prevPos = new Map();
    if (!viewChanged) for (const n of gdata.nodes) if (n.x != null) prevPos.set(n.id, n);
    gdata = buildView(curView);
    adj = { out: new Map(), inn: new Map() };
    for (const n of gdata.nodes) { adj.out.set(n.id, []); adj.inn.set(n.id, []); }
    for (const l of gdata.links) { adj.out.get(l.source).push(l); adj.inn.get(l.target).push(l); }
    metricMax = calcMetricMax();
    const N = gdata.nodes.length;
    dagWarned = false;
    applyPhysics();
    // Предрасчёт раскладки до первого кадра - камера сразу видит почти готовый граф
    // Раскладка из снимка: узлы встают на сохранённые места и фиксируются (кнопка ▶ отпускает их)
    let restored = false;
    if (layoutRestore && layoutRestore.view === curView && layoutRestore.pos) {
        for (const n of gdata.nodes) { const p = layoutRestore.pos[n.id]; if (p) { n.x = n.fx = p[0]; n.y = n.fy = p[1]; n.z = n.fz = p[2]; restored = true; } }
        layoutRestore = null;
    }
    let reused = 0;
    if (!restored && prevPos.size) {
        // Узел остаётся на месте и с той же фазой дрожания - перестройка (фильтр, опции) не дёргает граф
        for (const n of gdata.nodes) { const p = prevPos.get(n.id); if (p) { n.x = p.x; n.y = p.y; n.z = p.z || 0; n.__w = p.__w; reused++; } }
        // Новые узлы появляются рядом с уже стоящим соседом, а не в центре; несколько проходов -
        // чтобы и цепочки новых узлов (сосед тоже новый) разворачивались от старых
        const byId = new Map(gdata.nodes.map(n => [n.id, n]));
        let placeSeq = 0;
        for (let pass = 0, placed = 1; pass < 8 && placed; pass++) {
            placed = 0;
            for (const n of gdata.nodes) {
                if (n.x != null) continue;
                let m = null;
                for (const l of [...(adj.out.get(n.id) || []), ...(adj.inn.get(n.id) || [])]) {
                    const ls = l.source.id || l.source, lt = l.target.id || l.target, o = byId.get(ls === n.id ? lt : ls);
                    if (o && o.x != null) { m = o; break; }
                }
                if (!m) continue;
                n.x = m.x + (Math.random() - 0.5) * 20; n.y = m.y + (Math.random() - 0.5) * 20; n.z = (m.z || 0) + (Math.random() - 0.5) * 20;
                n.__parId = m.id; n.__pord = ++placeSeq; placed++;
            }
        }
    }
    // Тот же вид - всегда «доводка» на месте (возвращённые фильтром узлы вырастают из соседей), иначе граф раскладывался бы заново
    const incremental = reused > 0 && (reused > gdata.nodes.length * 0.5 || !viewChanged);
    // Сменили раскладку - узлы начинают с текущих мест, но раскладка идёт полностью, а не короткой «доводкой»:
    // дерево должно успеть развернуться в «силы» (и наоборот)
    const relayout = relayoutNext; relayoutNext = false;
    const gentle = incremental && !relayout;
    // Первые секунды - сильное трение: при доводке узлы почти стоят, при смене раскладки граф перетекает в новую форму,
    // а не схлопывается за пару кадров (затем раскладка идёт с обычным трением)
    const soft = gentle ? 1500 : relayout ? 1800 : 0;
    if (relayout && !selId) {
        fitPending = true; fitStamp = performance.now();
        const g = physics.gen + 1, st = fitStamp; setTimeout(() => { if (physics.gen === g && !selId && !orbit.fly && (orbit.camInput || 0) <= st) fitView(); }, 1500);
    }
    dagEase.grab = true; dagEase.t0 = dagEase.axis && reused && !restored && !REDUCED_MOTION.matches ? performance.now() : 0;
    const warmup = restored || incremental ? 0 : N > 20000 ? 8 : N > 2000 ? 40 : N > 600 ? 80 : 120;
    const useWorker = workerLayout();
    if (useWorker) {
        // Библиотека без сил и без остановки: её шаг каждый кадр переносит позиции из потока в выделенные связи
        G.warmupTicks(0).cooldownTime(Infinity).cooldownTicks(Infinity).d3AlphaDecay(0.0228).d3VelocityDecay(0.4);
        softUntil = 0;
    } else {
        physicsStop();
        G.warmupTicks(warmup);
        G.cooldownTime(gentle ? COOL_GENTLE : COOL_FULL);
        // При перестройке раскладка только «доводится»: сильное трение первые секунды и быстрое затухание -
        // стоящие узлы плавно сдвигаются, а не прыгают (раскладка стартует с полной силой)
        G.d3AlphaDecay(gentle ? ALPHA_GENTLE : ALPHA_FULL);
        G.d3VelocityDecay(soft ? SOFT_DECAY : vis.decay);
        softFrom = performance.now(); softUntil = soft ? softFrom + soft : 0;
        libPhysicsRestart();
    }
    // Концы связей - сами узлы, а не их id: при раскладке в потоке у библиотеки нет силы связей, которая сделала бы
    // это сама, а общий буфер и выделенные связи берут координаты прямо из узлов
    { const byId = new Map(gdata.nodes.map(n => [n.id, n])); for (const l of gdata.links) { if (typeof l.source !== 'object') l.source = byId.get(l.source) || l.source; if (typeof l.target !== 'object') l.target = byId.get(l.target) || l.target; } }
    // Встречные связи (A → B и B → A) у выделенного узла рисуются дугами в разные стороны - иначе стрелки лежат на одной
    // линии и упираются друг в друга
    { const ids = l => [l.source.id || l.source, l.target.id || l.target]; const keys = new Set(gdata.links.map(l => ids(l).join('\u0000'))); for (const l of gdata.links) { const [a, b] = ids(l); l.__mutual = a !== b && keys.has(b + '\u0000' + a); } }
    G.graphData(gdata);
    engineActive = true;
    if (restored) { paused = true; setPauseIcon(); setPulseSpawn(false); }
    else if (paused) for (const n of gdata.nodes) if (n.x != null) { n.fx = n.x; n.fy = n.y; n.fz = n.z; } // на паузе узлы остаются закреплёнными
    // Появление: весь вид - волнами по связям; перестройка - растут только новые узлы (из соседа)
    const now = performance.now() / 1000;
    gdata.nodes.forEach((n, i) => { n.__i = i; n.__par = -1; n.__born = null; });
    growOrder = null; growUntil = 0;
    if (!REDUCED_MOTION.matches) {
        if (!incremental && !restored) { growOrder = planGrowth(gdata.nodes, now + 0.05); seedPositions(gdata.nodes, growOrder); }
        else if (incremental) {
            const idx = new Map(gdata.nodes.map((n, i) => [n.id, i]));
            for (const n of gdata.nodes) if (!prevPos.has(n.id)) { n.__born = now; const pi = n.__parId != null ? idx.get(n.__parId) : null; if (pi != null) n.__par = pi; }
            if (gdata.nodes.some(n => n.__born != null)) {
                growUntil = now + GROW_DUR;
                // Старые узлы - первыми, новые - в порядке размещения (родитель всегда раньше ребёнка)
                const key = n => (n.__born == null ? -1 : n.__pord || 1e9);
                growOrder = Int32Array.from([...gdata.nodes.keys()].sort((a, b) => key(gdata.nodes[a]) - key(gdata.nodes[b])));
            }
        }
    }
    // Поток раскладки: узлы без координат получат их с первым сообщением - рост начнётся тогда же
    if (useWorker) {
        if (restored || paused) { physicsStop(); physics.gen++; engineActive = false; }
        else {
            // Рост откладывается до первых позиций из потока: иначе узлы начали бы расти в случайных местах
            physics.growShift = null;
            if (!incremental && growOrder) { const far = 1e4; for (const n of gdata.nodes) if (n.__born != null) n.__born += far; growUntil += far; physics.growShift = now + far; }
            physicsStart({ warmup, cooldown: gentle ? COOL_GENTLE : COOL_FULL, alphaDecay: gentle ? ALPHA_GENTLE : ALPHA_FULL, soft });
        }
    }
    rebuildLineBuffers();
    rebuildNodeMesh();
    rebuildCosmos();
    placeGrid();
    // Выделение переживает смену вида: функция → её файл и т.п.
    // Другой вид (вызовы, API…) - выделение сбрасывается и камера показывает весь граф (переход «к файлу» из деталей
    // выделяет узел сам, уже после смены вида)
    if (viewChanged) globalSel = null;
    const sel = viewChanged ? null : mapSelection(globalSel || selId);
    // Общий план: при смене вида и при смене/обновлении проекта. Но если после обновления (вручную или наблюдателем)
    // выделенный узел остался - камера не трогается: ни масштаб, ни ракурс не меняются
    if (viewChanged || (modelChanged && !sel)) { fitPending = true; fitStamp = performance.now(); fitView(first); }
    else if (modelChanged) fitDeferred = null;
    selId = null;
    if (sel) selectNode(sel, viewChanged && !first, true); else selectNode(null, false, true);
    if (!sel && !globalSel) closeDetails();
    renderLegend();
    requestRender();
    if (!gdata.nodes.length && liveFilterActive()) toast(t('filterEmpty'), 7000);
}
let lastAppliedView = null, lastAppliedModel = null, fitStamp = 0, softUntil = 0, softFrom = 0, fitDeferred = null, relayoutNext = false, pausedSettled = false;


// Подгонка камеры по координатам узлов (2-98 перцентиль, чтобы одиночные выбросы не мельчили граф)
function fitView(snap) {
    if (!G) return;
    orbit.follow = null;
    const ns = gdata.nodes.filter(n => n.x != null);
    // Граф только что заменён - координаты появятся на первом шаге раскладки, тогда и центрируем
    if (!ns.length) { fitDeferred = snap === true ? 'snap' : 'fly'; return; }
    fitDeferred = null;
    const q = (arr, p) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(p * (arr.length - 1))))];
    const lo = ns.length > 30 ? 0.02 : 0, hi = 1 - lo;
    const xs = ns.map(n => n.x).sort((a, b) => a - b), ys = ns.map(n => n.y).sort((a, b) => a - b), zs = ns.map(n => n.z || 0).sort((a, b) => a - b);
    const r = Math.max(20, Math.hypot(q(xs, hi) - q(xs, lo), q(ys, hi) - q(ys, lo), q(zs, hi) - q(zs, lo)) / 2);
    const el = $('#graph');
    const vfov2 = FOV_PERSP * DEG, hfov2 = 2 * Math.atan(Math.tan(vfov2 / 2) * (el.clientWidth / Math.max(1, el.clientHeight)));
    const c = new THREE.Vector3((q(xs, lo) + q(xs, hi)) / 2, (q(ys, lo) + q(ys, hi)) / 2, (q(zs, lo) + q(zs, hi)) / 2);
    const d = clampDist(r / Math.sin(Math.min(vfov2, hfov2) / 2) * 0.95);
    lastFitDist = d;
    if (snap === true) { orbit.gt.copy(c); orbit.gdist = d; orbitSnap(); orbit.dist = d * 2.2; } // первое появление - плавный «наезд»
    else flyCamera(c, d, 1000);
    requestRender();
}


// Слабая гравитация к центру: без неё несвязанные компоненты разлетаются
function gravityForce(k) {
    let nodes = [];
    const f = alpha => { for (const n of nodes) { n.vx -= n.x * k * alpha; n.vy -= n.y * k * alpha; if (n.z != null) n.vz -= n.z * k * alpha; } };
    f.initialize = ns => (nodes = ns);
    return f;
}


function refreshStyles() {
    if (!G) return;
    G.linkVisibility(G.linkVisibility()).linkDirectionalArrowLength(arrowLen); // размер стрелок зависит от числа выделенных связей
    if (selId) setHlLibOpacity(selFade.v);
    recolorNodes(); recolorLines(); requestRender();
}


function refreshVisual() {
    if (!G) return;
    G.nodeRelSize(3.2 * vis.nodeSize).nodeVal(nodeValLib)
        .linkDirectionalArrowLength(G.linkDirectionalArrowLength());
    metricMax = calcMetricMax();
    rebuildNodeMesh(); rebuildCosmos(); ensureBloom(); refreshStyles(); updateLabels(); renderLegend();
}


function renderLegend() {
    const o = viewOpts[curView]; const el = $('#legend'); const kinds = new Set(gdata.nodes.map(n => n.kind));
    let items = [];
    if (o.color === 'module') {
        const present = new Set(gdata.nodes.map(n => n.mod));
        items = model.modules.filter(m => present.has(m)).map(m => [m === '…' ? t('other') : m, m === '…' ? colorCache['--ext'] : colorCache[MOD_SLOTS[model.modules.indexOf(m)]]]);
        if (kinds.has('ext') || kinds.has('vendor')) items.push([t('external'), colorCache['--ext']]);
        if (kinds.has('nodef')) items.push([t('noDef'), colorCache['--s8']]);
    } else if (o.color === 'metric') {
        const r = colorCache.dark ? SEQ_RAMP.slice(0, 11).reverse() : SEQ_RAMP.slice(3);
        items = [[`${vis.sizeBy === 'degree' ? t('size_degree') : t('size_lines')}: 0 → ${fmt(metricMax)}`, `linear-gradient(90deg, ${r[0]}, ${r[r.length - 1]})`]];
    } else {
        const L = KIND_LABEL();
        for (const k of ['c', 'h', 'dir', 'fn', 'macro', 'type', 'var', 'nodef', 'ext', 'vendor']) if (kinds.has(k)) items.push([k === 'vendor' ? t('vendor') : L[k], k === 'vendor' ? colorCache['--ext'] : colorCache[KIND_COLORS[k]]]);
    }
    el.innerHTML = items.map(([l, c]) => `<span><i style="background:${c}${o.color === 'metric' ? ';width:34px;border-radius:3px' : ''}"></i>${esc(l)}</span>`).join('') +
        `<span class="arrowleg" title="${esc(t('arrowHint'))}">${esc(t('arr_' + (curView === 'calls' && o.gran === 'file' ? 'callsFile' : curView === 'api' && !gdata.nodes.some(n => n.kind === 'h') ? 'apiPub' : curView)))}</span>` +
        `<span id="gcount">${fmt(gdata.nodes.length)} ${t('nodes')} · ${fmt(gdata.links.length)} ${t('links')}</span>` + (vis.showFps ? `<span id="fpsVal" class="mono">… FPS</span>` : '');
}

/* ----- Выделение ----- */
// Последний явно выбранный объект - сохраняется между видами (функция → её файл в виде файлов и т.п.)
let globalSel = null;
function neighbors(id) {
    const out = (adj.out.get(id) || []), inn = (adj.inn.get(id) || []);
    return { out, inn };
}


// Найти в текущем виде узел, соответствующий выбранному объекту
function mapSelection(id) {
    if (!id) return null;
    if (adj.out.has(id)) return id;
    if (!model) return null;
    // Функция/макрос → её файл; файл → его директория (в виде «Директории» файлы тоже есть)
    const fn = model.fns.get(id) || model.macros.get(id);
    if (fn && fn.file && adj.out.has(fn.file.id)) return fn.file.id;
    if (id.startsWith('fd:') || id.startsWith('t:') || id.startsWith('v:')) {
        const n = model.files && [...model.files.values()].find(f => (f.decls || []).some(d => 'fd:' + d.name === id));
        if (n && adj.out.has(n.id)) return n.id;
    }
    return null;
}


// Снятие выделения пользователем (клик по фону, Esc, ✕): камера остаётся на месте, лишь немного отдаляется
function dropFocus() {
    if (!selId && !globalSel) return;
    const had = !!selId;
    selectNode(null);
    if (had) { cancelFly(); orbit.gdist = clampDist(orbit.gdist * 1.6); }
    requestRender();
}


function selectNode(id, fly, silent) {
    selId = id && adj.out.has(id) ? id : null;
    if (orbit.follow && orbit.follow === selId) orbit.followNode = gdata.nodes.find(n => n.id === selId); // вид перестроен - новый объект узла
    if (id && !silent) globalSel = selId || globalSel;
    if (!id && !silent) globalSel = null;
    hlNodes = new Set(); hlLinks = new Set();
    if (selId) {
        hlNodes.add(selId);
        const { out, inn } = neighbors(selId);
        for (const l of out) { hlLinks.add(l); hlNodes.add(l.target.id || l.target); }
        for (const l of inn) { hlLinks.add(l); hlNodes.add(l.source.id || l.source); }
    }
    if (selId) { selFade.hl = new Set(hlNodes); selFade.hlL = new Set(hlLinks); }
    selFade.dirty = true;
    refreshStyles();
    rebuildHlPulses();
    updateLabels();
    if (selId) { showDetails(gdata.nodes.find(n => n.id === selId)); if (fly) flyTo(selId, fly === 'center'); }
    else if (!silent) closeDetails();
    syncUrl();
}


// Плавный перелёт к узлу: центр - на узел, расстояние - чтобы были видны он и его соседи
function flyTo(id, centerOnly) {
    const n = gdata.nodes.find(x => x.id === id); if (!n || !G) return;
    const go = () => {
        const p = dispPos(n, new THREE.Vector3());
        let d = orbit.gdist;
        if (!centerOnly) {
            // Радиус окрестности: до самого дальнего соседа (но не больше, чем нужно, чтобы узел оставался крупным)
            let far = 0;
            const byId = new Map(gdata.nodes.map(x => [x.id, x]));
            for (const nid of hlNodes) { const m = byId.get(nid); if (m && m.x != null) far = Math.max(far, Math.hypot(m.x - n.x, m.y - n.y, (m.z || 0) - (n.z || 0))); }
            d = clampDist(Math.max(60 + nodeRadius(n) * 6, Math.min(far * 1.4, (lastFitDist || 600) * 0.9)));
        }
        flyCamera(p, d, 1100);
        orbit.follow = id; orbit.followNode = n; // дальше цель камеры следует за узлом, пока его не сдвинут вручную
    };
    if (n.x == null) setTimeout(go, 300); else go();
}

/* ----- Подписи узлов (HTML-оверлей, позиционируются внутри кадра рендера) ----- */
let labelItems = [], labelDying = [], labelTimer = 0;
const labelVec = new THREE.Vector3();
// Отложенное обновление подписей (камера, ползунки) - не чаще одного раза за delay мс
function scheduleLabels(delay = 200) { if (!labelTimer) labelTimer = setTimeout(() => { labelTimer = 0; updateLabels(); }, delay); }


// Узлы, ближайшие к камере: в кадре и крупнее всего на экране (близкий большой узел важнее далёкого)
function nearbyNodes(limit, ok) {
    if (!G || !gdata.nodes.length || limit <= 0) return [];
    const cam = G.camera(), h = G.height(), k = (h / 2) / Math.tan(cam.fov * DEG / 2), cp = cam.position;
    const res = [];
    _frustum.setFromProjectionMatrix(_pm.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    for (const n of gdata.nodes) {
        if (n.x == null || n.__hidden || (ok && !ok(n))) continue;
        dispPos(n, _cv);
        const dist = _cv.distanceTo(cp); if (dist < 1) continue;
        const r = nodeRadius(n), px = r / dist * k;
        if (px < 1.5) continue; // точки на горизонте не подписываем
        _sph.center.copy(_cv); _sph.radius = r;
        if (!_frustum.intersectsSphere(_sph)) continue;
        res.push([n, px]);
    }
    res.sort((a, b) => b[1] - a[1]);
    return res.slice(0, limit).map(x => x[0]);
}


// Подписи переиспользуются между обновлениями: оставшиеся - на месте, новые плавно проявляются, ушедшие - плавно гаснут
function updateLabels() {
    const box = $('#labels');
    box.style.setProperty('--label-size', vis.labelSize + 'px');
    requestRender();
    let list = [];
    if (gdata.nodes.length) {
        const okKind = n => vis.labelKinds[n.kind] !== false && !n.__hidden;
        // Выделен узел - подписываются только он и его соседи (остальные подписи гаснут; фильтр типов здесь не действует)
        if (selId) list = gdata.nodes.filter(n => hlNodes.has(n.id)).sort((a, b) => (b.id === selId) - (a.id === selId) || nodeVal(b) - nodeVal(a)).slice(0, Math.max(40, vis.labelCount));
        // Ничего не выделено - подписываются ближайшие к камере узлы (при полёте подписи меняются)
        else if (vis.labelNear) list = nearbyNodes(vis.labelCount, okKind);
        else {
            // Или самые связанные (число связей + размер как тай-брейк)
            const score = n => (adj.out.get(n.id) || []).length + (adj.inn.get(n.id) || []).length + n.val * 0.1;
            list = gdata.nodes.filter(okKind).sort((a, b) => score(b) - score(a)).slice(0, vis.labelCount);
        }
    }
    // Подписи узнаются по id узла: перестройка вида создаёт новые объекты узлов, а подпись должна остаться на месте (без мигания)
    const old = new Map(labelItems.map(it => [it.n.id, it]));
    const next = [];
    for (const n of list) {
        let it = old.get(n.id);
        if (it) { old.delete(n.id); it.n = n; if (it.el.textContent !== n.label) { it.el.textContent = n.label; it.fresh = true; } }
        else {
            const el = document.createElement('div'); el.textContent = n.label;
            el.className = 'nlabel off';
            box.appendChild(el);
            it = { n, el, shown: false, w: 0, h: 0, fresh: true };
        }
        it.el.classList.toggle('sel', n.id === selId); it.el.classList.toggle('ext', isExtNode(n));
        next.push(it);
    }
    // Ушедшие подписи гаснут и удаляются после перехода
    for (const it of old.values()) fadeOutLabel(it);
    labelItems = next;
    // Размеры меряем один раз (а не в каждом кадре - это форсировало бы перерасчёт раскладки страницы)
    for (const it of labelItems) if (it.fresh || it.el.classList.contains('sel') !== it.wasSel) { it.w = it.el.offsetWidth || 60; it.h = it.el.offsetHeight || 14; it.wasSel = it.el.classList.contains('sel'); }
}


function fadeOutLabel(it) {
    it.el.classList.add('off');
    labelDying.push(it);
    setTimeout(() => { it.el.remove(); const i = labelDying.indexOf(it); if (i >= 0) labelDying.splice(i, 1); }, 320);
}


// Расстановка подписей в каждом кадре. Порядок - от ближних к дальним: ближняя подпись занимает место первой,
// дальняя, которую она перекрывает, прячется. Подпись прячется и когда её узел заслонён более близким узлом.
// Проверки идут по сетке ячеек экрана - без перебора «каждый с каждым» (сотни подписей и тысячи узлов - без тормозов)
const _lvp = new THREE.Matrix4(), _lp = [0, 0, 0, 0];
let occX = new Float32Array(0), occY = occX, occR = occX, occZ = occX;
function placeLabels(camera) {
    if (!labelItems.length && !labelDying.length) return;
    // Размер берём у самого холста: при открытии панели деталей он меняется не мгновенно
    const cv = G.renderer().domElement; const w = cv.clientWidth, h = cv.clientHeight;
    const e = _lvp.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).elements;
    // Проекция точки: экранные x, y; глубина (расстояние вдоль взгляда); пикселей на единицу мира
    const proj = (x, y, z, out) => {
        const cw = e[3] * x + e[7] * y + e[11] * z + e[15]; if (cw <= 1e-6) return false;
        const nx = (e[0] * x + e[4] * y + e[8] * z + e[12]) / cw, ny = (e[1] * x + e[5] * y + e[9] * z + e[13]) / cw;
        out[0] = (nx + 1) / 2 * w; out[1] = (1 - ny) / 2 * h; out[2] = cw; out[3] = e[5] / cw * h / 2;
        return Math.abs(nx) < 1.2 && Math.abs(ny) < 1.2;
    };
    const tNow = performance.now() / 1000, N = gdata.nodes.length, D = cz.disp, R = cz.rad;
    // 1. Заслоняющие диски узлов (видимые и заметные на экране) - в сетку
    const OC = 48, occ = new Map();
    if (occX.length < N) { occX = new Float32Array(N); occY = new Float32Array(N); occR = new Float32Array(N); occZ = new Float32Array(N); }
    if (D.length >= N * 3 && nodeVis.length >= N) {
        for (let i = 0; i < N; i++) {
            if (!nodeVis[i] || !(R[i] > 0) || !proj(D[i * 3], D[i * 3 + 1], D[i * 3 + 2], _lp)) continue;
            const r = R[i] * _lp[3]; if (r < 4) continue; // мелкие точки ничего не загораживают
            occX[i] = _lp[0]; occY[i] = _lp[1]; occZ[i] = _lp[2]; occR[i] = r * 0.9;
            const rr = Math.min(r, 700);
            for (let cy = Math.floor((_lp[1] - rr) / OC); cy <= Math.floor((_lp[1] + rr) / OC); cy++)
                for (let cx = Math.floor((_lp[0] - rr) / OC); cx <= Math.floor((_lp[0] + rr) / OC); cx++) {
                    const k = cx * 65536 + cy, list = occ.get(k); if (list) list.push(i); else occ.set(k, [i]);
                }
        }
    }
    const occluded = (x, y, z, self) => {
        const list = occ.get(Math.floor(x / OC) * 65536 + Math.floor(y / OC)); if (!list) return false;
        for (const j of list) if (j !== self && occZ[j] < z) { const dx = x - occX[j], dy = y - occY[j]; if (dx * dx + dy * dy < occR[j] * occR[j]) return true; }
        return false;
    };
    // 2. Подписи - проекция и порядок от ближних к дальним (выделенный узел всегда первый)
    const order = [];
    for (const it of labelItems) {
        const n = it.n;
        it.vis = n.x != null && !n.__hidden && growOf(n, tNow) > 0.6 && dispPos(n, labelVec) && proj(labelVec.x, labelVec.y, labelVec.z, _lp);
        if (it.vis) { it.sx = _lp[0]; it.sy = _lp[1]; it.sz = _lp[2]; order.push(it); }
        else if (it.shown || it.fresh) { it.el.classList.add('off'); it.shown = false; it.fresh = false; }
    }
    order.sort((a, b) => (b.n.id === selId) - (a.n.id === selId) || a.sz - b.sz);
    // 3. Занятые подписями места - сетка ячеек 64 px
    const CELL = 64, grid = new Map();
    const cellsOf = (x0, y0, x1, y1, fn) => { for (let cy = Math.floor(y0 / CELL); cy <= Math.floor(y1 / CELL); cy++) for (let cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx++) if (fn(cx * 65536 + cy) === false) return false; return true; };
    for (const it of order) {
        const n = it.n, sx = it.sx, sy = it.sy;
        const x0 = sx - it.w / 2, y0 = sy - it.h * 1.35, x1 = x0 + it.w, y1 = y0 + it.h;
        let show = true;
        if (n.id !== selId) {
            // Узел или середина подписи за более близким узлом - подпись прячется
            if (occluded(sx, sy, it.sz, n.__i) || occluded(sx, (y0 + y1) / 2, it.sz, n.__i)) show = false;
            // Место уже занято более близкой подписью
            else show = cellsOf(x0, y0, x1, y1, k => { const list = grid.get(k); if (list) for (const r of list) if (x0 < r[2] && x1 > r[0] && y0 < r[3] && y1 > r[1]) return false; });
        }
        if (show) { const r = [x0, y0, x1, y1]; cellsOf(x0, y0, x1, y1, k => { const list = grid.get(k); if (list) list.push(r); else grid.set(k, [r]); }); }
        it.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -135%)`;
        if (show !== it.shown || it.fresh) { it.el.classList.toggle('off', !show); it.shown = show; it.fresh = false; }
    }
    // Гаснущие подписи продолжают следовать за своими узлами
    for (const it of labelDying) {
        if (it.n.x == null || !dispPos(it.n, labelVec) || !proj(labelVec.x, labelVec.y, labelVec.z, _lp)) continue;
        it.el.style.transform = `translate3d(${_lp[0].toFixed(1)}px, ${_lp[1].toFixed(1)}px, 0) translate(-50%, -135%)`;
    }
}

/* ======================================================================
   Панель деталей
   ====================================================================== */
function closeDetails() { $('#detBody').dataset.node = ''; setShown($('#details'), false); $('#details').classList.remove('expanded'); document.body.classList.remove('has-details', 'det-expanded'); }


function nodeDot(n) { return n ? baseColor(n) : colorCache['--ext']; }


const listItemHtml = it => `<li><button data-go="${esc(it.id)}" ${it.view ? `data-view="${it.view}"` : ''}>` +
    `<i class="dot" style="background:${it.color}"></i><span class="nm" title="${esc(it.title || it.label)}">${esc(it.label)}</span>` + (it.badge ? `<span class="badge ptr">${esc(it.badge)}</span>` : '') +
    (it.ct != null ? `<span class="ct">${esc(it.ct)}</span>` : '') + `</button></li>`;
// Длинный список показывается частями: кнопка «… ещё N» дописывает следующие пункты (остаток хранится до перерисовки)
const moreLists = new Map(); let moreSeq = 0;
const moreBtn = (id, n) => `<button class="chip lmore" data-morelist="${id}">… ${t('more')} ${fmt(n)}</button>`;
function listHtml(items, cap = 150) {
    if (!items.length) return `<div class="muted small">${t('none')}</div>`;
    let more = '';
    if (items.length > cap) {
        const id = ++moreSeq; moreLists.set(id, { items, shown: cap, step: Math.max(cap, 200) });
        if (moreLists.size > 60) moreLists.delete(moreLists.keys().next().value); // старые списки давно перерисованы
        more = moreBtn(id, items.length - cap);
    }
    return `<ul class="nlist">` + items.slice(0, cap).map(listItemHtml).join('') + `</ul>` + more;
}


function showMoreList(btn) {
    const L = moreLists.get(+btn.dataset.morelist), ul = btn.previousElementSibling;
    if (!L || !ul) { btn.remove(); return; }
    const next = L.items.slice(L.shown, L.shown + L.step); L.shown += next.length;
    ul.insertAdjacentHTML('beforeend', next.map(listItemHtml).join(''));
    if (L.shown >= L.items.length) { moreLists.delete(+btn.dataset.morelist); btn.remove(); } else btn.outerHTML = moreBtn(btn.dataset.morelist, L.items.length - L.shown);
}


function linkItems(links, end) {
    const m = new Map();
    for (const l of links) {
        const n = l[end]; const id = n.id || n;
        const node = typeof n === 'object' ? n : gdata.nodes.find(x => x.id === id);
        const prev = m.get(id);
        const ct = (l.count || 1) + (prev ? prev.n : 0);
        const tag = l.kind === 'ref' ? ' &' : l.via ? ' ⟵ ' + l.via : '';
        const badge = l.kind === 'indirect' ? `${t('viaPtr')} .${l.field || '?'}` : null;
        m.set(id, { n: ct, it: { id, label: node ? node.label + tag : id, title: node ? node.sub : id, color: nodeDot(node), ct: ct > 1 ? '×' + ct : null, badge } });
    }
    return [...m.values()].sort((a, b) => b.n - a.n || a.it.label.localeCompare(b.it.label)).map(x => x.it);
}


function sec(title, count, html) { return `<div class="dsec"><h5>${esc(title)} <span class="n">${count != null ? count : ''}</span></h5>${html}</div>`; }


function kv(rows) { return `<dl class="kv">${rows.filter(Boolean).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`; }


function statRows(s) {
    return [[t('lines'), fmt(s.total)], [t('code'), fmt(s.code)], [t('comments'), `${fmt(s.comment)} <span class="muted">(${pct(s.comment, s.code + s.comment)})</span>`], [t('blank'), fmt(s.blank)]];
}


function ghLink(path, a, b) { return model.web ? `<a class="iconbtn" target="_blank" rel="noopener" href="${esc(model.web(path, a, b))}">${t('openGH')} ↗</a>` : ''; }


function codeBlock(file, a, b) {
    if (typeof file.text !== 'string') return ''; // снимок без исходников - кода нет
    const lines = file.text.split('\n');
    b = Math.min(b, a + 400, lines.length);
    let out = '';
    for (let i = a; i <= b; i++) out += `<span class="ln">${i}</span>${highlight(lines[i - 1] || '')}\n`;
    return `<details class="box"><summary>${t('showCode')} (${b - a + 1})</summary><pre class="code">${out}</pre></details>`;
}
const HL_KW = /^(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|bool|true|false|nullptr|NULL|constexpr|_Bool|size_t|uint\d+_t|int\d+_t)$/;
function highlight(line) {
    // Простая подсветка построчно (многострочные комментарии упрощённо)
    let out = '', i = 0;
    const re = /(\/\*.*?(?:\*\/|$)|\/\/.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(^\s*#\s*\w+)|([A-Za-z_]\w*)|(\d[\w.]*)/g;
    let m;
    while ((m = re.exec(line))) {
        out += esc(line.slice(i, m.index)); i = m.index + m[0].length;
        if (m[1]) out += `<span class="hl-c">${esc(m[1])}</span>`;
        else if (m[2]) out += `<span class="hl-s">${esc(m[2])}</span>`;
        else if (m[3]) out += `<span class="hl-p">${esc(m[3])}</span>`;
        else if (m[4]) out += HL_KW.test(m[4]) ? `<span class="hl-k">${m[4]}</span>` : esc(m[4]);
        else out += `<span class="hl-n">${esc(m[5])}</span>`;
    }
    return out + esc(line.slice(i));
}


function fileItem(f, ct) { return { id: f.id, label: f.path, color: nodeDot(fileNode(f)), ct }; }


function showDetails(n) {
    if (!n) return;
    const p = $('#details'); setShown(p, true); document.body.classList.add('has-details');
    $('#detTitle').textContent = n.label;
    const { out, inn } = neighbors(n.id);
    const r = n.ref;
    let h = '';
    const acts = `<div class="actions"><button class="iconbtn" data-act="fly">${t('flyTo')}</button><button class="iconbtn" data-act="link" title="${t('nodeLinkHint')}">${t('nodeLink')}</button>` +
        (focus ? `<button class="iconbtn" data-act="unfocus">${t('unfocus')}</button>` : `<button class="iconbtn" data-act="focus">${t('focus')}</button>`);
    const L = KIND_LABEL();
    if (n.kind === 'c' || n.kind === 'h') {
        const f = r;
        h += kv([[t('path'), `<span class="mono">${esc(f.path)}</span>`], [t('kind'), L[n.kind]], ...statRows(f.stats), [t('funcs'), fmt(f.funcs.length)], f.macros.length || cLike(f) ? [t('macros'), fmt(f.macros.length)] : null]);
        h += acts + `<button class="iconbtn" data-act="md">Markdown</button>` + ghLink(f.path) + `</div>`;
        const incl = transIncludes(f);
        if (curView === 'includes') {
            h += sec(t('includes'), out.length, listHtml(linkItems(out, 'target')));
            h += sec(t('includedBy'), inn.length, listHtml(linkItems(inn, 'source')));
            h += sec(t('transIncl'), incl.size, '');
        } else if (curView === 'calls') {
            h += sec(t('calls'), out.length, listHtml(linkItems(out, 'target')));
            h += sec(t('calledBy'), inn.length, listHtml(linkItems(inn, 'source')));
        } else if (curView === 'api') {
            h += sec(t('declares'), out.length, listHtml(linkItems(out, 'target')));
            if (inn.length) h += sec(t('implIn') + ' ←', inn.length, listHtml(linkItems(inn, 'source')));
        } else {
            h += sec(t('includes'), f.incOut.length, listHtml(f.incOut.map(e => ({ id: e.file.id, label: e.file.path, color: nodeDot(fileNode(e.file)), view: 'includes' }))));
            h += sec(t('includedBy'), f.incIn.length, listHtml(f.incIn.map(e => ({ id: e.file.id, label: e.file.path, color: nodeDot(fileNode(e.file)), view: 'includes' }))));
        }
        const fnItems = f.fnIds.map(id => model.fns.get(id)).sort((a, b) => a.line - b.line).map(fn => ({ id: fn.id, label: fn.name, title: fn.sig, color: colorCache['--s3'], ct: 'L' + fn.line, view: 'calls' }));
        h += sec(t('definedHere'), fnItems.length, listHtml(fnItems, 300));
        const ext = f.includes.filter(i => i.res && i.res.kind !== 'project');
        if (ext.length) h += sec(t('extIncludes'), ext.length, `<div class="small mono">${ext.map(i => esc(mdImport(f, i)) + (i.res.kind === 'vendor' ? ` <span class="badge">${t('vendor')}</span>` : '')).join('<br>')}</div>`);
    } else if (n.kind === 'fn') {
        const fn = r; const len = fn.endLine - fn.startLine + 1;
        h += `<div class="sig">${esc(fn.sig)}</div>`;
        h += kv([[t('where'), `<span class="mono">${esc(fn.file.path)}:${fn.line}-${fn.endLine}</span>`], [t('length'), `${fmt(len)} ${t('lines').toLowerCase()}`],
            [t('kind'), [fn.isStatic && `<span class="badge">static</span>`, fn.isInline && `<span class="badge">inline</span>`, `<span class="badge">${t('func')}</span>`].filter(Boolean).join('')],
            fn.declaredIn.length ? [t('declaredIn'), fn.declaredIn.map(d => `<span class="mono">${esc(d.file.path)}:${d.line}</span>`).join('<br>')] : null,
            fn.indirect ? ['->fn()', fmt(fn.indirect)] : null]);
        h += acts + ghLink(fn.file.path, fn.startLine, fn.endLine) + `</div>`;
        h += codeBlock(fn.file, fn.startLine, fn.endLine);
        if (curView === 'calls') {
            h += sec(t('calls'), out.length, listHtml(linkItems(out, 'target')));
            h += sec(t('calledBy'), inn.length, listHtml(linkItems(inn, 'source')));
        } else {
            const outs = expandOut(fn, { showMacros: false }).filter(e => e.kind !== 'ext').map(e => ({ id: e.target.id, label: e.target.name + (e.kind === 'ref' ? ' &' : ''), color: colorCache['--s3'], ct: e.count > 1 ? '×' + e.count : null, view: 'calls' }));
            h += sec(t('calls'), outs.length, listHtml(outs));
            const ins = fn.inn.filter(e => e.from.kind === 'fn').map(e => ({ id: e.from.id, label: e.from.name, color: colorCache['--s3'], ct: e.count > 1 ? '×' + e.count : null, view: 'calls' }));
            h += sec(t('calledBy'), ins.length, listHtml(ins));
            if (curView === 'api') h += sec(t('definedIn'), 1, listHtml([fileItem(fn.file)]));
        }
        const ext = fn.out.filter(e => e.kind === 'ext');
        if (ext.length) h += sec(t('external'), ext.length, `<div class="small mono">${ext.map(e => esc(e.name) + (e.count > 1 ? ' ×' + e.count : '')).join(', ')}</div>`);
    } else if (n.kind === 'macro') {
        const m = r;
        h += `<div class="sig">#define ${esc(m.name)}${m.params ? '(' + esc(m.params.join(', ')) + ')' : ''} ${esc(m.body.length > 600 ? m.body.slice(0, 600) + '…' : m.body)}</div>`;
        h += kv([[t('where'), `<span class="mono">${esc(m.file.path)}:${m.line}</span>`], [t('kind'), m.params ? 'function-like' : 'object-like']]);
        h += acts + ghLink(m.file.path, m.line, m.endLine) + `</div>`;
        const outs = m.out.filter(e => e.target).map(e => ({ id: e.target.id, label: e.target.name, color: e.kind === 'macro' ? colorCache['--s4'] : colorCache['--s3'], view: e.kind === 'macro' ? null : 'calls' }));
        h += sec(t('calls'), outs.length, listHtml(outs));
        const ins = m.inn.map(e => ({ id: e.from.id, label: e.from.name, color: e.from.kind === 'macro' ? colorCache['--s4'] : colorCache['--s3'], ct: e.count > 1 ? '×' + e.count : null, view: e.from.kind === 'fn' ? 'calls' : null }));
        h += sec(t('usedBy'), ins.length, listHtml(ins));
        if (curView === 'api') h += sec(t('definedIn'), 1, listHtml([fileItem(m.file)]));
    } else if (n.kind === 'type') {
        const T = r;
        h += kv([[t('kind'), esc(T.tkind)], [t('definedIn'), T.defs.map(d => `<span class="mono">${esc(d.file.path)}:${d.line}</span>`).join('<br>') || t('none')],
            T.decls.length ? [t('declaredIn'), T.decls.map(d => `<span class="mono">${esc(d.file.path)}:${d.line}</span>` + (d.ref ? ` <span class="muted">→ ${esc(d.ref)}</span>` : '')).join('<br>')] : null]);
        const d0 = T.defs[0] || T.decls[0];
        h += acts + (d0 ? ghLink(d0.file.path, d0.startLine || d0.line, d0.endLine || d0.line) : '') + `</div>`;
        if (T.defs[0]) h += codeBlock(T.defs[0].file, T.defs[0].startLine || T.defs[0].line, T.defs[0].endLine || T.defs[0].line);
        h += sec(t('declaredIn'), inn.length, listHtml(linkItems(inn, 'source')));
    } else if (n.kind === 'var') {
        const V = r; const all = V.defs.concat(V.decls);
        h += all.length ? `<div class="sig">${esc(all[0].sig)}</div>` : '';
        h += kv([[t('definedIn'), V.defs.map(d => `<span class="mono">${esc(d.file.path)}:${d.line}</span>`).join('<br>') || t('none')],
            [t('declaredIn'), V.decls.map(d => `<span class="mono">${esc(d.file.path)}:${d.line}</span>`).join('<br>') || t('none')]]);
        h += acts + (all[0] ? ghLink(all[0].file.path, all[0].line) : '') + `</div>`;
        h += sec(t('declaredIn'), inn.length, listHtml(linkItems(inn, 'source')));
    } else if (n.kind === 'nodef') {
        h += `<div class="sig">${esc(r.decl.sig)}</div>` + kv([[t('declaredIn'), `<span class="mono">${esc(r.file.path)}:${r.decl.line}</span>`], [t('definedIn'), `<span class="badge warn">${t('noDef')}</span>`]]);
        h += acts + ghLink(r.file.path, r.decl.line) + `</div>`;
    } else if (n.kind === 'dir') {
        const d = r;
        h += kv([[t('path'), `<span class="mono">${esc(d.path || '/')}</span>`], [t('files'), fmt(d.nFiles)], ...statRows(d.stats)]);
        h += acts + `</div>`;
        const items = out.map(l => (typeof l.target === 'object' ? l.target : gdata.nodes.find(x => x.id === l.target))).sort((a, b) => (a.kind === 'dir' ? 0 : 1) - (b.kind === 'dir' ? 0 : 1) || a.label.localeCompare(b.label))
            .map(c => ({ id: c.id, label: c.label + (c.kind === 'dir' ? '/' : ''), color: nodeDot(c), ct: fmt(c.ref.stats.code) }));
        h += sec(t('children'), items.length, listHtml(items, 400));
        if (inn.length) h += sec(t('parent'), 1, listHtml(linkItems(inn, 'source')));
    } else {
        // Внешний узел
        h += kv([[t('kind'), esc(n.sub)]]) + acts + `</div>`;
        h += sec(t('usedBy'), inn.length, listHtml(linkItems(inn, 'source')));
    }
    // Описание из комментариев - сразу под заголовком
    const doc = n.doc || (r && r.doc) || '';
    if (doc) h = `<div class="doc">${docHtml(doc)}</div>` + h;
    const body = $('#detBody');
    // Тот же узел (перестройка вида, фильтр) - обновляем без анимации и с той же прокруткой; другой - проявляется заново
    const same = body.dataset.node === n.id, y = body.scrollTop;
    body.innerHTML = h; body.dataset.node = n.id; body.scrollTop = same ? y : 0;
    body.classList.remove('swap'); // класс оставил бы анимацию и новым элементам
    if (!same) { void body.offsetWidth; body.classList.add('swap'); }
}


// Комментарий → безопасный HTML: абзацы, `код`, теги Doxygen (@param, \return …)
function docHtml(text) {
    return esc(text)
        .replace(/`([^`\n]+)`/g, '<code>$1</code>')
        .replace(/(^|\n)\s*[@\\](param|arg)(?:\[[^\]]*\])?\s+(\w+)/g, '$1<span class="dtag">param</span> <code>$3</code>')
        .replace(/(^|\n)\s*[@\\](returns?|retval|brief|note|warning|see|todo|deprecated)\b/g, '$1<span class="dtag">$2</span>')
        .replace(/\n/g, '<br>');
}


function transIncludes(f) {
    const seen = new Set(); const st = [f];
    while (st.length) { const x = st.pop(); for (const e of x.incOut) if (!seen.has(e.file) && e.file !== f) { seen.add(e.file); st.push(e.file); } }
    return seen;
}


// Переход к узлу (возможно в другом виде)
function goTo(id, view) {
    if (view && view !== curView) {
        if (view === 'calls' && viewOpts.calls.gran !== 'fn') viewOpts.calls.gran = 'fn';
        focus = null; setView(view, true);
    }
    if (!adj.out.has(id)) {
        // Узел скрыт фильтрами - показываем его окрестность
        focus = { id, depth: 1 }; applyView();
        if (!adj.out.has(id)) { toast(t('nodeMissing'), 3000); return; }
    }
    selectNode(id, true);
}

/* ======================================================================
   Статистика
   ====================================================================== */
let statSort = { key: 'code', dir: -1 }, statFilter = '', openDirs = new Set(['']);
// Состояние графиков: папка и раскраска карты кода, выбранные столбцы гистограмм; сбрасывается для другого проекта
const statTree = { dir: '', mode: 'folders' }, statBins = { fn: -1, file: -1 };
let statModel = null, statAnimTimer = 0, statFilesAll = false, statDiag = {};
const statCW = 520; // ширина графика, пока его контейнера нет на странице
const fmtShort = v => (v >= 1e6 ? +(v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + 'M' : v >= 1e4 ? Math.round(v / 1e3) + 'k' : v >= 1e3 ? +(v / 1e3).toFixed(1) + 'k' : String(Math.round(v)));
const quant = (sorted, p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))] : 0);
const tipA = s => `data-tip="${esc(s)}"`;
const fnLen = f => f.endLine - f.startLine + 1;
// Ширина графика - по его контейнеру
const chartW = id => { const el = $(id); return el && el.clientWidth > 100 ? Math.round(el.clientWidth) : statCW; };
const modVar = mod => { const i = model.modules.indexOf(mod); return i >= 0 && i < 7 ? `var(${MOD_SLOTS[i]})` : 'var(--ext)'; };
const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)', 'var(--s7)', 'var(--ext)'];
// Плотность комментариев → цвет: почти нет - красный, около 10% - жёлтый, от 25% - зелёный
const _cc0 = new THREE.Color('#d03b3b'), _cc1 = new THREE.Color('#e0a020'), _cc2 = new THREE.Color('#1baf7a'), _ccx = new THREE.Color();
function commentColor(r) {
    const k = Math.max(0, Math.min(1, r / 0.25));
    return '#' + (k < 0.4 ? _ccx.copy(_cc0).lerp(_cc1, k / 0.4) : _ccx.copy(_cc1).lerp(_cc2, (k - 0.4) / 0.6)).getHexString();
}


function renderStats(animate) {
    const M = model, T = M.totals;
    if (statModel !== M) { statModel = M; statTree.dir = ''; statBins.fn = statBins.file = -1; statFilesAll = false; }
    const st = $('#stats');
    const fns = [...M.fns.values()];
    const lens = fns.map(fnLen).sort((a, b) => a - b);
    const cFiles = [...M.files.values()].filter(f => !f.isH).length, hFiles = M.files.size - cFiles;
    const incEdges = [...M.files.values()].reduce((s, f) => s + f.incOut.length, 0);
    const documented = fns.filter(f => f.doc).length, long50 = lens.filter(v => v > 50).length;
    const card = (k, v, s) => `<div class="card"><div class="k">${esc(k)}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`;
    let h = `<div class="stwrap"><div class="cards">` +
        card(t('files'), fmt(M.files.size), M.langs && [...M.langs].some(l => l !== 'c') ? `${t('srcFile')} ${fmt(cFiles)} · ${t('header')} ${fmt(hFiles)}` : `.c ${fmt(cFiles)} · .h ${fmt(hFiles)}`) +
        card(t('lines'), fmt(T.total)) +
        card(t('code'), fmt(T.code), pct(T.code, T.total)) +
        card(t('comments'), fmt(T.comment), pct(T.comment, T.total)) +
        card(t('blank'), fmt(T.blank), pct(T.blank, T.total)) +
        card(t('ratio'), pct(T.comment, T.code + T.comment)) +
        card(t('funcs'), fmt(fns.length), lens.length ? `${t('avgFn')} ${(lens.reduce((a, b) => a + b, 0) / lens.length).toFixed(1)} · ${t('maxFn')} ${lens[lens.length - 1]}` : '') +
        (fns.length ? card(t('documented'), pct(documented, fns.length), `${fmt(documented)} / ${fmt(fns.length)} ${t('funcs').toLowerCase()}`) +
            card(t('medianFn'), fmt(quant(lens, 0.5)), `${t('st_p90')} ${fmt(quant(lens, 0.9))}`) +
            card(t('longFns'), fmt(long50), pct(long50, fns.length)) : '') +
        card(t('avgFile'), fmt(Math.round(T.code / Math.max(1, M.files.size))), t('codeLinesU')) +
        (M.macros.size ? card(t('macros'), fmt(M.macros.size)) : '') + card(t('types'), fmt(M.types.size)) +
        card(t('incCard'), fmt(incEdges), t('includeEdges')) +
        card(t('ignored'), fmt(M.ignoredCount), M.large ? `> ${readCfg().maxKB} KB: ${M.large}` : '') + `</div>`;

    // Графики
    const panel = (title, hint, body, cls = '', head = '') => `<div class="panel chart ${cls}"><h3>${esc(title)}<span class="grow"></span>${head}</h3><p class="chint">${esc(hint)}</p>${body}</div>`;
    const half = []; // графики в две колонки; при нечётном числе последний - во всю ширину
    const tmSeg = `<div class="seg tmode">${[['folders', t('tm_folders')], ['comments', t('tm_comments')]].map(([v, l]) => `<button data-tmode="${v}" aria-pressed="${statTree.mode === v}">${esc(l)}</button>`).join('')}</div>`;
    h += `<div class="charts">`;
    h += panel(t('ch_tree'), t('ch_treeHint'), `<div class="tmnav" id="stTreeNav"></div><div class="tmap" id="stTreeBody"></div>`, 'wide', tmSeg);
    const multi = M.langs && M.langs.size > 1;
    // Графики в пикселях заполняются после вставки страницы (fitStatCharts) - по настоящей ширине своих панелей
    half.push(['ch_mix', multi ? 'ch_mixLang' : 'ch_mixMod', mixHtml(M, multi)], ['ch_mods', 'ch_modsHint', modulesHtml(M)]);
    if (fns.length) half.push(['ch_fnLen', 'ch_fnLenHint', `<div id="stHist_fn"></div>`]);
    half.push(['ch_fileSize', 'ch_fileSizeHint', `<div id="stHist_file"></div>`], ['ch_docs', 'ch_docsHint', `<div id="stDocs"></div>`]);
    if (fns.length > 3) half.push(['ch_coupling', 'ch_couplingHint', `<div id="stCoup"></div>`]);
    if ([...M.files.values()].filter(f => f.incOut.length || f.incIn.length).length >= 3) half.push(['ch_deps', 'ch_depsHint', `<div id="stDeps"></div>`]);
    half.push(['ch_pareto', 'ch_paretoHint', `<div id="stPareto"></div>`]);
    half.forEach(([k, hk, body], i) => { h += panel(t(k), t(hk), body, half.length % 2 && i === half.length - 1 ? 'wide' : ''); });
    h += `</div>`;

    // По директориям - дерево
    const legend = `<span class="legend-inline"><span><i style="background:var(--s1)"></i>${t('code')}</span><span><i style="background:var(--s2)"></i>${t('comments')}</span><span><i style="background:var(--s3)"></i>${t('blank')}</span></span>`;
    h += `<div class="panel"><h3>${t('dirStats')} <span class="grow"></span>${legend}</h3><div class="tablewrap"><table class="t"><thead><tr><th>${t('path')}</th><th>${t('files')}</th><th>${t('code')}</th><th>${t('comments')}</th><th>${t('blank')}</th><th>${t('total')}</th><th></th></tr></thead><tbody id="stDirBody">${dirRows()}</tbody></table></div></div>`;
    // По файлам - сортируемая таблица
    h += `<div class="panel" id="stFilesPanel">${filesPanelInner()}</div>`;

    // Топы
    const topList = (items) => listHtml(items, 15);
    const longest = [...fns].sort((a, b) => (b.endLine - b.startLine) - (a.endLine - a.startLine)).slice(0, 15).map(f => ({ id: f.id, label: f.name, title: f.file.path, color: 'var(--s3)', ct: f.endLine - f.startLine + 1, view: 'calls' }));
    const mostInc = [...M.files.values()].filter(f => f.incIn.length).sort((a, b) => b.incIn.length - a.incIn.length).slice(0, 15).map(f => ({ id: f.id, label: f.path, color: 'var(--s2)', ct: f.incIn.length, view: 'includes' }));
    const callers = f => f.inn.filter(e => e.kind !== 'ref').reduce((s, e) => s + e.count, 0);
    const mostCalled = [...fns].sort((a, b) => callers(b) - callers(a)).slice(0, 15).filter(f => callers(f)).map(f => ({ id: f.id, label: f.name, title: f.file.path, color: 'var(--s3)', ct: callers(f), view: 'calls' }));
    const fan = f => new Set(expandOut(f, { showMacros: false }).filter(e => e.kind === 'call').map(e => e.target.id)).size;
    const fanOut = [...fns].map(f => [f, fan(f)]).sort((a, b) => b[1] - a[1]).slice(0, 15).filter(x => x[1]).map(([f, c]) => ({ id: f.id, label: f.name, title: f.file.path, color: 'var(--s3)', ct: c, view: 'calls' }));
    h += `<div class="grid2">` +
        `<div class="panel"><h3>${t('longestFns')}</h3>${topList(longest)}</div>` +
        `<div class="panel"><h3>${t('mostIncluded')}</h3>${topList(mostInc)}</div>` +
        `<div class="panel"><h3>${t('mostCalled')}</h3>${topList(mostCalled)}</div>` +
        `<div class="panel"><h3>${t('fanOut')}</h3>${topList(fanOut)}</div></div>`;

    // Диагностика (прототипы и заголовки - понятия C/C++: в других языках эти разделы не показываются)
    const cFamily = f => f.lang === 'c' || f.lang === 'cpp';
    const hasC = M.langs && [...M.langs].some(l => l === 'c' || l === 'cpp');
    const protoNoDef = [...M.declsByName.entries()].filter(([n, ds]) => !M.fnByName.has(n) && ds.some(d => d.file.isH && cFamily(d.file))).map(([n, ds]) => ({ id: 'fd:' + n, label: n, title: ds[0].file.path, color: 'var(--s8)', ct: basename(ds[0].file.path) + ':' + ds[0].line, view: 'api' }));
    const noProto = fns.filter(f => f.file.lang === 'c' && !f.isStatic && f.name !== 'main' && !f.file.isH && !f.declaredIn.some(d => d.file.isH)).map(f => ({ id: f.id, label: f.name, title: f.file.path, color: 'var(--s3)', ct: basename(f.file.path), view: 'calls' }));
    const unused = fns.filter(f => !f.inn.length && f.name !== 'main' && !/^(WinMain|wWinMain|DllMain|SDL_main|android_main)$/.test(f.name)).map(f => ({ id: f.id, label: f.name, title: f.file.path, color: 'var(--s3)', ct: basename(f.file.path), view: 'calls' }));
    const hdrUnused = [...M.files.values()].filter(f => f.isH && !f.incIn.length).map(f => ({ id: f.id, label: f.path, color: 'var(--s2)', view: 'includes' }));
    const cyc = includeCycles(M);
    const cycHtml = cyc.length ? cyc.slice(0, 20).map(c => `<div class="small mono" style="margin:4px 0">${c.map(f => esc(f.path)).join(' ⇄ ')}</div>`).join('') : `<div class="muted small">${t('none')}</div>`;
    // Списки диагностики (бывают на тысячи пунктов) строятся только при раскрытии
    statDiag = {};
    // Пустой раздел не раскрывается - просто строка с нулём
    const dsec = (key, title, items, build) => {
        if (!items) return `<div class="box dempty">${esc(title)} <span class="muted">(0)</span></div>`;
        statDiag[key] = build; return `<details class="box" data-diag="${key}"><summary>${esc(title)} <span class="muted">(${items})</span></summary><div class="dbody"></div></details>`;
    };
    h += `<div class="panel" style="margin-top:16px"><h3>${t('diag')}</h3>` +
        (hasC ? dsec('proto', t('protoNoDef'), protoNoDef.length, () => listHtml(protoNoDef, 300)) +
            dsec('noProto', t('noProto'), noProto.length, () => listHtml(noProto, 300)) : '') +
        dsec('unused', t('unused'), unused.length, () => listHtml(unused, 300)) +
        ([...M.files.values()].some(f => f.isH) ? dsec('hdr', t('headersUnused'), hdrUnused.length, () => listHtml(hdrUnused, 300)) : '') +
        dsec('cyc', t('cycles'), cyc.length, () => cycHtml) + `</div></div>`;
    const y = st.scrollTop; st.innerHTML = h; st.scrollTop = y;
    renderTreemap(); fitStatCharts(true);
    // Появление (карточки, столбцы, точки) - только при открытии вкладки, а не на каждый щелчок по таблице
    clearTimeout(statAnimTimer);
    if (animate && !REDUCED_MOTION.matches) { st.classList.add('st-anim'); statAnimTimer = setTimeout(() => st.classList.remove('st-anim'), 1400); }
    else st.classList.remove('st-anim');
}


// Графики рисуются в пикселях (текст - своего размера) по ширине своих контейнеров: all - заполнить все (новая
// страница), иначе - перерисовать только те, чья ширина изменилась (окно, панель источника)
function fitStatCharts(all) {
    if (!model) return;
    const list = [['#stHist_fn', () => histHtml('fn')], ['#stHist_file', () => histHtml('file')], ['#stDocs', () => docsScatter(model)],
        ['#stCoup', () => couplingScatter([...model.fns.values()])], ['#stDeps', () => depsScatter(model)], ['#stPareto', () => paretoHtml(model)]];
    for (const [id, fn] of list) {
        const el = $(id); if (!el) continue;
        const svg = el.querySelector('svg.csvg'), w = el.clientWidth;
        if (all || !svg || (w >= 100 && Math.abs(w - svg.viewBox.baseVal.width) >= 3)) el.innerHTML = fn();
    }
}


// Строки таблицы директорий (раскрытые папки - с файлами)
function dirRows() {
    const M = model, rows = [];
    let maxTotal = 1;
    for (const d of M.dirs.values()) if (d.path !== '' && d.stats.total > maxTotal) maxTotal = d.stats.total;
    for (const f of M.files.values()) if (f.stats.total > maxTotal) maxTotal = f.stats.total;
    const bar = s => { const w = 160 * s.total / maxTotal; const seg = (v, c) => (v ? `<i style="width:${(w * v / s.total).toFixed(1)}px;background:var(${c})"></i>` : ''); return `<span class="sbar" title="${t('code')} ${s.code} · ${t('comments')} ${s.comment} · ${t('blank')} ${s.blank}">${seg(s.code, '--s1')}${seg(s.comment, '--s2')}${seg(s.blank, '--s3')}</span>`; };
    const walk = (d, depth) => {
        const hasKids = d.subdirs.some(s => s.nFiles) || d.files.length;
        const open = openDirs.has(d.path);
        rows.push(`<tr class="clk" data-dir="${esc(d.path)}"><td><span class="tw" style="padding-left:${depth * 14}px"><span class="tg">${hasKids ? (open ? '▾' : '▸') : ''}</span>${esc(d.path === '' ? M.name + '/' : basename(d.path) + '/')}</span></td>` +
            `<td>${fmt(d.nFiles)}</td><td>${fmt(d.stats.code)}</td><td>${fmt(d.stats.comment)}</td><td>${fmt(d.stats.blank)}</td><td>${fmt(d.stats.total)}</td><td>${bar(d.stats)}</td></tr>`);
        if (!open) return;
        for (const s of [...d.subdirs].filter(s => s.nFiles).sort((a, b) => b.stats.total - a.stats.total)) walk(s, depth + 1);
        for (const f of [...d.files].sort((a, b) => b.stats.total - a.stats.total))
            rows.push(`<tr class="clk" data-file="${esc(f.id)}"><td><span class="tw" style="padding-left:${(depth + 1) * 14}px"><span class="tg"></span>${esc(basename(f.path))}</span></td><td></td><td>${fmt(f.stats.code)}</td><td>${fmt(f.stats.comment)}</td><td>${fmt(f.stats.blank)}</td><td>${fmt(f.stats.total)}</td><td>${bar(f.stats)}</td></tr>`);
    };
    walk(M.dirs.get(''), 0);
    return rows.join('');
}


function filesPanelInner() {
    const [rowsHtml, rowsN] = statFileRows();
    return `<h3>${t('fileStats')} <span class="muted small" id="stFilesCount">${fmt(rowsN)}</span><span class="grow"></span><input class="stfilter" id="stFilter" type="search" placeholder="${t('filter')}" value="${esc(statFilter)}"></h3>` +
        `<div class="tablewrap"><table class="t"><thead><tr>${STAT_COLS().map(([k, l]) => `<th data-sort="${k}">${esc(l)}${statSort.key === k ? (statSort.dir < 0 ? ' ↓' : ' ↑') : ''}</th>`).join('')}</tr></thead><tbody id="stFilesBody">` +
        rowsHtml + `</tbody></table></div>`;
}


// Карта кода (treemap): площадь плитки - строки кода. Крупные папки (до трёх уровней) показывают своё содержимое
function squarify(items, x, y, w, h) {
    const out = [], sum = items.reduce((s, it) => s + it.v, 0);
    if (!sum || w <= 0 || h <= 0) return out;
    const k = w * h / sum; let i = 0;
    while (i < items.length) {
        const short = Math.min(w, h); let row = [], rowA = 0, mx = 0, mn = Infinity, best = Infinity;
        // Ряд растёт, пока плитки в нём становятся ближе к квадрату
        while (i < items.length) {
            const a = items[i].v * k, ra = rowA + a, nmx = Math.max(mx, a), nmn = Math.min(mn, a);
            const worst = Math.max(short * short * nmx / (ra * ra), ra * ra / (short * short * nmn));
            if (row.length && worst > best) break;
            best = worst; row.push({ it: items[i], a }); rowA = ra; mx = nmx; mn = nmn; i++;
        }
        const thick = rowA / short; let off = 0;
        for (const r of row) {
            const len = r.a / thick;
            out.push(w >= h ? { it: r.it, x, y: y + off, w: thick, h: len } : { it: r.it, x: x + off, y, w: len, h: thick });
            off += len;
        }
        if (w >= h) { x += thick; w -= thick; } else { y += thick; h -= thick; }
    }
    return out;
}


function renderTreemap() {
    const box = $('#stTreeBody'), nav = $('#stTreeNav'); if (!box || !model) return;
    const M = model;
    let d = M.dirs.get(statTree.dir) || M.dirs.get('');
    const kids = x => [...x.subdirs.filter(s => s.stats.code > 0).map(s => ({ v: s.stats.code, dir: s })), ...x.files.filter(f => f.stats.code > 0).map(f => ({ v: f.stats.code, file: f }))].sort((a, b) => b.v - a.v);
    // Цепочка из одной папки (src/ → main/ → java/) - сразу внутрь, иначе карта - одна большая плитка
    for (let k = kids(d); k.length === 1 && k[0].dir; k = kids(d)) d = k[0].dir;
    statTree.dir = d.path;
    const parts = d.path ? d.path.split('/') : [];
    nav.innerHTML = [`<button class="chip" data-tdir="">${esc(M.name)}</button>`].concat(parts.map((p, i) => `<button class="chip" data-tdir="${esc(parts.slice(0, i + 1).join('/'))}">${esc(p)}</button>`)).join('<span class="muted">/</span>') +
        (statTree.mode === 'comments' ? `<span class="tmleg">${t('comments').toLowerCase()}: 0% <i></i> 25%+</span>` : '');
    const W = Math.max(200, box.clientWidth), H = Math.max(160, box.clientHeight);
    box.dataset.w = W;
    // «Папки»: у каждой плитки верхнего уровня свой цвет, вложенные - цвета своей папки (модуль часто один на весь
    // проект); «комментарии» - плотность комментариев каждой плитки
    const color = (it, inherit) => {
        const s = it.dir ? it.dir.stats : it.file.stats;
        return statTree.mode === 'comments' ? commentColor(s.comment / Math.max(1, s.code + s.comment)) : inherit;
    };
    const tip = it => {
        const s = it.dir ? it.dir.stats : it.file.stats;
        return `${it.dir ? it.dir.path + '/' : it.file.path}\n${fmt(s.code)} ${t('codeLinesU')} · ${pct(s.code, M.totals.code)} ${t('ofProject')}\n${t('comments')}: ${pct(s.comment, s.code + s.comment)}` + (it.dir ? ` · ${t('files').toLowerCase()}: ${fmt(it.dir.nFiles)}` : '');
    };
    const tiles = [];
    const place = (list, x, y, w, h, depth, pc) => {
        let k = 0;
        for (const r of squarify(list, x, y, w, h)) {
            const c = color(r.it, depth === 0 ? SERIES[k++ % 7] : pc);
            if (r.w < 1.5 || r.h < 1.5) continue;
            // Цепочка папок из одной папки (core/src/mindustry/) - одна плитка с общим заголовком, уровень не тратится
            let it = r.it, name = it.dir ? basename(it.dir.path) : basename(it.file.path);
            if (it.dir) { let dd = it.dir; for (let ch = kids(dd); ch.length === 1 && ch[0].dir; ch = kids(dd)) { dd = ch[0].dir; name += '/' + basename(dd.path); } it = { v: it.v, dir: dd }; name += '/'; }
            const nest = !!it.dir && depth < 3 && r.w > 60 && r.h > 46;
            const attrs = it.dir ? `data-tdir="${esc(it.dir.path)}"` : `data-go="${esc(it.file.id)}" data-view="includes"`;
            const label = r.w > 44 && r.h > 20 && (depth === 0 || r.h > 30) ? `<span>${esc(name)}</span>` + (!nest && depth === 0 && r.h > 38 ? `<small>${fmtShort(it.v)}</small>` : '') : '';
            tiles.push(`<div class="tm d${depth}${nest ? ' nest' : ''}" style="left:${(100 * r.x / W).toFixed(3)}%;top:${(100 * r.y / H).toFixed(3)}%;width:${(100 * r.w / W).toFixed(3)}%;height:${(100 * r.h / H).toFixed(3)}%;--c:${c}" ${attrs} ${tipA(tip(it))}>${label}</div>`);
            if (nest) place(kids(it.dir), r.x + 3, r.y + 19, r.w - 6, r.h - 22, depth + 1, c);
        }
    };
    place(kids(d), 0, 0, W, H, 0);
    box.innerHTML = tiles.join('');
}


// Состав кода: кольцо (языки или модули) и полоса «код / комментарии / пустые»
function mixHtml(M, multi) {
    const by = new Map();
    for (const f of M.files.values()) { const k = multi ? f.lang : M.moduleOf(f.path); by.set(k, (by.get(k) || 0) + f.stats.code); }
    const keys = multi ? [...by.keys()].sort((a, b) => by.get(b) - by.get(a)) : M.modules.filter(m => by.has(m));
    const items = keys.map((k, i) => ({ v: by.get(k), label: multi ? ((window.CodriftLangs && CodriftLangs.byId(k)) || { name: k }).name : k === '…' ? t('other') : k, color: multi ? SERIES[i % SERIES.length] : modVar(k) })).filter(x => x.v > 0);
    const total = items.reduce((s, x) => s + x.v, 0), T = M.totals;
    const r = 70, C = 2 * Math.PI * r; let off = 0;
    const segs = items.map(it => {
        const len = C * it.v / Math.max(1, total), gap = items.length > 1 && len > 4 ? 1.5 : 0;
        const s = `<circle r="${r}" cx="90" cy="90" fill="none" stroke="${it.color}" stroke-width="26" stroke-dasharray="${(len - gap).toFixed(2)} ${(C - len + gap).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" ${tipA(`${it.label}: ${fmt(it.v)} ${t('codeLinesU')} (${pct(it.v, total)})`)}/>`;
        off += len; return s;
    }).join('');
    const legend = items.map(it => `<div class="dl" ${tipA(`${it.label}: ${fmt(it.v)} ${t('codeLinesU')}`)}><i style="background:${it.color}"></i><span class="grow">${esc(it.label)}</span><b>${pct(it.v, total)}</b></div>`).join('');
    const comp = [['code', T.code, 'var(--s1)'], ['comments', T.comment, 'var(--s2)'], ['blank', T.blank, 'var(--s3)']];
    return `<div class="donut"><svg viewBox="0 0 180 180"><g transform="rotate(-90 90 90)">${segs}</g><text x="90" y="88" class="dc1">${fmtShort(total)}</text><text x="90" y="108" class="dc2">${esc(t('codeLinesU'))}</text></svg><div class="dlegend">${legend}</div></div>` +
        `<div class="cbar">${comp.map(([k, v, c]) => (v ? `<i style="flex:${v};background:${c}" ${tipA(`${t(k)}: ${fmt(v)} (${pct(v, T.total)})`)}></i>` : '')).join('')}</div>` +
        `<div class="cleg">${comp.map(([k, v, c]) => `<span><i style="background:${c}"></i>${esc(t(k))} ${pct(v, T.total)}</span>`).join('')}</div>`;
}


// Модули: объём кода и доля функций с описанием
function modulesHtml(M) {
    const rows = M.modules.map(m => ({ m, code: 0, comm: 0, files: 0, fns: 0, doc: 0 })), by = new Map(rows.map(r => [r.m, r]));
    for (const f of M.files.values()) {
        const r = by.get(M.moduleOf(f.path)); if (!r) continue;
        r.code += f.stats.code; r.comm += f.stats.comment; r.files++;
        for (const id of f.fnIds) { r.fns++; if (M.fns.get(id).doc) r.doc++; }
    }
    const list = rows.filter(r => r.files), max = Math.max(1, ...list.map(r => r.code));
    return `<div class="mods"><div class="mrow mhead"><span>${t('m_module')}</span><span>${t('m_code')}</span><span></span><span>${t('m_doc')}</span></div>` + list.map(r => {
        const name = r.m === '…' ? t('other') : r.m, dp = r.fns ? r.doc / r.fns : null;
        return `<div class="mrow" ${tipA(`${name}\n${fmt(r.code)} ${t('codeLinesU')} · ${t('files').toLowerCase()}: ${fmt(r.files)} · ${t('funcs').toLowerCase()}: ${fmt(r.fns)}\n${t('comments')}: ${pct(r.comm, r.code + r.comm)} · ${t('m_doc')}: ${pct(r.doc, r.fns)}`)}>` +
            `<span class="mname"><i style="background:${modVar(r.m)}"></i>${esc(name)}</span><span class="mbar"><i style="width:${(100 * r.code / max).toFixed(1)}%;background:${modVar(r.m)}"></i></span>` +
            `<span class="mnum">${fmtShort(r.code)}</span><span class="mdoc" style="color:${dp == null ? 'var(--muted)' : commentColor(dp * 0.3)}">${pct(r.doc, r.fns)}</span></div>`;
    }).join('') + `</div>`;
}


// Гистограммы длины функций и размера файлов; щелчок по столбцу - список под графиком
const FN_BINS = [[1, 2], [3, 5], [6, 10], [11, 20], [21, 40], [41, 80], [81, 160], [161, 320], [321, Infinity]];
const FILE_BINS = [[1, 10], [11, 50], [51, 100], [101, 200], [201, 500], [501, 1000], [1001, 2000], [2001, 5000], [5001, Infinity]];
const binLabel = ([a, b]) => (b === Infinity ? fmtShort(a) + '+' : `${fmtShort(a)}-${fmtShort(b)}`);
const binShort = ([a, b]) => (b === Infinity ? fmtShort(a - 1) + '+' : '≤' + fmtShort(b));
function histHtml(kind) {
    const M = model, isFn = kind === 'fn', edges = isFn ? FN_BINS : FILE_BINS;
    const items = isFn ? [...M.fns.values()].map(f => ({ v: fnLen(f), o: f })) : [...M.files.values()].filter(f => f.stats.code > 0).map(f => ({ v: f.stats.code, o: f }));
    if (!items.length) return `<div class="muted small">${t('none')}</div>`;
    const bins = edges.map(e => ({ e, items: [] }));
    for (const it of items) { const b = bins.find(x => it.v >= x.e[0] && it.v <= x.e[1]); if (b) b.items.push(it); }
    const W = chartW('#stHist_' + kind), H = 190, L = 38, B = 22, Tp = 16, pw = W - L - 4, ph = H - B - Tp, max = Math.max(1, ...bins.map(b => b.items.length)), bw = pw / bins.length;
    const col = i => (isFn ? (i >= 6 ? 'var(--crit)' : i >= 5 ? 'var(--warn)' : 'var(--s1)') : (i >= 7 ? 'var(--crit)' : i >= 6 ? 'var(--warn)' : 'var(--s2)'));
    const unit = isFn ? t('lines').toLowerCase() : t('codeLinesU'), sel = statBins[kind];
    let svg = '';
    for (const f of [0.5, 1]) { const y = Tp + ph - ph * f; svg += `<line class="grid" x1="${L}" x2="${W - 4}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text x="${L - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${fmtShort(max * f)}</text>`; }
    svg += `<line class="axis" x1="${L}" x2="${W - 4}" y1="${Tp + ph}" y2="${Tp + ph}"/>`;
    bins.forEach((b, i) => {
        const n = b.items.length, bh = n ? Math.max(2, ph * n / max) : 0, x = L + i * bw + 3, y = Tp + ph - bh;
        svg += `<rect class="hbar${sel === i ? ' on' : ''}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1, bw - 6).toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${col(i)}" data-hbin="${kind}:${i}" ${tipA(`${binLabel(b.e)} ${unit}: ${fmt(n)} (${pct(n, items.length)})`)}/>`;
        if (n) svg += `<text class="hval" x="${(x + (bw - 6) / 2).toFixed(1)}" y="${(y - 4).toFixed(1)}">${fmtShort(n)}</text>`;
        svg += `<text x="${(L + i * bw + bw / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${binShort(b.e)}</text>`;
    });
    const vals = items.map(x => x.v).sort((a, b) => a - b);
    const over = isFn ? vals.filter(v => v > 50).length : vals.filter(v => v > 1000).length;
    let out = `<svg class="csvg" viewBox="0 0 ${W} ${H}">${svg}</svg><div class="cstat"><span>${t('st_median')}: <b>${fmt(quant(vals, 0.5))}</b></span><span>${t('st_p90')} <b>${fmt(quant(vals, 0.9))}</b></span>` +
        `<span>${isFn ? t('st_over50') : t('st_over1000')}: <b>${fmt(over)}</b> (${pct(over, vals.length)})</span></div>`;
    if (sel >= 0 && bins[sel]) {
        const list = bins[sel].items.sort((a, b) => b.v - a.v).map(x => (isFn ? { id: x.o.id, label: x.o.qual || x.o.name, title: x.o.file.path, color: modVar(M.moduleOf(x.o.file.path)), ct: fmt(x.v), view: 'calls' } : { id: x.o.id, label: x.o.path, color: modVar(M.moduleOf(x.o.path)), ct: fmt(x.v), view: 'includes' }));
        out += `<div class="hlist"><div class="small muted">${esc(binLabel(bins[sel].e))} ${esc(unit)}: ${fmt(list.length)}</div>${listHtml(list, 60)}</div>`;
    }
    return out;
}


// Точечный график; точки, попавшие в одно место экрана, объединяются (вес - для выбора представителя)
function scatterSvg(pts, o) {
    const W = o.W || statCW, H = 280, L = 44, B = 34, Tp = 10, R = 10, pw = W - L - R, ph = H - B - Tp;
    const lg = v => Math.log10(1 + Math.max(0, v));
    const sx = v => L + (o.xlog ? lg(v) / lg(o.xmax) : v / o.xmax) * pw;
    const sy = v => Tp + ph - Math.min(1, o.ylog ? lg(v) / lg(o.ymax) : v / o.ymax) * ph;
    const ticks = (log, max) => (log ? [0, 1, 10, 100, 1000, 10000, 100000].filter(v => v <= max) : [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(max * f)));
    // Подписи зон и четвертей - поверх точек (over), иначе их закрывают густые облака точек
    let svg = '', over = '';
    for (const z of o.zones || []) {
        svg += `<rect class="zone" x="${sx(z.x0).toFixed(1)}" y="${sy(z.y1).toFixed(1)}" width="${(sx(z.x1) - sx(z.x0)).toFixed(1)}" height="${(sy(z.y0) - sy(z.y1)).toFixed(1)}"/>`;
        over += `<text class="zlabel" x="${(sx(z.x1) - 6).toFixed(1)}" y="${(z.top ? sy(z.y1) + 14 : sy(z.y0) - 6).toFixed(1)}" text-anchor="end">${esc(z.label)}</text>`;
    }
    for (const v of ticks(o.ylog, o.ymax)) svg += `<line class="grid" x1="${L}" x2="${W - R}" y1="${sy(v).toFixed(1)}" y2="${sy(v).toFixed(1)}"/><text x="${L - 6}" y="${(sy(v) + 4).toFixed(1)}" text-anchor="end">${fmtShort(v)}${o.yunit || ''}</text>`;
    for (const v of ticks(o.xlog, o.xmax)) svg += `<text x="${sx(v).toFixed(1)}" y="${Tp + ph + 15}" text-anchor="middle">${fmtShort(v)}</text>`;
    for (const q of o.lines || []) svg += q.x != null ? `<line class="thr" x1="${sx(q.x).toFixed(1)}" x2="${sx(q.x).toFixed(1)}" y1="${Tp}" y2="${Tp + ph}"/>` : `<line class="thr" x1="${L}" x2="${W - R}" y1="${sy(q.y).toFixed(1)}" y2="${sy(q.y).toFixed(1)}"/>`;
    for (const q of o.labels || []) over += `<text class="qlabel" x="${q.right ? W - R - 4 : L + 6}" y="${q.top ? Tp + 14 : Tp + ph - 6}" text-anchor="${q.right ? 'end' : 'start'}">${esc(q.text)}</text>`;
    svg += `<line class="axis" x1="${L}" x2="${W - R}" y1="${Tp + ph}" y2="${Tp + ph}"/><line class="axis" x1="${L}" x2="${L}" y1="${Tp}" y2="${Tp + ph}"/>`;
    svg += `<text x="${L + pw / 2}" y="${H - 3}" text-anchor="middle" class="atitle">${esc(o.xlabel)}</text><text transform="translate(11 ${Tp + ph / 2}) rotate(-90)" text-anchor="middle" class="atitle">${esc(o.ylabel)}</text>`;
    const cells = new Map();
    for (const p of pts) {
        const px = sx(p.x), py = sy(p.y), k = Math.round(px / 3) + ',' + Math.round(py / 3);
        const c = cells.get(k); if (c) { c.n++; if (p.w > c.p.w) c.p = p; } else cells.set(k, { px, py, n: 1, p });
    }
    for (const c of [...cells.values()].sort((a, b) => a.n - b.n)) {
        const r = Math.min(9, 2.8 + Math.sqrt(c.n - 1) * 1.1);
        svg += `<circle class="pt" cx="${c.px.toFixed(1)}" cy="${c.py.toFixed(1)}" r="${r.toFixed(1)}" fill="${c.p.color}" data-go="${esc(c.p.go)}" data-view="${c.p.view}" ${tipA(c.p.tip + (c.n > 1 ? `\n+${c.n - 1}` : ''))}/>`;
    }
    return `<svg class="csvg" viewBox="0 0 ${W} ${H}">${svg}${over}</svg>`;
}


// Файлы: размер и плотность комментариев
function docsScatter(M) {
    const fs = [...M.files.values()].filter(f => f.stats.code > 0);
    if (!fs.length) return `<div class="muted small">${t('none')}</div>`;
    const ratio = f => 100 * f.stats.comment / Math.max(1, f.stats.code + f.stats.comment);
    const sizes = fs.map(f => f.stats.code).sort((a, b) => a - b), rs = fs.map(ratio).sort((a, b) => a - b);
    const xmax = sizes[sizes.length - 1], ymax = Math.min(100, Math.max(20, Math.ceil(quant(rs, 0.98) / 10) * 10)), big = Math.max(100, quant(sizes, 0.75));
    const pts = fs.map(f => ({ x: f.stats.code, y: ratio(f), w: f.stats.code, color: modVar(M.moduleOf(f.path)), go: f.id, view: 'includes', tip: `${f.path}\n${fmt(f.stats.code)} ${t('codeLinesU')} · ${t('comments')}: ${ratio(f).toFixed(1)}%` }));
    const bad = fs.filter(f => f.stats.code >= big && ratio(f) < 5).length;
    return scatterSvg(pts, { W: chartW('#stDocs'), xmax, ymax, xlog: true, xlabel: t('codeLinesU'), ylabel: t('ax_comm'), yunit: '%', zones: big < xmax ? [{ x0: big, x1: xmax, y0: 0, y1: Math.min(5, ymax), label: t('zone_bigNoDoc') }] : [] }) +
        `<div class="cstat"><span>${t('zone_bigNoDoc')}: <b>${fmt(bad)}</b></span><span>${t('st_median')}: <b>${quant(rs, 0.5).toFixed(1)}%</b> ${t('comments').toLowerCase()}</span></div>`;
}


// Функции: сколько функций её вызывают (вверх) и скольких вызывает она (вправо)
// Данные считаются один раз на проект и язык: тысячи функций и десятки тысяч связей
const statCache = { model: null, lang: null, coup: null };
function couplingScatter(fns) {
    if (statCache.model !== model || statCache.lang !== LANG) Object.assign(statCache, { model, lang: LANG, coup: null });
    const pts = statCache.coup || (statCache.coup = fns.map(f => {
        const os = new Set(), is = new Set();
        for (const e of f.out) if (e.target && e.target.kind === 'fn' && e.kind !== 'ref') os.add(e.target);
        for (const e of f.inn) if (e.kind !== 'ref' && e.from.kind === 'fn') is.add(e.from);
        const out = os.size, inn = is.size, len = fnLen(f);
        return { x: out, y: inn, w: inn * out + len, len, color: len > 80 ? 'var(--crit)' : len > 40 ? 'var(--warn)' : 'var(--s3)', go: f.id, view: 'calls', tip: `${f.qual || f.name}
${t('ax_callers')}: ${inn} · ${t('ax_callees')}: ${out} · ${fmt(len)} ${t('lines').toLowerCase()}` };
    }));
    const xs = pts.map(p => p.x).sort((a, b) => a - b), ys = pts.map(p => p.y).sort((a, b) => a - b);
    const xmax = Math.max(4, xs[xs.length - 1]), ymax = Math.max(4, ys[ys.length - 1]);
    const qx = Math.max(3, quant(xs, 0.95)), qy = Math.max(3, quant(ys, 0.95));
    const hubs = pts.filter(p => p.x >= qx && p.y >= qy).length;
    return scatterSvg(pts, {
        W: chartW('#stCoup'), xmax, ymax, xlog: true, ylog: true, xlabel: t('ax_callees'), ylabel: t('ax_callers'),
        zones: qx < xmax && qy < ymax ? [{ x0: qx, x1: xmax, y0: qy, y1: ymax, label: t('q_hub'), top: true }] : [],
        lines: [{ x: qx }, { y: qy }], labels: [{ text: t('q_core'), top: true }, { text: t('q_orch'), right: true }],
    }) + `<div class="cstat"><span>${t('q_hub')}: <b>${fmt(hubs)}</b></span><span class="cleg"><span><i style="background:var(--s3)"></i>≤ 40</span><span><i style="background:var(--warn)"></i>41-80</span><span><i style="background:var(--crit)"></i>&gt; 80 ${t('lines').toLowerCase()}</span></span></div>`;
}


// Файлы: сколько файлов подключают его (вверх) и сколько подключает он (вправо)
function depsScatter(M) {
    const fs = [...M.files.values()].filter(f => f.incOut.length || f.incIn.length);
    if (fs.length < 3) return '';
    const pts = fs.map(f => ({ x: f.incOut.length, y: f.incIn.length, w: f.incOut.length * f.incIn.length + f.incIn.length, color: modVar(M.moduleOf(f.path)), go: f.id, view: 'includes', tip: `${f.path}
${t('ax_incBy')}: ${f.incIn.length} · ${t('ax_incs')}: ${f.incOut.length}` }));
    const xs = pts.map(p => p.x).sort((a, b) => a - b), ys = pts.map(p => p.y).sort((a, b) => a - b);
    const xmax = Math.max(4, xs[xs.length - 1]), ymax = Math.max(4, ys[ys.length - 1]);
    const qx = Math.max(3, quant(xs, 0.9)), qy = Math.max(3, quant(ys, 0.9));
    const hubs = pts.filter(p => p.x >= qx && p.y >= qy).length;
    return scatterSvg(pts, {
        W: chartW('#stDeps'), xmax, ymax, xlog: true, ylog: true, xlabel: t('ax_incs'), ylabel: t('ax_incBy'),
        zones: qx < xmax && qy < ymax ? [{ x0: qx, x1: xmax, y0: qy, y1: ymax, label: t('q_hub'), top: true }] : [],
        lines: [{ x: qx }, { y: qy }], labels: [{ text: t('q_stable'), top: true }, { text: t('q_dependent'), right: true }],
    }) + `<div class="cstat"><span>${t('q_hub')}: <b>${fmt(hubs)}</b></span><span>${t('ax_incBy')} (${t('st_median')}): <b>${fmt(quant(ys, 0.5))}</b></span></div>`;
}


// Кривая Парето: доля кода в самых крупных файлах
function paretoHtml(M) {
    const sizes = [...M.files.values()].map(f => f.stats.code).filter(v => v > 0).sort((a, b) => b - a);
    const N = sizes.length, total = sizes.reduce((a, b) => a + b, 0);
    if (N < 2 || !total) return `<div class="muted small">${t('none')}</div>`;
    const W = chartW('#stPareto'), H = 230, L = 40, B = 34, Tp = 10, R = 10, pw = W - L - R, ph = H - B - Tp;
    const px = f => L + f * pw, py = f => Tp + ph - f * ph;
    let cum = 0, p50 = 1, p80 = 1, d = `M${px(0)} ${py(0)}`;
    const step = Math.max(1, Math.floor(N / 300));
    sizes.forEach((v, i) => {
        const prev = cum; cum += v;
        if (prev < total * 0.5 && cum >= total * 0.5) p50 = (i + 1) / N;
        if (prev < total * 0.8 && cum >= total * 0.8) p80 = (i + 1) / N;
        if (i % step === 0 || i === N - 1) d += ` L${px((i + 1) / N).toFixed(1)} ${py(cum / total).toFixed(1)}`;
    });
    let svg = '';
    for (const f of [0, 0.25, 0.5, 0.75, 1]) svg += `<line class="grid" x1="${L}" x2="${W - R}" y1="${py(f)}" y2="${py(f)}"/><text x="${L - 6}" y="${py(f) + 4}" text-anchor="end">${f * 100}%</text><text x="${px(f)}" y="${Tp + ph + 15}" text-anchor="middle">${f * 100}%</text>`;
    svg += `<line class="thr" x1="${px(0)}" y1="${py(0)}" x2="${px(1)}" y2="${py(1)}"/>`;
    svg += `<path class="area" d="${d} L${px(1)} ${py(0)} Z"/><path class="curve" pathLength="1" d="${d}"/>`;
    const pctTxt = f => (f * 100 < 10 ? (f * 100).toFixed(1) : Math.round(f * 100)) + '%';
    for (const [f, y] of [[p50, 0.5], [p80, 0.8]]) svg += `<line class="thr" x1="${px(f)}" x2="${px(f)}" y1="${py(y)}" y2="${py(0)}"/><circle class="mk" cx="${px(f).toFixed(1)}" cy="${py(y).toFixed(1)}" r="4.5" ${tipA(t(y === 0.8 ? 'pareto80' : 'pareto50').replace('{p}', pctTxt(f)))}/><text class="qlabel" x="${(px(f) + 8).toFixed(1)}" y="${(py(y) + 4).toFixed(1)}">${pctTxt(f)}</text>`;
    svg += `<text x="${L + pw / 2}" y="${H - 3}" text-anchor="middle" class="atitle">${esc(t('ax_files'))}</text><text transform="translate(11 ${Tp + ph / 2}) rotate(-90)" text-anchor="middle" class="atitle">${esc(t('ax_codeShare'))}</text>`;
    return `<svg class="csvg" viewBox="0 0 ${W} ${H}">${svg}</svg><div class="cstat"><span>${esc(t('pareto80').replace('{p}', pctTxt(p80)))}</span><span>${esc(t('pareto50').replace('{p}', pctTxt(p50)))}</span></div>`;
}


const STAT_COLS = () => [['path', t('path')], ['code', t('code')], ['comment', t('comments')], ['blank', t('blank')], ['total', t('total')], ['funcs', t('funcs')], ['inc', t('includes')], ['incBy', t('includedBy')]];
function statFileRows() {
    const cols = STAT_COLS();
    const val = (f, k) => (k === 'path' ? f.path : k === 'funcs' ? f.funcs.length : k === 'inc' ? f.incOut.length : k === 'incBy' ? f.incIn.length : f.stats[k]);
    const q = statFilter.toLowerCase();
    const flist = [...model.files.values()].filter(f => !q || f.path.toLowerCase().includes(q))
        .sort((a, b) => { const x = val(a, statSort.key), y = val(b, statSort.key); return (x < y ? -1 : x > y ? 1 : 0) * statSort.dir; });
    // Тысячи строк таблицы - тысячи узлов страницы: сначала первые 200, остальные - по кнопке
    const lim = statFilesAll ? Infinity : 200;
    return [flist.slice(0, lim).map(f => `<tr class="clk" data-file="${esc(f.id)}"><td title="${esc(f.path)}">${esc(f.path)}</td>${cols.slice(1).map(([k]) => `<td>${fmt(val(f, k))}</td>`).join('')}</tr>`).join('') +
        (flist.length > lim ? `<tr><td colspan="${cols.length}"><button class="chip" data-morefiles>${t('showAll')} (${fmt(flist.length)})</button></td></tr>` : ''), flist.length];
}


function includeCycles(M) {
    // Тарьян: компоненты сильной связности размера > 1
    let idx = 0; const index = new Map(), low = new Map(), on = new Set(), stack = [], res = [];
    const files = [...M.files.values()];
    const strong = v => {
        index.set(v, idx); low.set(v, idx); idx++; stack.push(v); on.add(v);
        for (const e of v.incOut) {
            const w = e.file;
            if (!index.has(w)) { strong(w); low.set(v, Math.min(low.get(v), low.get(w))); }
            else if (on.has(w)) low.set(v, Math.min(low.get(v), index.get(w)));
        }
        if (low.get(v) === index.get(v)) {
            const comp = []; let w;
            do { w = stack.pop(); on.delete(w); comp.push(w); } while (w !== v);
            if (comp.length > 1) res.push(comp);
        }
    };
    for (const f of files) if (!index.has(f)) strong(f);
    return res;
}

/* ======================================================================
   Генератор Markdown-документации (из той же модели: дерево, связи, комментарии)
   ====================================================================== */
const mdAnchor = p => 'f-' + p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const mdCell = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
const mdCode = s => '`' + String(s).replace(/`/g, 'ˋ') + '`';
function mdQuote(text) { return text.split('\n').map(l => '> ' + l).join('\n'); }


// Язык файла: подсветка блоков кода, вид импорта, «только API» (заголовки C/C++ или публичное в остальных языках)
const MD_FENCE = { c: 'c', cpp: 'cpp', java: 'java', cs: 'csharp', py: 'python' };
const mdFence = f => MD_FENCE[f.lang] || (f.lang === 'js' ? (/\.[mc]?tsx?$/i.test(f.path) ? 'typescript' : 'javascript') : 'text');
const cLike = f => f.lang === 'c' || f.lang === 'cpp';
// Файл в справочнике API: заголовок C/C++ или любой файл языка без заголовков
const mdApiFile = f => !!f.api;
// Публичная функция для справочника API: в C/C++ - всё из заголовка, в остальных языках - не private / не «_имя»
const mdApiFn = (f, fn) => (cLike(f) ? f.isH : !fn.isStatic);
// Импорт в синтаксисе языка файла
function mdImport(f, i) {
    if (cLike(f)) return i.sys ? `<${i.path}>` : `"${i.path}"`;
    if (f.lang === 'java') return `import ${i.path}`;
    if (f.lang === 'cs') return `using ${i.path}`;
    if (f.lang === 'py') return i.kind === 'from' ? `from ${i.path} import ${(i.names || []).join(', ')}` : `import ${i.path}`;
    return `'${i.path}'`;
}


function mdFileLink(f, line) {
    return `[${mdCode(f.path + (line ? ':' + line : ''))}](#${mdAnchor(f.path)})`;
}


function generateMarkdown(opts = {}) {
    const M = model, apiOnly = !!opts.apiOnly;
    const files = [...M.files.values()].filter(f => (!apiOnly || mdApiFile(f)) && (!opts.only || opts.only.has(f))).sort((a, b) => a.path.localeCompare(b.path));
    const out = [];
    const T = M.totals;
    const date = new Date().toISOString().slice(0, 10);
    const single = opts.only && opts.only.size === 1;
    if (!single) {
        out.push(`# ${M.name} - ${apiOnly ? t('md_titleApi') : t('md_title')}`, '');
        out.push(`> ${t('md_generated')} ${date}${M.ref ? ` · \`${M.ref}\`` : ''}. ${t('md_fromComments')}`, '');
        out.push(`## ${t('md_toc')}`, '', `1. [${t('views_stats')}](#stats)`, `2. [${t('md_tree')}](#tree)`, `3. [${t('files')}](#files)`);
        for (const f of files) out.push(`   - [${mdCode(f.path)}](#${mdAnchor(f.path)})`);
        out.push('');
        // Статистика
        out.push('<a id="stats"></a>', '', `## ${t('views_stats')}`, '');
        out.push(`| ${t('path')} | ${t('files')} | ${t('lines')} | ${t('code')} | ${t('comments')} | ${t('blank')} |`, '|---|---:|---:|---:|---:|---:|');
        out.push(`| **${t('total')}** | ${M.files.size} | ${T.total} | ${T.code} | ${T.comment} | ${T.blank} |`);
        const dirs = [...M.dirs.values()].filter(d => d.path && d.nFiles && d.path.split('/').length <= 3).sort((a, b) => a.path.localeCompare(b.path));
        for (const d of dirs) out.push(`| ${mdCode(d.path + '/')} | ${d.nFiles} | ${d.stats.total} | ${d.stats.code} | ${d.stats.comment} | ${d.stats.blank} |`);
        out.push('', `${t('funcs')}: **${M.fns.size}** · ${t('macros')}: **${M.macros.size}** · ${t('types')}: **${M.types.size}** · ${t('ratio')}: **${pct(T.comment, T.code + T.comment)}**`, '');
        // Дерево директорий
        out.push('<a id="tree"></a>', '', `## ${t('md_tree')}`, '', '```text', M.name + '/');
        const walk = (d, prefix) => {
            const hasApi = x => x.files.some(mdApiFile) || x.subdirs.some(hasApi);
            const kids = [...d.subdirs.filter(s => s.nFiles && (!apiOnly || hasApi(s))).sort((a, b) => a.path.localeCompare(b.path)).map(s => ({ dir: s })),
                ...d.files.filter(f => !apiOnly || mdApiFile(f)).sort((a, b) => a.path.localeCompare(b.path)).map(f => ({ file: f }))];
            kids.forEach((k, i) => {
                const last = i === kids.length - 1;
                if (k.dir) { out.push(`${prefix}${last ? '└── ' : '├── '}${basename(k.dir.path)}/`); walk(k.dir, prefix + (last ? '    ' : '│   ')); }
                else out.push(`${prefix}${last ? '└── ' : '├── '}${basename(k.file.path)}  (${k.file.stats.code})`);
            });
        };
        walk(M.dirs.get(''), '');
        out.push('```', '', '<a id="files"></a>', '', `## ${t('files')}`, '');
    }
    for (const f of files) mdFile(f, out, apiOnly);
    return out.join('\n');
}


function mdFile(f, out, apiOnly) {
    const M = model;
    out.push(`<a id="${mdAnchor(f.path)}"></a>`, '', `### ${mdCode(f.path)}`, '');
    if (f.fileDoc) out.push(mdQuote(f.fileDoc), '');
    out.push(`*${t('lines')}: ${f.stats.total} - ${t('code').toLowerCase()} ${f.stats.code}, ${t('comments').toLowerCase()} ${f.stats.comment}, ${t('blank').toLowerCase()} ${f.stats.blank}*` + (M.web ? ` · [${t('md_source')}](${M.web(f.path)})` : ''), '');
    const inc = f.includes.map(i => (i.res && i.res.kind === 'project' && M.files.get(i.res.path) ? mdFileLink(M.files.get(i.res.path)) : mdCode(mdImport(f, i))));
    const incU = [...new Set(inc)];
    if (incU.length) out.push(`**${t('includes')}:** ${incU.join(', ')}  `);
    if (f.incIn.length) out.push(`**${t('includedBy')} (${f.incIn.length}):** ${f.incIn.slice(0, 20).map(e => mdFileLink(e.file)).join(', ')}${f.incIn.length > 20 ? ', …' : ''}`);
    if (incU.length || f.incIn.length) out.push('');

    // Функции: для заголовка C/C++ - прототипы + inline-определения; для .c - определения; в языках с классами -
    // методы с именем класса, перегрузки (одно имя, разные параметры) - отдельно
    const items = []; const seen = new Set(), cl = cLike(f);
    const key = (name, container, sig) => (cl ? name : `${container || ''}.${name}|${sig}`);
    for (const d of f.decls) {
        const k = key(d.name, d.container, d.sig); if (seen.has(k)) continue; seen.add(k);
        const fn = cl ? M.resolveFn(d.name, f) : M.resolveFn(d.name, f, d.container);
        if (apiOnly && !cl && fn && fn.isStatic) continue;
        items.push({ name: d.container ? d.container + '.' + d.name : d.name, sig: d.sig, doc: d.doc || (fn && fn.doc) || '', fn, line: d.line });
    }
    for (const id of f.fnIds) {
        const fn = M.fns.get(id); const k = key(fn.name, fn.container, fn.sig); if (seen.has(k)) continue; seen.add(k);
        if (apiOnly && !mdApiFn(f, fn)) continue;
        items.push({ name: fn.qual || fn.name, sig: fn.sig, doc: fn.doc || fn.implDoc || '', fn, line: fn.line, def: true });
    }
    if (items.length) {
        out.push(`#### ${t('funcs')}`, '');
        for (const it of items.sort((a, b) => a.line - b.line)) {
            out.push(`##### ${mdCode(it.name)}`, '', '```' + mdFence(f), it.sig + (it.def || !cl ? '' : ';'), '```', '');
            if (it.doc) out.push(it.doc, '');
            const meta = [];
            if (it.fn) {
                const hdr = it.def && it.fn.declaredIn.find(d => d.file !== f);
                if (hdr) meta.push(`${t('declaredIn')}: ${mdFileLink(hdr.file, hdr.line)}`);
                if (it.fn.file !== f || !it.def) meta.push(`${t('definedIn')}: ${mdFileLink(it.fn.file, it.fn.line)}` + (M.web ? ` ([↗](${M.web(it.fn.file.path, it.fn.startLine, it.fn.endLine)}))` : ''));
                // В C/C++ isStatic - static (виден только в своём файле), в остальных языках - private / «_имя»
                const flags = [it.fn.isStatic && (cl ? 'static' : 'private'), it.fn.isInline && 'inline'].filter(Boolean);
                if (flags.length) meta.push(flags.map(mdCode).join(' '));
                const calls = [...new Set(expandOut(it.fn, { showMacros: false }).filter(e => e.kind === 'call' || e.kind === 'indirect').map(e => (e.kind === 'indirect' ? `${e.target.name} (->${e.field})` : e.target.qual || e.target.name)))];
                if (calls.length) meta.push(`${t('calls')}: ${calls.slice(0, 15).map(mdCode).join(', ')}${calls.length > 15 ? ', …' : ''}`);
                const by = [...new Set(it.fn.inn.filter(e => e.from.kind === 'fn').map(e => e.from.qual || e.from.name))];
                if (by.length) meta.push(`${t('calledBy')}: ${by.slice(0, 15).map(mdCode).join(', ')}${by.length > 15 ? ', …' : ''}`);
            } else meta.push(`⚠ ${t('noDef')}`);
            if (meta.length) out.push(meta.map(m => '- ' + m).join('\n'), '');
        }
    }
    // Типы
    const types = []; const tseen = new Set();
    for (const ty of f.types) {
        if (tseen.has(ty.name)) continue; tseen.add(ty.name);
        const TT = M.types.get('t:' + ty.name);
        types.push([mdCode(ty.name), ty.kind + (ty.ref ? ' ' + ty.ref : ''), mdCell((TT && TT.doc) || ty.doc || '')]);
    }
    if (types.length) out.push(`#### ${t('types')}`, '', `| ${t('type')} | ${t('kind')} | ${t('md_desc')} |`, '|---|---|---|', ...types.map(r => `| ${r.join(' | ')} |`), '');
    // Макросы (без include-guard)
    const macros = f.macros.filter(m => m.body || !/(_H|_H_|_INCLUDED|_HPP|_H__)$/.test(m.name));
    if (macros.length) {
        out.push(`#### ${t('macros')}`, '', `| ${t('macro')} | ${t('md_value')} | ${t('md_desc')} |`, '|---|---|---|');
        for (const m of macros) {
            const body = m.body.replace(/\s+/g, ' '); const v = body.length > 80 ? body.slice(0, 80) + '…' : body;
            out.push(`| ${mdCode(m.name + (m.params ? '(' + m.params.join(', ') + ')' : ''))} | ${v ? mdCode(v) : ''} | ${mdCell(m.doc || '')} |`);
        }
        out.push('');
    }
    // Глобальные переменные
    const vars = f.vars.filter(v => f.isH || !v.isStatic);
    if (vars.length) {
        out.push(`#### ${t('vars')}`, '', `| ${t('variable')} | ${t('md_decl')} | ${t('md_desc')} |`, '|---|---|---|');
        for (const v of vars) out.push(`| ${mdCode(v.name)} | ${mdCode(v.sig.length > 90 ? v.sig.slice(0, 90) + '…' : v.sig)} | ${mdCell(v.doc || '')} |`);
        out.push('');
    }
}


function openMarkdown(apiOnly, only) {
    if (!model) return;
    const md = generateMarkdown({ apiOnly, only });
    const name = (only && only.size === 1 ? basename([...only][0].path) : model.name.replace(/[^\w.-]+/g, '_') + (apiOnly ? '-api' : '')) + '.md';
    const box = $('#mdmodal');
    box.innerHTML = `<div class="mdcard"><div class="phead"><h3>${esc(name)} <span class="muted small">${fmt(md.length)} B · ${fmt(md.split('\n').length)} ${t('lines').toLowerCase()}</span></h3><button class="iconbtn" data-md="close" aria-label="close">✕</button></div>
        <textarea readonly spellcheck="false"></textarea>
        <div class="row" style="padding:10px 12px;flex-wrap:wrap"><button class="iconbtn primary" data-md="dl">${t('md_download')}</button><button class="iconbtn" data-md="copy">${t('md_copy')}</button><span class="small muted grow">${t('md_note')}</span></div></div>`;
    box.querySelector('textarea').value = md;
    setShown(box, true);
    box.onclick = e => {
        const b = e.target.closest('[data-md]'); if (!b && e.target !== box) return;
        const a = b ? b.dataset.md : 'close';
        if (a === 'close') setShown(box, false);
        if (a === 'copy') navigator.clipboard.writeText(md).then(() => toast(t('copied')), () => { box.querySelector('textarea').select(); document.execCommand('copy'); toast(t('copied')); });
        if (a === 'dl') {
            const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
            const el = document.createElement('a'); el.href = url; el.download = name; el.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
        }
    };
}

/* ======================================================================
   Снимки проекта (.drift) и экспорт графов
   Снимок = результат разбора + раскладка + настройки; открывается без повторного разбора и без GitHub API.
   ====================================================================== */
let layoutRestore = null;
const SNAP_FORMAT = 'codrift-snapshot', SNAP_FORMAT_OLD = 'c-codeviz-snapshot'; // старые снимки .ccv тоже открываются
async function gzipText(text) {
    if (typeof CompressionStream === 'undefined') return new Blob([text], { type: 'application/json' });
    return new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).blob();
}


async function readMaybeGzip(buf) {
    const u8 = new Uint8Array(buf);
    if (u8[0] === 0x1f && u8[1] === 0x8b) {
        if (typeof DecompressionStream === 'undefined') throw new Error('gzip is not supported by this browser');
        return new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    }
    return new TextDecoder().decode(u8);
}


function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
}
const safeName = () => (model && model.name || 'project').replace(/[^\w.-]+/g, '_');
const r2 = v => Math.round((v || 0) * 100) / 100;


async function exportSnapshot(withSource) {
    if (!model || !model.parsed) return;
    toast(t('snapBuilding'), 1500); await sleep0();
    const files = model.parsed.map(f => { const o = Object.assign({}, f); if (!withSource) delete o.text; return o; });
    const snap = {
        format: SNAP_FORMAT, version: 1, created: new Date().toISOString(), generator: 'Codrift',
        project: { name: model.name, ref: model.ref || null, repo: model.repoSpec || null },
        ctx: model.ctxRaw, files,
        state: buildStateParams(true).toString(),
        layout: curView === 'stats' ? null : { view: curView, pos: Object.fromEntries(gdata.nodes.filter(n => n.x != null).map(n => [n.id, [r2(n.x), r2(n.y), r2(n.z)]])) },
    };
    const plain = store.get('snapPlain', false);
    const blob = plain ? new Blob([JSON.stringify(snap)], { type: 'application/json' }) : await gzipText(JSON.stringify(snap));
    downloadBlob(blob, `${safeName()}${withSource ? '' : '-nosrc'}.${plain ? 'drift.json' : 'drift'}`);
    toast(`${t('snapSaved')} ${(blob.size / 1024 / 1024).toFixed(2)} MB`, 3000);
}


// Открыть снимок: из файла, по ссылке (?snap=URL) или перетаскиванием
async function openSnapshot(getBuffer, label) {
    if (busy) return; busy = true;
    try {
        setProgress(`${t('snapOpening')} ${label || ''}`, 0.2);
        loadCancel = false;
        const text = await readMaybeGzip(await getBuffer());
        if (loadCancel) throw new Error(CANCELED);
        setProgress(t('parsing'), 0.6); await sleep0();
        const snap = JSON.parse(text);
        if (snap && (snap.format === 'codrift-graph' || snap.format === 'c-codeviz-graph')) throw new Error(t('graphNotSnap'));
        if (!snap || (snap.format !== SNAP_FORMAT && snap.format !== SNAP_FORMAT_OLD) || !Array.isArray(snap.files)) throw new Error(t('snapBad'));
        // Настройки снимка, поверх - параметры исходной ссылки (они важнее)
        if (snap.state) applyUrlState(new URLSearchParams(snap.state));
        applyUrlState(START_QUERY);
        readColors(); applyLang();
        const rs = snap.project && snap.project.repo;
        const c = snap.ctx || {};
        model = buildModel(snap.files, {
            allPaths: new Set(c.allPaths || snap.files.map(f => f.path)), ignoredDirs: c.ignoredDirs || [], roots: c.roots || 'auto',
            name: (snap.project && snap.project.name) || label || 'snapshot', ref: snap.project && snap.project.ref,
            web: rs ? makeWeb(rs.owner, rs.repo, rs.ref || 'HEAD') : null, ignoredCount: c.ignoredCount || 0, large: c.large || 0,
        });
        model.parsed = snap.files; model.repoSpec = rs || null; model.ctxRaw = c; model.fromSnapshot = true;
        layoutRestore = snap.layout || null;
        setProgress(`${t('done')}: ${model.files.size} ${t('files').toLowerCase()}`, null);
        $('#loading').hidden = true;
        busy = false;
        if (G) applyStyle();
        onModelReady();
    } catch (err) {
        busy = false; bootFail(); $('#loading').hidden = true;
        if (err.message === CANCELED) { loadCancel = false; setProgress(t('canceled'), null); toast(t('canceled'), 2000); return; }
        console.error(err);
        setProgress(err.message || String(err), null, true); toast(err.message || String(err), 6000);
    }
}


function loadSnapUrl(u) {
    store.set('snapUrl', u);
    const url = new URL(u, location.href);
    openSnapshot(async () => { const r = await fetch(url); if (!r.ok) throw new Error(u + ': HTTP ' + r.status); return r.arrayBuffer(); }, u.split('/').pop());
    // ссылка на сайт с этим снимком: ?snap=…
    START_QUERY.set('snap', u); START_QUERY.delete('repo');
}

/* ----- Экспорт графа текущего вида ----- */
function exportNodes() {
    return gdata.nodes.map(n => {
        const p = dispPos(n, new THREE.Vector3());
        const f = n.ref && (n.ref.file || (n.ref.path && n.ref));
        return { id: n.id, label: n.label, kind: n.kind, module: n.mod, file: f && f.path || null, line: n.ref && n.ref.line || null, size: r2(nodeRadius(n)), color: '#' + shadeColor(n, new THREE.Color(baseColor(n))).getHexString(), x: r2(p.x), y: r2(p.y), z: r2(p.z), doc: n.doc ? n.doc.split('\n')[0] : undefined };
    });
}
const exportLinks = () => gdata.links.map(l => ({ source: l.source.id || l.source, target: l.target.id || l.target, kind: l.kind, count: l.count || 1 }));
const xmlEsc = v => String(v == null ? '' : v).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));


function exportGraph(fmt) {
    if (!gdata.nodes.length) return;
    const nodes = exportNodes(), links = exportLinks(), base = `${safeName()}-${curView}`;
    if (fmt === 'json') {
        downloadBlob(new Blob([JSON.stringify({ format: 'codrift-graph', version: 1, project: model.name, view: curView, nodes, links }, null, 1)], { type: 'application/json' }), base + '.graph.json');
    } else if (fmt === 'gexf') {
        // GEXF (Gephi): с позициями, цветами и размерами - раскладка открывается как есть
        const rgb = c => { const x = new THREE.Color(c); return `r="${Math.round(x.r * 255)}" g="${Math.round(x.g * 255)}" b="${Math.round(x.b * 255)}"`; };
        let x = `<?xml version="1.0" encoding="UTF-8"?>\n<gexf xmlns="http://gexf.net/1.3" xmlns:viz="http://gexf.net/1.3/viz" version="1.3">\n<meta><creator>Codrift</creator><description>${xmlEsc(model.name + ' - ' + curView)}</description></meta>\n<graph defaultedgetype="directed">\n<attributes class="node"><attribute id="kind" title="kind" type="string"/><attribute id="module" title="module" type="string"/><attribute id="file" title="file" type="string"/><attribute id="line" title="line" type="integer"/></attributes>\n<attributes class="edge"><attribute id="kind" title="kind" type="string"/></attributes>\n<nodes>\n`;
        for (const n of nodes) x += `<node id="${xmlEsc(n.id)}" label="${xmlEsc(n.label)}"><attvalues><attvalue for="kind" value="${xmlEsc(n.kind)}"/><attvalue for="module" value="${xmlEsc(n.module)}"/><attvalue for="file" value="${xmlEsc(n.file)}"/>${n.line ? `<attvalue for="line" value="${n.line}"/>` : ''}</attvalues><viz:color ${rgb(n.color)}/><viz:position x="${n.x}" y="${n.y}" z="${n.z}"/><viz:size value="${n.size}"/></node>\n`;
        x += `</nodes>\n<edges>\n`;
        links.forEach((l, i) => { x += `<edge id="${i}" source="${xmlEsc(l.source)}" target="${xmlEsc(l.target)}" weight="${l.count}"><attvalues><attvalue for="kind" value="${xmlEsc(l.kind)}"/></attvalues></edge>\n`; });
        x += `</edges>\n</graph>\n</gexf>\n`;
        downloadBlob(new Blob([x], { type: 'application/xml' }), base + '.gexf');
    } else if (fmt === 'graphml') {
        let x = `<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n<key id="label" for="node" attr.name="label" attr.type="string"/><key id="kind" for="node" attr.name="kind" attr.type="string"/><key id="module" for="node" attr.name="module" attr.type="string"/><key id="file" for="node" attr.name="file" attr.type="string"/><key id="color" for="node" attr.name="color" attr.type="string"/><key id="x" for="node" attr.name="x" attr.type="double"/><key id="y" for="node" attr.name="y" attr.type="double"/><key id="z" for="node" attr.name="z" attr.type="double"/><key id="ekind" for="edge" attr.name="kind" attr.type="string"/><key id="weight" for="edge" attr.name="weight" attr.type="double"/>\n<graph id="G" edgedefault="directed">\n`;
        for (const n of nodes) x += `<node id="${xmlEsc(n.id)}"><data key="label">${xmlEsc(n.label)}</data><data key="kind">${xmlEsc(n.kind)}</data><data key="module">${xmlEsc(n.module)}</data><data key="file">${xmlEsc(n.file)}</data><data key="color">${n.color}</data><data key="x">${n.x}</data><data key="y">${n.y}</data><data key="z">${n.z}</data></node>\n`;
        for (const l of links) x += `<edge source="${xmlEsc(l.source)}" target="${xmlEsc(l.target)}"><data key="ekind">${xmlEsc(l.kind)}</data><data key="weight">${l.count}</data></edge>\n`;
        x += `</graph>\n</graphml>\n`;
        downloadBlob(new Blob([x], { type: 'application/xml' }), base + '.graphml');
    } else if (fmt === 'dot') {
        const q = v => '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
        let x = `digraph ${q(model.name + ' ' + curView)} {\n  graph [rankdir=LR, bgcolor="#03040a", fontname="monospace"];\n  node [shape=box, style="rounded,filled", fontname="monospace", fontsize=10, fontcolor="#0b0b0b"];\n  edge [color="#8888aa80", arrowsize=0.6];\n`;
        for (const n of nodes) x += `  ${q(n.id)} [label=${q(n.label)}, fillcolor=${q(n.color)}${n.file ? `, tooltip=${q(n.file + (n.line ? ':' + n.line : ''))}` : ''}];\n`;
        for (const l of links) x += `  ${q(l.source)} -> ${q(l.target)}${l.kind !== 'call' && l.kind !== 'inc' && l.kind !== 'tree' ? ` [style=dashed, label=${q(l.kind)}]` : ''};\n`;
        x += '}\n';
        downloadBlob(new Blob([x], { type: 'text/vnd.graphviz' }), base + '.dot');
    } else if (fmt === 'glb') exportGlb(nodes, base);
}


// 3D-модель (glTF binary) - открывается в Blender, Windows 3D Viewer, онлайн-просмотрщиках
async function exportGlb(nodes, base) {
    toast(t('glbBuilding'), 2000); await sleep0();
    try {
        const { GLTFExporter } = await import('https://cdn.jsdelivr.net/npm/three@0.174.0/examples/jsm/exporters/GLTFExporter.js/+esm');
        const scene = new THREE.Scene(); const root = new THREE.Group(); root.name = `${model.name} - ${curView}`; root.scale.setScalar(0.01); scene.add(root);
        const mats = new Map();
        const matFor = hex => { if (!mats.has(hex)) { const c = new THREE.Color(hex); mats.set(hex, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.35, roughness: 0.45, metalness: 0.1, name: hex })); } return mats.get(hex); };
        if (nodes.length <= 6000) {
            // Отдельный объект на узел - в Blender его видно по имени в Outliner
            const geo = new THREE.IcosahedronGeometry(1, 2);
            for (const n of nodes) {
                const m = new THREE.Mesh(geo, matFor(n.color)); m.name = n.label; m.position.set(n.x, n.y, n.z); m.scale.setScalar(Math.max(0.5, n.size));
                m.userData = { id: n.id, kind: n.kind, file: n.file || '', line: n.line || 0 }; root.add(m);
            }
        } else {
            // Огромный граф - узлы одного цвета объединены в один меш
            const unit = new THREE.IcosahedronGeometry(1, 1).toNonIndexed(), up = unit.attributes.position.array, un = unit.attributes.normal.array;
            const byColor = new Map(); for (const n of nodes) { if (!byColor.has(n.color)) byColor.set(n.color, []); byColor.get(n.color).push(n); }
            for (const [hex, list] of byColor) {
                const pos = new Float32Array(list.length * up.length), nor = new Float32Array(list.length * un.length);
                list.forEach((n, i) => { const s = Math.max(0.5, n.size); for (let k = 0; k < up.length; k += 3) { pos[i * up.length + k] = up[k] * s + n.x; pos[i * up.length + k + 1] = up[k + 1] * s + n.y; pos[i * up.length + k + 2] = up[k + 2] * s + n.z; } nor.set(un, i * un.length); });
                const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
                const m = new THREE.Mesh(g, matFor(hex)); m.name = 'nodes ' + hex; root.add(m);
            }
        }
        if (linesObj && gdata.links.length) {
            const cnt = gdata.links.length * 2, cc = curveObj ? curveObj.geometry.drawRange.count : 0;
            const cat = (a, b) => { const r = new Float32Array(a.length + b.length); r.set(a); r.set(b, a.length); return r; };
            const lp = linesObj.geometry.attributes.position.array.slice(0, cnt * 3), lc = linesObj.geometry.attributes.color.array.slice(0, cnt * 3);
            const g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.BufferAttribute(cc ? cat(lp, curveObj.geometry.attributes.position.array.slice(0, cc * 3)) : lp, 3));
            g.setAttribute('color', new THREE.BufferAttribute(cc ? cat(lc, curveObj.geometry.attributes.color.array.slice(0, cc * 3)) : lc, 3));
            const ls = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true })); ls.name = 'links'; root.add(ls);
        }
        const out = await new Promise((res, rej) => new GLTFExporter().parse(scene, res, rej, { binary: true }));
        downloadBlob(new Blob([out], { type: 'model/gltf-binary' }), base + '.glb');
    } catch (err) { console.error(err); toast('GLB: ' + (err.message || err), 6000); }
}

/* ======================================================================
   UI: вкладки, поиск, опции, панели
   ====================================================================== */
function renderTabs() {
    $('#tabs').innerHTML = VIEW_IDS.map(v => `<button role="tab" data-view="${v}" aria-selected="${v === curView}" ${model ? '' : 'disabled'}>${t('views_' + v)}</button>`).join('');
    placeTabIndicator();
}


// Подложка выбранной вкладки - одна на всю полосу, плавно переезжает (первый раз - без анимации)
function placeTabIndicator() {
    const nav = $('#tabs'), b = nav.querySelector('[aria-selected="true"]');
    if (!b || !b.offsetWidth) return;
    nav.style.setProperty('--ix', b.offsetLeft + 'px'); nav.style.setProperty('--iw', b.offsetWidth + 'px');
    if (!nav.classList.contains('ready')) requestAnimationFrame(() => nav.classList.add('ready'));
}


function setView(v, noApply) {
    curView = v; focus = null; renderTabs(); store.set('view', v);
    syncUrl();
    applyView();
}

/* Подсказки к настройкам (ключ - ключ опции или ключ подписи из I18N) */
const HINTS = {
    ru: {
        layout: 'Как расставляются узлы. «Силы» - физическая модель: связанные узлы притягиваются, остальные отталкиваются. «Дерево» - уровнями по направлению связей (кто кого подключает/вызывает). «Радиально» - уровни расходятся кольцами от центра.',
        colorBy: 'Чем раскрашены узлы: по типу (файл, функция, макрос…), по модулю (папке проекта) или по метрике - чем больше строк/связей, тем ярче.', colorShade: 'Цвет модуля или типа ведёт себя как раскраска «по метрике»: мелкие и малосвязанные узлы - тёмный оттенок своего цвета, крупные и важные - яркий. Метрика - как у размера («по связям» - число связей, иначе - строки кода).',
        sizeBy: 'От чего зависит размер узла: сумма размеров по строкам и по связям, только строки кода, только число связей или одинаковый размер у всех.',
        gran: 'Уровень детализации графа вызовов: отдельные функции или целые файлы (связь = «функции файла A вызывают функции файла B»). Отличие от «Подключений»: там связь - подключение файла (что ему нужно для сборки или работы), а здесь - реальные вызовы между файлами; две связи навстречу значат, что файлы вызывают друг друга (например, через указатели на функции).',
        showIndirect: 'Вызовы через указатели на функции: obj->field(...) связывается с функциями, которые присваиваются этому полю (например, колбэки сцены start/update/render).',
        showMacros: 'Показывать макросы отдельными узлами. Если выключено, вызов через макрос сразу ведёт к функциям, которые макрос вызывает.',
        showRefs: 'Ссылки на функцию без вызова (&fn): например, функция передаётся как колбэк в другую.',
        showExt: 'Показывать внешние узлы: функции и подключения, которых нет в проекте (libc, SDL, java.util, numpy…). Рисуются полупрозрачными каркасами.',
        showVendor: 'Показывать файлы сторонних библиотек, которые лежат в проекте, но исключены фильтром (cglm, glad, stb…).',
        hideIsolated: 'Скрыть узлы без единой связи в этом виде (например, функции, которые никто не вызывает и которые сами никого не вызывают). Помогает убрать «шум» по краям графа.',
        kinds: 'Какие объявления показывать в виде API: из заголовков C/C++, в остальных языках - из любого файла.',
        fn: 'Функции и методы.', macro: 'Макросы #define из заголовков.', type: 'struct / union / enum / typedef.', var: 'Глобальные переменные (extern).',
        includeC: 'Показывать в API и символы, определённые только в .c файлах (не static).',
        palette: 'Набор цветов сцены. «Тема» - спокойные цвета под светлую/тёмную тему сайта, остальные - собственный тёмный фон и яркие цвета.',
        shape: 'Форма узлов: гладкая сфера, огранённый кристалл или проволочный каркас.',
        material: 'Как узел освещён: матовый (обычный свет), мягкий (с контурным ободком) или светящийся (светится своим цветом).',
        selfGlow: 'Насколько узлы светятся собственным цветом (без учёта освещения).',
        rim: 'Светлый контур по краю узла - делает узлы объёмнее, «как атомы». Работает при любом материале.',
        bloom: 'Свечение вокруг ярких объектов (bloom). Красиво, но это самый дорогой эффект для видеокарты.',
        glow: 'Насколько ярко светится ореол.', bloomRadius: 'Насколько широко расплывается ореол: больше - мягкие «облака», меньше - чёткие точки.', bloomThreshold: 'С какой яркости начинается свечение: ниже - светится почти всё, выше - только самые яркие места (ядра узлов, густые пучки связей).',
        orbits: 'Электронные оболочки (кольца-орбиты) вокруг крупных узлов.',
        electrons: 'Электроны, бегущие по орбитам.',
        pulses: 'Светящиеся импульсы, бегущие по связям от вызывающего к вызываемому.',
        fog: 'Дальние узлы плавно растворяются в фоне - легче понять глубину.',
        additive: 'Связи складываются по яркости: там, где их много, получается свечение. Выключите, если граф слишком «засвечен».', linkGlow: 'Яркость связей сверх обычной. Вместе со сложением света густые пучки связей становятся яркими пятнами, а свечение (bloom) размывает их в «газовые облака» - как активность в мозге. Лучше всего видно на больших графах.',
        gradient: 'Связь окрашена от цвета узла-источника к цвету узла-цели и у источника темнее - направление видно без стрелок.',
        autoRotate: 'Сцена вращается сама, если её не трогать (через сколько секунд - ползунком ниже). Вращение идёт на полном FPS, и пока оно включено, анимация не засыпает.',
        rotateSpeed: 'Скорость автовращения: ×1 - один оборот примерно за 2,3 минуты, ×5 - примерно за 28 секунд.',
        rotateDelay: 'Через сколько секунд без движения мыши, касаний и клавиш начинается автовращение.',
        wobble: 'Лёгкое «тепловое» дрожание узлов - граф выглядит живым. 0 - выключено.',
        pulseSpeed: 'С какой скоростью импульс бежит по связи (одинаково для коротких и длинных связей).',
        pulseRate: 'Сколько импульсов в секунду выпускает каждая связь. Кнопка паузы останавливает рождение новых.',
        sky: 'Фон сцены: градиент, звёзды, процедурная туманность или сетка.',
        skyAmt: 'Яркость фона (звёзд, туманности, сетки).',
        nodeSize: 'Общий масштаб всех узлов.', nodeOpacity: 'Непрозрачность узлов проекта.', linkOpacity: 'Насколько линии связей непрозрачны (видны). В очень плотных графах (десятки связей на узел) линии дополнительно приглушаются сами, иначе они сливаются в сплошное пятно.',
        quality: 'Число граней у сфер. Больше - глаже, но тяжелее для больших графов.',
        arrows: 'Стрелки на связях выделенного узла - от того, кто вызывает (подключает), к тому, кого вызывают (подключают). Что значит стрелка в текущем виде - в легенде внизу.', particles: 'Бегущие импульсы на связях выделенного узла. Скорость и частота - как у импульсов по связям («Стиль»).',
        nearFade: 'Узлы, оказавшиеся вплотную к камере, растворяются и не закрывают обзор.',
        labelCount: 'Сколько узлов подписывать, когда ничего не выделено (самые связанные или ближайшие к камере).', labelSize: 'Размер шрифта подписей.',
        labelKinds: 'Узлы каких типов подписывать. Соседи выделенного узла подписываются всегда.',
        smooth: 'Инерция камеры: 0 - мгновенно, ближе к 1 - плавнее и «тяжелее».',
        freeRotate: 'Вращать граф в любую сторону, без привязки к горизонту. Выключите, чтобы «верх» всегда оставался сверху.',
        projection: 'Перспектива - как глазами: дальнее меньше. Изометрия - без перспективных искажений, размеры не зависят от глубины. Переход плавный. «Изометрический ракурс» ставит классический угол 45°/35°.',
        labelNear: 'Включите, чтобы без выделения подписывались ближайшие к камере узлы (до «Количества подписей»): летите по графу - подписи меняются. Выключено (по умолчанию) - подписываются самые связанные узлы. При выделении подписываются только выделенный узел и его соседи; ближние подписи и узлы скрывают дальние.',
        vidFormat: 'MP4 (H.264) - маленький файл, открывается везде, в том числе в мессенджерах. GIF - без звука и кодеков, но в разы тяжелее: лучше 480 px и 15 кадров/с.', vidLoop: 'Граф делает ровно один оборот за ролик - при повторе (GIF, зацикленное видео) стык не виден. Иначе скорость задаётся ползунком.', vidDur: 'Длина ролика в секундах.', vidSpeed: 'Сколько градусов в секунду поворачивается граф.', vidSize: 'Сторона квадратного кадра. Подписи, пояснение цветов и заголовок рисуются поверх ролика по галочкам ниже; подписи в ролике пересчитываются на каждом кадре.', vidFps: 'Частота кадров ролика: 30 - стандарт, 60 - плавнее, но тяжелее; для GIF хватит 15-24.', dirsFilter: 'Папки проекта: снимите галочку, чтобы скрыть папку со всем содержимым (например, встроенную библиотеку). Число - файлов внутри.', liveFilter: 'Показывать только файлы, подходящие под шаблоны: «src/core» - только эта папка, «!tests» - исключить. Несколько условий - через пробел. Чипы ниже прячут целые модули. Работает сразу во всех видах.', sens: 'Чувствительность вращения и масштаба.',
        fpsCap: 'Максимум кадров в секунду. 30 заметно снижает нагрузку.',
        resScale: 'Разрешение рендера. «Авто» само снижает его, если кадры не успевают отрисоваться. «Максимум» - родное разрешение экрана (на телефонах ×3).',
        msaa: 'Сглаживание краёв (MSAA): меньше «лесенок» и мерцания тонких линий. 2× и 4× почти бесплатны, 8× на больших графах заметно нагружает видеокарту (на графе в 10 тысяч узлов - около четверти времени кадра).',
        idleStop: 'Через сколько секунд бездействия остановить фоновую анимацию (рендер замрёт до следующего движения мыши). 0 - никогда. Не действует, пока включено автовращение («Стиль»).',
        showFps: 'Показывать в легенде частоту кадров и текущий масштаб разрешения.',
        theme: 'Тема интерфейса: как в системе, светлая или тёмная.',
        charge: 'Сила взаимного отталкивания узлов. Больше - граф просторнее.', linkDist: 'Желаемая длина связей.',
        gravity: 'Притяжение к центру - не даёт отдельным частям графа разлетаться.',
        decay: 'Трение: чем больше, тем быстрее раскладка успокаивается (но может застрять в неудачной форме). По умолчанию небольшое: граф дольше разрастается и распределяется равномернее. Раскладка идёт, пока силы не уравновесятся (обычно 10-20 с).',
        dagDist: 'Расстояние между уровнями в раскладках «Дерево» и «Радиально».', stopAt: 'Насколько медленно должны двигаться узлы, чтобы раскладка плавно затормозила и остановилась. Больше - останавливается раньше, меньше - дольше доводит граф; 0 - только когда силы полностью иссякнут.',
        pngScale: 'Во сколько раз разрешение картинки больше экрана.',
        png_labels: 'Нарисовать на картинке подписи узлов, как на экране.', png_legend: 'Нарисовать табличку с объяснением цветов.', png_title: 'Нарисовать название проекта и вида.',
    },
    en: {
        layout: 'How nodes are placed. Force: physics, linked nodes attract. Tree: levels along link direction. Radial: levels as rings.',
        colorBy: 'Node color: by kind, by module (project folder) or by metric (more lines/links = brighter).', colorShade: 'Module or kind colors behave like metric coloring: small, loosely linked nodes get a dark shade of their color, big and important ones a bright one. The metric follows node size (links for "by links", otherwise lines of code).',
        sizeBy: 'Node size: lines of code, number of links, or uniform.',
        gran: 'Call graph detail: functions or whole files (link = functions of A call functions of B). Unlike Imports (what a file needs to build or run), these are real calls between files; two opposite links mean the files call each other (e.g. via function pointers).',
        showIndirect: 'Calls through function pointers: obj->field(...) links to functions assigned to that field (e.g. scene callbacks).',
        showMacros: 'Show macros as nodes. When off, a call via macro leads straight to the functions it calls.',
        showRefs: 'Function references without a call (&fn), e.g. passed as a callback.',
        showExt: 'Show external nodes (libc, SDL, java.util, numpy…) as translucent wireframes.',
        showVendor: '3rd-party library files that are inside the project but excluded by filters.',
        hideIsolated: 'Hide nodes with no links in this view - removes noise around the graph.',
        kinds: 'Which declarations to show in the API view: from C/C++ headers, in other languages from any file.',
        fn: 'Functions and methods.', macro: '#define macros from headers.', type: 'struct / union / enum / typedef.', var: 'Global (extern) variables.',
        includeC: 'Also show non-static symbols defined only in .c files.',
        palette: 'Scene colors. Theme = calm colors matching the UI theme; others use their own dark background.',
        shape: 'Node shape: sphere, faceted crystal or wireframe.', material: 'Lighting: matte, soft (rim light) or glowing.',
        selfGlow: 'How much nodes glow with their own color.', rim: 'Rim light brightness - makes nodes look volumetric.',
        bloom: 'Glow around bright objects. The most expensive effect for the GPU.', glow: 'How bright the glow is.', bloomRadius: 'How far the glow spreads: higher gives soft “clouds”, lower gives crisp dots.', bloomThreshold: 'Brightness at which glow starts: lower makes almost everything glow, higher only the brightest spots (node cores, dense link bundles).',
        orbits: 'Orbit rings around big nodes.', electrons: 'Electrons moving along orbits.', pulses: 'Glowing pulses flowing from caller to callee.',
        fog: 'Far nodes fade into the background.', additive: 'Links add up in brightness; turn off if the graph looks washed out.', linkGlow: 'Extra link brightness. With additive light, dense link bundles turn into bright spots and bloom blurs them into “gas clouds”, like brain activity. Best on large graphs.',
        gradient: 'A link goes from the source node color to the target node color and is darker at the source.', autoRotate: 'Rotate on its own when idle (the delay is set below). Rotation runs at full FPS, and while it is on the animation never sleeps.', rotateSpeed: 'Auto-rotation speed: ×1 is about one turn per 2.3 min, ×5 about 28 s.', rotateDelay: 'Idle seconds (no mouse, touch or keys) before auto-rotation starts.',
        wobble: 'Subtle thermal jitter of nodes. 0 = off.', pulseSpeed: 'How fast a pulse travels along a link.', pulseRate: 'Pulses per second per link. The pause button stops new ones.', sky: 'Background: gradient, stars, procedural nebula or grid.', skyAmt: 'Background brightness.',
        nodeSize: 'Global node scale.', nodeOpacity: 'Node opacity.', linkOpacity: 'How opaque (visible) link lines are. Very dense graphs (dozens of links per node) dim their lines further automatically, otherwise they merge into a solid blob.', quality: 'Sphere detail.',
        arrows: 'Arrows on links of the selected node, from the caller (importer) to the callee (imported). The legend below says what an arrow means in the current view.', particles: 'Pulses on links of the selected node. Speed and rate are shared with link pulses (Style).', nearFade: 'Nodes right in front of the camera dissolve.',
        vidFormat: 'MP4 (H.264) is small and plays everywhere, including messengers. GIF needs no codecs but is far heavier: prefer 480 px and 15 fps.', vidLoop: 'The graph makes exactly one turn per clip, so the loop seam is invisible. Otherwise the speed slider sets it.', vidDur: 'Clip length in seconds.', vidSpeed: 'Rotation in degrees per second.', vidSize: 'Side of the square frame. Labels, color key and title are drawn on the clip per the checkboxes below; labels are re-placed every frame.', vidFps: 'Clip frame rate: 30 is standard, 60 is smoother but heavier; 15-24 is enough for GIF.', dirsFilter: 'Project folders: uncheck one to hide it with everything inside (e.g. a bundled library). The number is the file count.', labelCount: 'How many nodes get labels when nothing is selected (the most connected or the nearest).', labelNear: 'Turn on to label the nodes nearest to the camera when nothing is selected (labels change as you fly). Off by default: the most connected nodes are labelled. With a selection only the node and its neighbours are labelled.', labelSize: 'Label font size.', labelKinds: 'Which node kinds get labels (the selection always does).',
        smooth: 'Camera inertia.', sens: 'Rotate/zoom sensitivity.', fpsCap: 'Frame rate limit; 30 lowers load a lot.',
        resScale: 'Render resolution; Auto lowers it when frames are late, Max is the native screen resolution.', msaa: 'Edge anti-aliasing (MSAA): fewer jaggies and less shimmering of thin lines. 2× and 4× are almost free, 8× noticeably loads the GPU on large graphs.',
        idleStop: 'Stop background animation after this many idle seconds. 0 = never. Ignored while auto-rotation (Style) is on.', showFps: 'Show FPS and resolution scale in the legend.',
        theme: 'UI theme.', charge: 'Node repulsion.', linkDist: 'Preferred link length.', gravity: 'Pull to the center.',
        decay: 'Friction: higher settles faster but may get stuck in a poor shape. Low by default, so the graph spreads out more evenly; the layout runs until the forces balance (usually 10-20 s).',
        dagDist: 'Distance between levels in Tree/Radial layouts.', stopAt: 'How slow nodes must move before the layout smoothly brakes and stops. Higher stops sooner, lower keeps refining longer; 0 - only when the forces fully die out.', pngScale: 'Image resolution relative to the screen.',
        png_labels: 'Draw node labels.', png_legend: 'Draw the color key.', png_title: 'Draw project and view title.',
    },
};
// Подсказка по ключу опции или по ключу подписи (ищется по переведённому тексту)
function hintFor(key, label) {
    const H = HINTS[LANG] || HINTS.ru;
    if (key && H[key]) return H[key];
    if (key && key.startsWith('v_') && H[key.slice(2)]) return H[key.slice(2)];
    if (label) { const dict = I18N[LANG] || {}; for (const k in dict) if (dict[k] === label && H[k]) return H[k]; }
    return '';
}
const hintIcon = h => (h ? `<span class="hint" data-hint="${esc(h)}" tabindex="0" role="button" aria-label="?">?</span>` : '');

let optsTab = store.get('optsTab', 'view');
const PHYS_KEYS = new Set(['charge', 'linkDist', 'gravity', 'decay', 'dagDist', 'stopAt']);
const SLIDERS = {
    charge: [0.1, 4, 0.05], linkDist: [0.2, 4, 0.05], gravity: [0, 5, 0.05], decay: [0.05, 0.9, 0.01], stopAt: [0, 3, 0.1], dagDist: [0.3, 4, 0.05],
    nodeSize: [0.3, 3, 0.05], nodeOpacity: [0.2, 1, 0.01], linkOpacity: [0.05, 1, 0.01], linkGlow: [0.2, 6, 0.1], bloomRadius: [0, 1.5, 0.05], bloomThreshold: [0, 1, 0.01], quality: [4, 24, 1],
    labelCount: [0, 1000, 5], labelSize: [8, 20, 1], smooth: [0, 0.98, 0.01], sens: [0.2, 3, 0.05],
    idleStop: [0, 300, 5], vidDur: [2, 30, 1], vidSpeed: [5, 180, 5], rotateSpeed: [0.1, 5, 0.1], rotateDelay: [1, 60, 1], pulseSpeed: [8, 240, 1], pulseRate: [0.2, 4, 0.1], glow: [0, 3, 0.05], selfGlow: [0, 1.5, 0.05], wobble: [0, 4, 0.1], rim: [0, 2, 0.05], skyAmt: [0, 2, 0.05],
};
// Как применить изменение параметра стиля
const STYLE_APPLY = {
    palette: 'style', sky: 'sky', skyAmt: 'sky', fog: 'style', shape: 'nodes', material: 'nodes', rim: 'rim', selfGlow: 'glowSelf',
    orbits: 'cosmos', electrons: 'cosmos', pulses: 'cosmos', bloom: 'bloom', glow: 'bloom', bloomRadius: 'bloom', bloomThreshold: 'bloom', additive: 'lines', gradient: 'lines', linkOpacity: 'lines', linkGlow: 'lines',
    nodeOpacity: 'nodes', wobble: 'frame', autoRotate: 'frame', rotateSpeed: 'frame', rotateDelay: 'frame', pulseSpeed: 'frame', pulseRate: 'frame',
};
function applyStyleKey(k) {
    const how = STYLE_APPLY[k];
    if (STYLE_KEYS.includes(k)) vis.styleEdited = true;
    if (how === 'style') applyStyle();
    else if (how === 'sky') rebuildSky();
    else if (how === 'nodes') { rebuildNodeMesh(); }
    else if (how === 'rim') { rimUniform.value = vis.rim; requestRender(); }
    else if (how === 'glowSelf') { if (nodesObj && vis.material !== 'flat') { nodesObj.material.emissive.set(0xffffff); nodesObj.material.emissiveIntensity = vis.selfGlow; } requestRender(); }
    else if (how === 'cosmos') rebuildCosmos();
    else if (how === 'bloom') ensureBloom();
    else if (how === 'lines') recolorLines();
    else if (how === 'frame') { posDirty = true; requestRender(); }
    else refreshVisual();
}


// Дерево папок проекта для фильтра: у каждой папки - галочка (снять = скрыть папку со всем содержимым) и число файлов
function dirTreeHtml() {
    if (!model || !model.files) return '';
    const root = { kids: new Map(), n: 0 };
    for (const f of model.files.values()) {
        const parts = (f.path || '').split('/').slice(0, -1); let node = root; root.n++;
        for (const p of parts) { let k = node.kids.get(p); if (!k) node.kids.set(p, k = { kids: new Map(), n: 0 }); k.n++; node = k; }
    }
    if (!root.kids.size) return '';
    const walk = (node, prefix, depth, off) => [...node.kids].sort((a, b) => a[0].localeCompare(b[0])).map(([name, k]) => {
        const path = prefix ? prefix + '/' + name : name, hid = liveFilter.dirs.has(path), dis = off;
        const row = `<label class="check"><input type="checkbox" data-dir="${esc(path)}" ${hid || off ? '' : 'checked'} ${dis ? 'disabled' : ''}><span class="grow">${esc(name)}</span><span class="muted small">${k.n}</span></label>`;
        return k.kids.size ? `<details ${depth < 1 ? 'open' : ''}><summary>${row}</summary>${walk(k, path, depth + 1, off || hid)}</details>` : `<div class="leaf">${row}</div>`;
    }).join('');
    return `<div class="dirtree">${walk(root, '', 0, false)}</div>`;
}


function renderOpts() {
    const o = viewOpts[curView]; const el = $('#opts');
    const seg = (key, items, src = o, attr = 'data-seg') => `<div class="seg" ${attr}="${key}">${items.map(([v, l]) => `<button data-v="${v}" aria-pressed="${src[key] === v}">${esc(l)}</button>`).join('')}</div>`;
    const vseg = (key, items) => seg(key, items, vis, 'data-vseg');
    const chk = (key, label, obj = 'v') => { const hn = hintFor(key, label); return `<label class="check" ${hn ? `data-hint="${esc(hn)}"` : ''}><input type="checkbox" data-chk="${key}" data-obj="${obj}" ${(obj === 'c' ? vis : o)[key] ? 'checked' : ''}><span class="grow">${esc(label)}</span>${hintIcon(hn)}</label>`; };
    const slider = (key) => {
        const [mn, mx, st] = SLIDERS[key];
        const hn = hintFor(key, t('v_' + key));
        return `<label class="field slider" ${hn ? `data-hint="${esc(hn)}"` : ''}><span><span class="lbl">${esc(t('v_' + key))}${hintIcon(hn)}</span> <b data-out="${key}">${fmtSlider(key, vis[key])}</b></span><input type="range" data-vis="${key}" min="${mn}" max="${mx}" step="${st}" value="${vis[key]}"></label>`;
    };
    const field = (label, html, key) => { const hn = hintFor(key, label); return `<div class="field" ${hn ? `data-hint="${esc(hn)}"` : ''}><span class="lbl">${esc(label)}${hintIcon(hn)}</span>${html}</div>`; };
    const hr = `<hr style="border:0;border-top:1px solid var(--line);margin:10px 0">`;
    const sub = x => x ? `<div class="osub">${x}</div>` : ''; // вложенные настройки под галочкой
    const tabs = [['view', t('o_view')], ['style', t('o_style')], ['screen', t('o_screen')], ['phys', t('o_phys')], ['export', t('o_export')]];
    const head = `<div class="ohead"><div class="seg otabs" data-otab>${tabs.map(([v, l]) => `<button data-v="${v}" aria-pressed="${optsTab === v}">${esc(l)}</button>`).join('')}</div></div>`;
    let h = '';
    if (optsTab === 'view') {
        h += field(t('liveFilter'), `<input type="text" id="lfInput" value="${esc(liveFilter.text)}" placeholder="src/core !tests" spellcheck="false" autocomplete="off">`, 'liveFilter');
        if (model && model.files && model.files.size > 1) h += field(t('dirsFilter'), dirTreeHtml(), 'dirsFilter');
        if (model && model.modules) h += `<div class="chips mods" style="margin:-4px 0 8px">${model.modules.map(m => `<label class="check chipchk"><input type="checkbox" data-mod="${esc(m)}" ${liveFilter.hidden.has(m) ? '' : 'checked'}><i class="dot" style="background:${m === '…' ? colorCache['--ext'] : colorCache[MOD_SLOTS[model.modules.indexOf(m)]]}"></i>${esc(m === '…' ? t('other') : m)}</label>`).join('')}</div>`;
        h += `<h4>${t('views_' + curView)}</h4>`;
        h += field(t('colorBy'), seg('color', [['kind', t('col_kind')], ['module', t('col_module')], ['metric', t('col_metric')]]));
        if (o.color !== 'metric') h += sub(chk('colorShade', t('colorShade'), 'c'));
        h += field(t('sizeBy'), vseg('sizeBy', [['both', t('size_both')], ['lines', t('size_lines')], ['degree', t('size_degree')], ['uniform', t('size_uniform')]]));
        if (curView === 'includes') h += chk('showVendor', t('showVendor')) + chk('showExt', t('showExt')) + chk('hideIsolated', t('hideIsolated'));
        if (curView === 'calls') {
            h += field(t('gran'), seg('gran', [['fn', t('gran_fn')], ['file', t('gran_file')]]));
            h += chk('showIndirect', t('showIndirect')) + chk('showMacros', t('showMacros')) + chk('showRefs', t('showRefs')) + chk('showExt', t('showExt')) + chk('hideIsolated', t('hideIsolated'));
        }
        if (curView === 'api') {
            const c = model && model.langs && [...model.langs].some(l => l === 'c' || l === 'cpp'); // макросы и .c - понятия C/C++
            h += field(t('kinds'), chk('fn', t('funcs')) + (c ? chk('macro', t('macros')) : '') + chk('type', t('types')) + chk('var', t('vars'))) + (c ? chk('includeC', t('includeC')) : '');
        }
    } else if (optsTab === 'style') {
        // Пресеты - карточки; дальше все параметры пресета можно менять по отдельности
        h += `<div class="presets">${Object.keys(STYLE_PRESETS).map(k => `<button class="preset ${vis.style === k ? 'on' : ''}" data-preset="${k}"><i class="pv pv-${k}"></i><span>${esc(t('st_' + k))}</span></button>`).join('')}</div>`;
        if (vis.styleEdited) h += `<div class="row small muted" style="margin:4px 0 6px">${t('presetEdited')} <button class="chip" data-oact="resetPreset">${t('resetPreset')}</button></div>`;
        // Группы: узлы, связи, свечение, сцена. Зависимые ползунки - под своей галочкой и скрыты, пока она выключена
        h += `<h4>${t('g_nodes')}</h4>`;
        h += field(t('palette'), vseg('palette', [['theme', t('pal_theme')], ['vivid', t('pal_vivid')], ['cosmos', t('pal_cosmos')], ['neon', t('pal_neon')], ['blueprint', t('pal_blueprint')]]));
        h += field(t('shape'), vseg('shape', [['sphere', t('sh_sphere')], ['crystal', t('sh_crystal')], ['wire', t('sh_wire')]]));
        h += field(t('material'), vseg('material', [['flat', t('m_flat')], ['soft', t('m_soft')], ['glow', t('m_glow')]]));
        h += (vis.material !== 'flat' ? slider('selfGlow') : '') + slider('rim') + slider('nodeOpacity') + slider('wobble');
        h += chk('orbits', t('c_orbits'), 'c') + sub(vis.orbits && chk('electrons', t('c_electrons'), 'c'));
        h += hr + `<h4>${t('g_links')}</h4>` + slider('linkOpacity') + slider('linkGlow');
        h += chk('additive', t('c_additive'), 'c') + chk('gradient', t('gradient'), 'c');
        // Скорость и частота - общие для фоновых импульсов и импульсов выделенного узла
        h += chk('pulses', t('c_pulses'), 'c') + sub(vis.pulses && slider('pulseSpeed') + slider('pulseRate'));
        h += hr + `<h4>${t('g_glow')}</h4>` + chk('bloom', t('c_bloom'), 'c') + sub(vis.bloom && slider('glow') + slider('bloomRadius') + slider('bloomThreshold'));
        h += hr + `<h4>${t('g_scene')}</h4>`;
        h += field(t('sky'), vseg('sky', [['none', t('sky_none')], ['gradient', t('sky_gradient')], ['stars', t('sky_stars')], ['nebula', t('sky_nebula')], ['grid', t('sky_grid')]]), 'sky');
        h += sub(vis.sky !== 'none' && slider('skyAmt') + (vis.sky === 'stars' || vis.sky === 'nebula' ? `<button class="iconbtn" data-oact="newSky" style="margin:2px 0 6px">${t('newSky')}</button>` : ''));
        h += chk('fog', t('c_fog'), 'c') + chk('autoRotate', t('c_autoRotate'), 'c') + sub(vis.autoRotate && slider('rotateSpeed') + slider('rotateDelay'));
    } else if (optsTab === 'screen') {
        h += slider('nodeSize') + slider('quality') + chk('nearFade', t('nearFade'), 'c');
        // Импульсы выделения используют ту же скорость и частоту, что и фоновые; без фоновых ползунки - здесь
        h += hr + `<h4>${t('g_select')}</h4>` + chk('arrows', t('arrows'), 'c') + chk('particles', t('particles'), 'c') + sub(vis.particles && !vis.pulses && slider('pulseSpeed') + slider('pulseRate'));
        h += hr + `<h4>${t('labels')}</h4>` + slider('labelCount') + slider('labelSize') + chk('labelNear', t('labelNear'), 'c');
        const L = KIND_LABEL(); const kinds = [...new Set(gdata.nodes.map(n => n.kind))];
        h += field(t('labelKinds'), `<div class="chips">${kinds.map(k => `<label class="check chipchk"><input type="checkbox" data-lk="${k}" ${vis.labelKinds[k] !== false ? 'checked' : ''}><i class="dot" style="background:${colorCache[KIND_COLORS[k]] || colorCache['--ext']}"></i>${esc(k === 'vendor' ? t('vendor') : L[k] || k)}</label>`).join('')}</div>`);
        h += hr + `<h4>${t('camera')}</h4>` + slider('smooth') + slider('sens') + chk('freeRotate', t('freeRotate'), 'c');
        h += field(t('projection'), vseg('proj', [['persp', t('proj_persp')], ['iso', t('proj_iso')]]) + `<button class="iconbtn" data-oact="isoView" style="margin-top:6px">${t('isoView')}</button>`, 'projection');
        h += hr + `<h4>${t('perf')}</h4>`;
        h += field(t('fpsCap'), vseg('fps', [[0, t('fps_auto')], [60, '60'], [30, '30']]));
        h += field(t('resScale'), vseg('res', [['low', t('res_low')], ['mid', t('res_mid')], ['auto', t('res_auto')], ['high', t('res_high')], ['max', t('res_max')]]));
        h += field(t('msaa'), vseg('msaa', [[0, t('fps_auto') === 'Нет' ? 'Выкл' : 'Off'], [2, '2×'], [4, '4×'], [8, '8×']]));
        h += slider('idleStop') + chk('showFps', t('showFps'), 'c');
        if (gpu.name) h += `<div class="field"><span class="lbl">${t('gpuLabel')}</span><div class="mono small">${esc(gpu.name)}</div>` +
            (gpu.kind === 'integrated' || gpu.kind === 'software' ? `<p class="small" style="margin:2px 0 0;color:var(--warn)">${t(gpu.kind === 'software' ? 'gpuSoftwareHint' : 'gpuIntegratedHint')}</p>` : '') + `</div>`;
        h += `<p class="small muted" style="margin:4px 0 0">${t('perfHint')}</p>`;
        h += field(t('theme'), `<div class="seg" data-theme-seg>${[['auto', 'Auto'], ['light', '☀'], ['dark', '☾']].map(([v, l]) => `<button data-v="${v}" aria-pressed="${(store.get('theme', 'auto')) === v}">${l}</button>`).join('')}</div>`);
    } else if (optsTab === 'phys') {
        h += field(t('layout'), seg('layout', [['force', t('lay_force')], ['td', t('lay_td')], ['radialout', t('lay_radial')]]), 'layout');
        h += slider('charge') + slider('linkDist') + slider('gravity') + slider('decay') + slider('stopAt') + (o.layout !== 'force' ? slider('dagDist') : '');
        h += `<div class="row"><button class="iconbtn grow" data-oact="reheat">${t('reheat')}</button></div>`;
    } else {
        h += `<p class="small muted" style="margin:0 0 8px">${t('mdHint')}</p>`;
        // «Только API»: заголовки C/C++, в остальных языках - публичные классы и методы; в смешанном проекте - и то и другое
        const langs = model && model.langs ? [...model.langs] : ['c'], hdr = langs.filter(l => l === 'c' || l === 'cpp').length;
        const apiLbl = hdr === langs.length ? t('mdApi') : hdr ? t('mdApiMixed') : t('mdApiPub');
        h += `<div class="field"><button class="iconbtn primary" data-oact="mdAll">${t('mdAll')}</button><button class="iconbtn" data-oact="mdApi">${apiLbl}</button></div>`;
        h += hr + `<h4>${t('png')}</h4>`;
        h += field(t('pngScale'), `<div class="seg" data-pngscale>${[1, 2, 3, 4].map(v => `<button data-v="${v}" aria-pressed="${vis.png.scale === v}">${v}×</button>`).join('')}</div>`);
        const cv = G && G.renderer().domElement, ps = cv ? pngScale(cv.clientWidth, cv.clientHeight) : 1;
        if (cv) h += `<div class="small muted" style="margin:-4px 0 6px">${Math.round(cv.clientWidth * ps)} × ${Math.round(cv.clientHeight * ps)} px</div>`;
        h += ['labels', 'legend', 'title'].map(k => { const hn = hintFor('png_' + k); return `<label class="check" data-hint="${esc(hn)}"><input type="checkbox" data-png="${k}" ${vis.png[k] ? 'checked' : ''}><span class="grow">${esc(t('png_' + k))}</span>${hintIcon(hn)}</label>`; }).join('');
        h += `<div class="field" style="margin-top:6px"><button class="iconbtn primary" data-oact="png">${t('pngSave')}</button></div>`;
        // Видео и GIF: квадратный кадр, граф вращается вокруг вертикали камеры
        h += hr + `<h4>${t('video')}</h4>`;
        const mp4ok = 'VideoEncoder' in window;
        h += field(t('vidFormat'), vseg('vidFmt', [['mp4', 'MP4'], ['gif', 'GIF']]), 'vidFormat');
        if (!mp4ok && vis.vidFmt === 'mp4') h += `<p class="small" style="margin:-4px 0 6px;color:var(--warn)">${t('vidNoMp4')}</p>`;
        h += field(t('vidSize'), vseg('vidSize', [[480, '480'], [720, '720'], [1080, '1080']]), 'vidSize');
        h += field(t('vidFps'), vseg('vidFps', [[15, '15'], [24, '24'], [30, '30'], [60, '60']]), 'vidFps');
        h += slider('vidDur') + chk('vidLoop', t('vidLoop'), 'c') + sub(!vis.vidLoop && slider('vidSpeed'));
        h += chk('vidLabels', t('png_labels'), 'c') + chk('vidLegend', t('png_legend'), 'c') + chk('vidTitle', t('png_title'), 'c');
        h += `<div class="field" style="margin-top:6px"><button class="iconbtn primary" data-oact="video" ${videoRec ? 'disabled' : ''}>${t('vidSave')}</button></div>`;
        h += hr + `<h4>${t('snapTitle')}</h4><p class="small muted" style="margin:0 0 6px">${t('snapHint')}</p>`;
        h += `<label class="check"><input type="checkbox" data-snapsrc ${store.get('snapSrc', true) ? 'checked' : ''}>${t('snapWithSrc')}</label>`;
        h += `<label class="check"><input type="checkbox" data-snapplain ${store.get('snapPlain', false) ? 'checked' : ''}>${t('snapPlain')}</label>`;
        h += `<div class="field"><button class="iconbtn primary" data-oact="snap">${t('snapSave')}</button></div>`;
        h += hr + `<h4>${t('graphExport')}</h4><p class="small muted" style="margin:0 0 6px">${t('graphExportHint')}</p>`;
        h += `<div class="xbtns">${[['glb', 'GLB · 3D (Blender)'], ['gexf', 'GEXF (Gephi)'], ['graphml', 'GraphML (yEd)'], ['dot', 'DOT (Graphviz)'], ['json', 'JSON']].map(([k, l]) => `<button class="iconbtn" data-export="${k}">${l}</button>`).join('')}</div>`;
        h += hr + `<div class="field"><button class="iconbtn" data-oact="link">${t('copyLink')}</button></div>`;
        h += `<div class="field"><button class="iconbtn" data-oact="source">${t('switchProject')}</button></div>`;
    }
    // Прокрутку внутри вкладки сохраняем при перерисовке (иначе каждый клик возвращал бы наверх)
    const prev = el.querySelector('.obody'), keep = prev && el.dataset.tab === optsTab ? prev.scrollTop : 0;
    const lfa = document.activeElement && document.activeElement.id === 'lfInput' ? document.activeElement : null, focusLf = lfa ? lfa.selectionStart : 0;
    const tabChanged = !!el.dataset.tab && el.dataset.tab !== optsTab;
    el.innerHTML = head + `<div class="obody">${h}</div>` +
        `<div class="ofoot"><button class="iconbtn" data-oact="resetTab">${t('resetTab')}</button><button class="iconbtn" data-oact="resetAll">${t('resetAll')}</button></div>`;
    el.dataset.tab = optsTab; el.dataset.view = curView;
    el.querySelector('.obody').scrollTop = keep;
    if (tabChanged) el.querySelector('.obody').classList.add('tabswap');
    if (lfa) { const i = el.querySelector('#lfInput'); if (i) { i.focus(); i.setSelectionRange(focusLf, focusLf); } }
}


function fmtSlider(k, v) {
    if (k === 'quality' || k === 'labelCount' || k === 'labelSize') return String(Math.round(v));
    if (k === 'rotateSpeed') return '×' + Number(v).toFixed(1);
    if (k === 'vidDur') return `${Math.round(v)} ${LANG === 'ru' ? 'с' : 's'}`;
    if (k === 'vidSpeed') return `${Math.round(v)}°/${LANG === 'ru' ? 'с' : 's'}`;
    if (k === 'rotateDelay') return `${Math.round(v)} ${LANG === 'ru' ? 'с' : 's'}`;
    if (k === 'pulseSpeed') return `${Math.round(v)} ${LANG === 'ru' ? 'ед/с' : 'u/s'}`;
    if (k === 'pulseRate') return `${Number(v).toFixed(1)} ${LANG === 'ru' ? 'в с' : '/s'}`;
    if (k === 'idleStop') return v > 0 ? `${Math.round(v)} ${LANG === 'ru' ? 'с' : 's'}` : (LANG === 'ru' ? 'никогда' : 'never');
    if (['nodeOpacity', 'linkOpacity', 'smooth', 'decay', 'glow', 'selfGlow', 'wobble', 'rim', 'skyAmt', 'bloomRadius', 'bloomThreshold'].includes(k)) return Number(v).toFixed(2);
    return '×' + Number(v).toFixed(2);
}


let radTimer = 0;
function onOptsEvent(e) {
    const pr = e.target.closest('[data-preset]');
    if (pr && e.type === 'click') { applyPreset(pr.dataset.preset); vis.styleEdited = false; saveVis(); renderOpts(); return; }
    const b = e.target.closest('button[data-v]');
    if (b && e.type === 'click') {
        const p = b.parentElement;
        if (p.hasAttribute('data-otab')) { optsTab = b.dataset.v; store.set('optsTab', optsTab); renderOpts(); return; }
        if (p.hasAttribute('data-theme-seg')) { setTheme(b.dataset.v); renderOpts(); return; }
        if (p.hasAttribute('data-pngscale')) { vis.png.scale = Number(b.dataset.v); saveVis(); renderOpts(); return; }
        if (p.dataset.vseg) {
            const k = p.dataset.vseg; vis[k] = ['fps', 'msaa', 'vidSize', 'vidFps'].includes(k) ? Number(b.dataset.v) : b.dataset.v; saveVis();
            if (k.startsWith('vid')) { renderOpts(); return; }
            if (k === 'res') applyRenderScale();
            else if (k === 'proj') { requestRender(); updateProjBtn(); }
            else if (k === 'msaa') applyMsaa();
            else if (k === 'fps') requestRender();
            else if (k === 'sizeBy') { refreshVisual(); physicsRadii(); }
            else applyStyleKey(k);
            renderOpts();
            return;
        }
        if (p.dataset.seg) {
            if (viewOpts[curView][p.dataset.seg] === b.dataset.v) return; // уже выбрано - раскладку не перезапускаем
            if (p.dataset.seg === 'layout') relayoutNext = true;
            viewOpts[curView][p.dataset.seg] = b.dataset.v; store.set('viewOpts', viewOpts); syncUrl();
            renderOpts();
            if (p.dataset.seg === 'color') { refreshStyles(); rebuildHlPulses(); renderLegend(); }
            else applyView(true);
            return;
        }
    }
    const act = e.target.closest('[data-oact]');
    if (act && e.type === 'click') { optsAction(act.dataset.oact); return; }
    const ex = e.target.closest('[data-export]');
    if (ex && e.type === 'click') { exportGraph(ex.dataset.export); return; }
    const ss = e.target.closest('input[data-snapsrc]');
    if (ss && e.type === 'change') { store.set('snapSrc', ss.checked); return; }
    const sp2 = e.target.closest('input[data-snapplain]');
    if (sp2 && e.type === 'change') { store.set('snapPlain', sp2.checked); return; }
    const r = e.target.closest('input[data-vis]');
    if (r && e.type === 'input') {
        const k = r.dataset.vis; vis[k] = parseFloat(r.value); saveVis();
        const out = $(`[data-out="${k}"]`); if (out) out.textContent = fmtSlider(k, vis[k]);
        if (k === 'stopAt') { if (physics.active) physicsSend('params', { cfg: physicsCfg() }); }
        else if (k === 'dagDist' && workerLayout()) { if (viewOpts[curView].layout !== 'force') physicsStart({ warmup: 0, soft: 800 }); }
        else if (PHYS_KEYS.has(k)) { applyPhysics(); reheat(); }
        else if (k.startsWith('vid')) { /* настройки записи видео - применяются при записи */ }
        else if (k === 'labelCount' || k === 'labelSize') scheduleLabels(120);
        else if (k === 'smooth' || k === 'sens' || k === 'idleStop') { requestRender(); }
        else if (STYLE_APPLY[k]) applyStyleKey(k);
        else refreshVisual();
        // Размер узлов и дрожание меняют радиус столкновений - раскладка расталкивает узлы (после остановки ползунка)
        if (k === 'nodeSize' || k === 'wobble') { clearTimeout(radTimer); radTimer = setTimeout(physicsRadii, 300); }
        return;
    }
    if (e.target.id === 'lfInput' && e.type === 'input') { setLiveFilter(e.target.value); return; }
    const dc = e.target.closest('input[data-dir]');
    if (dc && e.type === 'change') {
        const ds = new Set(liveFilter.dirs), p = dc.dataset.dir;
        if (dc.checked) ds.delete(p); else ds.add(p);
        // Вложенные галочки скрытой папки недоступны (и наоборот, когда её вернули)
        const box = dc.closest('details'); if (box) for (const x of box.querySelectorAll('input[data-dir]')) if (x !== dc) { x.disabled = !dc.checked; if (!dc.checked) x.checked = false; else x.checked = !ds.has(x.dataset.dir); }
        setLiveFilter(null, null, ds); return;
    }
    const mc = e.target.closest('input[data-mod]');
    if (mc && e.type === 'change') { const hdn = new Set(liveFilter.hidden); if (mc.checked) hdn.delete(mc.dataset.mod); else hdn.add(mc.dataset.mod); setLiveFilter(null, hdn); return; }
    const pc = e.target.closest('input[data-png]');
    if (pc && e.type === 'change') { vis.png[pc.dataset.png] = pc.checked; saveVis(); return; }
    const lk = e.target.closest('input[data-lk]');
    if (lk && e.type === 'change') { vis.labelKinds[lk.dataset.lk] = lk.checked; saveVis(); updateLabels(); return; }
    const c = e.target.closest('input[data-chk]');
    if (c && e.type === 'change') {
        const k = c.dataset.chk;
        if (c.dataset.obj === 'c') {
            vis[k] = c.checked; saveVis();
            if (STYLE_APPLY[k]) applyStyleKey(k);
            else if (k === 'nearFade') requestRender();
            else if (k === 'showFps') renderLegend();
            else if (k === 'freeRotate') { if (!vis.freeRotate) { levelQuat(orbit.gq); requestRender(); } }
            else if (k === 'labelNear') updateLabels();
            else if (k === 'colorShade') { refreshStyles(); rebuildHlPulses(); }
            else if (k === 'vidLoop') { renderOpts(); return; }
            else if (k.startsWith('vid')) return; // надписи ролика - применяются при записи
            else refreshVisual();
            if (['bloom', 'orbits', 'particles'].includes(k) || STYLE_KEYS.includes(k)) renderOpts();
        }
        else { viewOpts[curView][k] = c.checked; store.set('viewOpts', viewOpts); syncUrl(); applyView(true); }
    }
}


function optsAction(a) {
    if (a === 'reheat') { if (G) { unpinNodes(); if (workerLayout()) physicsSend('unpin'); if (paused) setPulseSpawn(true); paused = false; setPauseIcon(); reheat(); } }
    if (a === 'resetPhys') {
        for (const k of PHYS_KEYS) vis[k] = VIS_DEF[k]; saveVis();
        const o = viewOpts[curView], dl = (defOpts[curView] || {}).layout;
        if (o && dl && o.layout !== dl) { o.layout = dl; relayoutNext = true; store.set('viewOpts', viewOpts); syncUrl(); renderOpts(); applyPhysics(); applyView(true); }
        else { renderOpts(); applyPhysics(); reheat(); }
    }
    if (a === 'resetScreen') {
        for (const k of ['nodeSize', 'quality', 'arrows', 'particles', 'nearFade', 'labelCount', 'labelSize', 'labelKinds', 'smooth', 'sens', 'fps', 'res', 'msaa', 'idleStop', 'showFps', 'freeRotate', 'proj', 'labelNear']) vis[k] = JSON.parse(JSON.stringify(VIS_DEF[k]));
        saveVis(); renderOpts(); applyRenderScale(); refreshVisual();
    }
    if (a === 'isoView') { orbit.gq.copy(isoOrientation()); if (vis.proj !== 'iso') { vis.proj = 'iso'; saveVis(); renderOpts(); updateProjBtn(); } requestRender(); return; }
    if (a === 'resetTab') {
        if (optsTab === 'view') { const lay = (viewOpts[curView] || {}).layout; viewOpts[curView] = JSON.parse(JSON.stringify(defOpts[curView] || {})); if (lay) viewOpts[curView].layout = lay; store.set('viewOpts', viewOpts); vis.sizeBy = VIS_DEF.sizeBy; saveVis(); renderOpts(); if (curView !== 'stats') applyView(true); }
        else if (optsTab === 'style') { applyPreset(vis.style); vis.styleEdited = false; saveVis(); renderOpts(); }
        else if (optsTab === 'screen') optsAction('resetScreen');
        else if (optsTab === 'phys') optsAction('resetPhys');
        else {
            vis.png = JSON.parse(JSON.stringify(VIS_DEF.png)); store.set('snapSrc', true);
            for (const k of Object.keys(VIS_DEF)) if (k.startsWith('vid')) vis[k] = VIS_DEF[k];
            saveVis(); renderOpts();
        }
        toast(t('resetDone'), 1500);
        return;
    }
    if (a === 'resetAll') {
        if (!confirm(t('resetAllConfirm'))) return;
        // Стираем все сохранённые настройки, кроме последнего репозитория; оставляем в ссылке только источник
        try { for (const k of Object.keys(localStorage)) if (k.startsWith('drift.') && !['drift.repo', 'drift.ref', 'drift.lang'].includes(k)) localStorage.removeItem(k); } catch { /* */ }
        const u = new URL(location.href), keepQ = new URLSearchParams();
        if (model) {
            // Проект открыт - сбрасываем на месте (перезагрузка потеряла бы локальную папку и не работает под file://)
            for (const k of Object.keys(vis)) delete vis[k];
            Object.assign(vis, JSON.parse(JSON.stringify(VIS_DEF)));
            for (const v in defOpts) viewOpts[v] = JSON.parse(JSON.stringify(defOpts[v]));
            liveFilter.text = ''; liveFilter.hidden = new Set(); liveFilter.dirs = new Set(); cfgOverride = {};
            applyPreset(vis.style); applyPhysics(); renderOpts(); updateProjBtn();
            if (lastSource) refreshProject(true); else applyView(true);
            syncUrl(); toast(t('resetDone'), 1500);
            return;
        }
        for (const k of ['repo', 'ref', 'snap', 'lang', 'embed']) if (START_QUERY.get(k) || u.searchParams.get(k)) keepQ.set(k, u.searchParams.get(k) || START_QUERY.get(k));
        u.search = keepQ.toString(); location.href = u.toString().replace(/%2F/gi, '/');
        return;
    }
    if (a === 'resetPreset') { applyPreset(vis.style); vis.styleEdited = false; saveVis(); renderOpts(); }
    if (a === 'newSky') { vis.skySeed = (Math.random() * 1e9) | 0; saveVis(); rebuildSky(); }
    if (a === 'mdAll' || a === 'mdApi') openMarkdown(a === 'mdApi');
    if (a === 'png') savePng();
    if (a === 'video') saveVideo();
    if (a === 'snap') exportSnapshot(store.get('snapSrc', true));
    if (a === 'link') { const u = stateUrl(true); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => toast(t('copied')), () => prompt('URL', u)); }
    if (a === 'source') { setShown($('#opts'), false); openSource(true); }
}


// Масштаб PNG: выбранный (1×-4×), но не больше 8192 px по стороне и ~16.7 Мпикс по площади (4096²) -
// больше видеокарта может не выделить буферы, и картинка выйдет чёрной
const PNG_MAX_PIXELS = 4096 * 4096;
function pngScale(w, h) {
    return Math.max(0.5, Math.min(vis.png.scale, 8192 / Math.max(w, h), Math.sqrt(PNG_MAX_PIXELS / Math.max(1, w * h))));
}


// Надписи поверх кадра (PNG и видео / GIF): подписи узлов, заголовок и пояснение цветов. k - масштаб надписей.
// screenLabels: только подписи, видимые сейчас на экране (PNG); иначе (ролик, камера вращается) - отбор заново
// на каждом кадре: от ближних к дальним, перекрывающая уже нарисованную подпись пропускается
// Шрифт и пункты легенды не меняются за ролик - берутся один раз (getComputedStyle и разбор DOM на каждом кадре
// дороги); cache = {} от вызывающего, для PNG - без кэша
function drawOverlays(ctx, W, H, k, cam, o, screenLabels, cache) {
    const dark = darkScene() || colorCache.dark;
    const ink = dark ? '#e8eeff' : '#0c0f17', plate = dark ? 'rgba(8,12,26,0.62)' : 'rgba(252,252,251,0.8)';
    const mono = cache && cache.mono || getComputedStyle(document.body).getPropertyValue('--mono') || 'monospace';
    if (cache) cache.mono = mono;
    const pill = (x, y, tw, th, rad) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, tw, th, rad) : ctx.rect(x, y, tw, th); ctx.fill(); };
    if (o.labels) {
        ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        const items = [], taken = [];
        for (const it of labelItems) {
            if (it.n.x == null || it.n.__hidden || (screenLabels && !it.shown)) continue;
            dispPos(it.n, labelVec).project(cam);
            if (labelVec.z < -1 || labelVec.z > 1 || Math.abs(labelVec.x) > 1.1 || Math.abs(labelVec.y) > 1.1) continue;
            items.push({ n: it.n, sx: (labelVec.x + 1) / 2 * W, sy: (1 - labelVec.y) / 2 * H, z: labelVec.z });
        }
        items.sort((a, b) => (b.n.id === selId) - (a.n.id === selId) || a.z - b.z);
        for (const { n, sx, sy } of items) {
            const fs = vis.labelSize * k * (n.id === selId ? 1.12 : 1);
            ctx.font = `${n.id === selId ? 700 : 500} ${fs}px ${mono}`;
            const tw = ctx.measureText(n.label).width + fs * 0.7, th = fs * 1.45, y = sy - th * 0.95;
            const rc = [sx - tw / 2, y - th / 2, sx + tw / 2, y + th / 2];
            if (!screenLabels && n.id !== selId && taken.some(q => rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1])) continue;
            taken.push(rc);
            ctx.fillStyle = plate; pill(rc[0], rc[1], tw, th, fs * 0.35);
            if (n.id === selId) { ctx.strokeStyle = colorCache['--hl']; ctx.lineWidth = Math.max(1, k * 1.3); ctx.stroke(); }
            ctx.fillStyle = ink; ctx.fillText(n.label, sx, y + fs * 0.05);
        }
    }
    const pad = 14 * k;
    if (o.title) {
        const title = `${model.name}${model.ref && model.ref !== 'HEAD' ? ' @ ' + model.ref : ''} - ${t('views_' + curView)}`;
        const sub = `${fmt(gdata.nodes.length)} ${t('nodes')} · ${fmt(gdata.links.length)} ${t('links')} · Codrift`;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = `700 ${18 * k}px system-ui, sans-serif`; const tw1 = ctx.measureText(title).width;
        ctx.font = `400 ${12 * k}px system-ui, sans-serif`; const tw2 = ctx.measureText(sub).width;
        ctx.fillStyle = plate; pill(pad, pad, Math.max(tw1, tw2) + 20 * k, 50 * k, 10 * k);
        ctx.fillStyle = ink; ctx.font = `700 ${18 * k}px system-ui, sans-serif`; ctx.fillText(title, pad + 10 * k, pad + 8 * k);
        ctx.globalAlpha = 0.7; ctx.font = `400 ${12 * k}px system-ui, sans-serif`; ctx.fillText(sub, pad + 10 * k, pad + 32 * k); ctx.globalAlpha = 1;
    }
    if (o.legend) {
        // Легенда - те же пункты, что и на экране
        // (без счётчиков узлов и FPS; пояснение стрелок - строкой без цветной метки)
        const items = cache && cache.legend || [...document.querySelectorAll('#legend > span')].filter(x => x.id !== 'gcount' && x.id !== 'fpsVal').map(x => {
            const i = x.querySelector('i'); return { text: x.textContent.trim(), color: i ? (i.style.background || i.style.backgroundColor) : ink, plain: !i };
        });
        if (cache) cache.legend = items;
        if (items.length) {
            ctx.font = `500 ${12 * k}px system-ui, sans-serif`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
            const rowH = 20 * k, widths = items.map(it => ctx.measureText(it.text).width + 26 * k);
            const lw = Math.max(...widths) + 16 * k, lh = items.length * rowH + 12 * k;
            const x0 = pad, y0 = H - pad - lh;
            ctx.fillStyle = plate; pill(x0, y0, lw, lh, 10 * k);
            items.forEach((it, i) => {
                const cy = y0 + 6 * k + rowH * (i + 0.5);
                if (it.color.includes('gradient')) {
                    const m = it.color.match(/#[0-9a-f]{6}/gi) || ['#888', '#ccc'];
                    const gr = ctx.createLinearGradient(x0 + 8 * k, 0, x0 + 22 * k, 0); gr.addColorStop(0, m[0]); gr.addColorStop(1, m[m.length - 1]); ctx.fillStyle = gr;
                } else ctx.fillStyle = it.color;
                if (!it.plain) { ctx.beginPath(); ctx.arc(x0 + 15 * k, cy, 5 * k, 0, Math.PI * 2); ctx.fill(); }
                ctx.fillStyle = ink; ctx.globalAlpha = it.plain ? 0.75 : 1; ctx.fillText(it.text, x0 + (it.plain ? 10 : 28) * k, cy); ctx.globalAlpha = 1;
            });
        }
    }
}


// Экспорт PNG: рендер в повышенном разрешении + подписи, легенда и заголовок, дорисованные на 2D-холсте
async function savePng() {
    if (!G) return;
    const o = vis.png, r = G.renderer(), comp = G.postProcessingComposer(), cv = r.domElement;
    const w = G.width(), h = G.height(), prOld = r.getPixelRatio();
    // Ограничиваем итоговый размер (видеопамять и лимиты браузера на размер холста)
    const pr = pngScale(w, h);
    toast(t('pngRendering'), 1500);
    await sleep0();
    try {
        // MSAA на время экспорта выключено: картинка в 2-4 раза больше экрана уже сглажена размером, а многосэмпловые
        // буферы такого размера видеокарта может не выделить (сцена в PNG выйдет чёрной)
        for (const rt of [comp.renderTarget1, comp.renderTarget2]) if (rt && rt.samples) { rt.samples = 0; rt.dispose(); }
        r.setPixelRatio(pr); r.setSize(w, h, false); comp.setPixelRatio(pr); comp.setSize(w, h);
        G.camera().clearViewOffset(); G.camera().updateProjectionMatrix(); G.camera().updateMatrixWorld();
        frameSync(anim.t, 0, G.camera());
        if (cz.bloom && cz.bloom.enabled) comp.render(); else r.render(G.scene(), G.camera());
        const out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
        const ctx = out.getContext('2d'); ctx.drawImage(cv, 0, 0);
        drawOverlays(ctx, out.width, out.height, out.width / w, G.camera(), o, true);
        const blob = await new Promise(res => out.toBlob(res, 'image/png'));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${(model.name || 'graph').replace(/[^\w.-]+/g, '_')}-${curView}-${out.width}x${out.height}.png`; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (err) { toast(String(err && err.message || err), 6000); }
    finally {
        r.setPixelRatio(prOld); r.setSize(w, h, false); comp.setPixelRatio(prOld); comp.setSize(w, h);
        applyMsaa(); // сглаживание - обратно, как в настройках
        requestRender();
    }
}


// Видео / GIF: квадратный кадр, граф вращается вокруг вертикали камеры. Кадры рендерятся по одному с точными
// метками времени (а не записью экрана) - ролик плавный, даже если сцена тяжёлая и рисуется медленнее реального времени.
// MP4 (H.264) - через WebCodecs и mp4-muxer, GIF - через gifenc (палитра на каждый кадр)
let videoRec = false;
async function saveVideo() {
    if (!G || videoRec || !gdata.nodes.length) return;
    const gif = vis.vidFmt === 'gif' || !('VideoEncoder' in window);
    const S = vis.vidSize & ~1, fps = vis.vidFps, frames = Math.max(2, Math.round(vis.vidDur * fps));
    // Бесшовный повтор - ровно один оборот за ролик (последний кадр не совпадает с первым - без «запинки»)
    const radPerSec = (vis.vidLoop ? 360 / vis.vidDur : vis.vidSpeed) * DEG;
    const r = G.renderer(), comp = G.postProcessingComposer(), cam = G.camera(), cv = r.domElement;
    const w = G.width(), h = G.height(), prOld = r.getPixelRatio(), aspectOld = cam.aspect;
    const q0 = orbit.q.clone(), t0 = orbit.t.clone(), deff = orbit.deff || orbit.dist, tAnim = anim.t, free = vis.freeRotate;
    const rb = $('#rbar'), labels = $('#labels');
    const prog = i => { rb.hidden = false; $('#rbarText').textContent = `${t('vidRec')} ${i} / ${frames}`; $('#rbarFill').style.width = Math.round(i / frames * 100) + '%'; };
    // Класс recording: квадратный кадр записи на экране - без растягивания, шкала хода - без запаздывающей анимации
    videoRec = true; videoCancel = false; document.body.classList.add('recording'); bindCancelButtons(); renderOpts(); prog(0); labels.style.visibility = 'hidden';
    const ovCache = {};
    let enc = null, encErr = null;
    try {
        const lib = await import(gif ? 'https://cdn.jsdelivr.net/npm/gifenc@1.0.3/+esm' : 'https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/+esm');
        let muxer = null, gifEnc = null, gifPal = null;
        // Кадр собирается на 2D-холсте: сцена + подписи, легенда, заголовок (как в PNG), масштаб надписей - от размера кадра
        const ov = { labels: vis.vidLabels, legend: vis.vidLegend, title: vis.vidTitle }, anyOv = ov.labels || ov.legend || ov.title;
        const c2 = document.createElement('canvas'); c2.width = S; c2.height = S;
        const ctx = c2.getContext('2d', { willReadFrequently: gif });
        if (gif) {
            gifEnc = lib.GIFEncoder();
        } else {
            // Профиль H.264 - первый, что поддерживает браузер (High / Main / Baseline, уровень 4.0 - до 1080p)
            const base = { width: S, height: S, bitrate: Math.round(S * S * fps * 0.25), framerate: fps };
            let codec = null;
            for (const c of ['avc1.640028', 'avc1.4D0028', 'avc1.42E028']) { try { if ((await VideoEncoder.isConfigSupported({ ...base, codec: c })).supported) { codec = c; break; } } catch { /* следующий */ } }
            if (!codec) throw new Error(t('vidNoMp4'));
            muxer = new lib.Muxer({ target: new lib.ArrayBufferTarget(), video: { codec: 'avc', width: S, height: S, frameRate: fps }, fastStart: 'in-memory' });
            enc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: e => { encErr = e; } }); // ошибка кодировщика - проверяется после кадров
            enc.configure({ ...base, codec });
        }
        // Квадратный кадр: MSAA выключено (как в PNG), одна точка на пиксель
        for (const rt of [comp.renderTarget1, comp.renderTarget2]) if (rt && rt.samples) { rt.samples = 0; rt.dispose(); }
        r.setPixelRatio(1); r.setSize(S, S, false); comp.setPixelRatio(1); comp.setSize(S, S);
        cam.aspect = 1; cam.clearViewOffset(); cam.updateProjectionMatrix();
        let lastYield = performance.now();
        for (let i = 0; i < frames; i++) {
            _qa.setFromAxisAngle(_wy, radPerSec * i / fps);
            const q = free ? q0.clone().multiply(_qa) : q0.clone().premultiply(_qa);
            cam.quaternion.copy(q); cam.position.copy(t0).add(_off.set(0, 0, deff).applyQuaternion(q)); cam.updateMatrixWorld();
            frameSync(tAnim + i / fps, 1 / fps, cam);
            if (cz.bloom && cz.bloom.enabled) comp.render(); else r.render(G.scene(), cam);
            if (gif || anyOv) { ctx.drawImage(cv, 0, 0, S, S); if (anyOv) drawOverlays(ctx, S, S, S / 640, cam, ov, false, ovCache); }
            if (gif) {
                // Палитра подбирается раз в 20 кадров (соседние кадры вращения почти одинаковы по цветам): подбор -
                // самая дорогая часть записи GIF
                const data = ctx.getImageData(0, 0, S, S).data;
                if (i % 20 === 0) gifPal = lib.quantize(data, 256);
                gifEnc.writeFrame(lib.applyPalette(data, gifPal), S, S, { palette: gifPal, delay: Math.round(1000 / fps) });
            } else {
                const vf = new VideoFrame(anyOv ? c2 : cv, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
                enc.encode(vf, { keyFrame: i % (fps * 2) === 0 }); vf.close();
                while (enc.encodeQueueSize > 6) await yieldNow();
            }
            // Передышка с отрисовкой (шкала, «Отмена») - не чаще раза в 100 мс: ожидание кадра стоит до 16 мс
            if (performance.now() - lastYield > 100) { prog(i + 1); await yieldPaint(); lastYield = performance.now(); }
            if (videoCancel) throw new Error(CANCELED);
        }
        prog(frames); await yieldPaint(); // шкала заполнена, пока собирается файл
        let blob;
        if (gif) { gifEnc.finish(); blob = new Blob([gifEnc.bytes()], { type: 'image/gif' }); }
        else { await enc.flush(); if (encErr) throw encErr; muxer.finalize(); blob = new Blob([muxer.target.buffer], { type: 'video/mp4' }); }
        downloadBlob(blob, `${(model.name || 'graph').replace(/[^\w.-]+/g, '_')}-${curView}-${S}.${gif ? 'gif' : 'mp4'}`);
        toast(t('vidDone'), 2500);
    } catch (err) {
        if (err && err.message === CANCELED) toast(t('canceled'), 2000);
        else { console.error(err); toast(String(err && err.message || err), 6000); }
    } finally {
        videoCancel = false;
        if (enc && enc.state !== 'closed') try { enc.close(); } catch { /* уже закрыт */ }
        r.setPixelRatio(prOld); r.setSize(w, h, false); comp.setPixelRatio(prOld); comp.setSize(w, h);
        cam.aspect = aspectOld; cam.updateProjectionMatrix(); applyMsaa();
        anim.t = tAnim; labels.style.visibility = ''; rb.hidden = true;
        videoRec = false; document.body.classList.remove('recording'); posDirty = true; syncGraphSize(); renderOpts(); requestRender();
    }
}


function setTheme(v) {
    store.set('theme', v); if (typeof syncUrl === 'function' && model) syncUrl();
    if (v === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', v);
    readColors();
    if (G) { G.backgroundColor(colorCache['--graph-bg']); if (vis.palette === 'theme') applyStyle(); else refreshStyles(); }
    if (model) { renderLegend(); if (curView === 'stats') renderStats(); const sel = selId && gdata.nodes.find(n => n.id === selId); if (sel) showDetails(sel); }
}

// Поиск и список всех узлов: пустой запрос - весь вид списком; сортировка по имени, длине имени, строкам, связям
let searchHits = [], searchAct = 0, searchShown = 0;
let searchSort = store.get('searchSort', 'az'), searchDir = store.get('searchDir', 1);
const SEARCH_SORTS = ['az', 'len', 'lines', 'links'], SEARCH_CHUNK = 200;
// Порядок сортировки; searchDir = 1 - «естественный» (А→Я, короткие имена, больше строк/связей - выше)
function searchCompare(mode) {
    const az = (a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base', numeric: true });
    if (mode === 'len') return (a, b) => a.label.length - b.label.length || az(a, b);
    if (mode === 'lines') return (a, b) => (b.lines || 0) - (a.lines || 0) || az(a, b);
    if (mode === 'links') return (a, b) => (b.__deg || 0) - (a.__deg || 0) || az(a, b);
    return az;
}


// Узлы, по которым ищем: на «Статистике» графа нет - файлы и функции модели
function searchPool() {
    if (curView !== 'stats') {
        for (const n of gdata.nodes) n.__deg = (adj.out.get(n.id) || []).length + (adj.inn.get(n.id) || []).length;
        return gdata.nodes;
    }
    const files = [...model.files.values()].map(f => ({ ...fileNode(f), view: 'includes', __deg: f.incOut.length + f.incIn.length }));
    const fns = [...model.fns.values()].map(fn => ({ ...fnNode(fn), view: 'calls', __deg: fn.out.length + fn.inn.length }));
    return files.concat(fns);
}


function doSearch() {
    const q = $('#search').value.trim().toLowerCase(); const box = $('#results');
    if (!model) { setShown(box, false); return; }
    const pool = searchPool();
    let hits = q ? pool.filter(n => n.label.toLowerCase().includes(q) || (n.sub || '').toLowerCase().includes(q)) : pool.slice();
    const cmp = searchCompare(searchSort);
    hits.sort((a, b) => cmp(a, b) * searchDir);
    // Точное совпадение имени - всегда первым
    if (q) { const k = hits.findIndex(n => n.label.toLowerCase() === q); if (k > 0) hits.unshift(hits.splice(k, 1)[0]); }
    // Глобальный поиск, если в текущем виде почти ничего не нашлось
    if (q && hits.length < 5 && curView !== 'stats') {
        const extra = [];
        for (const fn of model.fns.values()) if (fn.name.toLowerCase().includes(q) && !hits.some(h => h.id === fn.id)) extra.push({ ...fnNode(fn), view: 'calls' });
        for (const f of model.files.values()) if (f.path.toLowerCase().includes(q) && !hits.some(h => h.id === f.id)) extra.push({ ...fileNode(f), view: 'includes' });
        hits = hits.concat(extra.sort(cmp).slice(0, 15));
    }
    searchHits = hits; searchAct = 0; searchShown = 0;
    const opening = box.hidden || box.classList.contains('leaving');
    const sortBtn = k => `<button data-ssort="${k}" aria-pressed="${searchSort === k}" title="${esc(t('ssh_' + k))}">${esc(t('ss_' + k))}${searchSort === k ? (searchDir > 0 ? ' ↓' : ' ↑') : ''}</button>`;
    box.innerHTML = `<div class="rhead"><span class="rcount">${fmt(hits.length)} ${t('nodes')}</span><div class="seg rsort">${SEARCH_SORTS.map(sortBtn).join('')}</div></div><div class="rlist"></div>`;
    renderSearchChunk(opening);
    box.scrollTop = 0;
    setShown(box, true);
}


// Следующая порция списка (длинные списки рисуются по мере прокрутки)
function renderSearchChunk(cascade) {
    const list = $('#results .rlist'); if (!list) return;
    if (!searchHits.length) { list.innerHTML = `<div class="muted small" style="padding:8px">${t('none')}</div>`; return; }
    const from = searchShown, to = Math.min(searchHits.length, from + SEARCH_CHUNK);
    const metric = n => (searchSort === 'lines' ? (n.lines ? fmt(n.lines) : '') : searchSort === 'links' ? fmt(n.__deg || 0) : '');
    list.insertAdjacentHTML('beforeend', searchHits.slice(from, to).map((n, k) => {
        const i = from + k, m = metric(n);
        const anim = cascade && i < 16 ? ` in" style="--k:${i}` : '';
        return `<button data-i="${i}" class="${i === searchAct ? 'act' : ''}${anim}"><i class="dot" style="width:8px;height:8px;border-radius:50%;background:${baseColor(n)};flex:none;align-self:center"></i>` +
            `<span class="mono">${esc(n.label)}</span><span class="r-sub">${esc(n.sub || '')}${n.view ? ' · ' + t('views_' + n.view) : ''}</span>${m ? `<span class="r-ct">${m}</span>` : ''}</button>`;
    }).join(''));
    searchShown = to;
}


function pickSearch(i) {
    const n = searchHits[i]; if (!n) return;
    setShown($('#results'), false); $('#search').blur();
    goTo(n.id, n.view || null);
}


// Панель источника
function renderSource() {
    const cfg = readCfg();
    const el = $('#srcpanel');
    const tab = store.get('srcTab', 'github');
    const lastRepo = store.get('repo', '');
    const fsOk = 'showDirectoryPicker' in window;
    el.innerHTML = `<div class="phead"><h3>${t('source')}</h3><button class="iconbtn" data-close aria-label="close">✕</button></div>
    <div class="pbody">
        <div class="seg" id="srcTabs" style="margin-bottom:12px"><button data-v="github" aria-pressed="${tab === 'github'}">${t('github')}</button><button data-v="local" aria-pressed="${tab === 'local'}">${t('local')}</button><button data-v="snap" aria-pressed="${tab === 'snap'}">${t('srcSnap')}</button></div>
        <div id="srcGithub" ${tab === 'github' ? '' : 'hidden'}>
            <label class="field"><span>${t('repo')}</span><input type="text" id="inRepo" value="${esc(lastRepo)}" placeholder="owner/repo" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
            <div class="muted small">${t('examples')}</div>
            <div class="examples">${exampleChips()}</div>
            <label class="field"><span>${t('ref')}</span><input type="text" id="inRef" value="${esc(store.get('ref', ''))}" placeholder="master" autocapitalize="off" spellcheck="false"></label>
            <label class="field"><span>${t('token')}</span><input type="password" id="inToken" value="${esc(ghToken)}" autocomplete="off" placeholder="ghp_…"></label>
            <button class="iconbtn primary btn-wide" id="btnLoadGh">${t('load')}</button>
        </div>
        <div id="srcLocal" ${tab === 'local' ? '' : 'hidden'}>
            <div class="row" style="flex-wrap:wrap">
                <button class="iconbtn primary grow" id="btnPickDir">${t('pickDir')}</button>
                <button class="iconbtn grow" id="btnPickZip">${t('pickZip')}</button>
            </div>
            <div class="row" style="margin-top:8px"><button class="iconbtn grow" id="btnPickFiles">${t('pickFiles')}</button></div>
            <label class="check" style="margin-top:6px"><input type="checkbox" id="inWatch" ${store.get('watch', true) ? 'checked' : ''}>${t('watchFolder')}</label>
            <p class="small muted" style="margin:6px 0 0">${t('dropHint')}</p>
            ${fsOk ? '' : `<div class="muted small" style="margin-top:6px">${t('fsUnsupported')}</div>`}
            <input type="file" id="inDir" webkitdirectory directory multiple hidden>
            <input type="file" id="inZip" accept=".zip,application/zip" hidden>
            <input type="file" id="inFiles" multiple accept="${(window.CodriftLangs ? CodriftLangs.all.flatMap(L => L.exts) : ['.c', '.h']).join(',')}" hidden>
        </div>
        <div id="srcSnap" ${tab === 'snap' ? '' : 'hidden'}>
            <p class="small muted" style="margin:0 0 8px">${t('snapSrcHint')}</p>
            <button class="iconbtn primary btn-wide" id="btnPickSnap">${t('openSnap')}</button>
            <input type="file" id="inSnap" accept=".drift,.ccv,.json,.gz,application/json,application/gzip,application/octet-stream" hidden>
            <label class="field" style="margin-top:12px"><span>${t('snapUrl')}</span><input type="text" id="inSnapUrl" value="${esc(store.get('snapUrl', ''))}" placeholder="https://…/project.drift" autocapitalize="off" spellcheck="false"></label>
            <button class="iconbtn btn-wide" id="btnLoadSnapUrl">${t('loadByUrl')}</button>
            <p class="small muted" style="margin:6px 0 0">${t('dropHint')}</p>
        </div>
        <div id="progress"></div>
        <details class="box" ${store.get('filtersOpen', false) ? 'open' : ''} id="filtersBox">
            <summary>${t('filters')}</summary>
            <label class="field" style="margin-top:8px"><span>${t('ignore')}</span><textarea id="inIgnore" spellcheck="false">${esc(cfg.ignore)}</textarea></label>
            <label class="field"><span>${t('includeOnly')}</span><textarea id="inOnly" spellcheck="false" style="min-height:60px" placeholder="src/">${esc(cfg.only)}</textarea></label>
            <div class="row">
                <label class="field grow"><span>${t('exts')}</span><input type="text" id="inExts" value="${esc(cfg.exts)}" spellcheck="false"></label>
                <label class="field" style="width:110px"><span>${t('maxSize')}</span><input type="number" id="inMaxKB" value="${esc(cfg.maxKB)}" min="1"></label>
            </div>
            <label class="field"><span>${t('maxFiles')}</span><input type="number" id="inMaxFiles" value="${esc(cfg.maxFiles)}" min="50" step="500"></label>
            <div class="field"><span>${t('languages')}</span><div class="chips">${(window.CodriftLangs ? CodriftLangs.all : []).map(L => { const on = L.exts.some(e => cfg.exts.split(/[\s,]+/).includes(e)); return `<label class="check chipchk"><input type="checkbox" data-lang="${L.id}" ${on ? 'checked' : ''}>${esc(L.name)}</label>`; }).join('')}</div></div>
            <label class="field"><span>${t('incRoots')}</span><input type="text" id="inRoots" value="${esc(cfg.roots)}" spellcheck="false"></label>
            <button class="iconbtn" id="btnResetCfg">${t('resetDefaults')}</button>
        </details>
    </div>`;
}


function saveCfgFromUI() {
    const v = id => $(id) && $(id).value;
    if (!$('#inIgnore')) return;
    store.set('ignore', v('#inIgnore')); store.set('only', v('#inOnly')); store.set('exts', v('#inExts'));
    store.set('roots', v('#inRoots') || 'auto'); store.set('maxKB', Math.max(1, parseInt(v('#inMaxKB'), 10) || DEFAULTS.maxKB));
    store.set('maxFiles', Math.max(50, parseInt(v('#inMaxFiles'), 10) || DEFAULTS.maxFiles));
    cfgOverride = {}; // пользователь сохранил свои фильтры - они важнее ссылки
    syncUrl();
}


// Класс src-open - чтобы уведомления и шкала хода центрировались по свободной части экрана, а не под панелью
// Статистика под открывающейся панелью: страница сразу получает новый отступ, а содержимое доезжает до места
// анимацией сдвига (FLIP) - без рывка на 400 px и без перестройки сетки в каждом кадре
function openSource(open) {
    if (open) renderSource();
    const wrap = curView === 'stats' && !$('#stats').hidden && innerWidth > 760 && !REDUCED_MOTION.matches ? $('#stats .stwrap') : null;
    const x0 = wrap ? wrap.getBoundingClientRect().left : 0;
    setShown($('#srcpanel'), open); document.body.classList.toggle('src-open', !!open);
    if (wrap) { const dx = x0 - wrap.getBoundingClientRect().left; if (Math.abs(dx) > 1) wrap.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2, .8, .2, 1)' }); }
}


function startGitHub(repoStr, ref) {
    const spec = parseRepoSpec(repoStr);
    if (!spec) { setProgress(t('notFound'), null, true); return; }
    store.set('repo', repoStr); store.set('ref', ref || '');
    busy || runSource(async () => {
        const s = await sourceGitHub(spec, ref);
        curRepo = { repo: `${spec.owner}/${spec.repo}`, ref: ref || spec.ref || '' };
        const u = new URL(location.href); u.searchParams.set('repo', curRepo.repo);
        if (curRepo.ref) u.searchParams.set('ref', curRepo.ref); else u.searchParams.delete('ref');
        setAddress(u.toString().replace(/%2F/gi, '/'));
        syncUrl();
        return s;
    });
}


function clearRepoParam() { curRepo = null; const u = new URL(location.href); u.searchParams.delete('repo'); u.searchParams.delete('ref'); setAddress(u); }


// Перечитать проект тем же источником, сохранив вид, позиции, выделение и камеру
function refreshProject(silent) {
    if (!lastSource || busy || videoRec) return;
    saveCfgFromUI(); // правки фильтров в открытой панели источника - сразу в дело
    if (!silent) toast(t('refreshing'), 1200);
    runSource(lastSource, { refresh: true });
}


// Слежение за локальной папкой (File System Access API): изменённые файлы → обновление графа
function startWatch() {
    clearInterval(watchTimer); watchTimer = 0;
    const src = lastSource && lastSource.src;
    if (!src || !src.watchable || !store.get('watch', true)) return;
    const exts = new Set(readCfg().exts.split(/[\s,]+/).filter(Boolean).map(s => (s.startsWith('.') ? s : '.' + s).toLowerCase()));
    if (model) for (const p of model.files.keys()) exts.add(extOf(p));
    const sigOf = list => list.filter(e => !e.dirOnly && exts.has(extOf(e.path))).map(e => e.path).sort().join('|');
    // Опорный список - тот, что был при загрузке (иначе файл, созданный в первые секунды, не заметили бы)
    let last = null, busyCheck = false, tick = 1, listSig = sigOf(src.entries);
    const stamp = async () => {
        // Раз в ~10 с - список файлов нужных расширений (появились новые / пропали старые)
        if (src.listAgain && tick++ % 4 === 0) listSig = sigOf(await src.listAgain());
        const parts = [listSig];
        for (const e of src.entries) if (e.handle) { try { const f = await e.handle.getFile(); parts.push(e.path + ':' + f.lastModified + ':' + f.size); } catch { parts.push(e.path + ':gone'); } }
        return parts.join('|');
    };
    const check = async () => {
        if (busyCheck || busy || document.hidden) return; busyCheck = true;
        try { const s2 = await stamp(); if (last != null && s2 !== last) refreshProject(true); last = s2; } finally { busyCheck = false; }
    };
    check(); watchTimer = setInterval(check, 2500);
}


function onModelReady() {
    $('#welcome').hidden = true; $('#boot').hidden = true;
    startWatch();
    if (refreshing) { refreshing = false; $('#rbar').hidden = true; renderTabs(); applyView(true); toast(t('refreshed'), 1500); return; }
    if (!liveFilter.fromUrl && store.get('lfProject', '') !== model.name && liveFilterActive()) { liveFilter.text = ''; liveFilter.hidden = new Set(); liveFilter.dirs = new Set(); store.set('lfText', ''); store.set('lfHidden', []); store.set('lfDirs', []); }
    liveFilter.fromUrl = false; store.set('lfProject', model.name);
    $('#projName').textContent = model.name + (model.ref ? ' @ ' + model.ref : '');
    document.title = model.name + ' - Codrift';
    if (window.matchMedia('(max-width: 760px)').matches) openSource(false);
    else setTimeout(() => openSource(false), 400);
    renderTabs();
    applyView();
    if (urlPending && curView !== 'stats') applyUrlPending(); else { urlPending = null; syncUrl(); }
    if (curView !== 'stats' && !document.body.classList.contains('embed')) toast(t('clickHint'), 3000);
}


function renderWelcome() {
    const w = $('#welcome'); if (model) { w.hidden = true; return; }
    w.innerHTML = `<div class="wcard"><h1>${t('welcomeTitle')}</h1><p>${t('welcomeText')}</p>
        <div class="row"><button class="iconbtn primary" data-w="gh">${t('openGithub')}</button><button class="iconbtn" data-w="local">${t('openLocal')}</button><button class="iconbtn" data-w="snap">${t('openSnap')}</button></div>
        <p class="small muted" style="margin:10px 0 0">${t('dropHint')}</p>
        <p class="small muted" style="margin-top:14px">${t('examples')}</p>
        <div class="examples">${exampleChips()}</div></div>`;
}


function applyLang() {
    document.documentElement.lang = LANG;
    $('#btnLang').textContent = LANG === 'ru' ? 'EN' : 'RU';
    $('#search').placeholder = t('search');
    for (const [id, key] of [['#btnSource', 'source'], ['#btnOpts', 'viewSettings'], ['#btnRefresh', 'refreshProject'], ['#btnFit', 'fitAll'], ['#detClose', 'closeBtn'], ['#detHandle', 'expandBtn']]) {
        const b = $(id); if (b) { b.title = t(key); b.setAttribute('aria-label', t(key)); }
    }
    updateProjBtn(); setPauseIcon();
    renderTabs(); renderWelcome();
    if (!$('#srcpanel').hidden) renderSource();
    if (model) { if (curView === 'stats') renderStats(); else renderLegend(); }
    if (!$('#opts').hidden) renderOpts();
    const sel = selId && gdata.nodes.find(n => n.id === selId); if (sel) showDetails(sel);
}


function updateProjBtn() {
    const b = $('#btnProj'); if (!b) return;
    b.title = vis.proj === 'iso' ? t('proj_persp') : t('proj_iso'); b.setAttribute('aria-label', b.title);
    b.classList.toggle('on', vis.proj === 'iso');
}


// Свайп по шторке деталей (телефон): вверх - развернуть, вниз - свернуть, из свёрнутой вниз - закрыть
function bindSheetSwipe() {
    const det = $('#details'); let y0 = null, h0 = 0, dy = 0, id = null;
    const grab = e => !!e.target.closest('#detHandle, #details .phead') && !e.target.closest('#detClose');
    det.addEventListener('pointerdown', e => {
        if (innerWidth > 760 || !grab(e)) return;
        y0 = e.clientY; h0 = det.getBoundingClientRect().height; dy = 0; id = e.pointerId;
    });
    det.addEventListener('pointermove', e => {
        if (y0 == null || e.pointerId !== id) return;
        dy = e.clientY - y0;
        if (Math.abs(dy) < 6) return;
        if (!det.classList.contains('dragging')) { det.classList.add('dragging'); try { det.setPointerCapture(id); } catch { /* */ } }
        det.style.height = Math.max(80, Math.min(innerHeight * 0.9, h0 - dy)) + 'px';
    });
    const end = e => {
        if (y0 == null || (e && e.pointerId !== id)) return;
        const moved = det.classList.contains('dragging');
        det.classList.remove('dragging'); det.style.height = ''; y0 = null;
        if (!moved) return;
        const exp = det.classList.contains('expanded');
        if (dy < -40 && !exp) { det.classList.add('expanded'); document.body.classList.add('det-expanded'); }
        else if (dy > 40 && exp) { det.classList.remove('expanded'); document.body.classList.remove('det-expanded'); }
        else if (dy > 60 && !exp) dropFocus();
        // Клик сразу после перетаскивания не должен срабатывать как тап по ручке; если браузер его не прислал -
        // перехватчик снимается сам, иначе он «съел» бы следующий настоящий тап (например, по пункту списка)
        const swallow = ev => { ev.stopPropagation(); ev.preventDefault(); det.removeEventListener('click', swallow, true); };
        det.addEventListener('click', swallow, true);
        setTimeout(() => det.removeEventListener('click', swallow, true), 350);
    };
    det.addEventListener('pointerup', end); det.addEventListener('pointercancel', end);
}


function setPauseIcon() {
    const b = $('#btnPause'); b.title = paused ? t('resume') : t('pause'); b.setAttribute('aria-label', b.title);
    $('#btnPause').innerHTML = paused ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5v14M15 5v14"/></svg>';
}

/* ======================================================================
   Обработчики событий
   ====================================================================== */
function bind() {
    $('#btnSource').onclick = () => openSource(!isShown($('#srcpanel')));
    $('#btnLang').onclick = () => { LANG = LANG === 'ru' ? 'en' : 'ru'; store.set('lang', LANG); applyLang(); if (model) syncUrl(); };
    $('#tabs').onclick = e => { const b = e.target.closest('button[data-view]'); if (b && !b.disabled) setView(b.dataset.view); };
    // Выделен узел - вернуть камеру к нему (масштаб окрестности), иначе - показать весь граф
    $('#btnFit').onclick = () => { if (!G) return; if (selId) flyTo(selId); else fitView(); };
    $('#btnRefresh').onclick = () => refreshProject();
    $('#btnProj').onclick = () => { vis.proj = vis.proj === 'iso' ? 'persp' : 'iso'; saveVis(); updateProjBtn(); requestRender(); if (isShown($('#opts'))) renderOpts(); };
    updateProjBtn();
    $('#btnPause').onclick = () => {
        // «Пауза» замораживает раскладку (узлы фиксируются) и останавливает рождение импульсов; рендер и выделение работают
        paused = !paused; if (!G) return;
        // Раскладка уже успокоилась до паузы - «продолжить» её не трогает
        if (paused) pausedSettled = !engineActive;
        if (paused) for (const n of gdata.nodes) { n.fx = n.x; n.fy = n.y; n.fz = n.z; } else unpinNodes();
        if (workerLayout()) {
            if (paused) { physicsSend('pin'); physics.active = false; engineActive = false; }
            else physicsSend('unpin');
        } else if (paused) { G.cooldownTicks(0); engineActive = false; } // библиотека остановится на следующем шаге
        if (!paused) { if (!pausedSettled) reheat(true); else requestRender(); } else syncPositions();
        setPulseSpawn(!paused);
        setPauseIcon();
    };
    $('#btnOpts').onclick = () => { const o = $('#opts'); if (isShown(o)) setShown(o, false); else { renderOpts(); setShown(o, true); } };
    // Подсказки к настройкам
    const opts = $('#opts');
    const showHint = (el, x, y) => { const h = el.dataset.hint; if (!h) return; if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'gtip'; document.body.appendChild(tipEl); }
        tipEl.className = 'gtip otip'; tipEl.textContent = h; tipEl.hidden = false;
        const r = tipEl.getBoundingClientRect(), box = el.getBoundingClientRect();
        const left = Math.max(8, Math.min(innerWidth - r.width - 8, (x != null ? x : box.left) - r.width / 2));
        const top = box.top - r.height - 8 > 8 ? box.top - r.height - 8 : box.bottom + 8;
        tipEl.style.left = left + 'px'; tipEl.style.top = top + 'px'; };
    const hideHint = () => { if (tipEl) { tipEl.hidden = true; tipEl.className = 'gtip'; } };
    let hintTimer = 0;
    // Подсказки - только для мыши: на телефоне тап эмулирует наведение, и подсказка закрывала элементы
    opts.addEventListener('pointerover', e => {
        if (e.pointerType !== 'mouse') return;
        const el = e.target.closest('[data-hint]'); clearTimeout(hintTimer);
        if (!el || !opts.contains(el)) { hideHint(); return; }
        // На значке «?» - сразу, на остальной строке - с небольшой задержкой, чтобы не мешать
        if (e.target.closest('.hint')) showHint(el, e.clientX); else hintTimer = setTimeout(() => showHint(el, e.clientX), 450);
    });
    opts.addEventListener('mouseleave', () => { clearTimeout(hintTimer); hideHint(); });
    opts.addEventListener('scroll', hideHint, true);
    opts.addEventListener('click', e => {
        const q = e.target.closest('.hint');
        if (q) { e.preventDefault(); e.stopPropagation(); const el = q.closest('[data-hint]') || q; if (tipEl && !tipEl.hidden && tipEl.textContent === el.dataset.hint) hideHint(); else showHint(el); }
        else hideHint();
    }, true);
    $('#opts').addEventListener('click', onOptsEvent); $('#opts').addEventListener('change', onOptsEvent); $('#opts').addEventListener('input', onOptsEvent);
    $('#detClose').onclick = () => dropFocus();
    $('#detHandle').onclick = () => { const x = $('#details').classList.toggle('expanded'); document.body.classList.toggle('det-expanded', x); };
    bindSheetSwipe();
    // Клики по спискам (детали, статистика)
    document.addEventListener('click', e => {
        const mb = e.target.closest('[data-morelist]');
        if (mb) { showMoreList(mb); return; }
        const b = e.target.closest('[data-go]');
        if (b) { e.preventDefault(); hideTip(); goTo(b.dataset.go, b.dataset.view || null); if (window.matchMedia('(max-width: 760px)').matches) { $('#details').classList.remove('expanded'); document.body.classList.remove('det-expanded'); } return; }
        const a = e.target.closest('[data-act]');
        if (a) {
            const act = a.dataset.act;
            if (act === 'fly' && selId) flyTo(selId);
            if (act === 'link' && selId) { const u = stateUrl(true); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => toast(t('copied')), () => prompt('URL', u)); }
            if (act === 'focus' && selId) { focus = { id: selId, depth: 1 }; const id = selId; applyView(true); selectNode(id, false); setTimeout(() => flyTo(id), 800); syncUrl(); }
            if (act === 'md' && selId) { const n = gdata.nodes.find(x => x.id === selId); if (n && n.ref && n.ref.path) openMarkdown(false, new Set([n.ref])); }
            if (act === 'unfocus') { const id = selId; focus = null; applyView(true); if (id) selectNode(id, true); syncUrl(); }
            return;
        }
        if (e.target.closest('[data-w="gh"]')) { store.set('srcTab', 'github'); openSource(true); }
        if (e.target.closest('[data-w="local"]')) { store.set('srcTab', 'local'); openSource(true); }
        if (e.target.closest('[data-w="snap"]')) { store.set('srcTab', 'snap'); openSource(true); }
        const ch = e.target.closest('[data-repo]');
        if (ch) { if ($('#srcpanel').hidden) { store.set('srcTab', 'github'); openSource(true); } $('#inRepo').value = ch.dataset.repo; $('#inRef').value = ''; saveCfgFromUI(); startGitHub(ch.dataset.repo, ''); }
        // composedPath - путь на момент клика (кнопка могла уже исчезнуть после перерисовки панели)
        const path = e.composedPath();
        if (!path.some(x => x.classList && x.classList.contains('searchwrap'))) setShown($('#results'), false);
        // Вращение и масштаб графа панель не закрывают - можно настраивать и сразу смотреть результат;
        // простой тап по графу закрывает её в обработчике ввода графа (bindOrbitInput)
        if (!path.includes($('#opts')) && !path.includes($('#btnOpts')) && !path.includes($('#graph')) && !path.includes($('#gtools')) && !path.includes($('#tabs')) && !path.includes($('#mdmodal'))) setShown($('#opts'), false);
    });
    // Панель источника
    const sp = $('#srcpanel');
    sp.addEventListener('click', async e => {
        if (e.target.closest('[data-cancel]')) { cancelOps(); return; }
        if (e.target.closest('[data-close]')) { saveCfgFromUI(); openSource(false); return; }
        const tb = e.target.closest('#srcTabs button'); if (tb) { saveCfgFromUI(); store.set('srcTab', tb.dataset.v); renderSource(); return; }
        if (e.target.closest('#btnLoadGh')) { ghToken = $('#inToken').value.trim(); saveCfgFromUI(); startGitHub($('#inRepo').value, $('#inRef').value.trim()); return; }
        if (e.target.closest('#btnResetCfg')) { for (const k of ['ignore', 'only', 'exts', 'roots', 'maxKB', 'maxFiles']) store.set(k, DEFAULTS[k]); renderSource(); return; }
        if (e.target.closest('#btnPickDir')) {
            saveCfgFromUI();
            if ('showDirectoryPicker' in window) {
                let h; try { h = await window.showDirectoryPicker({ mode: 'read' }); } catch { return; }
                clearRepoParam(); runSource(ign => sourceDirHandle(h, ign));
            } else $('#inDir').click();
            return;
        }
        if (e.target.closest('#btnPickZip')) { saveCfgFromUI(); $('#inZip').click(); return; }
        if (e.target.closest('#btnPickFiles')) { saveCfgFromUI(); $('#inFiles').click(); return; }
        if (e.target.closest('#btnPickSnap')) { $('#inSnap').click(); return; }
        if (e.target.closest('#btnLoadSnapUrl')) { const u = $('#inSnapUrl').value.trim(); if (u) loadSnapUrl(u); return; }
    });
    sp.addEventListener('change', e => {
        if (e.target.id === 'inDir' && e.target.files.length) { clearRepoParam(); const fl = e.target.files; runSource(async () => sourceFileList(fl)); }
        if (e.target.id === 'inFiles' && e.target.files.length) { clearRepoParam(); const fl = e.target.files; runSource(async () => sourceFileList(fl)); }
        if (e.target.id === 'inWatch') { store.set('watch', e.target.checked); startWatch(); }
        if (e.target.dataset && e.target.dataset.lang) {
            // Язык включает/выключает свои расширения в поле «Расширения»
            const L = CodriftLangs.byId(e.target.dataset.lang), inp = $('#inExts');
            let cur = inp.value.split(/[\s,]+/).filter(Boolean);
            cur = e.target.checked ? [...new Set([...cur, ...L.exts])] : cur.filter(x => !L.exts.includes(x));
            inp.value = cur.join(' '); saveCfgFromUI();
        }
        if (e.target.id === 'inZip' && e.target.files[0]) { clearRepoParam(); const f = e.target.files[0]; runSource(() => sourceZip(f)); }
        if (e.target.id === 'inSnap' && e.target.files[0]) { clearRepoParam(); START_QUERY.delete('snap'); const f = e.target.files[0]; openSnapshot(() => f.arrayBuffer(), f.name); }
    });
    sp.addEventListener('toggle', e => { if (e.target.id === 'filtersBox') store.set('filtersOpen', e.target.open); }, true);
    sp.addEventListener('keydown', e => {
        if (e.key === 'Enter' && (e.target.id === 'inRepo' || e.target.id === 'inRef' || e.target.id === 'inToken')) $('#btnLoadGh').click();
        if (e.key === 'Enter' && e.target.id === 'inSnapUrl') $('#btnLoadSnapUrl').click();
    });
    // Поиск
    const s = $('#search');
    s.addEventListener('input', doSearch);
    s.addEventListener('focus', doSearch);
    s.addEventListener('keydown', e => {
        const box = $('#results');
        if ((e.key === 'ArrowDown') && searchAct >= searchShown - 2 && searchShown < searchHits.length) renderSearchChunk();
        const btns = box.querySelectorAll('button[data-i]');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault(); if (!btns.length) return;
            btns[searchAct] && btns[searchAct].classList.remove('act');
            searchAct = (searchAct + (e.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length;
            btns[searchAct].classList.add('act'); btns[searchAct].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') { e.preventDefault(); pickSearch(searchAct); }
        else if (e.key === 'Escape') { setShown(box, false); s.blur(); }
    });
    $('#results').addEventListener('click', e => {
        const so = e.target.closest('button[data-ssort]');
        if (so) {
            // Повторный клик по выбранной сортировке меняет направление
            if (searchSort === so.dataset.ssort) searchDir = -searchDir; else { searchSort = so.dataset.ssort; searchDir = 1; }
            store.set('searchSort', searchSort); store.set('searchDir', searchDir);
            doSearch(); return;
        }
        const b = e.target.closest('button[data-i]'); if (b) pickSearch(+b.dataset.i);
    });
    $('#results').addEventListener('scroll', e => {
        const box = e.currentTarget;
        if (searchShown < searchHits.length && box.scrollTop + box.clientHeight > box.scrollHeight - 300) renderSearchChunk();
    }, { passive: true });
    // Статистика
    $('#stats').addEventListener('click', e => {
        const th = e.target.closest('th[data-sort]');
        if (th) { const k = th.dataset.sort; statSort = statSort.key === k ? { key: k, dir: -statSort.dir } : { key: k, dir: k === 'path' ? 1 : -1 }; $('#stFilesPanel').innerHTML = filesPanelInner(); return; }
        const tr = e.target.closest('tr[data-dir]');
        if (tr) { const d = tr.dataset.dir; if (openDirs.has(d)) openDirs.delete(d); else openDirs.add(d); $('#stDirBody').innerHTML = dirRows(); return; }
        if (e.target.closest('[data-morefiles]')) { statFilesAll = true; $('#stFilesBody').innerHTML = statFileRows()[0]; return; }
        const td = e.target.closest('[data-tdir]');
        if (td) { hideTip(); statTree.dir = td.dataset.tdir; renderTreemap(); return; }
        const tm = e.target.closest('[data-tmode]');
        if (tm) { statTree.mode = tm.dataset.tmode; for (const x of document.querySelectorAll('[data-tmode]')) x.setAttribute('aria-pressed', x === tm); renderTreemap(); return; }
        const hb = e.target.closest('[data-hbin]');
        if (hb) { const [k, i] = hb.dataset.hbin.split(':'); statBins[k] = statBins[k] === +i ? -1 : +i; hideTip(); $('#stHist_' + k).innerHTML = histHtml(k); return; }
        const tf = e.target.closest('tr[data-file]');
        if (tf) { globalSel = tf.dataset.file; goTo(tf.dataset.file, 'includes'); }
    });
    // Подсказки графиков (data-tip) - при наведении мышью; на телефоне щелчок по плитке или точке сразу переходит
    $('#stats').addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const el = e.target.closest('[data-tip]');
        if (el) showStatTip(el.dataset.tip, e.clientX, e.clientY); else hideTip();
    });
    $('#stats').addEventListener('pointerleave', hideTip);
    $('#stats').addEventListener('toggle', e => {
        const d = e.target; if (!d.open || !d.dataset || !d.dataset.diag) return;
        const b = d.querySelector('.dbody'), fn = statDiag[d.dataset.diag]; if (b && fn && !b.firstChild) b.innerHTML = fn();
    }, true);
    $('#stats').addEventListener('scroll', hideTip, { passive: true });
    // Карта кода и графики пересчитываются под новую ширину (окно, панель источника), но не чаще раза в 200 мс
    // Наблюдатель срабатывает и сразу после открытия вкладки - тогда ширина та же, и перерисовывать нечего
    { let rt = 0; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => {
        if (curView !== 'stats' || $('#stats').hidden || !model) return;
        const box = $('#stTreeBody'); if (box && Math.abs(Math.max(200, box.clientWidth) - (+box.dataset.w || 0)) > 2) renderTreemap();
        fitStatCharts();
    }, 200); }).observe($('#stats')); }
    $('#stats').addEventListener('input', e => {
        if (e.target.id === 'stFilter') { statFilter = e.target.value; const [rows, n] = statFileRows(); $('#stFilesBody').innerHTML = rows; $('#stFilesCount').textContent = fmt(n); }
    });
    document.addEventListener('keydown', e => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
        if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К')) { e.preventDefault(); refreshProject(); return; }
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); s.focus(); }
        if (e.key === 'Escape' && (videoRec || busy)) { cancelOps(); return; }
        if (e.key === 'Escape' && isShown($('#opts'))) { setShown($('#opts'), false); return; }
        if (e.key === 'Escape' && document.activeElement === document.body) dropFocus();
    });
    // Любое взаимодействие будит «уснувшую» анимацию
    const wake = () => { const was = (performance.now() - cz.lastInput) / 1000 > (vis.idleStop || 1e9); cz.lastInput = performance.now(); if (was) requestRender(); };
    for (const ev of ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart']) document.addEventListener(ev, wake, { passive: true });
    // Перетаскивание: снимок .drift/.ccv/.json или архив .zip
    document.addEventListener('dragover', e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) { e.preventDefault(); document.body.classList.add('dragging'); } });
    document.addEventListener('dragleave', e => { if (!e.relatedTarget) document.body.classList.remove('dragging'); });
    document.addEventListener('drop', e => {
        document.body.classList.remove('dragging');
        const f = e.dataTransfer && e.dataTransfer.files[0]; if (!f) return;
        e.preventDefault(); clearRepoParam();
        START_QUERY.delete('snap');
        if (/\.zip$/i.test(f.name)) runSource(() => sourceZip(f)); else openSnapshot(() => f.arrayBuffer(), f.name);
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => setTheme(store.get('theme', 'auto')));
    for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, e => e.preventDefault(), { passive: false });
    new ResizeObserver(() => placeTabIndicator()).observe($('#tabs'));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeTabIndicator);
}

/* ======================================================================
   Состояние в ссылке: проект + фильтры + вид + стиль + выделение + камера.
   В ссылку попадает только то, что отличается от значений по умолчанию (и от выбранного пресета),
   поэтому ссылки короткие и читаемые:  ?repo=owner/name&view=calls&style=neon&vs=bloom:0,glow:1.2
   ====================================================================== */
const URL_VIS_SKIP = new Set(['labelKinds', 'png', 'styleEdited', 'style', 'vidFmt', 'vidSize', 'vidFps', 'vidDur', 'vidSpeed', 'vidLoop', 'vidLabels', 'vidLegend', 'vidTitle']);
const encVal = v => (typeof v === 'boolean' ? (v ? '1' : '0') : typeof v === 'number' ? String(Math.round(v * 1000) / 1000) : String(v));
function decVal(raw, ref) {
    if (typeof ref === 'boolean') return raw === '1' || raw === 'true';
    if (typeof ref === 'number') { const n = Number(raw); return isFinite(n) ? n : ref; }
    return raw;
}
const packPairs = obj => Object.entries(obj).map(([k, v]) => `${k}:${encVal(v)}`).join(',');
const unpackPairs = str => String(str || '').split(',').map(x => x.split(':')).filter(x => x.length >= 2).map(([k, ...v]) => [k.trim(), v.join(':').trim()]);
let cfgOverride = {}, urlPending = null, lastFitDist = 0;
let curRepo = null; // открытый репозиторий GitHub (адресной строке не доверяем: под file:// она не меняется)


// Собрать параметры ссылки из текущего состояния
function buildStateParams(withCamera) {
    const q = new URLSearchParams();
    const snapUrl = START_QUERY.get('snap');
    if (snapUrl && model && model.fromSnapshot) q.set('snap', snapUrl);
    else if (curRepo) { q.set('repo', curRepo.repo); if (curRepo.ref) q.set('ref', curRepo.ref); }
    // Фильтры источника
    const cfg = readCfg();
    if (cfg.ignore !== DEFAULTS.ignore) q.set('ign', cfg.ignore.split(/\r?\n/).map(x => x.trim()).filter(x => x && !x.startsWith('#')).join(';'));
    if (cfg.only) q.set('only', cfg.only.split(/\r?\n/).map(x => x.trim()).filter(Boolean).join(';'));
    if (cfg.exts !== DEFAULTS.exts) q.set('exts', cfg.exts);
    if (cfg.roots !== DEFAULTS.roots) q.set('roots', cfg.roots);
    if (cfg.maxKB !== DEFAULTS.maxKB) q.set('maxkb', cfg.maxKB);
    if (cfg.maxFiles !== DEFAULTS.maxFiles) q.set('maxf', cfg.maxFiles);
    // Вид и его опции
    q.set('view', curView);
    const vo = {};
    for (const v in defOpts) for (const k in defOpts[v]) if (viewOpts[v][k] !== defOpts[v][k]) vo[v + '.' + k] = viewOpts[v][k];
    if (Object.keys(vo).length) q.set('vo', packPairs(vo));
    if (liveFilter.text.trim()) q.set('lf', liveFilter.text.trim());
    if (liveFilter.hidden.size) q.set('hm', [...liveFilter.hidden].join(';'));
    if (liveFilter.dirs.size) q.set('hd', [...liveFilter.dirs].join(';'));
    // Стиль: имя пресета + отличия от него
    q.set('style', vis.style);
    const base = Object.assign({}, VIS_DEF, STYLE_PRESETS[vis.style] || {});
    const vs = {};
    for (const k in VIS_DEF) if (!URL_VIS_SKIP.has(k) && JSON.stringify(vis[k]) !== JSON.stringify(base[k])) vs[k] = vis[k];
    if (Object.keys(vs).length) q.set('vs', packPairs(vs));
    const lk = {};
    for (const k of Object.keys(KIND_COLORS)) { const def = VIS_DEF.labelKinds[k] !== false, cur = vis.labelKinds[k] !== false; if (def !== cur) lk[k] = cur; }
    if (Object.keys(lk).length) q.set('lk', packPairs(lk));
    // Выделение, окрестность, камера
    if (selId) q.set('sel', selId);
    if (focus) q.set('focus', focus.depth);
    // Камера: ориентация (кватернион x,y,z,w) и приближение относительно «показать всё»
    if (withCamera && G && lastFitDist) q.set('cam', [orbit.gq.x, orbit.gq.y, orbit.gq.z, orbit.gq.w, orbit.gdist / lastFitDist].map(x => Math.round(x * 1000) / 1000).join(','));
    if (store.get('theme', 'auto') !== 'auto') q.set('theme', store.get('theme', 'auto'));
    q.set('lang', LANG);
    return q;
}


function stateUrl(withCamera) {
    const u = new URL(location.href); u.search = buildStateParams(withCamera).toString();
    return u.toString().replace(/%2F/gi, '/').replace(/%3A/gi, ':').replace(/%2C/gi, ',').replace(/%3B/gi, ';');
}
// Адресная строка всегда содержит актуальное состояние (без камеры - она меняется постоянно)
let urlTimer = 0;
// Страница, открытая как file://, не может менять свой адрес - состояние тогда живёт только в памяти (кнопка «ссылка» работает)
const URL_WRITABLE = location.protocol === 'http:' || location.protocol === 'https:';
function setAddress(u) {
    if (!URL_WRITABLE) return;
    try { history.replaceState(null, '', u); } catch { /* браузер запретил - не критично */ }
}


function syncUrl() {
    clearTimeout(urlTimer);
    urlTimer = setTimeout(() => { if (!urlPending) setAddress(stateUrl(false)); }, 350);
}


// Применить состояние из ссылки (до загрузки проекта). Настройки из ссылки не перезаписывают сохранённые
// локально, пока пользователь сам что-нибудь не поменяет.
function applyUrlState(q) {
    const lang = q.get('lang'); if (lang && I18N[lang]) LANG = lang;
    const theme = q.get('theme'); if (theme && ['auto', 'light', 'dark'].includes(theme)) document.documentElement[theme === 'auto' ? 'removeAttribute' : 'setAttribute']('data-theme', theme);
    const v = q.get('view'); if (v && VIEW_IDS.includes(v)) curView = v;
    const style = q.get('style');
    if (style && STYLE_PRESETS[style]) { vis.style = style; Object.assign(vis, STYLE_PRESETS[style]); vis.styleEdited = false; }
    for (const [k, raw] of unpackPairs(q.get('vs'))) if (k in VIS_DEF && !URL_VIS_SKIP.has(k)) { vis[k] = decVal(raw, VIS_DEF[k]); if (STYLE_KEYS.includes(k)) vis.styleEdited = true; }
    for (const [k, raw] of unpackPairs(q.get('lk'))) vis.labelKinds[k] = raw === '1';
    for (const [key, raw] of unpackPairs(q.get('vo'))) {
        const [vw, k] = key.split('.'); if (defOpts[vw] && k in defOpts[vw]) viewOpts[vw][k] = decVal(raw, defOpts[vw][k]);
    }
    const lines = x => x.split(';').map(y => y.trim()).filter(Boolean).join('\n');
    if (q.has('lf')) { liveFilter.text = q.get('lf'); liveFilter.fromUrl = true; }
    if (q.has('hm')) { liveFilter.hidden = new Set(q.get('hm').split(';').filter(Boolean)); liveFilter.fromUrl = true; }
    normLayouts();
    if (q.has('hd')) { liveFilter.dirs = new Set(q.get('hd').split(';').filter(Boolean)); liveFilter.fromUrl = true; }
    if (q.has('ign')) cfgOverride.ignore = lines(q.get('ign'));
    if (q.has('only')) cfgOverride.only = lines(q.get('only'));
    if (q.has('exts')) cfgOverride.exts = q.get('exts');
    if (q.has('roots')) cfgOverride.roots = q.get('roots');
    if (q.has('maxkb')) cfgOverride.maxKB = Math.max(1, Number(q.get('maxkb')) || DEFAULTS.maxKB);
    if (q.has('maxf')) cfgOverride.maxFiles = Math.max(50, Number(q.get('maxf')) || DEFAULTS.maxFiles);
    urlPending = urlPending || { sel: null, focus: 0, cam: [] };
    if (q.has('sel')) urlPending.sel = q.get('sel');
    if (q.has('focus')) urlPending.focus = Number(q.get('focus')) || 0;
    if (q.has('cam')) urlPending.cam = q.get('cam').split(',').map(Number);
    if (q.get('embed') === '1') document.body.classList.add('embed');
}


// После построения графа: выделение, окрестность, камера из ссылки
function applyUrlPending() {
    const p = urlPending; urlPending = null;
    if (!p) return;
    if (p.sel && adj.out.has(p.sel)) {
        if (p.focus) { focus = { id: p.sel, depth: p.focus }; applyView(true); }
        selectNode(p.sel, !((p.cam.length === 3 || p.cam.length === 5) && p.cam.every(isFinite)));
    }
    const camOk = (p.cam.length === 3 || p.cam.length === 5) && p.cam.every(isFinite) && lastFitDist;
    if (camOk) {
        if (p.cam.length === 5) { orbit.gq.set(p.cam[0], p.cam[1], p.cam[2], p.cam[3]).normalize(); if (!vis.freeRotate) levelQuat(orbit.gq); }
        else orbit.gq.setFromEuler(new THREE.Euler(-Math.max(-1.55, Math.min(1.55, p.cam[1])), -p.cam[0], 0, 'YXZ')); // старый формат: поворот, наклон
        cancelFly(); orbit.gdist = clampDist(lastFitDist * p.cam[p.cam.length - 1]);
        if (p.sel) { const n = gdata.nodes.find(x => x.id === p.sel); if (n && n.x != null) orbit.gt.set(n.x, n.y, n.z || 0); }
        requestRender();
    }
    syncUrl();
}

/* ======================================================================
   Старт
   ====================================================================== */
const START_QUERY = new URLSearchParams(location.search);
(function main() {
    const q = START_QUERY;
    setTheme(q.get('theme') || store.get('theme', 'auto'));
    applyUrlState(q);
    bind(); applyLang();
    // Встраивание (iframe на сайте проекта): ссылка «открыть полностью»
    if (document.body.classList.contains('embed')) {
        const a = document.createElement('a'); a.className = 'iconbtn embed-open'; a.target = '_blank'; a.rel = 'noopener'; a.textContent = '↗';
        a.title = t('openFull'); a.onclick = () => { const u = new URL(stateUrl(true)); u.searchParams.delete('embed'); a.href = u.toString(); };
        $('#gtools').prepend(a);
    }
    if (typeof ForceGraph3D === 'undefined') { toast('3d-force-graph CDN failed to load', 10000); }
    const repo = q.get('repo'), snapUrl = q.get('snap');
    if (snapUrl) {
        // Снимок по ссылке (например, лежит рядом с сайтом проекта) - без GitHub API и без разбора
        bootShow(`${t('snapOpening')} ${snapUrl.split('/').pop()}`);
        loadSnapUrl(snapUrl);
    } else if (repo) {
        store.set('srcTab', 'github');
        bootShow(`${t('bootRepo')} ${repo}`);
        startGitHub(repo, q.get('ref') || '');
    }
    // Для тестов и автоматизации
    cz.lastInput = performance.now();
    requestAnimationFrame(orbitFrame);
    window.Codrift = { step: renderStep, get orbit() { return orbit; }, runSource, sourceFileList, sourceDirHandle, openSnapshot, get model() { return model; }, get graph() { return G; }, setView, goTo, buildView };
})();
