<template>
  <div style="margin-bottom: 1em;">
    <Badge
      type="tip"
      :text="createdDateString"
    />

    <Badge
      type="info"
      :text="updatedDateString"
    />

    <Badge
      type="warning"
      v-if="ogDate"
      :text="ogDateString"
    />

  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  createdTimestamp: {
    type: String,
    required: true
  },
  updatedTimestamp: {
    type: String,
    required: true
  },
  ogDate: {
    type: String,
    required: false
  },
});

//should be unified to the one in SiteMetadataService.#getCardBody
const formatTs = (ts) => Intl.DateTimeFormat().format(new Date(ts));
const createdDateString = computed(() => `Creato il ${formatTs(props.createdTimestamp)}`);
const updatedDateString = computed(() => `Aggiornato il ${formatTs(props.updatedTimestamp)}`);

const formatDate = (dts) => Intl.DateTimeFormat().format(new Date(dts));
const ogDateString = computed(() => `Originariamente creato il ${formatDate(props.ogDate)}`);

</script>