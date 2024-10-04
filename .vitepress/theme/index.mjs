import DefaultTheme from 'vitepress/theme'
import CustomLayout from './CustomLayout.vue'
import CopyButton from 'vitepress-copy-helper';
import 'vitepress-copy-helper/style.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    app.component('CopyButton', CopyButton);
  }
}