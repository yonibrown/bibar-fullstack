<template>
  <form @submit.prevent="submitValue" class="menu" v-if="editing">
    <sequence-key
      :initialValue="fromKey"
      @changeValue="updateFrom"
      defaultValue="min"
      :referenceStyle="referenceStyle"
    ></sequence-key>
    <span v-if="displayOneVerse">
      <button class="disp-range" @click="displayRange">
        טווח
      </button>
    </span>
    <span v-else>
      -
      <sequence-key
        :initialValue="toKey"
        @changeValue="updateTo"
        defaultValue="max"
        :referenceStyle="referenceStyle"
      ></sequence-key>
    </span>
    <button>שמור</button>
  </form>
  <span
    v-else
    @dblclick="startEdit"
    :class="{ placeholder: fromName == '' }"
    class="title"
  >
    {{ title }}
  </span>
</template>

<script setup>
import SequenceKey from "../sequence/SequenceKey.vue";
import { computed, provide, ref, watch ,inject} from "vue";
import { biResearch } from "../../store/biResearch.js";

const props = defineProps(["part", "editable", "referenceStyle"]);
const emit = defineEmits(["changeValue"]);

const defaultIndex = { res: 1, col: 1, idx: 1 };
const defaultDivision = 972; /* Genesis,1,1 */

// console.log('props.part',props.part);

const fromPosition = computed(function () {
  if (props.part) {
    return props.part.src_from_position;
  }
});

const fromDivision = computed(function () {
  if (props.part) {
    return props.part.src_from_division;
  }
});

const toPosition = computed(function () {
  if (props.part) {
    return props.part.src_to_position;
  }
});

const toDivision = computed(function () {
  if (props.part) {
    return props.part.src_to_division;
  }
});

const seqIndex = computed(function () {
  if (props.part) {
    return {
      res: props.part.src_research,
      col: props.part.src_collection,
      idx: props.part.src_index || 1,
    };
  }
  return defaultIndex;
});
provide("seqIndex", seqIndex);

const displayOneVerse = ref(
  !props.part
    ? true
    : props.part.src_from_division
    ? props.part.src_from_division == props.part.src_to_division
    : props.part.src_from_position == props.part.src_to_position
);
function displayRange() {
  displayOneVerse.value = false;
}

const fromName = computed(function () {
  if (props.part) {
    if (props.part.src_from_key) {
      return props.part.src_from_key.map((key,idx) => key.nameArr[nameIdxArr.value[idx]]).join(" ");  
    }
    return props.part.src_from_name.replaceAll(",", " ");
  }
  return "";
});

const toName = computed(function () {
  if (props.part) {
    if (props.part.src_to_key) {
        return props.part.src_to_key.map((key,idx) => key.nameArr[nameIdxArr.value[idx]]).join(" ");
    }
    return props.part.src_to_name.replaceAll(",", " ");
  }
  return "";
});

var changedAttr = {};
function updateFrom(newVal) {
  changedAttr.src_from_division = newVal.id;
  changedAttr.src_from_name = newVal.name;
  changedAttr.src_from_word = 0;
}

function updateTo(newVal) {
  changedAttr.src_to_division = newVal.id;
  changedAttr.src_to_name = newVal.name;
  changedAttr.src_to_word = 999;
}

function submitValue() {
  let fromDiv = fromDivision.value;
  let toDiv = toDivision.value;
  if (changedAttr.src_from_division) {
    fromDiv = changedAttr.src_from_division;
  }
  if (changedAttr.src_to_division) {
    toDiv = changedAttr.src_to_division;
  }

  if (changedAttr.src_from_division && !toDiv) {
    toDiv = changedAttr.src_from_division;
    changedAttr.src_to_division = changedAttr.src_from_division;
    changedAttr.src_to_name = changedAttr.src_from_name;
    changedAttr.src_to_word = changedAttr.src_from_word;
  }

  if (fromDiv == toDiv) {
    displayOneVerse.value = true;
  }

  editing.value = false;
  emit("changeValue", changedAttr);
}

const styles = biResearch.getReferenceStyles();
const nameIdxArr = computed(function () {
  if (props.referenceStyle == -1) {
    return styles[0].nameIdxArr;
  }
  return styles[props.referenceStyle].nameIdxArr;
});

const title = computed(function () {
  // console.log('title', props.part);
  if (fromName.value != "") {
    if (displayOneVerse.value) {
      return fromName.value;
    }
    return fromName.value + " - " + toName.value;
  }
  if (props.editable) {
    return "בחר פסוק...";
  }
  return "";
});

const editing = ref(false);
const fromKey = ref(null);
const toKey = ref(null);
async function startEdit() {
  if (props.editable) {
    // from
    if (fromDivision.value) {
      fromKey.value = await biResearch.getKey(seqIndex.value, {
        division_id: fromDivision.value,
      });
    } else if (fromPosition.value) {
      fromKey.value = await biResearch.getKey(seqIndex.value, {
        position: fromPosition.value,
      });
    } else {
      fromKey.value = null;
    }

    // to
    if (toDivision.value) {
      toKey.value = await biResearch.getKey(seqIndex.value, {
        division_id: toDivision.value,
      });
    } else if (toPosition.value) {
      toKey.value = await biResearch.getKey(seqIndex.value, {
        position: toPosition.value,
      });
    } else {
      toKey.value = null;
    }

    changedAttr = {};
    editing.value = true;
  }
}

watch(
  computed(function () {
    return props.editable;
  }),
  function (newVal) {
    if (!newVal) {
      editing.value = false;
    }
  }
);
</script>

<style scoped>
.disp-range {
  margin-right: 5px;
}

.placeholder {
  color: rgb(196, 196, 196);
}
</style>
