<template>
  <Layout>
    <template #doc-before>
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
import { watch } from 'vue'

const { page } = useData();
const { go } = useRouter();

const { Layout } = DefaultTheme;

const redirects = Object.entries({
  '/eniblog/123': '/eniblog/brew.brews.2016.blue-marble'
});

watch(
  () => page.value.isNotFound,
  (isNotFound) => {
    console.log(isNotFound, inBrowser);
    if (!isNotFound || !inBrowser)
      return;

    console.log(window.location.pathname);
    const redirect = redirects.find(([from]) => window.location.pathname.startsWith(from));
    console.log(redirect);

    if (!redirect)
      return;

    go(redirect[1] + window.location.pathname.slice(redirect[0].length))
  },
  { immediate: true }
);

</script>