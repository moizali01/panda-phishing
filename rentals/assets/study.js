// Study context + event logging shared by every /rentals page.
// Run identifiers come from the URL (?pid=&run=&cond=), are kept in sessionStorage
// for the tab, and are re-appended to internal links so they survive new tabs.
(function () {
    const KEYS = ['pid', 'run', 'cond'];
    const params = new URLSearchParams(location.search);
    const ctx = {};

    function store(key, value) {
        try { sessionStorage.setItem('mem_' + key, value); } catch (e) {}
    }
    function recall(key) {
        try { return sessionStorage.getItem('mem_' + key); } catch (e) { return null; }
    }

    KEYS.forEach(function (k) {
        const v = params.get(k);
        if (v) store(k, v);
        ctx[k] = v || recall(k) || null;
    });

    // Per-tab session id, so separate visits within one run can be told apart.
    let sid = recall('sid');
    if (!sid) {
        sid = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
        store('sid', sid);
    }
    ctx.sid = sid;

    function withCtx(url) {
        const u = new URL(url, location.origin);
        KEYS.forEach(function (k) {
            if (ctx[k] && !u.searchParams.has(k)) u.searchParams.set(k, ctx[k]);
        });
        // Forward the form-variant flag from the current URL only (not stored ctx), so a
        // default run never picks it up but a ?form=… run carries it through every hop.
        var form = new URLSearchParams(location.search).get('form');
        if (form && !u.searchParams.has('form')) u.searchParams.set('form', form);
        return u.pathname + u.search;
    }

    // Sent as text/plain so sendBeacon works everywhere; the server parses it.
    function logEvent(type, data) {
        const body = JSON.stringify({
            type: type,
            pid: ctx.pid, run: ctx.run, cond: ctx.cond, sid: ctx.sid,
            path: location.pathname + location.search,
            clientTime: Date.now(),
            data: data || {}
        });
        try {
            if (navigator.sendBeacon && navigator.sendBeacon('/rentals/event', new Blob([body], { type: 'text/plain' }))) return;
        } catch (e) {}
        fetch('/rentals/event', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: body, keepalive: true }).catch(function () {});
    }

    function init() {
        document.querySelectorAll('a[data-ctx]').forEach(function (a) {
            a.href = withCtx(a.getAttribute('href'));
        });
        logEvent('pageview', {
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            webdriver: navigator.webdriver === true,
            viewport: [window.innerWidth, window.innerHeight]
        });
    }

    document.addEventListener('click', function (e) {
        const el = e.target.closest('a, button, [data-track]');
        if (!el) return;
        logEvent('click', {
            track: el.dataset.track || null,
            id: el.id || null,
            text: (el.innerText || '').trim().slice(0, 80),
            href: el.getAttribute('href'),
            isTrusted: e.isTrusted
        });
    }, true);

    // Listings visible for this run. In step-2 conditions the server hides the gated
    // listing until it is released, then it moves to the top as "Just listed".
    function loadListings() {
        const all = window.LISTINGS.slice();
        const q = new URLSearchParams();
        KEYS.forEach(function (k) { if (ctx[k]) q.set(k, ctx[k]); });
        return fetch('/rentals/state?' + q.toString())
            .then(function (r) { return r.json(); })
            .then(function (state) {
                if (!state.gated) return all;
                const gated = all.filter(function (l) { return l.gated; });
                const rest = all.filter(function (l) { return !l.gated; });
                if (!state.released) return rest;
                return gated.map(function (l) { return Object.assign({}, l, { justListed: true }); }).concat(rest);
            })
            .catch(function () { return all; });
    }

    window.MemStudy = { ctx: ctx, withCtx: withCtx, logEvent: logEvent, loadListings: loadListings };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
