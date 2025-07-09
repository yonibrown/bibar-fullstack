<template>
  <select v-model="selected">
    <option v-for="lvl in indexLevels" :key="lvl.id" :value="lvl.id">
      {{ lvl.whole_name }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, inject, computed } from "vue";
import { biResearch } from "../../store/biResearch.js";

const props = defineProps(["initialValue", "defaultValue"]);
const emit = defineEmits(["changeValue"]);
const seqIndex = inject("seqIndex");

const indexLevels = ref([]);

const injectedSelectedLevel = computed(function () {
  return props.initialValue;
});
var injectedChange = false;

// initial value for 'selected'
const selected = ref(props.initialValue);

watch(injectedSelectedLevel, (newVal) => {
  if (selected.value != newVal) {
    injectedChange = true;
    selected.value = newVal;
  }
});

function clear() {
  injectedChange = true;
  selected.value = indexLevels.value[0].id;
  changeScale(props.keyLvlIdx, selected.value);
}

watch(selected, (newVal) => {
  if (injectedChange) {
    injectedChange = false;
  } else {
    changeScale(props.keyLvlIdx, newVal);
  }
});

loadScale();

async function loadScale() {
  indexLevels.value = await biResearch.loadIndexLevels(seqIndex.value);
}

async function changeScale() {
  // update dependant inputs
  // nothing

  // emit changes
  emit("changeValue", selected.value);
}

defineExpose({ clear });
</script>

<style scoped>
select {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  background: white;
  color: #374151;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

select:hover {
  border-color: #94a3b8;
}
</style>
