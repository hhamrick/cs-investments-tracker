import { db } from './database.mjs';
import { updateAllItems, updateAllItemsNew } from './database.mjs';

await db.exec(`
    DROP TABLE IF EXISTS items;
    CREATE TABLE items(
        name TEXT PRIMARY KEY,
        price REAL,
        img_url TEXT,
        parent_name INTEGER,
        FOREIGN KEY(parent_name) REFERENCES items(name)
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

await updateAllItemsNew();

db.close();