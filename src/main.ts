import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

import olMap from "@/components/vue3-openlayers/index.js";
app.use(olMap);

app.mount("#app");
