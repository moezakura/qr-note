<template>
  <v-card>
    <v-card-title>QRコードの読み取り</v-card-title>
    <v-card-text>
      <video autoplay muted playsinline ref="video" width="100%" height="100%"></video>
      <canvas class="video-canvas" ref="qrPreview" :width="`${displayState.videoWidth}px`"
              :height="`${displayState.videoHeight}px`"></canvas>
    </v-card-text>
    <v-card-actions>
      <v-btn class="red" block x-large>閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, SetupContext} from '@vue/composition-api';
import jsQR from 'jsqr';

interface DisplayState {
  videoWidth: number;
  videoHeight: number;
}

interface State {
  qrReadInterval: number;
}

export default defineComponent({
  setup(_: {}, setupContext: SetupContext) {
    const video = ref();
    const qrPreview = ref();

    const displayState = reactive<DisplayState>({
      videoWidth: 0,
      videoHeight: 0,
    });

    const state = reactive<State>({
      qrReadInterval: 0,
    });

    const previewWithReadQR = () => {
      try {
        if (!qrPreview) {
          return;
        }
        const videoElement: HTMLVideoElement = video.value;
        const videoRegion = videoElement.getBoundingClientRect();
        const canvas = qrPreview.value;
        const context = canvas.getContext('2d');
        const size = {
          width: videoRegion.width,
          height: videoRegion.height,
        };

        displayState.videoWidth = size.width;
        displayState.videoHeight = size.height;
        context.drawImage(videoElement, 0, 0, size.width, size.height);

        const imageData = context.getImageData(0, 0, size.width, size.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setupContext.emit('read', code.data);
          window.clearInterval(state.qrReadInterval);
          video.value!.srcObject.getTracks().forEach((track: any) => track.stop())
          video.value!.srcObject = null;
        }
      } catch (e) {
        console.error(e);
      }
    };

    onMounted(async () => {
      try {
        const media = navigator.mediaDevices;
        video.value!.srcObject = await media.getUserMedia({
          audio: false, video: {
            facingMode: 'environment'
          }
        });
        state.qrReadInterval = window.setInterval(previewWithReadQR, 30);
      } catch (e) {
        console.error(e);
      }
    });

    return {
      video,
      qrPreview,

      displayState,
      state,
    }
  }
})
</script>

<style lang="scss" scoped>
.video-canvas {
  width: 0;
  height: 0;
  opacity: 0;
  transform: scale(0);
}
</style>
