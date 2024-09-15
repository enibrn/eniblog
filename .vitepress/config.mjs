import { defineConfig } from 'vitepress';
import { getItemsFromDendronNotes } from './dendron-utilities.mjs'
import { SiteMetadataService } from './site-metadata-service.mjs'
import markdownItWikilinksFn from "markdown-it-wikilinks";
import mditCustomPluginFn from './mdit-custom-plugin.mjs';

const siteMetadata = new SiteMetadataService(getItemsFromDendronNotes);

export default defineConfig({
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  lang: 'it-IT',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/enibrn/eniblog' }
    ],
    nav: siteMetadata.nav,
    sidebar: siteMetadata.sidebar,
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Cerca',
            buttonAriaLabel: 'Cerca'
          },
          modal: {
            searchBox: {
              resetButtonTitle: 'Pulisci ricerca',
              resetButtonAriaLabel: 'Pulisci ricerca',
              cancelButtonText: 'Annulla',
              cancelButtonAriaLabel: 'Annulla'
            },
            startScreen: {
              recentSearchesTitle: 'Cronologia delle ricerche',
              noRecentSearchesText: 'Nessuna ricerca recente',
              saveRecentSearchButtonTitle: 'Salva nella cronologia delle ricerche',
              removeRecentSearchButtonTitle: 'Rimuovi dalla cronologia delle ricerche',
              favoriteSearchesTitle: 'Preferiti',
              removeFavoriteSearchButtonTitle: 'Rimuovi dai preferiti'
            },
            errorScreen: {
              titleText: 'Impossibile ottenere risultati',
              helpText: 'Verifica la tua connessione di rete'
            },
            footer: {
              selectText: 'Seleziona',
              navigateText: 'Naviga',
              closeText: 'Chiudi',
              searchByText: 'Ricerca per'
            },
            noResultsScreen: {
              noResultsText: 'Impossibile trovare risultati', //seems not working
              suggestedQueryText: 'Puoi provare una nuova ricerca',
              reportMissingResultsText: 'Dovrebbero esserci risultati per questa query?',
              reportMissingResultsLinkText: 'Clicca per inviare feedback'
            }
          }
        }
      }
    },
    //italian labels
    docFooter: {
      prev: 'Precedente',
      next: 'Successivo'
    },
    outline: {
      label: 'In questa pagina'
    },
    returnToTopLabel: 'Torna all\'inizio',
    sidebarMenuLabel: 'Menu laterale',
    darkModeSwitchLabel: 'Tema Scuro',
    lightModeSwitchTitle: 'Cambia in tema chiaro',
    darkModeSwitchTitle: 'Cambia in tema scuro'
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
