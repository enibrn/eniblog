import { defineConfig } from 'vitepress';
import { getItemsFromDendronNoteFiles, notesPath } from '../dendron-utilities.mjs';
import { SiteMetadataService } from '../site-metadata-service.mjs';
import markdownItWikilinksFn from 'markdown-it-wikilinks';
import mditCustomPluginFn from '../mdit-custom-plugin.mjs';
import fs from 'fs';

const siteMetadata = new SiteMetadataService(getItemsFromDendronNoteFiles);
//need to save it locally to be imported in CustomLayout.vue
fs.writeFileSync(
  '.vitepress/redirects-data.json',
  JSON.stringify(siteMetadata.redirects),
  'utf-8');

const rewrites = {};
rewrites[notesPath + '/:note'] = ':note';

export const base = defineConfig({
  title: 'eniblog',
  base: '/eniblog/',
  description: 'enib + (b)log = eniblog',
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
  rewrites: rewrites,
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
    //todo hero actions (pinned pages)
    //dinamically add cards to homepage by editing its frontmatter
    pageData.frontmatter['features'] = siteMetadata.homeCards;
  },
  srcExclude: siteMetadata.srcExclude
});
