<template>
  <Panel toggleable>
    <template #header>
      <div class="flex items-center text-primary w-72">
        <span :class="props.icon"></span>
        <span class="flex-grow font-bold ml-2">{{ props.header }}</span>
        <Button class="mr-4 h-8" icon="pi pi-download" rounde text></Button>
      </div>
    </template>
    <div class="m-auto h-80 w-80">
      <img v-if="props.src" :src="props.src" class="object-contain" preview />
      <div
        v-else
        class="flex flex-col justify-center gap-4 h-80 w-80 bg-gray-100"
      >
        <span class="pi pi-camera text-center" style="font-size: 2rem" />
        <span class="text-lg text-center">沒有圖像</span>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
// Primevue Components
import Panel from "primevue/panel";
import Button from "primevue/button";
// import Image from "primevue/image";

const props = defineProps({
  header: { type: String, default: "圖片" },
  icon: { type: String, default: "pi pi-image" },
  src: { type: String, default: "" },
});
</script>
