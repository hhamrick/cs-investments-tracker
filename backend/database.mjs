import { Database } from 'sqlite-async';
import cliProgress from 'cli-progress';
import { getCSItems, getItemImgs } from './steam.mjs';
import { P } from '@angular/cdk/keycodes';

export let db = await Database.open('db.sqlite');

export async function updateAllItems() {
    let items = Object.entries(await getCSItems());
    let imgs = await getItemImgs();

    let count = 0;
    let bar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
    bar.start(items.length, 0);

    await db.run('BEGIN TRANSACTION');
    for (let [name, price] of items) {
        let img_url = imgs[name];

        await db.run(`INSERT OR REPLACE INTO items (name, price, img_url) VALUES (?, ?, ?)`, [name, price, img_url]);

        let parent_name = nameToParentName(name);
        // parent item needed
        if (parent_name != name) {
            await db.run(`INSERT OR REPLACE INTO items (name) VALUES (?)`, [parent_name]);
            await db.run(`UPDATE items SET parent_name = ? WHERE name = ?`, [parent_name, name]);
        }

        bar.update(++count);
    }
    await db.run('COMMIT');
    
    bar.stop();
    // clears the progress bar
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
}

function nameToParentName(item_name) {
    // regex for properties to look for in items that can be split into subitems
    let stattrak_regex = /^StatTrak™\s*/
    let wear_regex = /\s*\(.*\)$/;

    return item_name.replace(stattrak_regex, '').replace(wear_regex, '');
}

export async function getAllItems() {
    return await db.all('SELECT * FROM items');
}

export async function getItem(name) {
    return await db.get('SELECT * FROM items WHERE name = ?', [name]);
}

export async function getItemNew(name) {
    let item = await db.get('SELECT * FROM items WHERE name = ?', [name]);

    if (item.parent_name) return null; // cant get subitem directly

    item.sub_items = await db.all(`SELECT * FROM items WHERE parent_name = ?`, [item.name]);

    if (item.sub_items.length > 0) {
        let min_item = item.sub_items.reduce((low, curr) => curr.price < low.price ? curr : low, item.sub_items[0]);
        let max_item = item.sub_items.reduce((high, curr) => curr.price > high.price ? curr : high, item.sub_items[0]);

        item.price = `$${min_item.price} - $${max_item.price}`;
        item.img_url = max_item.img_url;
    } else {
        item.price = `$${item.price}`;
    }

    // remove parent_name
    delete item.parent_name;
    item.sub_items.forEach(i => delete i.parent_name)
    
    return item;
}

export async function getFilteredItems(keywords) {
    let words = keywords.split(' ');

    let conditions = words.map(word => 'name LIKE ?').join(' AND ');
    let values = words.map(word => `%${word}%`);
    let query = `SELECT name, price, img_url FROM items WHERE ${conditions} AND parent_name IS NULL`;

    let items = await db.all(query, values);


    for (let item of items) {
        if (!item.price) {
            let sub_items = await db.all(`SELECT * FROM items WHERE parent_name = ?`, [item.name]);

            if (sub_items.length > 0) {
                let min_item = sub_items.reduce((low, curr) => curr.price < low.price ? curr : low, sub_items[0]);
                let max_item = sub_items.reduce((high, curr) => curr.price > high.price ? curr : high, sub_items[0]);

                item.price = `$${min_item.price} - $${max_item.price}`;
                item.img_url = max_item.img_url;
            }
        } else {
            item.price = `$${item.price}`;
        }
    }

    return items;
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