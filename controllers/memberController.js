const db = require('../database/db');

exports.list = (req, res) => {
  const rows = db.prepare(`
    SELECT m.*, p.name as plan_name, t.name as trainer_name
    FROM members m
    LEFT JOIN plans p ON p.id = m.plan_id
    LEFT JOIN trainers t ON t.id = m.trainer_id
    ORDER BY m.created_at DESC
  `).all();
  res.json(rows);
};

exports.get = (req, res) => {
  const row = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
};

exports.create = (req, res) => {
  const { name, email, phone, plan_id, trainer_id, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const info = db.prepare(`
    INSERT INTO members (name, email, phone, plan_id, trainer_id, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, email || null, phone || null, plan_id || null, trainer_id || null, status || 'active');
  res.status(201).json(db.prepare('SELECT * FROM members WHERE id = ?').get(info.lastInsertRowid));
};

exports.update = (req, res) => {
  const { name, email, phone, plan_id, trainer_id, status } = req.body;
  db.prepare(`
    UPDATE members SET name=?, email=?, phone=?, plan_id=?, trainer_id=?, status=?
    WHERE id=?
  `).run(name, email, phone, plan_id, trainer_id, status, req.params.id);
  res.json(db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id));
};

exports.remove = (req, res) => {
  db.prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
};
