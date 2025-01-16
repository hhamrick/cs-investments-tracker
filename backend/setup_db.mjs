import { db } from './database.mjs';
import { updateAllItems } from './database.mjs';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Are you sure you want to reset the database? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
        setup();
    } else {
        console.log('Exiting.');
    }
    rl.close();
});

async function setup() {
    await db.exec(`
        DROP TABLE IF EXISTS items;
        CREATE TABLE items(
            name TEXT PRIMARY KEY,
            price REAL,
            img_url TEXT,
            group_name TEXT
        );
    `);
    
    await db.exec(`
        DROP TABLE IF EXISTS inventory;
        CREATE TABLE inventory(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item_name TEXT,
            quantity INTEGER,
            price REAL,
            time TXT DEFAULT (datetime('now')),
            FOREIGN KEY(item_name) REFERENCES items(name)
        );
    `);
    
    await updateAllItems();
    
    db.close();
}