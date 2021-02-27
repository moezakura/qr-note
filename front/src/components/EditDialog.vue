<template>
  <v-card flat>
    <v-app-bar fixed>
      <v-toolbar-title>
        <template v-if="!isEdit">新規追加</template>
        <template v-else>編集</template>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn large text class="mr-2" @click="cancel">キャンセル</v-btn>
      <v-btn large color="primary" @click="save">
        <v-icon class="mr-2">mdi-cloud-upload</v-icon>
        保存
      </v-btn>
    </v-app-bar>
    <v-card flat class="mx-2 pt-12">
      <v-textarea
        v-model="displayState.text"
        auto-grow
        counter
        height="100%"
      ></v-textarea>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext } from '@vue/composition-api';

interface Props {
  isEdit: boolean;
  value: string;
}

interface DisplayState {
  text: string;
}

export default defineComponent({
  props: {
    isEdit: {
      type: Boolean,
      require: true,
    },
    value: {
      type: String,
      require: true,
    },
  },
  setup(props: Props, context: SetupContext) {
    const displayState = reactive<DisplayState>({
      text: props.value,
    });

    const save = () => {
      context.emit('save', displayState.text);
    };
    const cancel = () => {
      context.emit('cancel');
      displayState.text = props.value;
    };

    return {
      displayState,

      save,
      cancel,
    };
  },
});
</script>

<style lang="scss" scoped></style>
