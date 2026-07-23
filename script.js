function fillWeights() {
    const ball1Weight = document.getElementById("flour1").value;
    if (ball1Weight === "") {
        alert("Please enter a weight for Ball 1 first.");
        return;
    }
    document.getElementById("flour2").value = ball1Weight;
    document.getElementById("flour3").value = ball1Weight;
}

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

function calculateAll() {
    const hydrationInput = parseFloat(document.getElementById("hydration").value);
    const hotWaterFixed = 30;
    const yeastGrams = 0.8;

    if (isNaN(hydrationInput)) {
        alert("Please enter hydration %");
        return;
    }

    const hydration = hydrationInput / 100;
    let totalFlour = 0, totalWater = 0, totalSalt = 0, totalOil = 0;

    for (let i = 1; i <= 3; i++) {
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

    Water: ${Math.round(totalWater)} g<br>
    <span class="hot-water">Hot Water: ${Math.round(hotWaterFixed)} g</span><br>
    <span class="cold-water">Cold Water: ${Math.round(coldWater)} g</span><br><br>
    Salt: ${Math.round(totalSalt)} g<br>
    Oil: ${Math.round(totalOil)} g<br>
    Yeast: ${Math.round(yeastGrams)} g<br>
    <br><strong>Total Dough Weight:</strong> ${Math.round(totalMix)} g
`;

    const flourPct = 100;
    const waterPct = Math.round(totalWater / totalFlour * 100);
    const saltPct = (totalSalt / totalFlour * 100).toFixed(1);
    const oilPct = (totalOil / totalFlour * 100).toFixed(1);

    document.getElementById("percentResults").innerHTML = `
        <strong>Baker's Percentages</strong><br>
        Water: ${waterPct}%<br>
        Salt: ${saltPct}%<br>
        Oil: ${oilPct}%<br>
        Yeast: ${yeastPct}%
    `;

    document.getElementById("stepsBox").innerHTML = `
        <strong>Steps</strong><br>
        1. ¼ tsp yeast + <span class="hot-water">30g hot water</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;(Bloom 5 minutes)<br>
        2. Mix flour + salt (pulse 1×)<br>
        3. Add<span class="cold-water">Cold water (${Math.round(coldWater)} g)</span><br>
        4. Pulse 5×<br>
        5. Add yeast mix (pulse 3×)<br>
        6. Add oil (pulse 3×)<br>
        7. Dough button (10–15 sec)<br>
        8. Knead dough (20–30 sec)<br>
        9. Rest (20–30 min)<br>
        10. Degas dough<br>
        11. ½ tsp oil for container<br>
        12. Ball dough and place in container<br>
        13. Refrigerate (48–72 hrs)
    `;
}

function resetAll() {
    document.getElementById("hydration").value = "";
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`flour${i}`).value = "";
    }
    document.getElementById("totalResults").innerHTML = "";
    document.getElementById("percentResults").innerHTML = "";
    document.getElementById("stepsBox").innerHTML = "";
}
