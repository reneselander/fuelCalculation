document.getElementById("tankForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fields = [
    "width", "depth", "height", "density", "distance",
    "topThickness", "wallThickness", "bottomThickness"
  ];

  let valid = true;
  const values = {};

  fields.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);
    let value = input.value.replace(",", ".");

    // Tillåt upp till tre decimaler
    if (!/^\d+(\.\d{1,3})?$/.test(value)) {
      error.textContent = "Ange ett giltigt tal med max tre decimaler.";
      valid = false;
    } else {
      error.textContent = "";
      values[id] = parseFloat(value);
    }
  });

  if (!valid) return;

  const topThicknessM = values.topThickness / 1000;
  const wallThicknessM = values.wallThickness / 1000;
  const bottomThicknessM = values.bottomThickness / 1000;
  const distanceM = values.distance / 100;

  const innerWidth = values.width - 2 * wallThicknessM;
  const innerDepth = values.depth - 2 * wallThicknessM;
  const innerHeight = values.height - topThicknessM - bottomThicknessM - distanceM;

  const resultBox = document.getElementById("result");
  const resultText = document.querySelector(".result-text");

  if (innerWidth <= 0 || innerDepth <= 0 || innerHeight <= 0) {
    resultBox.style.display = "block";
    resultText.textContent = "Tankens inre mått är ogiltiga. Kontrollera att tjocklekarna inte är för stora.";
    return;
  }

  const volumeM3 = innerWidth * innerDepth * innerHeight;
  const volumeLiters = volumeM3 * 1000;
  const massKg = volumeM3 * values.density;

  resultBox.style.display = "block";
  resultText.innerHTML = `
    Mängden vätska i tanken är <strong>${volumeLiters.toFixed(2)}</strong> liter.<br>
    Motsvarande volym är <strong>${volumeM3.toFixed(2)}</strong> kubikmeter.<br>
    Vätskans massa är <strong>${massKg.toFixed(2)}</strong> kg.
  `;

  const tankHeightMeters = values.height;
  const liquidHeightMeters = Math.max(0, tankHeightMeters - distanceM);
  const liquidRatio = liquidHeightMeters / tankHeightMeters;
  const liquidPercent = Math.round(liquidRatio * 100);

  const segmentBar = document.getElementById("segment-bar");
  segmentBar.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    const segment = document.createElement("div");
    segment.classList.add("segment");

    if (i < liquidPercent / 5) {
      if (liquidPercent >= 70) {
        segment.classList.add("filled-green");
      } else if (liquidPercent >= 40) {
        segment.classList.add("filled-yellow");
      } else {
        segment.classList.add("filled-red");
      }
    }

    segmentBar.appendChild(segment);
  }

  const segmentLabel = document.getElementById("segment-label");
  segmentLabel.textContent = `Fyllnadsgrad: ${liquidPercent}%`;
});