document.getElementById("tankForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fields = ["width", "depth", "height", "distance"];
  let hasError = false;

  // Rensa tidigare fel
  fields.forEach(id => {
    document.getElementById(id).classList.remove("invalid");
    document.getElementById("error-" + id).textContent = "";
  });

  // Kontrollera negativa värden
  fields.forEach(id => {
    const value = parseFloat(document.getElementById(id).value);
    if (isNaN(value) || value < 0) {
      document.getElementById(id).classList.add("invalid");
      document.getElementById("error-" + id).textContent = "Värdet måste vara positivt.";
      hasError = true;
    }
  });

  if (hasError) return;

  // Beräkningar
  const wall = 0.004;
  const width = parseFloat(document.getElementById("width").value);
  const depth = parseFloat(document.getElementById("depth").value);
  const height = parseFloat(document.getElementById("height").value);
  const distance = parseFloat(document.getElementById("distance").value) / 100;

  const innerW = width - 2 * wall;
  const innerD = depth - 2 * wall;
  const innerH = height - wall;
  const level = innerH - distance;

  const fuel_m3 = innerW * innerD * level;
  const total_m3 = innerW * innerD * innerH;
  const fuel_L = fuel_m3 * 1000;
  const pct = Math.round((fuel_m3 / total_m3) * 1000) / 10;

  let color = "green";
  if (pct < 20) color = "red";
  else if (pct < 50) color = "orange";

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = `
    <h2>Resultat</h2>
    <p>Bränslenivå: ${level.toFixed(2)} m</p>
    <p>Volym: ${fuel_m3.toFixed(2)} m³ (${fuel_L.toFixed(2)} L)</p>
    <p>Fyllnadsgrad: ${pct.toFixed(1)}%</p>
    <div class="bar">
      <div class="fill" id="fillBar" style="width:0%; background:${color};">${pct.toFixed(1)}%</div>
    </div>
    ${pct < 10 ? `<p>📦 Beställ minst ${Math.round((total_m3 * 0.99 - fuel_m3) * 1000)} L för att nå 99% fyllnad.</p>` :
      pct < 20 ? `<p>📦 Planera bränslebeställning snart.</p>` :
      `<p>📦 Ingen beställning behövs just nu.</p>`}
    ${pct < 20 ? `<p>⚠️ Varning: låg bränslenivå!</p>` : ""}
    <button id="resetBtn" style="margin-top: 1.5em;">🔄 Ny beräkning</button>
  `;

  // Trigga animationen
  setTimeout(() => {
    const fillBar = document.getElementById("fillBar");
    fillBar.style.width = `${pct}%`;
  }, 100);

  // Lägg till funktion för "Ny beräkning"
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("tankForm").reset();
    resultContainer.innerHTML = "";
    fields.forEach(id => {
      document.getElementById(id).classList.remove("invalid");
      document.getElementById("error-" + id).textContent = "";
    });
  });
});