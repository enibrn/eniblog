import { defineConfig } from 'vitepress';
import { getItemsFromDendronNotes } from './dendron-utilities.mjs'
import { SiteMetadataService } from './site-metadata-service.mjs'
import markdownItWikilinksFn from "markdown-it-wikilinks";
import mditCustomPluginFn from './mdit-custom-plugin.mjs';

const siteMetadata = new SiteMetadataService(getItemsFromDendronNotes);

export default defineConfig({
  transformHtml: (code, id, { pageData }) => { return code.replace('Crystal', 'CRISTALLO')},
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/enibrn/eniblog' }
    ],
    nav: siteMetadata.nav,
    sidebar: siteMetadata.sidebar,
    search: {
      provider: 'local'
    }
  },
  rewrites: {
    'notes/:note': ':note'
  },
  markdown: {
    config: (md) => {
      const options = {
        postProcessLabel: (label) => siteMetadata.linksVocabulary[label] ?? label
      };
      md.use(markdownItWikilinksFn(options));
      md.use(mditCustomPluginFn);
    }
  },
  transformPageData: (pageData) => {
    if (pageData.frontmatter['layout'] !== 'home') return;
    //dinamically add cards to homepage by editing its frontmatter
    pageData.frontmatter['features'] = siteMetadata.homeCards;
  }
});
