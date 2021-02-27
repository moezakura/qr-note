<template>
  <v-card>
    <v-app-bar fixed>
      <v-toolbar-title>
        画像一覧
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn large text class="mr-2" @click="close">
        閉じる
      </v-btn>
      <v-btn type="file" large color="primary" @click="newSelect">
        <v-icon class="mr-2">mdi-cloud-upload</v-icon>
        新規追加
      </v-btn>
      <input
        ref="fileSelect"
        autocomplete="off"
        type="file"
        class="fake-file-select"
        @change="fileSelected"
      />
    </v-app-bar>
    <v-card flat class="mx-2 pt-12">
      <div v-for="(i, n) in images" :key="i">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              v-bind="attrs"
              :src="i"
              class="mb-4"
              :class="{ 'mt-4': n === 0 }"
              v-on="on"
            ></v-img>
          </template>
          <v-list>
            <v-list-item @click="openNew(i)">
              <v-list-item-title>
                <v-icon>mdi-open-in-new</v-icon>
                新しいタブで開く
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title>
                <v-icon>mdi-delete</v-icon>
                削除
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from '@vue/composition-api';
import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import FileReaderEx from '../lib/fileReaderEx';
import ImageResize from '../lib/imageResize';
import Auth from '../lib/auth';

export default defineComponent({
  props: {
    images: {
      type: Array,
      require: true
    }
  },
  setup(_: {}, context: SetupContext) {
    const fileSelect = ref<HTMLInputElement>();

    const newSelect = () => {
      fileSelect.value!.click();
    };

    const fileSelected = async () => {
      const file = fileSelect.value?.files[0];
      if (!file) {
        return;
      }

      try {
        const user = await Auth.getUser();
        const fileName = `${uuidv4()}.jpeg`;

        const r = await FileReaderEx.readAsDataURL(file);
        const resizer = new ImageResize(r.result);
        const imageFile = await resizer.contain(1920);

        const storageRef = firebase.storage().ref(`images/${user.uid}`);
        const ep = storageRef.child(fileName);
        await ep.put(imageFile);
        const downloadURL = await ep.getDownloadURL();
        context.emit('imageAdd', downloadURL);
      } catch (e) {
        console.error(e);
      }
    };

    const close = () => {
      context.emit('close');
    };

    const openNew = (url: string) => {
      window.open(url);
    };

    return {
      fileSelect,

      newSelect,
      fileSelected,
      close,
      openNew
    };
  }
});
</script>

<style lang="scss" scoped>
.fake-file-select {
  display: none;
}
</style>
