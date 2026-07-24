// === TOGGLE SWITCH MODE ===
function getBatchCount() {
    return document.getElementById("batchToggle").checked ? 3 : 1;
}

function updateBatchVisibility() {
    const count = getBatchCount();

    document.getElementById("ball1Label").textContent =
        count === 1 ? "Ball Weight (g)" : "Ball 1 Weight (g)";

    document.getElementById("ball2Box").style.display = count === 3 ? "block" : "none";
    document.getElementById("ball3Box").style.display = count === 3 ? "block" : "none";

    const fillBtn = document.getElementById("fillBtn");
    fillBtn.style.display = count === 3 ? "inline-block" : "none";
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

    document.getElementById("stepsBox").innerHTML = `
