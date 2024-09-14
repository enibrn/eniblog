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
    }
  },
  transformPageData: (pageData, { siteConfig }) => {
    if (pageData.frontmatter['layout'] === 'home') {
      //dinamically add cards to homepage by editing its frontmatter
      pageData.frontmatter['features'] = siteMetadata.homeCards;
    } else { //only 2 types of pages in the website, homepage or page
      // add an ID in the head's og:title for an immutable reference to the page for giscus
      pageData.frontmatter.head ??= [];
      pageData.frontmatter.head.push([
        'meta',
        {
          name: 'og:title',
          content: pageData.frontmatter['id']
        }
      ]);
    }
  }
});
