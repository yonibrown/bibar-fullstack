<template>
  <div class="options-box">
    <div>סגנון הפניה:</div>
    <label for="bookStyle">ספר</label>
    <select v-model="bookStyle" name="bookStyle">
      <option v-for="opt in bookOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
    <label for="chapterStyle">פרק</label>
    <select v-model="chapterStyle" name="chapterStyle">
      <option v-for="opt in chapterOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
    <label for="verseStyle">פסוק</label>
    <select v-model="verseStyle" name="verseStyle">
      <option v-for="opt in verseOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const project = inject("project");

const bookStyle = ref(0);
const chapterStyle = ref(0);
const verseStyle = ref(0);

const bookOptions = [
  { value: 0, name: "מלכים א" },
  { value: 1, name: "מלכים א'" },
  { value: 2, name: 'מל"א' },
];
const chapterOptions = [
  { value: 0, name: "יח" },
  { value: 1, name: 'י"ח' },
];
const verseOptions = [
  { value: 0, name: "יב" },
  { value: 1, name: 'י"ב' },
  { value: 2, name: "12" },
];
</script>

<style scoped>
.options-box {
  padding: 10px;
}
label {
  margin: 5px;
}
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
