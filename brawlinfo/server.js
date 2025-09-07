import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/player/:tag', async (req, res) => {
  const tag = req.params.tag;
  try {
    const resp = await fetch(`https://api.brawlstars.com/v1/players/%23${tag}`, {
      headers: { 'Authorization': `Bearer ${process.env.BS_API_KEY}` }
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).send(text);
    }

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));