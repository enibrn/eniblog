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

const { Layout } = DefaultTheme;

</script>