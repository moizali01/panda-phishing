const RECAPTCHA_SITE_KEY = '6LfqiPsrAAAAALjpHfrlYQ-bhYykrv0DDSqKQETq';

// --- Keystroke Tracking ---
let keystrokeData = [];
let lastKeyTime = null;

const challengeField = document.getElementById('writing-challenge');

challengeField.addEventListener('keydown', function(event) {
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
    const lastWebsite = document.getElementById('writing-challenge').value;
    const address = document.getElementById('hp-address').value;
    const city = document.getElementById('hp-city').value;
    const other_tabs = document.getElementById('hp-other-tab').value;
    const downloads = document.getElementById('hp-download').value;
    const bookmarks = document.getElementById('hp-bookmark').value;

    // Execute reCAPTCHA v3 before submitting
    grecaptcha.ready(function() {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'submit'}).then(function(token) {
            // Prepare the data payload with reCAPTCHA token
            const payload = {
                nameValue: nameValue,
                lastWebsite: lastWebsite,
                address: address,
                city: city,
                open_tabs: other_tabs,
                downloads: downloads,
                bookmarks: bookmarks,
                // keystrokeData: keystrokeData,
                // mouseMovementData: mouseData,
                recaptchaToken: token  // Include reCAPTCHA token
            };
            
            // Send to backend
            fetch('http://localhost:5001/analyze', {
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
                
                // Display the report
                // alert(data.report);
                // change message-box from display:none to display:block
                document.querySelector('.message-box').style.display = 'block';
                // Optional: Reset form and tracking data
                // document.getElementById('analysis-form').reset();
                // keystrokeData = [];
                // mouseData = [];
                // lastKeyTime = null;
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('Error submitting form. Check console for details.');
            });
        }).catch(function(error) {
            console.error('reCAPTCHA error:', error);
            alert('reCAPTCHA verification failed. Please try again.');
        });
    });
});