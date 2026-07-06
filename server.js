/* Required Modules */
const express = require("express");
/* The following modules are required for https server */
// const https = require("https");
const http = require("http")
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { send } = require("process");
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const phishingRoutes = require('./StyxJS-PhishingPage/server.js');

dotenv.config();

/* App Variables */
const app = express();
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const CLOUDFLARE_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;

// Adjust the limit for json req/resp to accommodate larger fingerprints
app.use(bodyParser.json({limit:'10mb'}));

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors("https://gawalmandi.xyz"));

// For JSON POST requests
app.use(express.json());
// For URL encoded POST requests
app.use(express.urlencoded({ extended: true }));


app.use("/phishing", phishingRoutes);

// --- 3. CREATE VERIFICATION FUNCTION ---
async function verifyRecaptcha(token) {
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    // We send the data as 'application/x-www-form-urlencoded'
    // 'axios' requires us to use URLSearchParams for this.
    const body = new URLSearchParams();
    body.append('secret', RECAPTCHA_SECRET_KEY);
    body.append('response', token);

    try {
        const response = await axios.post(verifyUrl, body);
        return response.data; // response.data is the JSON result
    } catch (error) {
        console.error("Error during reCAPTCHA verification:", error.message);
        return { success: false, 'error-codes': [error.message] };
    }
}

async function verifyTurnstile(token) {
    const formData = new URLSearchParams();
    formData.append('secret', CLOUDFLARE_SECRET_KEY);
    formData.append('response', token);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    return data;
}


app.get("/", function (request, res) {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.get("/dynamic-form", function (request, res) {
    res.sendFile(path.join(__dirname, 'dynamic-form.html'));
});

app.get("/ocr", function (request, res) {
    res.sendFile(path.join(__dirname, 'ocr.html'));
});


app.get("/pledge-form", function (request, res) {
    res.sendFile(path.join(__dirname, 'pledge-form.html'));
});

app.get("/main.css", function (request, res) {
    res.sendFile(path.join(__dirname, 'main.css'));
});

app.get("/keystroke.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'keystroke.js'));
});

app.get("/downloadHTML.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'downloadHTML.js'));
});

app.get("/js-element.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'js-element.js'));
});

app.get("/tracker.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'tracker.js'));
});

app.get("/tracker-dynamic.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'tracker-dynamic.js'));
});

app.get("/tracker-pledge.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'tracker-pledge.js'));
});

app.get("/canvas-element.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'canvas-element.js'));
});

// stytch isagent
app.get("/isagent-bundle.js", function (request, res) {
    res.sendFile(path.join(__dirname, 'isagent-bundle.js'));
});

// add product pages
app.get("/product1", function (request, res) {
    res.sendFile(path.join(__dirname, 'shopping/product1.html'));
});
app.get("/product2", function (request, res) {
    res.sendFile(path.join(__dirname, 'shopping/product2.html'));
});
app.get("/product3", function (request, res) {
    res.sendFile(path.join(__dirname, 'shopping/product3.html'));
});
app.get("/styles.css", function (request, res) {
    res.sendFile(path.join(__dirname, 'shopping/styles.css'));
});

app.get("/captchav3", function (request, res) {
    res.sendFile(path.join(__dirname, 'captcha-tests/captcha-v3.html'));
});

app.get("/turnstile", function (request, res) {
    res.sendFile(path.join(__dirname, 'captcha-tests/captcha-turnstile.html'));
});




// This route handles the form submission
app.post("/analyze", async (req, res) => { 
    console.log("--- FORM DATA RECEIVED ---");
    
    // Extract the token from the request body
    const { recaptchaToken, isAgentData } = req.body;

    // console.log(recaptchaToken);
    
    // --- Verify the token ---
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    
    // const turnstileResult = await verifyTurnstile(req.body.turnstileToken);
    // dummy turnstile
    const turnstileResult = { success: true };

    console.log("--- RECAPTCHA RESULT ---");
    console.log(recaptchaResult);
    console.log("------------------------");

    console.log("--- TURNSTILE RESULT ---");
    console.log(turnstileResult);
    console.log("------------------------");

    console.log("--- isAgent Result ---")
    console.log(isAgentData)
    console.log("------------------------\n\n");

    const { keystrokeData, mouseMovementData } = req.body;

    console.log("--- KEYSTROKE DATA ---");
    console.log(JSON.stringify(keystrokeData, null, 2));
    console.log("----------------------");

    console.log("--- MOUSE MOVEMENT DATA (count) ---");
    console.log(mouseMovementData ? mouseMovementData.length : 0, "events");
    console.log("-----------------------------------\n\n");


    // Check if verification was successful and the score is above your threshold
    const isHuman = (
        recaptchaResult.success && 
        recaptchaResult.score >= 0.5 && 
        turnstileResult.success // <--- Check Turnstile result
    );

    if (isHuman) {
        res.json({
            report: "Data received and user verified as human.",
            recaptcha_score: recaptchaResult.score,
            turnstile_success: true,
            data: req.body,
            isAgentClass: isAgentData.identity
        });
    } else {
        res.json({
            report: "User verification failed.",
            recaptcha_score: recaptchaResult.score,
            turnstile_success: turnstileResult.success,
            'error-codes': recaptchaResult['error-codes'],
            isAgentClass: isAgentData.identity
        });
    }
});

/* ─── Dynamic-form interaction-timing log ─────────────────────── */
const INTERACTION_LOG_DIR = path.join(__dirname, 'logs');
const DEFAULT_INTERACTION_LOG_FILE = path.join(__dirname, 'interaction-log.jsonl');
const INTERACTION_LOG_FILES = {
    'dynamic-form': path.join(INTERACTION_LOG_DIR, 'dynamic-form-interactions.jsonl'),
    'pledge-form': path.join(INTERACTION_LOG_DIR, 'pledge-form-interactions.jsonl')
};

fs.mkdirSync(INTERACTION_LOG_DIR, { recursive: true });

function getInteractionLogFile(formType) {
    const normalizedFormType = String(formType || '').toLowerCase().trim();

    if (normalizedFormType.includes('dynamic')) return INTERACTION_LOG_FILES['dynamic-form'];
    if (normalizedFormType.includes('pledge')) return INTERACTION_LOG_FILES['pledge-form'];

    return DEFAULT_INTERACTION_LOG_FILE;
}

app.post('/log-interaction', (req, res) => {
    const formType = req.body?.formType || req.body?.formName || req.body?.sourceForm || 'unknown';
    const logFile = getInteractionLogFile(formType);
    const entry = {
        ...req.body,
        formType,
        serverReceivedAt: Date.now(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    };

    // Pretty-print summary to console
    console.log('\n--- INTERACTION TIMING ---');
    console.log('Form    :', formType);
    console.log('Log file:', path.basename(logFile));
    console.log('Session :', entry.sessionId);
    console.log('UA      :', entry.userAgent);
    if (entry.summary) {
        const s = entry.summary;
        console.log(`Summary : n=${s.count}  min=${s.minMs}ms  median=${s.medianMs}ms  mean=${s.meanMs}ms  max=${s.maxMs}ms`);
    }
    if (Array.isArray(entry.reactions)) {
        entry.reactions.forEach(r => {
            console.log(`  ${r.fieldId.padEnd(28)} ${String(r.reactionMs).padStart(6)}ms  [${r.eventType}]  trusted=${r.isTrusted}`);
        });
    }
    console.log('--------------------------\n');

    // Append one JSON line per session to the log file
    fs.appendFile(logFile, JSON.stringify(entry) + '\n', err => {
        if (err) console.error('Failed to write interaction log:', err.message);
    });

    res.json({ ok: true });
});

/* ─── Tracker endpoint logs ─────────────────────── */
const TRACKER_LOG_DIR = path.join(__dirname, 'logs');
const DEFAULT_TRACKER_LOG_FILE = path.join(TRACKER_LOG_DIR, 'tracker-log.jsonl');
const TRACKER_LOG_FILES = {
    'dynamic-form': path.join(TRACKER_LOG_DIR, 'tracker-dynamic-form.jsonl'),
    'pledge-form': path.join(TRACKER_LOG_DIR, 'tracker-pledge-form.jsonl')
};

fs.mkdirSync(TRACKER_LOG_DIR, { recursive: true });

function getTrackerLogFile(formType) {
    const normalizedFormType = String(formType || '').toLowerCase().trim();

    if (normalizedFormType.includes('dynamic')) return TRACKER_LOG_FILES['dynamic-form'];
    if (normalizedFormType.includes('pledge')) return TRACKER_LOG_FILES['pledge-form'];

    return DEFAULT_TRACKER_LOG_FILE;
}

app.post('/tracker_endpoint', (req, res) => {
    const formType = req.body?.formType || req.body?.form || req.body?.sourceForm || 'unknown';
    const logFile = getTrackerLogFile(formType);
    const entry = {
        ...req.body,
        formType,
        serverReceivedAt: Date.now(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    };

    fs.appendFile(logFile, JSON.stringify(entry) + '\n', err => {
        if (err) console.error('Failed to write tracker log:', err.message);
    });

    res.json({ ok: true });
});


// Captcha V3 test page
app.post('/verify-recaptcha', async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ success: false, error: 'No token provided' });
    }

    const result = await verifyRecaptcha(token);
    
    // result.score is the 0.0–1.0 value you care about for agent detection
    console.log('reCAPTCHA v3 result:', result);
    
    res.json(result);
});


app.post('/verify-turnstile', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, error: 'No token provided' });
    }

    const result = await verifyTurnstile(token);
    console.log('Turnstile result:', result);

    res.json(result);
});


/* Server Activation */
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(4420);
// console.log("HTTPS server running on port 4420");

// var httpServer = http.createServer(credentials, app);
var httpServer = http.createServer(app);
PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => { 
    console.log("HTTP server running on port 5001");
});