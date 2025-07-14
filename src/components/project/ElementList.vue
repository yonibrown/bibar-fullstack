<template>
  <sortable-cell
    v-for="(elm, dispElmIdx) in dispElements"
    :key="dispElmIdx"
    :idx="dispElmIdx"
    :dragData="dragData"
    :moveElement="moveElement"
    :dragStruct="dragStruct"
  >
    <element-box
      :element="elm"
      @closeElement="closeElement(elm)"
      :nextPos="ordElements.nextPos({ tab, idx: dispElmIdx })"
    ></element-box>
  </sortable-cell>
</template>

<script setup>
import ElementBox from "./ElementBox.vue";
import { ordering } from "../../general.js";
import { provide, computed, ref, onUpdated, inject } from "vue";

const props = defineProps(["elements", "tab"]);
const project = inject("project");
const elementList = inject("elementList");

const dispElements = computed(function () {
  return elementList.value[props.tab];
});

const ordElements = new ordering({
  getSize: function (attr) {
    return elementList.value[attr.tab].length;
  },
  getPosition: function (attr) {
    return +elementList.value[attr.tab][attr.idx].position;
  },
  setPosition: function (item, newPosition) {
    item.position = newPosition;
  },
  setTab: function (item, newTab) {
    item.tab = newTab;
  },
  getItem: function (attr) {
    return elementList.value[attr.tab][attr.idx];
  },
  commitChanges: saveElmList,
});

const dragStruct = ["dispElmId", "dispElmIdx", "dispElmTab"];
function dragData(dispElmIdx) {
  const elm = dispElements.value[dispElmIdx];

  const data = {
    dispElmId: elm.id,
    dispElmIdx,
    dispElmTab: props.tab,
  };

  if (elm.type == "link") {
    data.linkId = elm.attr.link_id;
  }
  if (elm.type == "parts") {
    data.resId = elm.attr.res;
  }
  return data;
}

function moveElement(dragData, dropIdx) {
  ordElements.move({
    source: {
      tab: +dragData.dispElmTab,
      idx: +dragData.dispElmIdx,
    },
    target: {
      tab: props.tab,
      idx: dropIdx,
    },
  });
}

const positionVersion = ref(0);
provide("positionVersion", positionVersion);
onUpdated(function () {
  positionVersion.value++;
});

function saveElmList() {
  elementList.value.forEach(function (tab,tabIdx) {
    const elmList = tab.map(function (elm, idx) {
      return {
        id: elm.id,
        position: idx + 1,
      };
    });
    project.value.storeElementList({
      elements: elmList,
      tab: tabIdx,
    });
  });
}

function closeElement(elm) {
  elm.position = -1;
  saveElmList();
}

function openNewElement() {
  project.value.openNewElement(props.tab, ordElements.prevPos(0));
}
defineExpose({ openNewElement });
</script>
