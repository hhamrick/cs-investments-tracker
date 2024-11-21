import { Database } from 'sqlite-async';
import cliProgress from 'cli-progress';
import { getCSItems, getItemImgs } from './steam.mjs';

export let db = await Database.open('db.sqlite');

export async function updateAllItems() {
    let items = Object.entries(await getCSItems());
    let imgs = await getItemImgs();

    let count = 0;
    let bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(items.length, 0);

    await db.run('BEGIN TRANSACTION');
    for (let [name, price] of items) {
        let res = await db.run(`INSERT OR REPLACE INTO items (name, price, url) VALUES (?, ?, ?)`, [name, price, imgs[name]]);
        bar.update(++count);
    }
    await db.run('COMMIT');
    bar.stop();
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