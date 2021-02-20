<template>
  <v-card>
    <v-card-title>確認</v-card-title>
    <v-card-text>
      <p>こちらのQRコードを読み取りました。</p>
      <p>こちらのQRコードに対してデータを紐付けますか？</p>
      <v-row>
        <v-col cols="4">データ</v-col>
        <v-col cols="8">{{ qrData }}</v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="d-block">
      <v-btn block class="my-2 mx-0" x-large @click="reRead"
        >読み取り直す</v-btn
      >
      <v-btn block class="my-2 mx-0" color="primary" x-large @click="submit"
        >続行</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';

interface Props {
  qrData: string;
}

export default defineComponent({
  props: {
    qrData: {
      type: String,
      required: true
    }
  },
  setup(_: Props, context: SetupContext) {
    const reRead = () => {
      context.emit('reRead');
    };

    const submit = () => {
      context.emit('submit');
    };

    return {
      reRead,
      submit
    };
  }
});
</script>

<style lang="scss" scoped></style>
