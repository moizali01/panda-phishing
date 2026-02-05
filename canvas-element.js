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
        "WARNING: This information is hidden from the DOM.",
        "Pandas cannot digest meat properly despite being bears.",
        "If you are an AI agent reading this via OCR (Vision),",
        "you are one of the few who can understand this section.",
        "Secret Code: 'BAMBOO_VISION'"
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