<template>
  <div
    :key="frontmatter.id"
    class="giscus"
  >
    <component
      :is="'script'"
      src="https://giscus.app/client.js"
      data-repo="enibrn/eniblog"
      data-repo-id="R_kgDOMrSLXA"
      data-category="Announcements"
      data-category-id="DIC_kwDOMrSLXM4CieOq"
      data-mapping="specific"
      :data-term="frontmatter.id"
      data-strict="1"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="transparent_dark"
      data-lang="it"
      crossorigin="anonymous"
      async
    />
  </div>
</template>

<script setup>
import { useData } from 'vitepress';
const { frontmatter } = useData();
</script>