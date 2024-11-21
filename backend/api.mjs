import express from 'express';
import bodyParser from 'body-parser';
import { updateAllItems, getItem, getFilteredItems } from './database.mjs';

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
  
let server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// updates the items db every 5 mins
let interval = setInterval(async () => {
    console.log(`${new Date().toLocaleTimeString()} - Updating items database`);
    await updateAllItems();
}, 5 * 60 * 1000);

process.on('SIGINT', () => {
    clearInterval(interval);
    server.close(process.exit(0));
})

process.on('SIGTERM', () => {
    clearInterval(interval);
    server.close(process.exit(0));
})