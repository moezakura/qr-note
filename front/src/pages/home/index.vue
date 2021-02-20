<template>
  <div>
    
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from '@vue/composition-api';

interface State {
  createDialog: boolean
}

export default defineComponent({
  setup() {
    const viewState = reactive<State>({
      createDialog: false,
    });

    const openCreateDialog = () =>{
      viewState.createDialog = true;
    };
    const closeCreateDialog = () =>{
      viewState.createDialog = false;
    };
    
    return {
      viewState,
      openCreateDialog,
      closeCreateDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.record-item {
  .buttons {
    display: none;
  }

  &:hover .buttons {
    display: block;
  }
}
</style>
