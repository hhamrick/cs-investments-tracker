import { Database } from 'sqlite-async';
import cliProgress from 'cli-progress';
import { getCSItems, getItemImgs } from './steam.mjs';

export let db = await Database.open('db.sqlite');

export async function updateAllItems() {
    let items = Object.entries(await getCSItems());
    let imgs = await getItemImgs();

    let count = 0;
    let bar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
    bar.start(items.length, 0);

    await db.run('BEGIN TRANSACTION');
    for (let [name, price] of items) {
        let res = await db.run(`INSERT OR REPLACE INTO items (name, price, url) VALUES (?, ?, ?)`, [name, price, imgs[name]]);
        bar.update(++count);
    }
    await db.run('COMMIT');
    
    bar.stop();
    // clears the progress bar
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
}

export async function getAllItems() {
    return await db.all('SELECT * FROM items');
}

export async function getItem(name) {
    return await db.get('SELECT * FROM items WHERE name = ?', [name]);
}

export async function getFilteredItems(keywords) {
    let words = keywords.split(' ');

    let conditions = words.map(word => 'name LIKE ?').join(' AND ');
    let values = words.map(word => `%${word}%`);
    let query = `SELECT * FROM items WHERE ${conditions}`;

    return await db.all(query, values);
}

export async function addInvTransaction(user_id, item_name, quantity, price) {
    let res = await db.run(`
        INSERT INTO inventory (user_id, item_name, quantity, price) VALUES (?, ?, ?, ?)`,
        [user_id, item_name, quantity, price]
    )

    return await db.get(`SELECT id, item_name, quantity, price FROM inventory WHERE id = ?`, [res.lastID]);
}

export async function deleteInvTransaction(user_id, tranaction_id) {
    let res = await db.run(`
        DELETE FROM inventory WHERE user_id = ? AND id = ?`,
        [user_id, tranaction_id]
    );

    return res.lastID;
}

export async function getTransactions(user_id, item_name) {
    if (item_name) {
        return await db.all(
            `SELECT id, item_name, quantity, price FROM inventory WHERE user_id = ? AND item_name = ? ORDER BY time DESC`,
            [user_id, item_name]
        );
    }

    return await db.all(
        `SELECT id, item_name, quantity, price FROM inventory WHERE user_id = ? ORDER BY time DESC`,
        [user_id]
    );
}