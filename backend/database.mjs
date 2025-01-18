import { Database } from 'sqlite-async';
import cliProgress from 'cli-progress';
import { getCSItems, getItemImgs } from './steam.mjs';

export let db = await Database.open('db.sqlite');

export async function updateAllItems() {
    let items = await getCSItems();
    if (!items) {
        console.log('Error with the Items API');
        return;
    }

    let imgs = await getItemImgs();
    if (!imgs) {
        console.log('Error with the Images API');
        return;
    }
    
    items = Object.entries(items);

    let count = 0;
    let bar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
    bar.start(items.length, 0);

    await db.run('BEGIN TRANSACTION');
    for (let [name, price] of items) {
        let img_url = imgs[name];

        let group_name = nameToGroupName(name);
        await db.run(`INSERT OR REPLACE INTO items (name, price, img_url, group_name) VALUES (?, ?, ?, ?)`, [name, price, img_url, group_name]);

        bar.update(++count);
    }

    // remove group_name from all items that are the only item in a group
    await db.run(`
        UPDATE items
        SET group_name = NULL
        WHERE group_name IN (
            SELECT group_name
            FROM items
            GROUP BY group_name
            HAVING COUNT(*) = 1
        );
    `);

    await db.run('COMMIT');
    
    bar.stop();
    // clears the progress bar
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
}

function nameToGroupName(item_name) {
    // regex for properties to look for in items that can be grouped
    let stattrak_regex = /StatTrak™\s*/
    let wear_regex = /\s*\(.*\)$/;
    let sticker_regex = /^Sticker/;

    let group_name = item_name.replace(stattrak_regex, '');
    if (!sticker_regex.test(group_name)) {
        group_name = group_name.replace(wear_regex, '');
    }

    return group_name;
}

export async function getAllItems() {
    return await db.all('SELECT * FROM items');
}

export async function getItem(name) {
    return await db.get('SELECT * FROM items WHERE name = ?', [name]);
}

export async function getGroupItem(name) {
    let item = await db.get(`
        SELECT name, price, img_url FROM items
        WHERE name = ? AND group_name IS NULL`,
        [name]
    );

    if (item) return {
        name: item.name,
        price: item.price,
        max_price: null,
        img_url: item.img_url,
        sub_items: []
    };

    let items = await db.all(`
        SELECT name, price, img_url FROM items
        WHERE group_name = ?
        ORDER BY price DESC`,
        [name]
    );

    if (items.length == 0) return null;
    
    let min_item = items.reduce((low, curr) => curr.price < low.price ? curr : low, items[0]);
    let max_item = items.reduce((high, curr) => curr.price > high.price ? curr : high, items[0]);

    return {
        name: name,
        price: min_item.price,
        max_price: max_item.price,
        img_url: max_item.img_url,
        sub_items: items
    }
}

export async function getFilteredItems(keywords) {
    let words = keywords.split(' ');

    let name_conditions = words.map(word => 'name LIKE ?').join(' AND ');
    let group_conditions = words.map(word => 'group_name LIKE ?').join(' AND ');
    let values = words.map(word => `%${word}%`);

    // gets items without a group that match keywords
    // and groups that match search keywords
    // if group, gets min and max prices and the img_url of the item with the max price 
    let query = `
        SELECT
            name,
            price,
            NULL AS max_price,
            img_url
        FROM items
        WHERE ${name_conditions}
        AND group_name IS NULL

        UNION ALL

        SELECT
            group_name AS name,
            min(price) AS price,
            max(price) AS max_price,
            (
                SELECT img_url
                FROM items AS items2
                WHERE items.group_name = items2.group_name
                ORDER BY items2.price DESC
                LIMIT 1
            ) AS img_url
        FROM items
        WHERE ${group_conditions}
        GROUP BY group_name

        ORDER BY name
    `;
    
    return await db.all(query, [...values, ...values]);
}

export async function addInvTransaction(user_id, item_name, quantity, price) {
    let res = await db.run(`
        INSERT INTO inventory (user_id, item_name, quantity, price) VALUES (?, ?, ?, ?)`,
        [user_id, item_name, quantity, price]
    )

    return await db.get(`SELECT id, item_name, quantity, price FROM inventory WHERE id = ?`, [res.lastID])
}

export async function deleteInvTransaction(user_id, tranaction_id) {
    let res = await db.run(`
        DELETE FROM inventory WHERE user_id = ? AND id = ?`,
        [user_id, tranaction_id]
    );

    return res.lastID;
}

export async function getTransactions(user_id, item_name) {
    if (!item_name) {
        return await db.all(
            `SELECT id, item_name, quantity, price
            FROM inventory
            WHERE user_id = ?
            ORDER BY time DESC`,
            [user_id]
        );
    }

    let items_in_group = await db.all(`
        SELECT name FROM items
        WHERE group_name = ?`,
        [item_name]
    );

    // item_name is a group

    if (items_in_group.length > 0) {
        let placeholders = items_in_group.map(() => '?').join(', ');
        return await db.all(`
            SELECT id, item_name, quantity, price
            FROM inventory
            WHERE user_id = ? AND item_name IN (${placeholders})    
            ORDER BY time DESC`,
            [user_id, ...items_in_group.map(item => item.name)]
        );
    }

    // item_name is a single item
    return await db.all(`
        SELECT id, item_name, quantity, price
        FROM inventory
        WHERE user_id = ? AND item_name = ?
        ORDER BY time DESC`,
        [user_id, item_name]
    );
}

export async function getInventory(user_id) {
    return await db.all(`
        SELECT
            inventory.item_name AS name,
            group_name,
            sum(inventory.quantity) AS quantity,
            items.price AS price,
            items.img_url AS img_url
        FROM inventory
        JOIN items ON items.name = inventory.item_name
        WHERE inventory.user_id = ?
        GROUP BY inventory.item_name`,
        [user_id]
    );
}

export async function addTag(user_id, item_name, tag_name) {
    let item = await db.get(`
        SELECT name FROM items
        WHERE name = ? AND group_name IS NULL`,
        [item_name]
    );
    if (!item) {
        let items = await db.all(`
            SELECT name FROM items
            WHERE group_name = ?`,
            [item_name]
        );
        if (items.length < 1) return null;
    }
    

    let res = await db.run(`
        INSERT INTO tags (user_id, item_name, tag_name) VALUES (?, ?, ?)`,
        [user_id, item_name, tag_name]
    );

    return await db.get(`SELECT id, item_name, tag_name FROM tags WHERE id = ?`, [res.lastID]);
}

export async function deleteTag (user_id, tag_id) {
    let res = await db.run(`
        DELETE FROM tags WHERE user_id = ? AND id = ?`,
        [user_id, tag_id]
    );

    return res.lastID;
}

export async function getTags (user_id, item_name) {
    return await db.all(`
        SELECT id, item_name, tag_name FROM tags WHERE user_id = ? AND item_name = ?`,
        [user_id, item_name]
    );
}