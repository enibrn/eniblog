<template>
  <Layout>
    <template #doc-before>
      <CopyButton
        id="id-copy-btn"
        :message="permalinkProps.message"
        :label="permalinkProps.label"
        :content="permalinkProps.content"
        classes='copy-btn'
      />

      <Badges
        :createdTimestamp="$frontmatter.created"
        :updatedTimestamp="$frontmatter.updated"
        :ogDate="$frontmatter.vp?.ogdate"
      />
    </template>

    <template #doc-after>
      <Comments :pageId="$frontmatter.id" />
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import Badges from './components/Badges.vue'
import Comments from './components/Comments.vue'
import { inBrowser, useData, useRouter } from 'vitepress'
import { watch, ref, computed } from 'vue'
import CopyButton from 'vitepress-copy-helper';
import redirects from '../redirects-data.json'

const { page, frontmatter } = useData();

console.log(frontmatter.value.id);
const { go, route } = useRouter();

const { Layout } = DefaultTheme;

const permalinkProps = computed(() => {
  return {
    message: 'Link copiato',
    label: 'Copia il link a questa pagina',
    //todo implement localhost
    content: `https://enibrn.github.io/eniblog/${frontmatter.value.id}`
  }
});

watch(
  () => page.value.isNotFound,
  (isNotFound) => {
    if (!isNotFound || !inBrowser) return;

    const redirect = getRedirectFromRoute(route.path);
    console.log('redirect', redirect);
    if (!redirect) return;

    go(redirect);
  },
  { immediate: true }
);

function getRedirectFromRoute(path) {
  console.log('getRedirectFromRoute', 'no path');
  if (!path) return;

  const regex = /\/eniblog\/(.*?)\.html/;
  const match = path.match(regex);
  const guid = match ? match[1] : null;
  console.log('getRedirectFromRoute', match, guid);
  return redirects[guid];
}

</script>

<style scoped>
#id-copy-btn {
  margin-bottom: 1em;
  height: 26px;
  padding-bottom: 2px;
  padding-top: 2px;
  padding-left: 26px;
}
</style>