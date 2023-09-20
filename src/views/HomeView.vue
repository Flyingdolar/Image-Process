<template>
  <Toast />
  <Menubar :model="menuItems" class="fixed top-0 w-full bg-white z-50">
    <template #end>
      <Button class="h-9" label="繁體中文" icon="pi pi-globe" outlined />
    </template>
  </Menubar>
  <input
    type="file"
    ref="imgFile"
    id="imgInput"
    accept="image/*"
    class="hidden"
    @change="onFileChange"
  />
  <div class="p-8" />
  <!-- <div>{{ helloworld }}</div> -->
  <ScrollPanel class="top-20">
    <div class="flex gap-4 px-6 py-4">
      <ImageCard header="輸入圖像" :src="srcInput" />
      <ImageCard
        v-if="showRotate"
        icon="pi pi-sync"
        header="旋轉圖像"
        :src="srcRotate"
      />
      <ImageCard
        v-if="showHistogram"
        header="直方圖"
        icon="pi pi-chart-bar"
        :src="srcHistogram"
      />
    </div>
    <div class="flex gap-4 px-6 py-4"></div>
  </ScrollPanel>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

// Primevue Components
import Toast from "primevue/toast";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import ImageCard from "@/components/ImgCard.vue";
import ScrollPanel from "primevue/scrollpanel";

// Variables
const toast = useToast();
const imgFile = ref(null);

// eslint-disable-next-line
// const helloworld = eel.hello_world();

// Show/Hide Image Cards
const showRotate = ref(false);
const showHistogram = ref(false);

// Image Src
const srcInput = ref("");
const srcRotate = ref("");
const srcHistogram = ref("");

// Menu items
const menuItems = ref([
  {
    label: "檔案",
    icon: "pi pi-fw pi-file",
    items: [
      {
        label: "輸入圖像",
        icon: "pi pi-fw pi-plus",
        command: () => document.getElementById("imgInput")?.click(),
      },
      {
        label: "移除圖像",
        icon: "pi pi-fw pi-trash",
        command: () => onFileRemove(),
      },
      {
        separator: true,
      },
      {
        label: "導出結果",
        icon: "pi pi-fw pi-external-link",
      },
    ],
  },
  {
    label: "旋轉圖像",
    icon: "pi pi-sync",
    items: [
      {
        label: "右轉90度",
        icon: "pi pi-refresh",
        command: () => onRotate(1),
      },
      {
        label: "左轉90度",
        icon: "pi pi-undo",
        command: () => onRotate(0),
      },
    ],
  },
  {
    label: "繪製直方圖",
    icon: "pi pi-chart-bar",
  },
  {
    label: "生成雜訊",
    icon: "pi pi-qrcode",
    items: [
      {
        label: "高斯雜訊",
        icon: "pi pi-cloud",
      },
      {
        label: "椒鹽雜訊",
        icon: "pi pi-palette",
      },
    ],
  },
]);

function closeAll() {
  showRotate.value = false;
  showHistogram.value = false;
}

function cleanAll() {
  srcRotate.value = "";
  srcHistogram.value = "";
}

// Homework 0 : Image I/O
function onFileChange(e: any) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    srcInput.value = e.target?.result as string;
    closeAll(), cleanAll();
  };
}
function onFileRemove() {
  if (imgFile.value === null) return;
  imgFile.value.value = null;
  srcInput.value = "";
  closeAll(), cleanAll();
}

// Homework 1 : Rotate Image
function onRotate(direction: number) {
  if (srcInput.value === "") {
    toast.add({
      severity: "warn",
      summary: "找不到圖像",
      detail: "請先從檔案 -> 輸入圖像",
      life: 3000,
    });
    return;
  }

  closeAll();
  showRotate.value = true;

  // Send Image to Python eel
  // eslint-disable-next-line
  // eel.rotate_image(
  //   srcInput.value,
  //   direction
  // )((img: string) => {
  //   srcRotate.value = img;
  //   console.log(img);
  // });
}
</script>
