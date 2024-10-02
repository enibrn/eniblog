import { defineConfig } from 'vitepress';

export const it = defineConfig({
  lang: 'it-IT',
  themeConfig: {
    search: {
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
              noResultsText: 'Impossibile trovare risultati',
              suggestedQueryText: 'Puoi provare una nuova ricerca',
              reportMissingResultsText: 'Dovrebbero esserci risultati per questa query?',
              reportMissingResultsLinkText: 'Clicca per inviare feedback'
            },
            displayDetails: 'Mostra lista dettagliata',
            resetButtonTitle: 'Pulisci ricerca',
            backButtonTitle: 'Chiudi ricerca',
            noResultsText: 'Impossibile trovare risultati',
          }
        }
      }
    },
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
    lightModeSwitchTitle: 'Cambia in tema chiaro (a tuo rischio)',
    darkModeSwitchTitle: 'Cambia in tema scuro (per il tuo bene)',
    notFound: {
      title: 'Oops!',
      quote: 'Sembra che tu abbia trovato un buco nero nel nostro sito. Torna indietro prima che sia troppo tardi!',
      linkLabel: 'torna indietro',
      linkText: 'Torna indietro',
    }
  }
});
