import express from 'express';
import passport from 'passport';

import { addTag, deleteTag, getTags } from '../database.mjs';

export const tags = express.Router();
tags.use(passport.session());

tags.post('/',
    async (req, res) => {
        if (!req.user) {
            res.status(403).send('Not authenticated.');
            return;
        }

        let tag = req.body;
        let result = await addTag(req.user.steamId, tag.item_name, tag.tag_name);

        if (result == null) {
            res.status(404).send('Invalid item.');
            return;
        }
        res.send(result);
    }
)

tags.delete('/:id',
    async (req, res) => {
        if (!req.user) {
            res.status(403).send('Not authenticated.');
            return;
        }

        await deleteTag(req.user.steamId, req.params.id);
        res.send('Deleted');
    }
)

tags.get('/:item_name',
    async (req, res) => {
        if (!req.user) {
            res.status(403).send('Not authenticated.');
            return;
        }

        res.send(await getTags(req.user.steamId, req.params.item_name));
    }
)