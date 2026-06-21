const db = require('../database/db');

exports.list = (req, res) => res.json(db.prepare('SELECT * FROM trainers ORDER BY created_at DESC').all());
exports.get = (req, res) => {
  const row = db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
};
exports.create = (req, res) => {
  const { name, email, phone, specialization, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const info = db.prepare(
    'INSERT INTO trainers (name, email, phone, specialization, status) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email || null, phone || null, specialization || null, status || 'active');
  res.status(201).json(db.prepare('SELECT * FROM trainers WHERE id = ?').get(info.lastInsertRowid));
};
exports.update = (req, res) => {
  const { name, email, phone, specialization, status } = req.body;
  db.prepare('UPDATE trainers SET name=?, email=?, phone=?, specialization=?, status=? WHERE id=?')
    .run(name, email, phone, specialization, status, req.params.id);
  res.json(db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id));
};
exports.remove = (req, res) => {
  db.prepare('DELETE FROM trainers WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
};
