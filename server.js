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

// Adjust the limit for json req/resp to accommodate larger fingerprints
app.use(bodyParser.json({limit:'10mb'}));

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());

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

// This route handles the form submission
app.post("/analyze", async (req, res) => { // <-- Make the route 'async'
    console.log("--- FORM DATA RECEIVED ---");
    
    // Extract the token from the request body
    const { recaptchaToken } = req.body;

    // Log the full payload (excluding the token for brevity if you want)
    console.log(JSON.stringify(req.body, null, 2));
    
    // --- Verify the token ---
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    
    console.log("--- RECAPTCHA RESULT ---");
    console.log(recaptchaResult);
    console.log("------------------------");

    // Check if verification was successful and the score is above your threshold
    if (recaptchaResult.success && recaptchaResult.score >= 0.5) {
        // Human
        res.json({
            report: "Data received and user verified as human.",
            recaptcha_score: recaptchaResult.score,
            data: req.body // You can send back the data if needed
        });
    } else {
        // Bot or error
        res.json({
            report: "User verification failed. Likely a bot.",
            recaptcha_score: recaptchaResult.score,
            'error-codes': recaptchaResult['error-codes']
        });
    }
});

/* Server Activation */
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(4420);
// console.log("HTTPS server running on port 4420");

// var httpServer = http.createServer(credentials, app);
var httpServer = http.createServer(app);
httpServer.listen(5001, () => { 
    console.log("HTTP server running on port 5001");
});