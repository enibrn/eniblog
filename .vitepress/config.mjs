import { defineConfig } from 'vitepress';
import { getItemsFromDendronNotes } from './dendron-utilities.mjs'
import { DataParser } from './menu.mjs'
import markdownItWikilinksFn from "markdown-it-wikilinks";

const menu = new DataParser(getItemsFromDendronNotes);

export default defineConfig({
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/enibrn/eniblog' }
    ],
    nav: menu.nav,
    sidebar: menu.sidebar
  },
  rewrites: {
    'notes/:note': ':note'
  },
  markdown: {
    config: (md) => {
      const options = {
        postProcessLabel: (label) => menu.linksVocabulary[label] ?? label
      };
      md.use(markdownItWikilinksFn(options));
    }
  }
});
