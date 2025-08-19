document.getElementById("tankForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const wall = 0.004;
  const width = parseFloat(document.getElementById("width").value);
  const depth = parseFloat(document.getElementById("depth").value);
  const height = parseFloat(document.getElementById("height").value);
  const distance = parseFloat(document.getElementById("distance").value) / 100;

  // Kontrollera negativa värden
  if (width <= 0 || depth <= 0 || height <= 0 || distance < 0) {
    alert("Alla mått måste vara positiva värden.");
    return;
  }

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

  const result = `
    <h2>Result</h2>
    <p>Fuel Level: ${level.toFixed(2)} m</p>
    <p>Volume: ${fuel_m3.toFixed(2)} m³ (${fuel_L.toFixed(2)} L)</p>
    <p>Degree of filling: ${pct.toFixed(1)}%</p>
    <div class="bar">
      <div class="fill" style="width:${pct}%; background:${color};">${pct.toFixed(1)}%</div>
    </div>
    ${pct < 10 ? `<p>📦 Order at least ${Math.round((total_m3 * 0.99 - fuel_m3) * 1000)} L to get 99% filling.</p>` :
      pct < 20 ? `<p>📦 Prepare for ordering fuel soon.</p>` :
      `<p>📦 No order needed now.</p>`}
    ${pct < 20 ? `<p>⚠️ Warning: low level!</p>` : ""}
  `;

  document.getElementById("result").innerHTML = result;
});