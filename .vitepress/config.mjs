import { defineConfig } from 'vitepress';
import { Menu } from './menu.mjs'

const menu = new Menu();

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
