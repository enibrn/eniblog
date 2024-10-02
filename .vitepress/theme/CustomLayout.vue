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

const redirects = {
  '/eniblog/123': '/eniblog/brew.brews.2016.blue-marble'
};

watch(
  () => page.value.isNotFound,
  (isNotFound) => {
    if (!isNotFound || !inBrowser)
      return;
    const redirect = redirects[window.location.pathname];
    console.log(redirect);

    if (!redirect)
      return;

    go(redirect);
  },
  { immediate: true }
);

</script>