<template>
  <div>
    <v-btn @click="start()">起動</v-btn>

    <v-dialog v-model="displayState.previewDialog" fullscreen>
      <QrReader @read="readQR" v-if="displayState.previewDialog"></QrReader>
    </v-dialog>

    <v-dialog v-model="displayState.qrConfirmDialog" persistent>
      <QrConfirm
        :qr-data="state.qrData"
        @reRead="start"
        @submit="submit"
      ></QrConfirm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext } from '@vue/composition-api';
import QrReader from '../../components/QrReader.vue';
import QrConfirm from '../../components/QrConfirm.vue';

interface DisplayState {
  previewDialog: boolean;
  qrConfirmDialog: boolean;
}

interface State {
  qrData: string;
}

export default defineComponent({
  name: 'index',
  components: { QrConfirm, QrReader },
  setup(_: {}, context: SetupContext) {
    const displayState = reactive<DisplayState>({
      previewDialog: false,
      qrConfirmDialog: false
    });
    const state = reactive<State>({
      qrData: ''
    });

    const start = () => {
      displayState.previewDialog = true;
      displayState.qrConfirmDialog = false;
    };

    const readQR = (data: string) => {
      displayState.previewDialog = false;
      displayState.qrConfirmDialog = true;
      state.qrData = data;
    };

    const submit = () => {
      const router = context.root.$router;
      const qrData = encodeURIComponent(state.qrData);
      router.push(`/home/qr/${qrData}`);
    };

    return {
      displayState,
      state,

      start,
      readQR,
      submit
    };
  }
});
</script>
