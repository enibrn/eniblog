import { defineConfig } from 'vitepress';
import path from 'path';
import fs from 'fs';

const menu = JSON.parse(fs.readFileSync('test_hier/menu.json', 'utf-8'));

export default defineConfig({
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AndreaBinelli/eniblog' }
    ],
    nav: menu.nav,
    sidebar: menu.sidebar
  },
  rewrites: {
    'notes/:note': ':note'
  }
});
