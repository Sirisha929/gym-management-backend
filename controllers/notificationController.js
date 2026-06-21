const db = require('../database/db');

exports.list = (req, res) => {
  res.json(db.prepare('SELECT * FROM notifications WHERE user_id IS NULL OR user_id = ? ORDER BY created_at DESC')
    .all(req.user.id));
};

exports.create = (req, res) => {
  const { user_id, title, message, type } = req.body;
  const info = db.prepare(
    'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)'
  ).run(user_id || null, title, message || '', type || 'info');
  res.status(201).json(db.prepare('SELECT * FROM notifications WHERE id = ?').get(info.lastInsertRowid));
};

exports.markRead = (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
};
