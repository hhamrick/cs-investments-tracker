import express from 'express';
import bodyParser from 'body-parser';
import { getItem, getFilteredItems } from './database.mjs';

const app = express();
const port = 3000;

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/items', async (req, res) => {
    res.status(500).send("Needs to be implemented");
});

app.get('/items/:name', async (req, res) => {
    let name = req.params.name;

    let item = await getItem(name);

    if (item) {
        res.send(item);
        return;
    }
    res.status(404).send('No item found.');
});

app.get('/items/search/:keywords', async (req, res) => {
    let keywords = req.params.keywords;

    let items = await getFilteredItems(keywords);

    if (items) {
        res.send(items);
        return;
    }
    res.status(404).send('No items found.');
});
  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});