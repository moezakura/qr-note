<template>
  <div>
    <v-btn x-large block color="primary" @click="start">QRを読み取る</v-btn>

    <v-card class="mt-4">
      <v-card-title>登録されているメモ一覧</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="displayState.searchText"
          label="検索"
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <v-card
          v-for="i in displayState.searchedList"
          :key="i.itemID"
          outlined
          class="mb-2"
          @click="move(i)"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">
                {{ i.images.length ? '画像付きメモ' : '通常メモ' }}
              </div>
              <v-list-item-title class="headline mb-1">
                {{ i.id }}
              </v-list-item-title>
              <v-list-item-subtitle
                v-html="marked(i.text)"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              v-if="i.images.length"
              tile
              size="80"
              color="grey"
            >
              <v-img :src="i.images[0]"></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-card-text>
    </v-card>

    <v-dialog v-model="displayState.previewDialog" fullscreen>
      <QrReader
        v-if="displayState.previewDialog"
        @read="readQR"
        @close="onClickCloseReader"
      ></QrReader>
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
import {
  computed,
  ComputedRef,
  defineComponent,
  reactive,
  SetupContext,
  UnwrapRef,
} from '@vue/composition-api';
import QrReader from '~/components/QrReader.vue';
import QrConfirm from '~/components/QrConfirm.vue';
import { db } from '~/lib/firebase';
import Note from '~/lib/classes/model/note';
import Auth from '~/lib/auth';
import firebase from 'firebase';
import marked from 'marked';

interface DisplayState {
  previewDialog: boolean;
  qrConfirmDialog: boolean;
  searchText: string;
  list: Note[];
  searchedList: ComputedRef<Node[]>;
}

interface State {
  qrData: string;
  user: firebase.User | null;
}

export default defineComponent({
  name: 'index',
  components: { QrConfirm, QrReader },
  setup(_: {}, context: SetupContext) {
    let displayState: UnwrapRef<DisplayState>;
    displayState = reactive<DisplayState>({
      previewDialog: false,
      qrConfirmDialog: false,
      searchText: '',
      list: [],
      searchedList: computed<Node[]>(() => {
        try {
          const searchText = displayState.searchText.toLowerCase();
          const searchPattern = new RegExp(searchText);
          return displayState.list.filter(
            item => searchPattern.test(item.text) || searchPattern.test(item.id)
          );
        } catch {
          return displayState.list;
        }
      }),
    });
    const state = reactive<State>({
      qrData: '',
      user: null,
    });

    const itemsRef = db.collection('/items');

    const loadList = async () => {
      try {
        const user = await Auth.getUser();
        state.user = user;
        const ref = itemsRef.doc(user.uid).collection('items');

        const items = await ref.get();
        displayState.list = items.docs.map(doc => {
          const note = new Note();
          note.fromData(doc.id, doc.data());
          return note;
        });
      } catch (e) {
        console.error(e);
      }
    };
    loadList();

    const start = () => {
      displayState.previewDialog = true;
      displayState.qrConfirmDialog = false;
    };

    const readQR = (data: string) => {
      displayState.previewDialog = false;
      displayState.qrConfirmDialog = true;
      state.qrData = data;
    };

    const onClickCloseReader = () => {
      displayState.previewDialog = false;
    };

    const submit = () => {
      const router = context.root.$router;
      const qrData = encodeURIComponent(state.qrData);
      router.push(`/home/qr/${qrData}`);
    };

    const move = (item: Note) => {
      const router = context.root.$router;
      const qrData = encodeURIComponent(item.id);
      router.push(`/home/qr/${qrData}`);
    };

    return {
      displayState,
      state,

      start,
      readQR,
      onClickCloseReader,
      submit,
      marked,
      move,
    };
  },
});
</script>
