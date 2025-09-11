const express = require('express');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

const profiles = new Map();

app.post('/profile', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  const id = String(profiles.size + 1);
  const profile = { id, name };
  profiles.set(id, profile);
  res.status(201).json(profile);
});

app.get('/profile/:id', (req, res) => {
  const profile = profiles.get(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(profile);
});

app.get('/qr/:id', async (req, res) => {
  const profile = profiles.get(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Not found' });
  }
  try {
    const url = await qrcode.toDataURL(profile.id);
    const base64 = url.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    res.type('png').send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

module.exports = app;
