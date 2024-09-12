import { defineConfig } from 'vitepress';
import { getItemsFromDendronNotes } from './dendron-utilities.mjs'
import { SiteMetadataService } from './site-metadata-service.mjs'
import markdownItWikilinksFn from "markdown-it-wikilinks";

const siteMetadata = new SiteMetadataService(getItemsFromDendronNotes);

export default defineConfig({
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/enibrn/eniblog' }
    ],
    nav: siteMetadata.nav,
    sidebar: siteMetadata.sidebar
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
    }
  },
  transformPageData: (pageData, { siteConfig }) => {
    if (pageData.frontmatter['layout'] !== 'home') return;
    pageData.frontmatter['features'] = siteMetadata.homeCards;
  }
});
