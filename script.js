document.getElementById("tankForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fields = [
    "width", "depth", "height", "distance",
    "topThickness", "wallThickness", "bottomThickness"
  ];

  let valid = true;
  const values = {};

  fields.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);
    let value = input.value.replace(",", ".");

    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      error.textContent = "Ange ett giltigt tal med max två decimaler.";
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

resultBox.style.display = "block";
resultText.innerHTML = `
  Mängden vätska i tanken är <strong>${volumeLiters.toFixed(2)}</strong> liter.<br>
  Motsvarande volym är <strong>${volumeM3.toFixed(2)}</strong> kubikmeter.

  
`;




});