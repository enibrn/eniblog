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
});

//should be unified to the one in SiteMetadataService.#getCardBody
const formatTs = (ts) => Intl.DateTimeFormat().format(new Date(ts));
const createdDateString = computed(() => `Creato il ${formatTs(props.createdTimestamp)}`);
const updatedDateString = computed(() => `Aggiornato il ${formatTs(props.updatedTimestamp)}`);

</script>