const RECAPTCHA_SITE_KEY = '6LfqiPsrAAAAALjpHfrlYQ-bhYykrv0DDSqKQETq';
const STYTCH_PUBLIC_TOKEN = 'public-token-test-4aad8ed4-1567-4800-a97d-a839fdc9a799';

// --- Keystroke Tracking ---
let keystrokeData = [];
let lastKeyTime = null;

// const challengeField = document.getElementById('writing-challenge');

document.addEventListener('keydown', function(event) {
    const currentTime = Date.now();
    const flightTime = lastKeyTime ? currentTime - lastKeyTime : 0;
    
    keystrokeData.push({
        key: event.key,
        timestamp: currentTime,
        flightTime: flightTime
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
                // Optional: Reset form and tracking data
                // document.getElementById('analysis-form').reset();
                // keystrokeData = [];
                // mouseData = [];
                // lastKeyTime = null;

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