<template>
  <v-card>
    <v-card-title>削除の確認</v-card-title>
    <v-card-text>
      <p>この項目を削除しますか？</p>
      <p>削除した項目を元に戻すことはできません。</p>
      <p>QRキー: {{ id }}</p>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="red" x-large @click="deleteItem">
        <v-icon class="mr-2">mdi-delete</v-icon>
        削除
      </v-btn>
      <v-btn color="primary" x-large @click="close">
        キャンセル
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';

export default defineComponent({
  props: {
    id: {
      type: String,
      require: true,
    },
  },
  setup(_: {}, context: SetupContext) {
    const deleteItem = () => {
      context.emit('deleteItem');
    };
    const close = () => {
      context.emit('close');
    };

    return {
      deleteItem,
      close,
    };
  },
});
</script>

<style lang="scss" scoped></style>
