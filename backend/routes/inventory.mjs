import express from 'express';
import passport from 'passport';
import { checkAuth } from './auth.mjs';
import { addInvTransaction, deleteInvTransaction, getInventory, getTransactions } from '../database.mjs';

export const inventory = express.Router();
inventory.use(passport.session());

    inventory.post('/transaction',
        // checkAuth, 
        async (req, res) => {
            if (!req.user) {
                res.status(403).send('Not authenticated.');
                return;
            }
            
            let trans = req.body;
            let result = await addInvTransaction(req.user.steamId, trans.item_name, trans.quantity, trans.price);

            if (result == null) {
                res.status(404).send('Invalid item.');
            }
            res.send(result);
    });

    inventory.delete('/transaction/:id',
        // checkAuth,
        async (req, res) => {
            if (!req.user) {
                res.status(403).send('Not authenticated.');
                return;
            }

            await deleteInvTransaction(req.user.steamId, req.params.id);
            res.send('Deleted');
        }
    )

    inventory.get('/transactions',
        // checkAuth,
        async (req, res) => {
            if (!req.user) {
                res.status(403).send('Not authenticated.');
                return;
            }

            let transactions = await getTransactions(req.user.steamId, req.query.item);

            let total_quantity = transactions.reduce((s, t) => s + t.quantity, 0);

            let total_spent = transactions.filter(t => t.quantity > 0).reduce((s, t) => s + t.quantity * t.price, 0);

            let total_sold = transactions.filter(t => t.quantity < 0).reduce((s, t) => s + t.quantity * t.price, 0);

            let avg_price = total_spent / total_quantity;

            res.send({
                stats: {total_quantity, total_spent, total_sold, avg_price},
                transactions
            });
    });

    inventory.get('/',
        // checkAuth,
        async (req, res) => {
            if (!req.user) {
                res.status(403).send('Not authenticated.');
                return;
            }

            res.send(await getInventory(req.user.steamId));
    });