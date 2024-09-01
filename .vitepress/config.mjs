import { defineConfig } from 'vitepress';

const nav = [
  { text: 'Hello world', link: 'notes/root.md' }
];

export default defineConfig({
  title: "eniblog",
  base: '/eniblog/',
  description: "enib + (b)log = eniblog",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AndreaBinelli/eniblog' }
    ],
    nav
  },
  rewrites: {
    'notes/:note': ':note'
  }
});
