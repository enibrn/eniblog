import { defineConfig } from 'vitepress';
import { getItemsFromDendronNoteFiles } from '../dendron-utilities.mjs'
import { SiteMetadataService } from '../site-metadata-service.mjs'
import markdownItWikilinksFn from 'markdown-it-wikilinks';
import mditCustomPluginFn from '../mdit-custom-plugin.mjs';

const siteMetadata = new SiteMetadataService(getItemsFromDendronNoteFiles);

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
  rewrites: {
    //TODO Redirects to the first leaf path when path is not leaf
    //TODO Redirects for hard links
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
  },
  srcExclude: siteMetadata.srcExclude
});
