<template>
  <div>
    <section v-if="projectLoaded">
      <project-card
        :openNewElement="openNewElement"
        :copyToClipboard="copyToClipboard"
      >
      </project-card>
      <div class="tab-list">
        <div
          class="tab"
          v-for="tab in tabs"
          :key="tab.id"
          :style="{ width: tab.width_pct + '%' }"
        >
          <div class="head">
            <span class="menu-buttons">
              <menu-button
                type="close"
                @click="removeTab(tab.id)"
              ></menu-button>
            </span>
          </div>
          <element-list
            :elements="elements"
            :tab="tab.id"
            ref="listRef"
          ></element-list>
        </div>
        <!-- <div class="tab">
          <element-list :elements="elements" ref="listRef"></element-list>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script setup>
import ElementList from "./ElementList.vue";
import ProjectCard from "./ProjectCard.vue";
import { ref, provide, computed } from "vue";
import { biProject } from "../../store/biProject.js";
import MenuButton from "../ui/MenuButton.vue";

const props = defineProps(["id"]);
const editMode = ref(true);
provide("editMode", editMode);

const projectLoaded = ref(false);
const project = ref(new biProject(props.id));
provide("project", project);

const tabs = computed(function () {
  return project.value.tabs;
});

// const tabWidth = computed(function () {
//   return (100/project.value.tabs.length)+'%';
// });

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

const listRef = ref([]);

function openNewElement() {
  listRef.value[0].openNewElement(0);
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
.menu-buttons {
  float: left;
}
.title {
  cursor: default;
  /* float: right; */
  font-weight: bold;
  font-size: 1.8em;
  margin: 0.83em 0;
}

.tab {
  border: solid 1px #b4b4b4;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.26);
  overflow-y: scroll;
  overflow-x: hidden;
  flex-grow: 1;
}

.tab-list {
  display: flex;
  height: calc(100vh - 124px);
  flex-direction: row-reverse;
}

.head {
  cursor: grab;
  padding: 0em 0em 1em 0em;
}
</style>
