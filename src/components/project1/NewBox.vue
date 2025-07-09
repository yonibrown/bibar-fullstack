<template>
  <base-menu>
    <span>פעולה</span>
    <select v-model="action">
      <option value="new">חדש</option>
      <option value="open">פתח</option>
    </select>
    <span>סוג:</span>
    <select v-model="type">
      <option value="choose">בחר</option>
      <option
        v-for="typ in typeList"
        :value="typ.id"
        v-show="typ.openList || action == 'new'"
      >
        {{ typ.name }}
      </option>
    </select>
    <select v-if="displayObjectList" v-model="selectedObject">
      <option value="choose">בחר</option>
      <option v-for="obj in objects" :value="obj.id">{{ obj.name }}</option>
    </select>
    <input
      type="submit"
      value="פתח"
      @click="submitElement"
      :disabled="!displaySubmitElement"
    />
  </base-menu>
</template>

<script setup>
import { ref, computed, inject, watch } from "vue";

const action = ref("new");
const type = ref("choose");
const selectedObject = ref("choose");

const typeList = [
  {
    id: "bar",
    name: "ציר",
    openList: false,
  },
  {
    id: "text",
    name: "טקסט",
    openList: false,
  },
  {
    id: "parts",
    name: "רשימה",
    openList: true,
  },
  {
    id: "link",
    name: "הדגשות",
    openList: true,
  },
  {
    id: "note",
    name: "הערות",
    openList: false,
  },
];

watch(action, function () {
  type.value = "choose";
});

const displayObjectList = computed(function () {
  return action.value == "open" && type.value != "choose";
});

const displaySubmitElement = computed(function () {
  if (action.value == "new") {
    return type.value != "choose";
  }

  if (action.value == "open") {
    return type.value != "choose" && selectedObject.value != "choose";
  }
});

const researches = inject("researches");
const links = inject("links");
const objects = computed(function () {
  if (type.value == "parts") {
    return researches.value;
  }
  if (type.value == "link") {
    return links.value;
  }
  return [];
});

const createElement = inject("createElement");
function submitElement() {
  if (action.value == "new") {
    createElement({
      type: type.value,
    });
    return;
  }
  if (action.value == "open") {
    if (type.value == "parts") {
      createElement({
        type: type.value,
        res: selectedObject.value,
      });
      return;
    }
    if (type.value == "link") {
      createElement({
        type: type.value,
        link: selectedObject.value,
      });
      return;
    }
    console.log("not yet implemented");
    return;
  }
}
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

input[type="submit"] {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="submit"]:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input[type="submit"]:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
