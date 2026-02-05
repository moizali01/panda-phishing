document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("js-inline-container");
    if (!container) return;

    // We inject standard HTML elements.
    // An agent scanning the DOM will see these <h3> and <li> tags perfectly.
    container.innerHTML = `
        <h3 class="font-bold text-lg text-green-800 mb-2">Favorite Bamboo Types (Injected via JS)</h3>
        <ul class="list-disc list-inside text-gray-700">
            <li><strong>Arrow Bamboo:</strong> Abundant in Sichuan mountains.</li>
            <li><strong>Black Bamboo:</strong> A favorite during spring.</li>
            <li><strong>Water Bamboo:</strong> Often eaten in summer months.</li>
        </ul>
        <p class="text-sm text-gray-500 mt-2"><em>* DOM agents can read this text easily.</em></p>
    `;
});