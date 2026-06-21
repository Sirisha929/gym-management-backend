const db = require('../database/db');

exports.checkin = (req, res) => {
  const { member_id } = req.body;
  if (!member_id) return res.status(400).json({ error: 'member_id required' });
  const info = db.prepare('INSERT INTO attendance (member_id) VALUES (?)').run(member_id);
  res.status(201).json(db.prepare('SELECT * FROM attendance WHERE id = ?').get(info.lastInsertRowid));
};

exports.checkout = (req, res) => {
  const { attendance_id } = req.body;
  db.prepare("UPDATE attendance SET check_out = CURRENT_TIMESTAMP WHERE id = ?").run(attendance_id);
  res.json(db.prepare('SELECT * FROM attendance WHERE id = ?').get(attendance_id));
};

exports.byMember = (req, res) => {
  res.json(db.prepare('SELECT * FROM attendance WHERE member_id = ? ORDER BY check_in DESC').all(req.params.id));
};

exports.today = (req, res) => {
  const rows = db.prepare(`
    SELECT a.*, m.name as member_name
    FROM attendance a
    JOIN members m ON m.id = a.member_id
    WHERE date(a.check_in) = date('now')
    ORDER BY a.check_in DESC
  `).all();
  res.json(rows);
};
