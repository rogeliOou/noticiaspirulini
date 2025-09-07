document.getElementById('buscarBtn').addEventListener('click', async () => {
  const rawTag = document.getElementById('playerTag').value.trim();
  const tag = rawTag.replace('#', '');
  const resDiv = document.getElementById('resultado');
  resDiv.innerHTML = '<p>Buscando...</p>';

  try {
    const response = await fetch(`/api/player/${tag}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al obtener datos');
    }
    const data = await response.json();

    // Información básica
    let html = `
      <h2 style="color:${data.nameColor || '#fff'}">${data.name} (${data.tag})</h2>
      <p><strong>Trofeos:</strong> ${data.trophies} (Máximo: ${data.highestTrophies})</p>
      <p><strong>Nivel:</strong> ${data.expLevel} (${data.expPoints} XP)</p>
      <p><strong>Victorias 3vs3:</strong> ${data['3vs3Victories']}</p>
      <p><strong>Victorias Solo:</strong> ${data.soloVictories}</p>
      <p><strong>Victorias Dúo:</strong> ${data.duoVictories}</p>
      <p><strong>Mejor Robo Rumble:</strong> ${data.bestRoboRumbleTime || 'N/A'}</p>
      <p><strong>Mejor Big Game:</strong> ${data.bestTimeAsBigBrawler || 'N/A'}</p>
      <p><strong>Club:</strong> ${data.club ? `${data.club.name} (${data.club.tag})` : 'Sin club'}</p>
      <hr>
      <h3>Brawlers</h3>
    `;

    // Lista de brawlers
    html += '<div style="max-height:300px;overflow-y:auto;"><ul>';
    data.brawlers.forEach(b => {
      html += `
        <li>
          <strong>${b.name}</strong> — Trofeos: ${b.trophies} / Máx: ${b.highestTrophies}, Poder: ${b.power}, Rango: ${b.rank}
          <br>Star Powers: ${b.starPowers && b.starPowers.length ? b.starPowers.map(sp => sp.name).join(', ') : 'Ninguno'}
          <br>Gadgets: ${b.gadgets && b.gadgets.length ? b.gadgets.map(g => g.name).join(', ') : 'Ninguno'}
          <br>Gears: ${b.gears && b.gears.length ? b.gears.map(g => `${g.name} (Lv.${g.level})`).join(', ') : 'Ninguno'}
        </li>
      `;
    });
    html += '</ul></div>';

    resDiv.innerHTML = html;

  } catch (e) {
    resDiv.innerHTML = `<p style="color:red;">Error: ${e.message}</p>`;
  }
});