<template>
  <Layout>
    <template #doc-before>
      <div style="margin-bottom: 1em;">
        <Badge
          type="tip"
          :text="formattedCreated"
        />

        <Badge
          type="info"
          :text="formattedUpdated"
        />
      </div>
    </template>

    <template #doc-after>
      <Comments :pageId="frontmatter.id" />
    </template>
  </Layout>
</template>

<script setup>
import { computed } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import Comments from './components/Comments.vue'

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