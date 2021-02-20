<template>
  <v-app>
    <DefaultLayout></DefaultLayout>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import DefaultLayout from './layouts/DefaultLayout.vue';

export default defineComponent({
  name: 'app',
  components: { DefaultLayout },
  setup() {
    return {};
  }
});
</script>

<style lang="scss"></style>
