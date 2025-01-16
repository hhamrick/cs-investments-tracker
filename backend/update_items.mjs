import { db } from './database.mjs';
import { updateAllItems } from './database.mjs';

await updateAllItems();

db.close();