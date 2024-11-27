import express from 'express';
import { updateAllItems, getItem, getFilteredItems } from '../database.mjs';

export const items = express.Router();

items.get('/:name', async (req, res) => {
    let name = req.params.name;

    let item = await getItem(name);

    if (item) {
        res.send(item);
        return;
    }
    res.status(404).send('No item found.');
});

items.get('/search/:keywords', async (req, res) => {
    console.log(req.session.passport ? req.session.passport.user : {user:null});
    let keywords = req.params.keywords;

    let items = await getFilteredItems(keywords);

    if (items) {
        res.send(items);
        return;
    }
    res.status(404).send('No items found.');
});