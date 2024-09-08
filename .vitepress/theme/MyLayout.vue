<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="vp-doc">
        <h1>{{ $frontmatter.title }}</h1>
      </div>
    </template>
  </Layout>
</template>