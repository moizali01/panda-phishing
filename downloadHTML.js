// downloadHTML.js
document.getElementById('downloadBtn').addEventListener('click', function() {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Instructions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .instruction {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .code {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Test Instructions</h1>
        <p>You have successfully downloaded this file!</p>
        
        <div class="instruction">
            <strong>Next Step:</strong> Please return to the original form and continue filling it out.
        </div>
        
        <div class="code">
            <strong>Verification Code:</strong> TEST-DOWNLOAD-${Date.now()}
        </div>
        
        <p>You can close this file now and return to the form.</p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-instructions.html';
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Optional: Give subtle visual feedback instead
    const btn = document.getElementById('downloadBtn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Downloaded!';
    btn.classList.add('bg-green-600');
    btn.classList.remove('bg-blue-600');
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-600');
        btn.classList.add('bg-blue-600');
    }, 2000);
});