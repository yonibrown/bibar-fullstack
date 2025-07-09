<template>
  <select v-model="selected" v-show="divisions.length > 0">
    <option v-for="div in divisions" :value="div.id">
      {{ div.nameArr[nameIdx] }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, computed } from "vue";

const props = defineProps(["keyLvl", "nameIdx", "blanlable"]);
const emit = defineEmits(["changeKeyLevel"]);

const divisions = computed(function () {
  const options = [];
  if (props.blanlable) {
    options.push({
      id: -999,
      name: "בחר...",
      nameArr: ["בחר...", "בחר...", "בחר..."],
    });
  }

  return options.concat(props.keyLvl.divisions);
});

const injectedSelectedDiv = computed(function () {
  return props.keyLvl.selected_div;
});
var injectedChange = false;

// initial value for 'selected'
const selected = ref(injectedSelectedDiv.value);

watch(injectedSelectedDiv, (newVal) => {
  if (selected.value != newVal) {
    injectedChange = true;
    selected.value = newVal;
  }
});

watch(selected, (newVal) => {
  if (injectedChange) {
    injectedChange = false;
  } else {
    emit("changeKeyLevel", newVal);
  }
});
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
