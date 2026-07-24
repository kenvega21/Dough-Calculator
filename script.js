// === TOGGLE SWITCH MODE ===
function getBatchCount() {
    return document.getElementById("batchToggle").checked ? 3 : 1;
}

function updateBatchVisibility() {
    const count = getBatchCount();

    // Change Ball 1 label based on mode
    document.getElementById("ball1Label").textContent =
        count === 1 ? "Ball Weight (g)" : "Ball 1 Weight (g)";

    // Show/hide Ball 2 and Ball 3
    document.getElementById("ball2Box").style.display = count === 3 ? "block" : "none";
    document.getElementById("ball3Box").style.display = count === 3 ? "block" : "none";

    // Show/hide Fill button only in Multiple mode
    const fillBtn = document.getElementById("fillBtn");
    if (fillBtn) fillBtn.style.display = count === 3 ? "inline-block" : "none";
}

// === FILL BUTTON ===
function fillWeights() {
    const ball1Weight = document.getElementById("flour1").value;
    if (!ball1Weight) {
        alert("Please enter a weight for Ball 1 first.");
        return;
    }
    document.getElementById("flour2").value = ball1Weight;
    document.getElementById("flour3").value = ball1Weight;
}

// === CALCULATE ONE BALL ===
function calculateBall(ball, hydration) {
    const doughWeight = parseFloat(document.getElementById(`flour${ball}`).value);
    const salt = 2.5 / 100;
    const oil = 3.3 / 100;

    if (isNaN(doughWeight)) return null;

    const totalPercent = 1 + hydration + salt + oil;
    const flour = doughWeight / totalPercent;
    const water = flour * hydration;
    const saltGrams = flour * salt;
    const oilGrams = flour * oil;

    return { flour, water, saltGrams, oilGrams, doughWeight };
}

// === CALCULATE ALL ===
function calculateAll() {
    const hydrationInput = parseFloat(document.getElementById("hydration").value);
    const hotWaterFixed = 30;
    const yeastGrams = 0.8;
    const batchCount = getBatchCount();

    if (isNaN(hydrationInput)) {
        alert("Please enter hydration %");
        return;
    }

    const hydration = hydrationInput / 100;
    let totalFlour = 0, totalWater = 0, totalSalt = 0, totalOil = 0;

    for (let i = 1; i <= batchCount; i++) {
        const result = calculateBall(i, hydration);
        if (result) {
            totalFlour += result.flour;
            totalWater += result.water;
            totalSalt += result.saltGrams;
            totalOil += result.oilGrams;
        }
    }

    const totalMix = totalFlour + totalWater + totalSalt + totalOil + yeastGrams;
    const coldWater = totalWater - hotWaterFixed;
    const yeastPct = (yeastGrams / totalFlour * 100).toFixed(2);

    // Totals box
    document.getElementById("totalResults").innerHTML = `
        <strong>Total Dough Mix</strong>
        <span class="flour-total">${Math.round(totalFlour)} g Flour</span>

        <span class="big-ingredient">Salt: ${Math.round(totalSalt)} g</span><br>
        <span class="big-ingredient">Oil: ${Math.round(totalOil)} g</span><br>
        <span class="big-ingredient">Yeast: ${yeastGrams} g</span><br><br>

        <span class="big-water">Water: ${Math.round(totalWater)} g</span><br>
        <span class="big-water hot-water">Hot Water: ${hotWaterFixed} g</span><br>
        <span class="big-water cold-water">Cold Water: ${Math.round(coldWater)} g</span><br><br>

        <strong>Total Dough Weight:</strong> ${Math.round(totalMix)} g
    `;

    // Baker's percentages
    const waterPct = Math.round(totalWater / totalFlour * 100);
    const saltPct = (totalSalt / totalFlour * 100).toFixed(1);
    const oilPct = (totalOil / totalFlour * 100).toFixed(1);

    document.getElementById("percentResults").innerHTML = `
        <strong>Baker's Percentages</strong><br>
        <span class="big-percent">Water: ${waterPct}%</span><br>
        <span class="big-percent">Salt: ${saltPct}%</span><br>
        <span class="big-percent">Oil: ${oilPct}%</span><br>
        <span class="big-percent">Yeast: ${yeastPct}%</span>
    `;

    // Steps box
    document.getElementById("stepsBox").innerHTML = `
        <strong>Steps</strong><br>
        1. ¼ tsp yeast + <span class="hot-water">30g hot water</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;(Bloom 5 minutes)<br>
        2. Mix flour + salt (pulse 1×)<br>
        3. Add <span class="cold-water">Cold water (${Math.round(coldWater)} g)</span><br>
        4. Pulse 5×<br>
        5. Add yeast mix (pulse 3×)<br>
        6. Add oil (pulse 3×)<br>
        7. Dough button (10–15 sec)<br>
        8. Knead dough (20–30 sec)<br>
        9. Rest (20–30 min)<br>
        10. Degas dough<br>
        11. ½ tsp oil for container<br>
        12. Ball dough and place in container<br>
        13. Refrigerate (48–72 hrs)
    `;

    // Ripple animation classes
    const totalBox = document.getElementById("totalResults");
    const percentBox = document.getElementById("percentResults");
    const stepsBox = document.getElementById("stepsBox");

    totalBox.classList.remove("ripple", "ripple-delay-1", "ripple-delay-2");
    percentBox.classList.remove("ripple", "ripple-delay-1", "ripple-delay-2");
    stepsBox.classList.remove("ripple", "ripple-delay-1", "ripple-delay-2");

    // Force reflow so animation restarts cleanly
    void totalBox.offsetWidth;

    totalBox.classList.add("ripple");
    percentBox.classList.add("ripple", "ripple-delay-1");
    stepsBox.classList.add("ripple", "ripple-delay-2");

    // Show results columns
    const container = document.querySelector(".main-container");
    container.classList.add("show-results");
    document.querySelector(".middle-column").scrollIntoView({ behavior: "smooth" });
}

// === RESET ===
function resetAll() {
    const container = document.querySelector(".main-container");
    container.classList.add("fade-out");

    setTimeout(() => {
        // Reset inputs
        document.getElementById("hydration").value = "";
        document.getElementById("batchToggle").checked = false;
        updateBatchVisibility();

        for (let i = 1; i <= 3; i++) {
            document.getElementById(`flour${i}`).value = "";
        }

        // Clear results
        document.getElementById("totalResults").innerHTML = "";
        document.getElementById("percentResults").innerHTML = "";
        document.getElementById("stepsBox").innerHTML = "";

        // Remove ripple classes
        document.getElementById("totalResults").classList.remove("ripple", "ripple-delay-1", "ripple-delay-2");
        document.getElementById("percentResults").classList.remove("ripple", "ripple-delay-1", "ripple-delay-2");
        document.getElementById("stepsBox").classList.remove("ripple", "ripple-delay-1", "ripple-delay-2");

        // Reset visibility
        container.classList.remove("show-results");
        container.classList.remove("fade-out");
        container.classList.add("show-results");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
}

// === STEPS MODAL ===
function enableStepsModal() {
    const stepsBox = document.getElementById("stepsBox");
    const stepsModal = document.getElementById("stepsModal");
    const stepsModalText = document.getElementById("stepsModalText");
    const closeBtn = document.getElementById("closeSteps");

    stepsBox.addEventListener("click", () => {
        if (!stepsBox.innerHTML.trim()) return;
        stepsModalText.innerHTML = stepsBox.innerHTML;
        stepsModal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        stepsModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === stepsModal) {
            stepsModal.style.display = "none";
        }
    });
}

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
    updateBatchVisibility();
    enableStepsModal();
    document.getElementById("batchToggle").addEventListener("change", updateBatchVisibility);
});
