<template>
  <base-droppable
    :drop="addToLink"
    :dragStruct="['linkId', 'resId']"
    :dragEnter="enterLinksMenu"
    :dragLeave="leaveLinksMenu"
  >
    <base-menu :hilightMenu="hilightMenu">
      <span>{{ title }}:</span>
      <links-menu-obj
        v-for="link in links"
        :key="link.id"
        :link="link"
      ></links-menu-obj>
      <select v-model="action">
        <option value="choose">הוסף...</option>
        <option v-for="res in otherResearches" value="res.id">{{ res.name }}</option>
      </select>
    </base-menu>
  </base-droppable>
</template>

<script setup>
import { inject, ref, computed } from "vue";
import LinksMenuObj from "./LinksMenuObj.vue";
import { biLink } from "../../store/biLink.js";

const props = defineProps(["title"]);

const project = inject("project");
const element = inject("element");

const links = inject("links");
const hilightMenu = ref(false);

function enterLinksMenu() {
  hilightMenu.value = true;
}
function leaveLinksMenu() {
  hilightMenu.value = false;
}
function addToLink(dragData) {
  const linkId = +dragData.linkId;
  if (linkId != 0) {
    const link = project.value.getLink({ id: linkId });
    link.addElementToLink(element.value.id);
    return;
  }

  const resId = +dragData.resId;
  if (resId != 0) {
    const link = project.value.getLink({ res: resId });
    if (link) {
      link.addElementToLink(element.value.id);
    } else {
      biLink.createLink({
        researchId: resId,
        element: element.value,
      });
    }
    return;
  }
}

const researches = inject("researches");

const otherResearches = computed(() => {
  // Collect IDs that are already in links
  const linkResearchIds = links.value?.map(l => l.research_id) || [];
  console.log('linkResearchIds',linkResearchIds);
  console.log('links.value',links.value);
  console.log('researches.value',researches.value);
  console.log(researches.value);
  // Return researches which are not in those IDs
  return researches.value?.filter(res => !linkResearchIds.includes(res.id)) || [];
});

const action = ref("choose");
</script>

<style scoped>
.menu * {
  margin-left: 3px;
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
