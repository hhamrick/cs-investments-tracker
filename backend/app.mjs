#!/home/hbhlaxman/.nvm/versions/node/v23.5.0/bin/node
import express from 'express';
import cors from 'cors';
import session from 'cookie-session';
import 'dotenv/config';
import { updateAllItems } from './database.mjs';
// routes
import { auth } from './routes/auth.mjs';
import { items } from './routes/items.mjs';
import { inventory } from './routes/inventory.mjs';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    maxAge: 24 * 60 * 60 * 1000
}));

// setup routes
app.use('/auth', auth);
app.use('/api/items', items);
app.use('/api/inventory', inventory);
  
let server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// updates the items db every 5 mins
// let interval = setInterval(async () => {
//     console.log(`${new Date().toLocaleTimeString()} - Updating items database`);
//     await updateAllItems();
// }, 5 * 60 * 1000);

// process.on('SIGINT', () => {
//     clearInterval(interval);
//     server.close(process.exit(0));
// })

// process.on('SIGTERM', () => {
//     clearInterval(interval);
//     server.close(process.exit(0));
// })