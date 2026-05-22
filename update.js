const Database = require('better-sqlite3');
const db = new Database('./mmbarber.db');
db.prepare("UPDATE barbers SET requiresUnlock = 1, unlockThreshold = 5 WHERE id = 'tomas'").run();
console.log('Tomas updated');
