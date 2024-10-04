<template>
  <div
    :key="pageId"
    class="giscus"
    style="margin-top: 1em;"
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
import { computed } from 'vue';

const props = defineProps({
  pageId: {
    type: String,
    required: true
  }
});

//discussions are separated between the published and development versions
const giscusPageId = computed(() => {
  //TODO better to use an env variable OR see inBrowser in CustomLayout.vue
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const suffix = isLocal ? '_dev' : '';
  return props.pageId + suffix;
});
</script>