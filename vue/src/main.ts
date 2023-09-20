import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import "windi.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.use(router).mount("#app");
