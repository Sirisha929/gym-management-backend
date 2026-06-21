const db = require('../database/db');

exports.notify = ({ user_id = null, title, message = '', type = 'info' }) => {
  db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
    .run(user_id, title, message, type);
};
