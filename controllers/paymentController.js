const db = require('../database/db');

exports.list = (req, res) => {
  const rows = db.prepare(`
    SELECT pay.*, m.name as member_name, pl.name as plan_name
    FROM payments pay
    LEFT JOIN members m ON m.id = pay.member_id
    LEFT JOIN plans pl ON pl.id = pay.plan_id
    ORDER BY pay.payment_date DESC
  `).all();
  res.json(rows);
};

exports.create = (req, res) => {
  const { member_id, plan_id, amount, status, method } = req.body;
  if (!member_id || !amount) return res.status(400).json({ error: 'member_id and amount required' });
  const info = db.prepare(
    'INSERT INTO payments (member_id, plan_id, amount, status, method) VALUES (?, ?, ?, ?, ?)'
  ).run(member_id, plan_id || null, amount, status || 'paid', method || 'cash');
  res.status(201).json(db.prepare('SELECT * FROM payments WHERE id = ?').get(info.lastInsertRowid));
};

exports.byMember = (req, res) => {
  res.json(db.prepare('SELECT * FROM payments WHERE member_id = ? ORDER BY payment_date DESC').all(req.params.id));
};
