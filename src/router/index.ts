import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CityView from '../views/CityView.vue'

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/weather/:state/:city', name: 'cityView', component: CityView },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
