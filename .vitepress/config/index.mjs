import { defineConfig } from 'vitepress';
import { base } from "./base.mjs";
import { it } from "./it.mjs";

export default defineConfig({
  ...base,
  ...it,
  themeConfig: {
    ...base.themeConfig,
    ...it.themeConfig,
    search: {
      ...base.themeConfig.search,
      ...it.themeConfig.search,
    }
  }
});
