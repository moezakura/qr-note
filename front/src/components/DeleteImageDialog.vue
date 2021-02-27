<template>
  <v-card>
    <v-card-title>画像の削除</v-card-title>
    <v-card-text>
      <p>表示されている画像を削除しますか</p>
      <v-img :src="image.url"></v-img>
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
import Image from '../lib/classes/model/image';

interface Props {
  image: Image;
}

export default defineComponent({
  props: {
    image: {
      type: Object,
      require: true,
    },
  },
  setup(props: Props, context: SetupContext) {
    const close = () => {
      context.emit('close');
    };

    const deleteItem = () => {
      context.emit('deleteItem', props.image);
    };

    return {
      close,
      deleteItem,
    };
  },
});
</script>

<style lang="scss" scoped></style>
