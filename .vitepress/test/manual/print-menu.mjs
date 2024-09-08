import { Menu } from '../../menu.mjs'
import fs from 'fs';

const menu = new Menu();
fs.writeFileSync('.vitepress/test/manual/printed-menu.json', JSON.stringify(menu, null, 2));