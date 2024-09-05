import { defineConfig } from 'vitepress';
import path from 'path';
import fs from 'fs';

const menu = JSON.parse(fs.readFileSync('test_hier/menu.json', 'utf-8'));

export default defineConfig({
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AndreaBinelli/eniblog' }
    ],
    nav: [
      {
        text: "Brew",
        items: [
          {
            text: "Produzioni",
            items: [
              {
                text: "2016",
                link: "brew.brews.2016.zirael"
              }
            ]
          },
          {
            text: "Lato caldo",
            link: "brew.hots.rb-set.biab"
          }
        ]
      }
    ],
    sidebar: {
      "brew.brews.2016": [
        {
          text: "Blue Marble",
          link: "brew.brews.2016.blue-marble"
        },
        {
          text: "Ecstasy Of Gold",
          link: "brew.brews.2016.ecstasy-of-gold"
        },
        {
          text: "Fen'Harel",
          link: "brew.brews.2016.fen-harel"
        },
        {
          text: "Haven",
          link: "brew.brews.2016.haven"
        },
        {
          text: "Heisenberg",
          link: "brew.brews.2016.heisenberg"
        },
        {
          text: "Montblanc",
          link: "brew.brews.2016.montblanc"
        },
        {
          text: "Mr Robot",
          link: "brew.brews.2016.mr-robot"
        },
        {
          text: "Newton",
          link: "brew.brews.2016.newton"
        },
        {
          text: "Pale Blue Dot",
          link: "brew.brews.2016.pale-blue-dot"
        },
        {
          text: "Solar Eclipse",
          link: "brew.brews.2016.solar-eclipse"
        },
        {
          text: "The Son Of Mars",
          link: "brew.brews.2016.son-of-mars"
        },
        {
          text: "Zirael",
          link: "brew.brews.2016.zirael"
        }
      ],
      "brew.hots": [
        {
          text: "Impianti Ryan Biller",
          items: [
            {
              text: "Tre Tini",
              items: [
                {
                  text: "Mark 2",
                  link: "brew.hots.rb-set.3v.mk2"
                },
                {
                  text: "Mark 3",
                  link: "brew.hots.rb-set.3v.mk3"
                },
                {
                  text: "Mark 4",
                  link: "brew.hots.rb-set.3v.mk4"
                },
                {
                  text: "Mark 5",
                  link: "brew.hots.rb-set.3v.mk5"
                },
                {
                  text: "Tre Tini Mark 1",
                  link: "brew.hots.rb-set.3v.mk1"
                }
              ]
            },
            {
              text: "Biab",
              link: "brew.hots.rb-set.biab"
            }
          ]
        }
      ]
    }
  },
  rewrites: {
    'notes/:note': ':note'
  }
});
