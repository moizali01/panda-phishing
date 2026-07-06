// tracker-pledge.js
(function() {
    const FORM_TYPE = 'pledge-form';
    const ENDPOINT = '/tracker_endpoint';
    const BATCH_INTERVAL = 2000;
    let mutationQueue = [];

    let sessionId = sessionStorage.getItem('panda_form_session');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('panda_form_session', sessionId);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;

                if (target.classList && target.classList.contains('reveal-field')) {
                    const isNowVisible = target.classList.contains('visible');
                    const wasVisible = mutation.oldValue && mutation.oldValue.includes('visible');

                    if (isNowVisible && !wasVisible) {
                        mutationQueue.push({
                            type: 'field_revealed',
                            field_id: target.id,
                            timestamp: Date.now()
                        });
                    }
                }
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const formContainer = document.getElementById('dynamic-form') || document.getElementById('pledge-form') || document.body;
        if (formContainer) {
            observer.observe(formContainer, {
                attributes: true,
                attributeOldValue: true,
                subtree: true,
                attributeFilter: ['class']
            });
        }
    });

    document.addEventListener('change', function(e) {
        const target = e.target;
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
            mutationQueue.push({
                type: 'field_completed',
                field_name: target.name || target.id,
                input_type: target.type,
                timestamp: Date.now()
            });
        }
    }, true);

    setInterval(() => {
        if (mutationQueue.length === 0) return;

        const batch = mutationQueue.splice(0, 50);
        console.log('Tracker Batch Prepared:', batch);

        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                formType: FORM_TYPE,
                url: window.location.pathname,
                events: batch
            }),
            keepalive: true
        }).catch((err) => console.error('Tracker fetch error:', err));
    }, BATCH_INTERVAL);

    let lastMouseMoveTime = 0;
    const MOUSE_THROTTLE = 40;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMoveTime > MOUSE_THROTTLE) {
            mutationQueue.push({
                type: 'mouse_move',
                x: Math.round(e.pageX),
                y: Math.round(e.pageY),
                timestamp: now
            });
            lastMouseMoveTime = now;
        }
    });

    document.addEventListener('mousedown', (e) => {
        let btn = 'left';
        if (e.button === 1) btn = 'middle';
        if (e.button === 2) btn = 'right';

        mutationQueue.push({
            type: 'mouse_click',
            button: btn,
            x: Math.round(e.pageX),
            y: Math.round(e.pageY),
            target_element: e.target.tagName,
            target_id: e.target.id || '',
            is_trusted: e.isTrusted,
            timestamp: Date.now()
        });
    });

    document.addEventListener('input', function(e) {
        const target = e.target;

        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;
        if (target.type === 'password') return;

        mutationQueue.push({
            type: 'input_capture',
            field_name: target.name || target.id || 'unnamed_field',
            value: target.value,
            is_trusted: e.isTrusted,
            timestamp: Date.now()
        });
    }, true);

    const activeKeys = {};

    document.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        activeKeys[e.code] = Date.now();
    }, true);

    document.addEventListener('keyup', (e) => {
        const startTime = activeKeys[e.code];

        if (startTime) {
            const duration = Date.now() - startTime;
            delete activeKeys[e.code];

            mutationQueue.push({
                type: 'keypress_dwell_time',
                key: e.code,
                duration_ms: duration,
                is_trusted: e.isTrusted,
                timestamp: Date.now()
            });
        }
    }, true);
})();
