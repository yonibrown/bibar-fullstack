<template>
  <div
    class="tab"
    :style="{ width: tab.width_pct + '%' }"
  >
    <div class="head">
      <span class="menu-buttons">
        <menu-button
          type="close"
          @click="$emit('removeTab', tab.id)"
        ></menu-button>
      </span>
    </div>
    <element-list
      :elements="elements"
      :tab="tab.id"
      ref="listRef"
    ></element-list>
  </div>
</template>

<script setup>
import ElementList from "./ElementList.vue";
import MenuButton from "../ui/MenuButton.vue";
import { ref } from "vue";

const props = defineProps({
  tab: {
    type: Object,
    required: true
  },
  elements: {
    type: Array,
    required: true
  }
});

defineEmits(['removeTab']);

const listRef = ref();

defineExpose({ listRef });
</script>

<style scoped>
.menu-buttons {
  float: left;
}

.tab {
  border: solid 1px #b4b4b4;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.26);
  overflow-y: scroll;
  overflow-x: hidden;
  flex-grow: 1;
}

.head {
  cursor: grab;
  padding: 0em 0em 1em 0em;
}
</style> 