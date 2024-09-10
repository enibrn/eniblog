import { getItemsFromDendronNotes } from '../../dendron-utilities.mjs'
import { DataParser } from '../../menu.mjs'
import fs from 'fs';

const menu = new DataParser(getItemsFromDendronNotes);
fs.writeFileSync('.vitepress/test/manual/temp/printed-menu.json', JSON.stringify(menu, null, 2));