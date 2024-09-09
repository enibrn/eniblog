import { DataParser } from '../../menu.mjs'
import fs from 'fs';

const menu = new DataParser();
fs.writeFileSync('.vitepress/test/manual/temp/printed-menu.json', JSON.stringify(menu, null, 2));