<template>
  <div>
    <v-app-bar>
      <span>qr-note</span>
    </v-app-bar>
    
    <v-main class="mt-4">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';

export default defineComponent({
  name: 'default-layout',
  setup() {
  }
})
</script>

<style lang="scss" scoped></style>
