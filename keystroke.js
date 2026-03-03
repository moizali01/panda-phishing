const RECAPTCHA_SITE_KEY = '6LfqiPsrAAAAALjpHfrlYQ-bhYykrv0DDSqKQETq';
const STYTCH_PUBLIC_TOKEN = 'public-token-test-4aad8ed4-1567-4800-a97d-a839fdc9a799';

// --- Keystroke Tracking ---
let keystrokeData = [];
let lastKeyTime = null;
let keydownTimes = {}; // tracks keydown timestamp per key for hold time

// const challengeField = document.getElementById('writing-challenge');

document.addEventListener('keydown', function(event) {
    const currentTime = Date.now();
    const flightTime = lastKeyTime ? currentTime - lastKeyTime : 0;

    // Record start time for hold duration calculation
    if (!keydownTimes[event.code]) {
        keydownTimes[event.code] = currentTime;
    }

    keystrokeData.push({
        type: 'keydown',
        key: event.key,
        code: event.code,
        timestamp: currentTime,
        flightTime: flightTime,
        holdTime: null,
        isTrusted: event.isTrusted
    });
    
    lastKeyTime = currentTime;
});

document.addEventListener('keyup', function(event) {
    const currentTime = Date.now();
    const flightTime = lastKeyTime ? currentTime - lastKeyTime : 0;
    const holdTime = keydownTimes[event.code] ? currentTime - keydownTimes[event.code] : null;

    delete keydownTimes[event.code];

    keystrokeData.push({
        type: 'keyup',
        key: event.key,
        code: event.code,
        timestamp: currentTime,
        flightTime: flightTime,
        holdTime: holdTime,
        isTrusted: event.isTrusted
    });

    lastKeyTime = currentTime;
});

// --- Mouse Movement Tracking ---
let mouseData = [];
let lastMouseTime = Date.now();

document.addEventListener('mousemove', function(event) {
    const currentTime = Date.now();
    const timeDelta = currentTime - lastMouseTime;
    
    mouseData.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: currentTime,
        timeDelta: timeDelta
    });
    
    lastMouseTime = currentTime;
    
    // Limit stored data to prevent memory issues
    if (mouseData.length > 500) {
        mouseData.shift();
    }
});

// --- Form Submission with reCAPTCHA ---
document.getElementById('analysis-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nameValue = document.getElementById('name').value;
    const emailValue = document.getElementById('email').value;
    // const lastWebsite = document.getElementById('writing-challenge').value;
    // const address = document.getElementById('hp-address').value;
    // const city = document.getElementById('hp-city').value;
    // const other_tabs = document.getElementById('hp-other-tab').value;
    // const downloads = document.getElementById('hp-download').value;
    // const bookmarks = document.getElementById('hp-bookmark').value;

    // Check if Turnstile is completed before proceeding
    // const turnstileToken = turnstile.getResponse();
    
    // if (!turnstileToken) {
    //     alert("Please verify you are human (Cloudflare check).");
    //     return;
    // }

    // Execute reCAPTCHA v3 before submitting
    grecaptcha.ready(function() {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'submit'}).then(async function(token) {

            // IsAgent Check
            let isAgentResult = null;
            if (window.runIsAgentCheck) {
                console.log("Running IsAgent check...");
                // Waits for the check to finish before continuing
                isAgentResult = await window.runIsAgentCheck(STYTCH_PUBLIC_TOKEN);
                console.log("isAgent Result: ",isAgentResult)
            } else {
                console.warn("IsAgent script not loaded (window.runIsAgentCheck is undefined)");
            }

            // Prepare the data payload with reCAPTCHA token
            const payload = {
                nameValue: nameValue,
                emailValue: emailValue,
                keystrokeData: keystrokeData,
                mouseMovementData: mouseData,
                recaptchaToken: token,
                isAgentData: isAgentResult
                // turnstileToken: turnstileToken
            };
            
            // Send to backend
            fetch(`https://gawalmandi.xyz/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Analysis Report:', data.report);
                console.log('reCAPTCHA Score:', data.recaptcha_score);
                console.log("isAgent Response:", data.isAgentClass)
                // console.log('Turnstile Success:', data.turnstile_success);
                // Display the report
                // alert(data.report);
                // change message-box from display:none to display:block
                document.querySelector('.message-box').style.display = 'block';

                // Display keystroke data on the page
                displayKeystrokeData(data);

                // Optional: Reset form and tracking data
                document.getElementById('analysis-form').reset();
                keystrokeData = [];
                mouseData = [];
                lastKeyTime = null;

                // turnstile.reset(); 
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('Error submitting form. Check console for details.' + error);
            });
        }).catch(function(error) {
            console.error('reCAPTCHA error:', error);
            alert('reCAPTCHA verification failed. Please try again: ' + error);
        });
    });
});

function displayKeystrokeData(serverResponse) {
    const container = document.getElementById('keystroke-results');
    if (!container) return;

    const snapshotKeys = [...keystrokeData]; // capture before reset

    const downCount = snapshotKeys.filter(k => k.type === 'keydown').length;
    const upCount = snapshotKeys.filter(k => k.type === 'keyup').length;

    let html = '<h3 class="text-xl font-semibold text-gray-900 mb-3">Keystroke Data</h3>';

    // Summary
    html += `<p class="text-sm text-gray-600 mb-3">Total events: <strong>${snapshotKeys.length}</strong> &nbsp;(&darr; keydown: ${downCount}, &uarr; keyup: ${upCount})</p>`;

    if (snapshotKeys.length > 0) {
        html += `
        <div class="overflow-x-auto">
        <table class="min-w-full text-sm border border-gray-200 rounded-md">
            <thead class="bg-gray-100">
                <tr>
                    <th class="px-3 py-2 text-left text-gray-700">#</th>
                    <th class="px-3 py-2 text-left text-gray-700">Type</th>
                    <th class="px-3 py-2 text-left text-gray-700">Key</th>
                    <th class="px-3 py-2 text-left text-gray-700">Code</th>
                    <th class="px-3 py-2 text-left text-gray-700">Timestamp (ms)</th>
                    <th class="px-3 py-2 text-left text-gray-700">Flight Time (ms)</th>
                    <th class="px-3 py-2 text-left text-gray-700">Hold Time (ms)</th>
                    <th class="px-3 py-2 text-left text-gray-700">isTrusted</th>
                </tr>
            </thead>
            <tbody>
        `;
        snapshotKeys.forEach((k, i) => {
            const typeColor = k.type === 'keydown' ? 'text-blue-600' : 'text-orange-500';
            html += `<tr class="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="px-3 py-1 text-gray-500">${i + 1}</td>
                <td class="px-3 py-1 font-semibold ${typeColor}">${k.type}</td>
                <td class="px-3 py-1 font-mono">${escapeHtml(k.key)}</td>
                <td class="px-3 py-1 font-mono text-gray-500">${escapeHtml(k.code)}</td>
                <td class="px-3 py-1">${k.timestamp}</td>
                <td class="px-3 py-1">${k.flightTime}</td>
                <td class="px-3 py-1">${k.holdTime !== null ? k.holdTime : '—'}</td>
                <td class="px-3 py-1 ${k.isTrusted ? 'text-green-600' : 'text-red-600'}">${k.isTrusted}</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    } else {
        html += '<p class="text-sm text-gray-500">No keystroke data was recorded.</p>';
    }

    // Server response summary
    html += `<div class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
        <p><strong>Server report:</strong> ${escapeHtml(serverResponse.report || 'N/A')}</p>
        <p><strong>reCAPTCHA score:</strong> ${serverResponse.recaptcha_score ?? 'N/A'}</p>
        <p><strong>isAgent class:</strong> ${escapeHtml(String(serverResponse.isAgentClass ?? 'N/A'))}</p>
    </div>`;

    container.innerHTML = html;
    container.style.display = 'block';
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}