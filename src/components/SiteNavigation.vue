<template>
    <header class="sticky top-0 z-50 bg-weather-primary shadow-lg">
        <nav
            class="container flex flex-col items-center gap-4 py-6 text-white sm:flex-row"
        >
            <router-link :to="{ name: 'home' }">
                <div class="flex flex-1 items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <h1 class="text-2xl">The Local Weather</h1>
                </div>
            </router-link>
            <div class="flex flex-1 justify-end gap-3">
                <i
                    class="fa-solid fa-circle-info cursor-pointer text-xl duration-150 hover:text-weather-secondary"
                    @click="toggleModal"
                >
                </i>
                <i
                    class="fa-solid fa-plus cursor-pointer text-xl duration-150 hover:text-weather-secondary"
                    v-if="route.query.preview"
                    @click="addCity"
                ></i>
            </div>
        </nav>

        <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
            <div class="text-black">
                <h1 class="mb-1 text-2xl">About:</h1>
                <p class="mb-4">
                    The Local Weather allows you to track the current and future
                    weather of cities of your choosing.
                </p>
                <h2 class="text-2xl">How it works:</h2>
                <ol class="mb-4 list-inside list-decimal">
                    <li>
                        Search for your city by entering the name into the
                        search bar.
                    </li>
                    <li>
                        Select a city within the results, this will take you to
                        the current weather for your selection.
                    </li>
                    <li>
                        Track the city by clicking on the "+" icon in the top
                        right. This will save the city to view at a later time
                        on the home page.
                    </li>
                </ol>

                <h2 class="text-2xl">Removing a city</h2>
                <p>
                    If you no longer wish to track a city, simply select the
                    city within the home page. At the bottom of the page, there
                    will be am option to delete the city.
                </p>
            </div>
        </BaseModal>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uid } from 'uid'
import { useRouter, useRoute } from 'vue-router'
import BaseModal from './BaseModal.vue'

const modalActive = ref<boolean>(false)
const savedCities = ref([])

const route = useRoute()
const router = useRouter()

const toggleModal = () => {
    modalActive.value = !modalActive.value
}

const addCity = () => {
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    }

    const locationObj = {
        id: uid(),
        state: route.params.state,
        city: route.params.city,
        coords: {
            lat: route.query.lat,
            lng: route.query.lng,
        },
    }

    savedCities.value.push(locationObj)
    localStorage.setItem('savedCities', JSON.stringify(savedCities.value))

    const query = Object.assign({}, route.query)
    delete query.preview
    query.id = locationObj.id
    router.replace({ query })
}
</script>
