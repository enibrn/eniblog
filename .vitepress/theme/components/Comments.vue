<template>
  <span>pageId</span>{{ pageId }}
  <div
    :key="pageId"
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
      :data-term="giscusPageId"
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
import { defineProps, computed } from 'vue';

const props = defineProps({
  pageId: {
    type: String,
    required: true
  }
});

const giscusPageId = computed(() => {
  const suffix = window.location.hostname === 'localhost' ? '_dev' : '';
  return props.pageId + suffix;
});
</script>