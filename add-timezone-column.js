import db from './lib/db.js';

async function addTimezoneColumn() {
  try {
    await db.query(`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS timezone VARCHAR(255)
    `);
    console.log('Timezone column added successfully');
  } catch (error) {
    console.error('Error adding timezone column:', error);
  } finally {
    await db.end();
  }
}

addTimezoneColumn();