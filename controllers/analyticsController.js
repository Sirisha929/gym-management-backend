const db = require('../database/db');

exports.overview = (req, res) => {
  const members = db.prepare('SELECT COUNT(*) as c FROM members').get().c;
  const activeMembers = db.prepare("SELECT COUNT(*) as c FROM members WHERE status='active'").get().c;
  const trainers = db.prepare('SELECT COUNT(*) as c FROM trainers').get().c;
  const todayAttendance = db.prepare("SELECT COUNT(*) as c FROM attendance WHERE date(check_in)=date('now')").get().c;
  const monthRevenue = db.prepare(
    "SELECT COALESCE(SUM(amount),0) as s FROM payments WHERE status='paid' AND strftime('%Y-%m', payment_date)=strftime('%Y-%m','now')"
  ).get().s;
  res.json({ members, activeMembers, trainers, todayAttendance, monthRevenue });
};

exports.revenue = (req, res) => {
  const rows = db.prepare(`
    SELECT strftime('%Y-%m', payment_date) as month, COALESCE(SUM(amount),0) as revenue
    FROM payments WHERE status='paid'
    GROUP BY month ORDER BY month ASC LIMIT 12
  `).all();
  res.json(rows);
};

exports.attendanceTrends = (req, res) => {
  const rows = db.prepare(`
    SELECT date(check_in) as day, COUNT(*) as count
    FROM attendance
    WHERE check_in >= date('now','-30 day')
    GROUP BY day ORDER BY day ASC
  `).all();
  res.json(rows);
};

exports.memberGrowth = (req, res) => {
  const rows = db.prepare(`
    SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
    FROM members GROUP BY month ORDER BY month ASC LIMIT 12
  `).all();
  res.json(rows);
};
