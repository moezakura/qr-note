<template>
  <div>
    <v-btn @click="start()">起動</v-btn>

    <v-dialog v-model="displayState.previewDialog" fullscreen>
      <v-card>
        <v-card-title>QRコードの読み取り</v-card-title>
        <v-card-text>
          <video autoplay muted playsinline ref="video" width="100%" height="100%"></video>
          <canvas class="video-canvas" ref="qrPreview" :width="`${displayState.videoWidth}px`" :height="`${displayState.videoHeight}px`"></canvas>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from '@vue/composition-api';
import jsQR from 'jsqr';

interface DisplayState {
  previewDialog: boolean;
  videoWidth: number;
  videoHeight: number;
}

interface State {
  qrReadInterval: number;
}

export default defineComponent({
  name: 'index',
  setup() {
    const video = ref();
    const qrPreview = ref();

    const displayState = reactive<DisplayState>({
      previewDialog: false,
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
          width: videoRegion.width / 4,
          height: videoRegion.height / 4,
        };
        
        displayState.videoWidth = size.width;
        displayState.videoHeight = size.height;
        context.drawImage(videoElement, 0, 0, size.width, size.height);

        const imageData = context.getImageData(0, 0, size.width, size.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          console.log(code);
          window.clearInterval(state.qrReadInterval);
        }

      } catch (e) {
        console.error(e);
      }
    };

    const start = async () => {
      displayState.previewDialog = true;
      try {
        const media = navigator.mediaDevices;
        video.value!.srcObject = await media.getUserMedia({
          audio: false, video: {
            facingMode: 'environment'
          }
        });
        state.qrReadInterval= window.setInterval(previewWithReadQR, 30);
      } catch (e) {
        console.error(e);
      }
    };

    return {
      state,
      video,
      qrPreview,
      start,
      displayState,
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
