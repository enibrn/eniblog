import { getItemsFromDendronNotes } from '../../dendron-utilities.mjs'
import { DataParser } from '../../data-parser.mjs'
import fs from 'fs';

const data = new DataParser(getItemsFromDendronNotes);
fs.writeFileSync('.vitepress/test/manual/temp/printed-data.json', JSON.stringify(data, null, 2));