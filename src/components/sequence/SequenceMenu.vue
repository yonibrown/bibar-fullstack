<template>
  <base-menu>
    <span>טקסט:</span>
    <select>
      <option value="1_1" selected="selected">נוסח המסורה</option>
    </select>
    <span>מפתח:</span>
    <select>
      <option value="1" selected="selected">חלוקה לפרקים</option>
    </select>
    <!-- <input type="submit" :value="filterText" @click="toggleFilter"/> -->
    <span style="display: inline" v-show="displayFilter">
      <span>מ-</span>
      <sequence-key
        :initialValue="initialFromKey"
        @changeValue="(newVal) => updateAttr('from_div', newVal.id)"
        defaultValue="min"
        ref="fromRef"
        referenceStyle="1"
      ></sequence-key>
      <span>עד</span>
      <sequence-key
        :initialValue="initialToKey"
        @changeValue="(newVal) => updateAttr('to_div', newVal.id)"
        defaultValue="max"
        ref="toRef"
        referenceStyle="1"
      ></sequence-key>
      <input
        v-if="enableWholeText"
        type="submit"
        value="כל הטקסט"
        @click="removeFilter"
      />
    </span>
    <span v-if="displayScale">
      <span>חלוקה:</span>
      <sequence-scale
        :initialValue="initialScaleLevel"
        @changeValue="(newVal) => updateAttr('seq_level', newVal)"
        defaultValue="min"
        ref="scaleRef"
      ></sequence-scale>
    </span>
    <span>מספור פסוקים:</span>
    <select v-model="numbering">
      <option value="letters">אותיות</option>
      <option value="numbers">מספרים</option>
    </select>
    <input
      type="submit"
      value="החל"
      @click="submitChanges"
      :disabled="!hasChanges"
    />
  </base-menu>
</template>

<script setup>
import SequenceKey from "./SequenceKey.vue";
import SequenceScale from "./SequenceScale.vue";

import { computed, provide, inject, ref, watch } from "vue";

const props = defineProps(["displayScale", "enableWholeText"]);

const elementAttr = inject("elementAttr");
const changeAttr = inject("changeAttr");

const fromRef = ref();
const toRef = ref();
const scaleRef = ref();

const seqIndex = computed(function () {
  return {
    res: elementAttr.value.research_id,
    col: elementAttr.value.collection_id,
    idx: elementAttr.value.seq_index,
  };
});
provide("seqIndex", seqIndex);

var changedAttr = {};
const hasChanges = ref(false);

function updateAttr(attr, newVal) {
  hasChanges.value = true;
  changedAttr[attr] = newVal;

  if ((attr = "from_div")) {
    if (getSeqDiv("to") < newVal) {
      toRef.value.updateKey(fromRef.value.getKey());
      changedAttr["to_div"] = newVal;
    }
  }
}

async function submitChanges() {
  if (Object.keys(changedAttr).length == 0) {
    return;
  }

  const fromDiv = getSeqDiv("from");
  const toDiv = getSeqDiv("to");

  if (toDiv < fromDiv) {
    alert("טווח הפסוקים לא הגיוני");
    return;
  }

  if (!props.enableWholeText) {
    if (toDiv - fromDiv > 1000) {
      alert("לא ניתן להציג יותר מ-1000 פסוקים");
      // changedAttr['to_div'] = fromDiv + 1000;
      return;
    }
  }
  changeAttr(changedAttr);
  // if only scale changed, we can reload only the segments

  changedAttr = {};
  hasChanges.value = false;
}

function getSeqDiv(ident) {
  // ident can be 'from' or 'to'
  if (changedAttr[ident + "_div"] != null) {
    return +changedAttr[ident + "_div"];
  }

  const seqKey = elementAttr.value[ident + "_key"];
  return +seqKey[seqKey.length - 1].division_id;
}

const displayFilter = ref(true);
// function toggleFilter() {
//   displayFilter.value = !displayFilter.value;
// }
// const filterText = computed(function () {
//   return "מיקוד " + (displayFilter.value ? "<<" : ">>");
// });

const initialFromKey = computed(function () {
  return elementAttr.value.from_key;
});
const initialToKey = computed(function () {
  return elementAttr.value.to_key;
});
const initialScaleLevel = computed(function () {
  return elementAttr.value.seq_level;
});
function removeFilter() {
  fromRef.value.clear();
  toRef.value.clear();
  scaleRef.value.clear();
}

const numbering = ref(elementAttr.value.numbering);
watch(numbering, function (newVal) {
  changeAttr({ numbering: newVal });
});
</script>

<style scoped>
div * {
  margin-left: 6px;
}

/* Modern styling improvements */
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

span {
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9rem;
}
</style>
