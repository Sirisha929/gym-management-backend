const db = require('../database/db');

exports.list = (req, res) => {
  const rows = db.prepare('SELECT * FROM plans ORDER BY price ASC').all();
  res.json(rows.map(r => ({ ...r, features: r.features ? JSON.parse(r.features) : [] })));
};
exports.get = (req, res) => {
  const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.features = row.features ? JSON.parse(row.features) : [];
  res.json(row);
};
exports.create = (req, res) => {
  const { name, price, duration_days, features } = req.body;
  const info = db.prepare(
    'INSERT INTO plans (name, price, duration_days, features) VALUES (?, ?, ?, ?)'
  ).run(name, price, duration_days, JSON.stringify(features || []));
  res.status(201).json({ id: info.lastInsertRowid });
};
exports.update = (req, res) => {
  const { name, price, duration_days, features } = req.body;
  db.prepare('UPDATE plans SET name=?, price=?, duration_days=?, features=? WHERE id=?')
    .run(name, price, duration_days, JSON.stringify(features || []), req.params.id);
  res.json({ ok: true });
};
exports.remove = (req, res) => {
  db.prepare('DELETE FROM plans WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
};
