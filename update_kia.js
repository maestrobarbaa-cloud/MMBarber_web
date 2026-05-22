const Database = require('better-sqlite3');
const db = new Database('./mmbarber.db');
try {
  db.exec('ALTER TABLE barbers ADD COLUMN missionFailed BOOLEAN DEFAULT 0');
  console.log('Column missionFailed added successfully.');
} catch (e) {
  console.log('Column already exists or error:', e.message);
}
