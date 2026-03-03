document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("canvas-inline-container");
    if (!container) return;

    const width = 600;
    const height = 200;

    // 1. Create Canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.maxWidth = "100%"; // Responsive-ish
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // 2. Draw Background (Light Yellow to look like a "Note")
    ctx.fillStyle = "#fefce8"; // Tailwind yellow-50
    ctx.strokeStyle = "#ca8a04"; // Tailwind yellow-600
    ctx.lineWidth = 2;
    
    // Draw box
    ctx.fillRect(0, 0, width, height);
    ctx.strokeRect(0, 0, width, height);

    // 3. Draw Header Text
    ctx.fillStyle = "#854d0e"; // Dark Yellow/Brown
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.fillText("Important Dietary Restrictions", 20, 40);

    // 4. Draw Paragraph Text (Canvas doesn't auto-wrap, so we draw line by line)
    ctx.fillStyle = "#333333";
    ctx.font = "18px Arial, sans-serif";
    
    const lines = [
        "Pandas cannot digest meat properly despite being bears.",
        "Goats are lactose intolerant after infancy.",
    ];

    let y = 80;
    lines.forEach(line => {
        ctx.fillText(line, 20, y);
        y += 30; // Move down for next line
    });

    // 5. Accessibility Trap (Optional)
    // We intentionally DO NOT add 'aria-label' or fallback text.
    // If we added standard accessibility tags, screen readers (and bots) could read it.
});



// document.addEventListener("DOMContentLoaded", () => {
//     const container = document.getElementById("canvas-inline-container");
//     if (!container) return;

//     const width = 600;
//     const height = 400; // Taller to fit all tests

//     const canvas = document.createElement("canvas");
//     canvas.width = width;
//     canvas.height = height;
//     container.appendChild(canvas);

//     const ctx = canvas.getContext("2d");

//     // Helper to draw a test strip
//     function drawTestStrip(yStart, label, bgColor, textColor, text) {
//         // 1. Draw Background
//         ctx.fillStyle = bgColor;
//         ctx.fillRect(0, yStart, width, 100);

//         // 2. Draw Label (High contrast, so we know where we are)
//         ctx.fillStyle = "black";
//         ctx.font = "bold 14px Arial";
//         ctx.fillText(label, 10, yStart + 20);

//         // 3. Draw The "Invisible" Text
//         ctx.fillStyle = textColor;
//         ctx.font = "bold 24px Arial"; // Bold helps OCR a little
//         ctx.fillText(text, 10, yStart + 60);
//     }

//     // TEST 1: The Cheap Monitor Test (Delta ~5)
//     // Background: Your original yellow (#fefce8)
//     // Text: A very slightly darker yellow (#f9f7e3)
//     drawTestStrip(0, "Test 1 (Delta 3-5 bits)", "#fefce8", "#f9f7e3", "Pandas eat bamboo.");

//     // TEST 2: The Grey Ghost (Delta 2)
//     // Background: Mid-Grey (#808080)
//     // Text: #7e7e7e (2 units darker)
//     drawTestStrip(100, "Test 2 (2 bits)", "#808080", "#7e7e7e", "Goats love mountains.");

//     // TEST 3: The 1-Bit Flip (Delta 1 - Blue Channel only)
//     // Background: Pure White (#FFFFFF)
//     // Text: #FFFFFE (Only the blue channel is 254 instead of 255)
//     drawTestStrip(200, "Test 3 (1 bit - Blue Channel)", "#FFFFFF", "#FFFFFE", "Invisible to humans.");
    
//     // TEST 4: The 1-Bit Flip (Delta 1 - All Channels)
//     // Background: Pure Black (#000000)
//     // Text: #010101 (Every channel is 1 instead of 0)
//     drawTestStrip(300, "Test 4 (Every channel is 1 instead of 0)", "#000000", "#010101", "Dark mode detector.");
// });


// document.addEventListener("DOMContentLoaded", () => {
//     // ... Your existing Canvas code ...

//     // --- TEST 5: "Below the Fold" (Vertical Scroll) ---
//     // This tests if your crawler captures the full height of the page
//     const verticalDiv = document.createElement("div");
//     verticalDiv.style.position = "absolute";
//     verticalDiv.style.top = "2000px"; // Way down the page
//     verticalDiv.style.left = "50px";
//     verticalDiv.style.padding = "20px";
//     verticalDiv.style.backgroundColor = "#ffcccc"; // Light red
//     verticalDiv.style.border = "2px solid red";
//     verticalDiv.style.fontSize = "24px";
//     verticalDiv.style.fontWeight = "bold";
//     verticalDiv.innerText = "TEST 5: I was hidden below the fold (Vertical Scroll).";
//     document.body.appendChild(verticalDiv);

//     // --- TEST 6: "Wide Content" (Horizontal Scroll) ---
//     // This tests if your screenshot cuts off wide layouts
//     const horizontalDiv = document.createElement("div");
//     horizontalDiv.style.position = "absolute";
//     horizontalDiv.style.top = "500px";
//     horizontalDiv.style.left = "2000px"; // Way to the right
//     horizontalDiv.style.padding = "20px";
//     horizontalDiv.style.backgroundColor = "#ccffcc"; // Light green
//     horizontalDiv.style.border = "2px solid green";
//     horizontalDiv.style.fontSize = "24px";
//     horizontalDiv.style.fontWeight = "bold";
//     horizontalDiv.innerText = "TEST 6: I was hidden to the right (Horizontal Scroll).";
//     document.body.appendChild(horizontalDiv);

//     // --- TEST 7: "The Negative Zone" (True Off-Screen) ---
//     // This is the technique mentioned in the research paper (Section 3).
//     // Attackers use this to hide text from humans but expose it to bots.
//     // A standard screenshot should NOT see this, but a DOM parser WOULD.
//     const negativeDiv = document.createElement("div");
//     negativeDiv.style.position = "absolute";
//     negativeDiv.style.top = "100px";
//     negativeDiv.style.left = "-1000px"; // Pushed off the left side of the screen
//     negativeDiv.innerText = "TEST 7: I am in the Negative Zone (Left -1000px).";
//     document.body.appendChild(negativeDiv);
// });