import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"

const app = createApp(App)

app.use(VNetworkGraph)
app.mount("#app")