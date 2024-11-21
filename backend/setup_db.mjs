import { db } from './database.mjs';
import { updateAllItems } from './database.mjs';

await db.exec(`
    DROP TABLE IF EXISTS items;
    CREATE TABLE items(
        name TEXT PRIMARY KEY,
        price REAL,
        url TEXT
    );
`);

await updateAllItems();

db.close();