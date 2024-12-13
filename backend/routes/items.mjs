import express from 'express';
import { updateAllItems, getItemNew, getFilteredItems } from '../database.mjs';

export const items = express.Router();

items.get('/:name', async (req, res) => {
    let name = req.params.name;

    let item = await getItemNew(name);

    if (item) {
        res.send(item);
        return;
    }
    res.status(404).send('No item found.');
});

items.get('/search/:keywords', async (req, res) => {
    let keywords = req.params.keywords;

    let items = await getFilteredItems(keywords);

    if (items) {
        res.send(items);
        return;
    }
    res.status(404).send('No items found.');
});