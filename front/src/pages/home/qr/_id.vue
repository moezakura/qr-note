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
        <v-btn x-large block>
          <v-icon class="mr-1">mdi-image</v-icon>
          紐付いている画像一覧を表示
        </v-btn>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn x-large color="red">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn x-large color="primary" @click="displayState.editDialog = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog fullscreen v-model="displayState.editDialog">
      <EditDialog
        v-model="displayState.text"
        :is-edit="displayState.isEdit"
        @save="save"
        @cancel="cancel"
      ></EditDialog>
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
import EditDialog from '../../../components/EditDialog.vue';

const EditMode = {
  EDIT: 0,
  CREATE: 1
};

interface DisplayState {
  editMode: number;
  isEdit: ComputedRef<Boolean>;
  text: string;
  html: ComputedRef<String>;
  editDialog: boolean;
}

export default defineComponent({
  components: { EditDialog },
  setup(_: {}, context: SetupContext) {
    const id = context.root.$route.params['id'];

    let displayState: UnwrapRef<DisplayState>;
    displayState = reactive<DisplayState>({
      editMode: EditMode.EDIT,
      isEdit: computed<Boolean>(() => displayState.editMode === EditMode.EDIT),
      text:
        '## 引っ越しの荷物A\n' +
        '\n' +
        '### これにはいろんな荷物入れた\n' +
        '\n' +
        '*割れ物注意*\n' +
        '\n' +
        '- 荷物A\n' +
        '- 荷物B\n' +
        '- 荷物C\n' +
        '\n',
      html: computed<String>(() => marked(displayState.text)),
      editDialog: false
    });

    const save = (text: string) => {
      displayState.editDialog = false;
      displayState.text = text;
    };
    const cancel = () => {
      displayState.editDialog = false;
    };

    return {
      id,

      displayState,

      save,
      cancel
    };
  }
});
</script>

<style lang="scss" scoped></style>
