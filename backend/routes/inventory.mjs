import express from 'express';
import passport from 'passport';
import { checkAuth } from './auth.mjs';
import { addInvTransaction, getTransactions } from '../database.mjs';

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
            res.send(await addInvTransaction(req.user.steamId, trans.item_name, trans.quantity, trans.price));
    });

    inventory.get('/transactions',
        // checkAuth,
        async (req, res) => {
            if (!req.user) {
                res.status(403).send('Not authenticated.');
                return;
            }

            let transactions = await getTransactions(req.user.steamId, req.query.item);

            let total_quantity = transactions.reduce((s, t) => s + t.quantity, 0);

            let total_spent = transactions.reduce((s, t) => s + t.quantity * t.price, 0);

            let avg_price = total_spent / total_quantity;

            res.send({
                stats: {total_quantity, total_spent, avg_price},
                transactions
            });
    });