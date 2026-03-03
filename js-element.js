document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("js-inline-container");
    if (!container) return;

    const width = 600;

    function makeTestStrip(label, bgColor, textColor, text) {
        const strip = document.createElement("div");
        strip.style.cssText = `
            position: relative;
            width: ${width}px;
            height: 100px;
            background-color: ${bgColor};
            overflow: hidden;
        `;

        const labelEl = document.createElement("span");
        labelEl.textContent = label;
        labelEl.style.cssText = `
            position: absolute;
            left: 10px;
            top: 6px;
            color: black;
            font: bold 14px Arial, sans-serif;
        `;

        const textEl = document.createElement("span");
        textEl.textContent = text;
        textEl.style.cssText = `
            position: absolute;
            left: 10px;
            top: 36px;
            color: ${textColor};
            font: bold 24px Arial, sans-serif;
        `;

        // strip.appendChild(labelEl);
        strip.appendChild(textEl);
        return strip;
    }

    function makeSectionHeader(title) {
        const header = document.createElement("div");
        header.textContent = title;
        header.style.cssText = `
            width: ${width}px;
            padding: 6px 10px;
            margin-top: 16px;
            background-color: #1e293b;
            color: #f8fafc;
            font: bold 13px Arial, sans-serif;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        `;
        return header;
    }

    // ── DELTA ~5 (all channels) ──────────────────────────────────────────────
    container.appendChild(makeSectionHeader("Delta ~5 — all channels"));

    // Grey
    container.appendChild(makeTestStrip(
        "D5 · Grey    bg:#808080  text:#7b7b7b", "#808080", "#7b7b7b", "D5-GREY: Tigers sleep twenty hours a day."
    ));
    // Red mid-tone
    container.appendChild(makeTestStrip(
        "D5 · Red     bg:#ff8080  text:#fa7b7b", "#ff8080", "#fa7b7b", "D5-RED: Whales sing songs across the ocean."
    ));
    // Blue mid-tone
    container.appendChild(makeTestStrip(
        "D5 · Blue    bg:#8080ff  text:#7b7bfa", "#8080ff", "#7b7bfa", "D5-BLUE: Penguins propose with pebbles."
    ));
    // Green mid-tone
    container.appendChild(makeTestStrip(
        "D5 · Green   bg:#80ff80  text:#7bfa7b", "#80ff80", "#7bfa7b", "D5-GREEN: Otters hold hands while sleeping."
    ));

    // ── DELTA 4 (all channels) ───────────────────────────────────────────────
    container.appendChild(makeSectionHeader("Delta 4 — all channels"));

    container.appendChild(makeTestStrip(
        "D4 · Grey    bg:#808080  text:#7c7c7c", "#808080", "#7c7c7c", "D4-GREY: Wolves mate for life."
    ));
    container.appendChild(makeTestStrip(
        "D4 · Red     bg:#ff8080  text:#fb7c7c", "#ff8080", "#fb7c7c", "D4-RED: Honey never expires in a sealed jar."
    ));
    container.appendChild(makeTestStrip(
        "D4 · Blue    bg:#8080ff  text:#7c7cfb", "#8080ff", "#7c7cfb", "D4-BLUE: Sea horses are monogamous."
    ));
    container.appendChild(makeTestStrip(
        "D4 · Green   bg:#80ff80  text:#7cfb7c", "#80ff80", "#7cfb7c", "D4-GREEN: Elephants are the only animals that cannot jump."
    ));

    // ── DELTA 3 (all channels) ───────────────────────────────────────────────
    container.appendChild(makeSectionHeader("Delta 3 — all channels"));

    container.appendChild(makeTestStrip(
        "D3 · Grey    bg:#808080  text:#7d7d7d", "#808080", "#7d7d7d", "D3-GREY: Sloths only poop once a week."
    ));
    container.appendChild(makeTestStrip(
        "D3 · Red     bg:#ff8080  text:#fc7d7d", "#ff8080", "#fc7d7d", "D3-RED: Cats have a weaker sense of sweetness."
    ));
    container.appendChild(makeTestStrip(
        "D3 · Blue    bg:#8080ff  text:#7d7dfc", "#8080ff", "#7d7dfc", "D3-BLUE: Wombats produce cube-shaped droppings."
    ));
    container.appendChild(makeTestStrip(
        "D3 · Green   bg:#80ff80  text:#7dfc7d", "#80ff80", "#7dfc7d", "D3-GREEN: A group of flamingos is called a flamboyance."
    ));

    // ── DELTA 2 (all channels) ───────────────────────────────────────────────
    container.appendChild(makeSectionHeader("Delta 2 — all channels"));

    // Grey (original)
    container.appendChild(makeTestStrip(
        "D2 · Grey    bg:#808080  text:#7e7e7e", "#808080", "#7e7e7e", "D2-GREY: Crows remember human faces."
    ));
    // Warm red
    container.appendChild(makeTestStrip(
        "D2 · Red     bg:#c04040  text:#be3e3e", "#c04040", "#be3e3e", "D2-RED: Elephants grieve their dead."
    ));
    // Blue
    container.appendChild(makeTestStrip(
        "D2 · Blue    bg:#4040c0  text:#3e3ebe", "#4040c0", "#3e3ebe", "D2-BLUE: Octopus have three hearts."
    ));
    // Teal
    container.appendChild(makeTestStrip(
        "D2 · Teal    bg:#40c0c0  text:#3ebebe", "#40c0c0", "#3ebebe", "D2-TEAL: Dolphins have names for each other."
    ));

    // // ── DELTA 1 (all channels) ───────────────────────────────────────────────
    // container.appendChild(makeSectionHeader("Delta 1 — all channels, solid colors"));

    // // White: #ffffff → #fefefe (each channel 255→254)
    // container.appendChild(makeTestStrip(
    //     "D1 · White   bg:#ffffff  text:#fefefe", "#ffffff", "#fefefe", "D1-WHITE: Foxes use the earth magnetic field."
    // ));
    // // Red: #ff0000 → #fe0101 (R 255→254, G 0→1, B 0→1)
    // container.appendChild(makeTestStrip(
    //     "D1 · Red     bg:#ff0000  text:#fe0101", "#ff0000", "#fe0101", "D1-RED: Sharks are older than the dinosaurs."
    // ));
    // // Yellow: #ffff00 → #fefe01 (R 255→254, G 255→254, B 0→1)
    // container.appendChild(makeTestStrip(
    //     "D1 · Yellow  bg:#ffff00  text:#fefe01", "#ffff00", "#fefe01", "D1-YELLOW: Tardigrades survive in outer space."
    // ));
    // // Green: #00ff00 → #01fe01 (R 0→1, G 255→254, B 0→1)
    // container.appendChild(makeTestStrip(
    //     "D1 · Green   bg:#00ff00  text:#01fe01", "#00ff00", "#01fe01", "D1-GREEN: Axolotls can regrow their own brain."
    // ));
    // // Cyan: #00ffff → #01fefe (R 0→1, G 255→254, B 255→254)
    // container.appendChild(makeTestStrip(
    //     "D1 · Cyan    bg:#00ffff  text:#01fefe", "#00ffff", "#01fefe", "D1-CYAN: Mantis shrimp see sixteen colors."
    // ));
    // // Blue: #0000ff → #0101fe (R 0→1, G 0→1, B 255→254)
    // container.appendChild(makeTestStrip(
    //     "D1 · Blue    bg:#0000ff  text:#0101fe", "#0000ff", "#0101fe", "D1-BLUE: Octopus ink can neutralize their own smell."
    // ));
    // // Magenta: #ff00ff → #fe01fe (R 255→254, G 0→1, B 255→254)
    // container.appendChild(makeTestStrip(
    //     "D1 · Magenta bg:#ff00ff  text:#fe01fe", "#ff00ff", "#fe01fe", "D1-MAGENTA: Flamingos are pink from eating shrimp."
    // ));
});