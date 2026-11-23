(function () {
    'use strict';

    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // small helper: el('button', {class: 'chip'}, 'text', child, ...)
    function el(tag, attrs, ...children) {
        const node = document.createElement(tag);
        Object.entries(attrs || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== false) node.setAttribute(k, v);
        });
        node.append(...children.filter(c => c !== null && c !== undefined));
        return node;
    }


    /* Menu on small screens
     * ------------------------------------------------------ */
    const toggle = $('.menu-toggle');
    const tabs = $('.tabs');
    function setMenu(open) {
        tabs.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open);
        toggle.textContent = open ? 'Close' : 'Menu';
    }
    toggle.addEventListener('click', () => setMenu(!tabs.classList.contains('is-open')));
    tabs.addEventListener('click', e => { if (e.target.matches('a')) setMenu(false); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && tabs.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });


    /* Active tab and status bar
     * ------------------------------------------------------ */
    const sections = $$('main > section');
    function onScroll() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        let current = sections[0];
        sections.forEach(s => { if (s.offsetTop <= y + window.innerHeight * 0.35) current = s; });
        if (max > 0 && y >= max - 2) current = sections[sections.length - 1];
        $$('a', tabs).forEach(a => {
            const on = a.hash === '#' + current.id;
            a.classList.toggle('is-current', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
        const pct = max > 0 ? Math.min(100, Math.max(0, Math.round(y / max * 100))) : 0;
        $('#sb-section').textContent = current.id;
        $('#sb-pos').textContent = 'Ln ' + (Math.max(0, Math.round(y / 24)) + 1) + ', ' + pct + '%';
    }
    let queued = false;
    function queueScroll() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => { queued = false; onScroll(); });
    }
    window.addEventListener('scroll', queueScroll, { passive: true });
    window.addEventListener('resize', queueScroll);

    function tick() {
        $('#sb-time').textContent = 'Lisbon ' + new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon'
        }).format(new Date());
    }
    tick();
    setInterval(tick, 15000);


    /* Photo lightbox
     * ------------------------------------------------------ */
    const lightbox = $('#lightbox');
    $$('.shot').forEach(shot => shot.addEventListener('click', () => {
        $('img', lightbox).src = shot.dataset.full;
        $('img', lightbox).alt = $('img', shot).alt;
        $('p', lightbox).textContent = $('.shot__cap', shot).lastChild.textContent.trim();
        lightbox.showModal();
    }));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target.matches('button')) lightbox.close();
    });


    /* Projects
     * ------------------------------------------------------ */
    const projects = window.PROJECTS.slice().sort((a, b) => b.year - a.year);
    const CONTEXTS = [['all', 'All'], ['university', 'University'], ['personal', 'Personal']];
    const tally = {};
    projects.forEach(p => p.tech.forEach(t => { tally[t] = (tally[t] || 0) + 1; }));
    const allTech = Object.keys(tally).sort((a, b) => tally[b] - tally[a] || a.localeCompare(b));
    const state = { context: 'all', tech: new Set(), match: 'any', search: '' };

    const fold = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    function passes(p, tech) {
        if (state.context !== 'all' && p.context !== state.context) return false;
        if (state.search) {
            const hay = fold([p.title, p.summary].concat(p.tech).join(' '));
            if (!fold(state.search).split(/\s+/).every(w => hay.includes(w))) return false;
        }
        if (!tech.size) return true;
        const list = Array.from(tech);
        return state.match === 'all'
            ? list.every(t => p.tech.includes(t))
            : list.some(t => p.tech.includes(t));
    }

    // tiny highlighter for the covers: comments and keywords
    const KEYWORDS = /^(class|def|return|if|let|const|for|function|export|select|from|inner|left|join|on|as|public|extends|super)$/i;
    function highlight(line) {
        const out = el('span', { class: 'l' });
        (line.match(/#.*$|\/\/.*$|@\w+|"[^"]*"|'[^']*'|\w+|\s+|[^\w\s]/g) || [' ']).forEach(t => {
            if (/^(#|\/\/)/.test(t)) out.append(el('span', { class: 'com' }, t));
            else if (KEYWORDS.test(t) || t[0] === '@') out.append(el('span', { class: 'kw' }, t));
            else out.append(t);
        });
        return out;
    }

    function card(p) {
        const cover = el('div', { class: 'card__cover' });
        if (p.image) {
            cover.append(el('img', { src: encodeURI(p.image), alt: 'Screenshot of ' + p.title, loading: 'lazy' }));
        } else {
            const pre = el('pre', { class: 'card__code' });
            p.code.forEach(l => pre.append(highlight(l)));
            cover.setAttribute('aria-hidden', 'true');
            cover.append(el('div', { class: 'card__file' }, p.file), pre);
        }

        const tech = el('ul', { class: 'card__tech' });
        p.tech.forEach(t => tech.append(el('li', {},
            el('button', { type: 'button', 'data-tech': t, 'aria-label': 'Filter by ' + t }, t))));

        const links = el('div', { class: 'card__links' });
        const ext = (href, label) => links.append(el('a', {
            class: 'textlink', href, target: '_blank', rel: 'noopener', 'aria-label': label + ': ' + p.title
        }, label));
        if (p.live) ext(p.live, 'Open site');
        if (p.repo) ext(p.repo, 'View code');

        return el('li', { class: 'card' }, cover,
            el('div', { class: 'card__body' },
                el('div', {},
                    el('h3', {}, p.title),
                    el('span', { class: 'card__meta' }, (p.context === 'university' ? 'University' : 'Personal') + ', ' + p.year + (p.team ? ', team project' : ''))),
                el('p', {}, p.summary),
                tech,
                links.children.length ? links : null));
    }

    const cards = projects.map(card);
    const empty = el('li', { class: 'empty', hidden: '' },
        el('p', {}, 'No project matches these filters. Remove a technology or clear the search.'));
    $('#cards').append(...cards, empty);

    CONTEXTS.forEach(([id, label]) => $('#context-filter').append(
        el('button', { class: 'chip', type: 'button', 'data-context': id }, label)));
    allTech.forEach(t => $('#tech-filter').append(
        el('button', { class: 'chip', type: 'button', 'data-chip': t }, t, el('span', { class: 'chip__n' }))));

    // the filters written as a PostgreSQL query (tech is a text[] column)
    function renderSql(n) {
        const kw = s => el('span', { class: 'kw' }, s);
        const str = s => el('span', { class: 'str' }, "'" + s.replace(/'/g, "''") + "'");
        const where = [];
        if (state.context !== 'all') where.push(['context = ', str(state.context)]);
        const list = Array.from(state.tech);
        if (list.length === 1) {
            where.push([str(list[0]), ' = ', kw('ANY'), '(tech)']);
        } else if (list.length > 1) {
            const parts = ['tech ', state.match === 'all' ? '@> ' : '&& ', kw('ARRAY'), '['];
            list.forEach((t, i) => { if (i) parts.push(', '); parts.push(str(t)); });
            parts.push(']');
            where.push(parts);
        }
        if (state.search) where.push(['summary ', kw('ILIKE'), ' ', str('%' + state.search + '%')]);

        const out = [kw('SELECT'), ' * ', kw('FROM'), ' projects'];
        where.forEach((w, i) => out.push('\n', kw(i ? '  AND ' : 'WHERE '), ...w));
        out.push('\n', kw('ORDER BY'), ' year ', kw('DESC'), ';\n');
        out.push(el('span', { class: 'com' }, '-- ' + n + (n === 1 ? ' row' : ' rows')));
        $('#sql').replaceChildren(...out);
    }

    function render() {
        let n = 0;
        projects.forEach((p, i) => {
            const ok = passes(p, state.tech);
            cards[i].hidden = !ok;
            if (ok) n++;
        });
        empty.hidden = n > 0;

        $$('[data-context]').forEach(b => b.setAttribute('aria-pressed', b.dataset.context === state.context));
        $$('[data-match]').forEach(b => b.setAttribute('aria-pressed', b.dataset.match === state.match));
        $('#match-row').hidden = state.tech.size < 2;

        // each count says how many projects that technology would give
        $$('[data-chip]').forEach(b => {
            const t = b.dataset.chip;
            const probe = state.match === 'all' ? new Set([...state.tech, t]) : new Set([t]);
            const c = projects.filter(p => passes(p, probe)).length;
            b.setAttribute('aria-pressed', state.tech.has(t));
            b.dataset.empty = c === 0;
            $('.chip__n', b).textContent = c;
        });
        $$('[data-tech]').forEach(b => b.classList.toggle('is-on', state.tech.has(b.dataset.tech)));

        $('#count').textContent = n === projects.length
            ? 'All ' + n + ' projects'
            : n + ' of ' + projects.length + ' projects';
        $('#reset').hidden = state.context === 'all' && !state.tech.size && !state.search;
        renderSql(n);
        queueScroll();
    }

    function reset() {
        state.context = 'all';
        state.match = 'any';
        state.search = '';
        state.tech.clear();
        $('#search').value = '';
    }
    function flip(t) {
        if (state.tech.has(t)) state.tech.delete(t); else state.tech.add(t);
        if (state.tech.size < 2) state.match = 'any';
    }
    function goTo(node) {
        node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }

    $('#projects').addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.context) state.context = b.dataset.context;
        else if (b.dataset.match) state.match = b.dataset.match;
        else if (b.dataset.chip) flip(b.dataset.chip);
        else if (b.dataset.tech) { flip(b.dataset.tech); render(); goTo($('.query')); return; }
        else if (b.id === 'reset') { reset(); $('#search').focus({ preventScroll: true }); }
        render();
    });
    $('#search').addEventListener('input', e => {
        state.search = e.target.value.trim();
        render();
    });


    /* Skills, counted from the projects
     * ------------------------------------------------------ */
    const GROUPS = {
        languages: ['Java', 'Python', 'C', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'],
        frameworks: ['Spring Boot', 'Django', 'React', 'Next.js', 'TanStack', 'Tailwind CSS', 'Swing', 'JUnit'],
        'data and messaging': ['PostgreSQL', 'Kafka', 'gRPC', 'REST API', 'Vercel Blob'],
        tools: ['Docker', 'Maven', 'GitHub Actions', 'CMake', 'UML', 'POSIX threads']
    };
    const known = Object.values(GROUPS).flat();
    GROUPS.other = allTech.filter(t => !known.includes(t));
    Object.entries(GROUPS).forEach(([dir, list]) => {
        const items = list.filter(t => tally[t]).sort((a, b) => tally[b] - tally[a]);
        if (!items.length) return;
        const ul = el('ul');
        items.forEach(t => {
            const bar = el('span', { class: 'tree__bar', 'aria-hidden': 'true' });
            for (let i = 0; i < tally[t]; i++) bar.append(el('i'));
            const b = el('button', { type: 'button' },
                el('span', { class: 'tree__name' }, t), bar,
                el('span', { class: 'tree__n' }, tally[t] + (tally[t] === 1 ? ' project' : ' projects')));
            b.addEventListener('click', () => { reset(); state.tech.add(t); render(); goTo($('.query')); });
            ul.append(el('li', {}, b));
        });
        $('#skill-tree').append(el('p', { class: 'tree__dir' }, dir + '/'), ul);
    });


    /* Shell
     * ------------------------------------------------------ */
    (function shell() {
        const out = $('#shell-out'), input = $('#shell-in');
        const history = [];
        let at = 0;

        function print(...parts) {
            out.append(el('div', {}, ...parts));
            out.scrollTop = out.scrollHeight;
        }
        const bold = s => el('b', {}, s);
        function link(href, label) {
            const web = href.startsWith('http');
            return el('a', { href, target: web ? '_blank' : undefined, rel: web ? 'noopener' : undefined }, label);
        }
        const jump = id => goTo(document.getElementById(id));

        const HELP = [
            ['whoami', 'who you are talking to'],
            ['deloitte', 'internship and ambassador role'],
            ['projects', 'list every project'],
            ['projects java', 'list projects by technology'],
            ['cv', 'my résumé'],
            ['email', 'write to me'],
            ['github', 'my code'],
            ['linkedin', 'my profile'],
            ['clear', 'empty this window']
        ];
        // a command you can also click or tap
        function cmd(name) {
            const b = el('button', { type: 'button', class: 'cmd' }, name);
            b.addEventListener('click', () => run(name));
            return b;
        }

        const commands = {
            help() {
                HELP.forEach(([c, d]) => {
                    print(cmd(c), el('span', {}, d));
                    out.lastChild.className = 'shell__help';
                });
            },
            whoami() { print('Gonçalo Almeida. Computer Engineering student at Lusófona, Deloitte ambassador, regular at the tennis and padel courts.'); },
            deloitte() {
                print('Summer intern in 2026, Team-Players award with Infini9, ambassador today.');
                jump('deloitte');
            },
            projects(arg) {
                if (!arg) {
                    projects.forEach(p => print(bold(String(p.year)), '  ' + p.title));
                    return;
                }
                const t = allTech.find(x => fold(x) === fold(arg));
                if (!t) {
                    print('No project uses "' + arg + '". Try one of: ' + allTech.join(', '));
                    return;
                }
                reset();
                state.tech.add(t);
                render();
                projects.filter(p => p.tech.includes(t)).forEach(p => print(bold(String(p.year)), '  ' + p.title));
                print('The ', link('#projects', 'project list'), ' is now filtered by ' + t + '.');
            },
            cv() { print(link('Curriculo%20-%20Gon%C3%A7alo%20Almeida.pdf', 'Download résumé (PDF)')); },
            email() { print(link('mailto:goncalmeida06@gmail.com', 'goncalmeida06@gmail.com')); },
            github() { print(link('https://github.com/a22408651GoncaloAlmeida', 'github.com/a22408651GoncaloAlmeida')); },
            linkedin() { print(link('https://www.linkedin.com/in/gonçalo-almeida-049737350', 'LinkedIn profile')); },
            ls() { print('about/  experience/  deloitte/  projects/  skills/  contact/'); },
            cd(arg) {
                const id = (arg || '').replace(/[\/.~]/g, '') || 'intro';
                if (sections.some(s => s.id === id)) jump(id);
                else print('cd: ' + arg + ': no such section');
            },
            sudo() { print('Permission denied. Try asking by email.'); },
            clear() { out.replaceChildren(); }
        };

        function run(line) {
            history.push(line);
            at = history.length;
            print(bold('visitor@goncalo:~$ '), line);
            const [name, ...rest] = line.split(/\s+/);
            const key = name.toLowerCase();
            if (Object.prototype.hasOwnProperty.call(commands, key)) commands[key](rest.join(' '));
            else print(name + ': command not found. Type ', cmd('help'), ' to see what works.');
        }
        $('#shell-form').addEventListener('submit', e => {
            e.preventDefault();
            const line = input.value.trim();
            input.value = '';
            if (!line) return;
            finishIntro();
            run(line);
        });
        input.addEventListener('keydown', e => {
            if (e.key === 'ArrowUp' && at > 0) { input.value = history[--at]; e.preventDefault(); }
            if (e.key === 'ArrowDown' && at < history.length) { input.value = history[++at] || ''; e.preventDefault(); }
        });
        $('#shell').addEventListener('click', e => {
            if (!e.target.closest('a, button') && !String(window.getSelection())) input.focus({ preventScroll: true });
        });
        // on load the shell types its first command, once
        const typed = document.createTextNode('');
        const word = 'whoami';
        let introDone = false;
        function finishIntro() {
            if (introDone) return;
            introDone = true;
            typed.data = word;
            commands.whoami();
            print('Type ', cmd('help'), ' for every command, or try ', cmd('deloitte'), ' or ', cmd('projects'));
            out.setAttribute('aria-live', 'polite');
        }
        function type() {
            if (introDone) return;
            if (typed.data.length === word.length) { finishIntro(); return; }
            typed.data += word[typed.data.length];
            setTimeout(type, 90);
        }
        print(bold('visitor@goncalo:~$ '), typed);
        if (reduced) finishIntro(); else setTimeout(type, 500);
    })();

    render();
    onScroll();
})();
