<script setup>
import { computed } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';

const { Layout } = DefaultTheme;
const { frontmatter } = useData();

const formattedCreated = computed(() => getDateText(frontmatter.value.created, true));
const formattedUpdated = computed(() => getDateText(frontmatter.value.updated));

function getDateText(ts, created) {
  const dateString = Intl.DateTimeFormat().format(new Date(ts));
  const result = created ? `Creato il ${dateString}` : `Aggiornato il ${dateString}`;

  return result;
}
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="vp-doc">
        <h1>
          {{ $frontmatter.title + ' ' }}
          <Badge type="tip" :text="formattedCreated" />
          <Badge type="info" :text="formattedUpdated" />
        </h1>
      </div>
    </template>
  </Layout>
</template>