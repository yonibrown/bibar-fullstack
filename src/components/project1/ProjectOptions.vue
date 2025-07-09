<template>
  <div class="options-box">
    <div>סגנון הפניה:</div>
    <label for="bookStyle">ספר</label>
    <select v-model="bookStyle" name="bookStyle" @change="saveReferenceStyles">
      <option v-for="opt in bookOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
    <label for="chapterStyle">פרק</label>
    <select v-model="chapterStyle" name="chapterStyle" @change="saveReferenceStyles">
      <option v-for="opt in chapterOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
    <label for="verseStyle">פסוק</label>
    <select v-model="verseStyle" name="verseStyle" @change="saveReferenceStyles">
      <option v-for="opt in verseOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, watch, onMounted } from "vue";

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

// Load reference styles from project when component mounts
onMounted(() => {
  loadReferenceStyles();
});

// Watch for project changes and reload reference styles
watch(() => project.value.attr, () => {
  loadReferenceStyles();
}, { deep: true });

function loadReferenceStyles() {
  if (project.value && project.value.attr) {
    bookStyle.value = project.value.attr.bookStyle || 0;
    chapterStyle.value = project.value.attr.chapterStyle || 0;
    verseStyle.value = project.value.attr.verseStyle || 0;
  }
}

function saveReferenceStyles() {
  if (project.value) {
    project.value.changeAttr({
      book_style: bookStyle.value,
      chapter_style: chapterStyle.value,
      verse_style: verseStyle.value
    });
  }
}
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
