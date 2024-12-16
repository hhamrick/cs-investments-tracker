import { db } from './database.mjs';
import { updateAllItems } from './database.mjs';

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