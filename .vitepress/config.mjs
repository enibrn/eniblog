import { defineConfig } from 'vitepress';
import path from 'path';
import fs from 'fs';

const nav = [
  { text: 'Hello world', link: 'notes/root.md' }
];




// function filterFields(item) {
//   return {
//     title: item.data.title,
//     desc: item.data.desc,
//     is_blog_page: item.data.is_blog_page
//   };
// }

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
