<template>
  <v-app>
    <component :is="layout"></component>
  </v-app>
</template>

<script lang="ts">
import {defineComponent, ref, SetupContext, watch} from '@vue/composition-api';
import DefaultLayout from './layouts/DefaultLayout.vue';

export default defineComponent({
  name: 'app',
  components: {DefaultLayout},
  setup(_: {}, context: SetupContext) {
    const layout = ref<string>('default-layout');
    watch(context.$route, () => {
      layout.value = context.$route?.meta?.layout ?? 'default-layout';
    });

    return {
      layout,
    }
  }
})
</script>

<style lang="scss">
</style>
