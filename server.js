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