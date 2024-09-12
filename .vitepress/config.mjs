import { defineConfig } from 'vitepress';
import { getItemsFromDendronNotes } from './dendron-utilities.mjs'
import { DataParser } from './data-parser.mjs'
import markdownItWikilinksFn from "markdown-it-wikilinks";

const data = new DataParser(getItemsFromDendronNotes);

export default defineConfig({
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/enibrn/eniblog' }
    ],
    nav: data.nav,
    sidebar: data.sidebar
  },
  rewrites: {
    'notes/:note': ':note'
  },
  markdown: {
    config: (md) => {
      const options = {
        postProcessLabel: (label) => data.linksVocabulary[label] ?? label
      };
      md.use(markdownItWikilinksFn(options));
    }
  },
  transformPageData: (pageData, { siteConfig }) => {
    if (pageData.frontmatter['layout'] !== 'home') return;
    pageData.frontmatter['features'] = data.lastCards;
  }
});
