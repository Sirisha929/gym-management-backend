const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

// Ensure .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, 'PORT=5000\nJWT_SECRET=change-me-in-production\n');
  console.log('Created .env');
}

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);
console.log('Schema applied.');

// Seed admin
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@gym.com');
if (!existing) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run('Admin', 'admin@gym.com', hash, 'admin');
  console.log('Seeded admin user: admin@gym.com / admin123');
}

// Seed plans
const planCount = db.prepare('SELECT COUNT(*) as c FROM plans').get().c;
if (planCount === 0) {
  const insertPlan = db.prepare(
    'INSERT INTO plans (name, price, duration_days, features) VALUES (?, ?, ?, ?)'
  );
  insertPlan.run('Basic', 29.99, 30, JSON.stringify(['Gym access', 'Locker']));
  insertPlan.run('Pro', 59.99, 30, JSON.stringify(['Gym access', 'Group classes', 'Sauna']));
  insertPlan.run('Elite', 99.99, 30, JSON.stringify(['All Pro', 'Personal trainer', 'Nutrition plan']));
  console.log('Seeded plans.');
}

console.log('DB ready.');
process.exit(0);
