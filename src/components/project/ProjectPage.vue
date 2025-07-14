<template>
  <div>
    <section v-if="projectLoaded">
      <project-card
        :openNewElement="openNewElement"
        :copyToClipboard="copyToClipboard"
      >
      </project-card>
      <div class="tab-list">
        <tab-box
          v-for="tab in tabs"
          :key="tab.id"
          :tab="tab"
          :elements="elements"
          @removeTab="removeTab"
          ref="tabBoxRef"
        ></tab-box>
      </div>
    </section>
  </div>
</template>

<script setup>
import TabBox from "./TabBox.vue";
import ProjectCard from "./ProjectCard.vue";
import { ref, provide, computed } from "vue";
import { biProject } from "../../store/biProject.js";

const props = defineProps(["id"]);
const editMode = ref(true);
provide("editMode", editMode);

const projectLoaded = ref(false);
const project = ref(new biProject(props.id));
provide("project", project);

const tabs = computed(function () {
  return project.value.tabs;
});

const elements = computed(function () {
  return project.value.elements;
});
provide("elements", elements);

// Add elementList computed property
const elementList = computed(() => {
  // Get all tab ids
  const tabIds = project.value.tabs.map((tab) => tab.id);
  // For each tab id, filter elements that belong to that tab
  return tabIds.map((tabId) =>
    project.value.elements
      .filter((el) => el.tab === tabId)
      .filter(function (a) {
        return +a.position >= 0;
      })
      .sort(function (a, b) {
        return a.position - b.position;
      })
  );
});
provide("elementList", elementList);

const links = computed(function () {
  return project.value.links;
});
provide("links", links);

const researches = computed(function () {
  return project.value.researches;
});
provide("researches", researches);

const tabBoxRef = ref([]);

function openNewElement() {
  tabBoxRef.value[0].listRef.openNewElement(0);
}

project.value.loadProject().then(function () {
  projectLoaded.value = true;
});

function copyToClipboard() {}

function removeTab(tabId) {
  project.value.removeTab(tabId);
}
</script>

<style scoped>
.tab-list {
  display: flex;
  height: calc(100vh - 124px);
  flex-direction: row-reverse;
}
</style>
