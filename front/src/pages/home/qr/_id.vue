<template>
  <div>
    <v-card>
      <v-card-title>QR情報</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">QRキー</v-col>
          <v-col cols="8">{{ id }}</v-col>
        </v-row>
      </v-card-text>

      <v-card-title>登録情報</v-card-title>
      <v-card-text>
        <template v-if="!displayState.isEdit">
          <p>新規で読み込まれたQRのため、情報はありません。</p>
        </template>
        <template v-else>
          <v-card flat outlined>
            <v-card-text v-html="displayState.html"></v-card-text>
          </v-card>
        </template>
      </v-card-text>

      <v-card-text>
        <v-btn x-large block @click="displayState.imageDialog = true">
          <v-icon class="mr-1">mdi-image</v-icon>
          紐付いている画像一覧を表示
        </v-btn>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn
          v-if="displayState.isEdit"
          x-large
          color="red"
          @click="displayState.deleteDialog = true"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn x-large color="primary" @click="displayState.editDialog = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="displayState.imageDialog" fullscreen>
      <ImageDialog
        :images="displayState.images"
        @close="displayState.imageDialog = false"
        @imageAdd="imageAdd"
      ></ImageDialog>
    </v-dialog>

    <v-dialog v-model="displayState.editDialog" fullscreen>
      <EditDialog
        v-model="displayState.text"
        :is-edit="displayState.isEdit"
        @save="save"
        @cancel="editCancel"
      ></EditDialog>
    </v-dialog>

    <v-dialog v-model="displayState.deleteDialog">
      <DeleteDialog
        :id="id"
        @close="displayState.deleteDialog = false"
        @deleteItem="deleteItem"
      ></DeleteDialog>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  SetupContext,
  ComputedRef,
  UnwrapRef
} from '@vue/composition-api';
import marked from 'marked';
import firebase from 'firebase';
import EditDialog from '../../../components/EditDialog.vue';
import Note from '../../../lib/classes/model/note';
import Auth from '../../../lib/auth';
import DeleteDialog from '../../../components/DeleteDialog.vue';
import ImageDialog from '../../../components/ImageDialog.vue';

const EditMode = {
  EDIT: 0,
  CREATE: 1
};

interface DisplayState {
  editMode: number;
  isEdit: ComputedRef<Boolean>;
  text: ComputedRef<String>;
  html: ComputedRef<String>;
  images: ComputedRef<Array>;
  editDialog: boolean;
  deleteDialog: boolean;
  imageDialog: boolean;
}

interface State {
  item: Note;
  user: firebase.User | null;
}

export default defineComponent({
  components: { ImageDialog, DeleteDialog, EditDialog },
  setup(_: {}, context: SetupContext) {
    const id = context.root.$route.params['id'];
    const firestore = firebase.firestore();
    const itemsRef = firestore.collection('/items');

    const item = new Note();

    const state = reactive<State>({
      item,
      user: null
    });

    let displayState: UnwrapRef<DisplayState>;
    displayState = reactive<DisplayState>({
      editMode: EditMode.EDIT,
      isEdit: computed<Boolean>(() => displayState.editMode === EditMode.EDIT),
      text: computed<String>(() => item.text),
      html: computed<String>(() => marked(displayState.text)),
      images: computed<Array>(() => item.images),
      editDialog: false,
      deleteDialog: false,
      imageDialog: false
    });

    const getItem = async () => {
      const user = await Auth.getUser();
      state.user = user;

      const querySnapshot = await itemsRef
        .doc(user.uid)
        .collection('items')
        .where('id', '==', id)
        .get();
      if (querySnapshot.docs.length) {
        const doc = querySnapshot.docs[0];
        const d = doc.data();
        item.fromData(doc.id, d);
        displayState.editMode = EditMode.EDIT;
        return;
      }
      displayState.editMode = EditMode.CREATE;
    };
    getItem();

    const save = async (text: string) => {
      displayState.editDialog = false;
      item.text = text;
      const user = state.user!;
      const ref = itemsRef.doc(user.uid).collection('items');

      if (displayState.isEdit) {
        await ref.doc(state.item.itemID).update(item.toObject());
      } else {
        item.id = id;
        item.text = text;
        item.images = [];
        await ref.add(item.toObject());
      }
      getItem();
    };

    const imageAdd = async (addFile: string) => {
      const user = state.user!;
      const ref = itemsRef.doc(user.uid).collection('items');
      await ref.doc(state.item.itemID).update({
        images: firebase.firestore.FieldValue.arrayUnion(addFile)
      });
      getItem();
    };

    const editCancel = () => {
      displayState.editDialog = false;
    };

    const deleteItem = async () => {
      const user = state.user!;
      const ref = itemsRef.doc(user.uid).collection('items');
      await ref.doc(state.item.itemID).delete();
      const router = context.root.$router;
      router.push('/home/');
    };

    return {
      id,

      displayState,
      state,

      save,
      editCancel,
      imageAdd,
      deleteItem
    };
  }
});
</script>
