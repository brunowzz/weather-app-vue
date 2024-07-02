<template>
    <main class="container text-white">
        <div class="relative pt-4">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Search for a city or state"
                class="w-full border-b bg-transparent px-1 py-2 focus:border-weather-secondary focus:shadow-[0px_1px_0_0_#004e71] focus:outline-none"
                @input="getSearchResults"
            />
            <ul
                v-if="mapBoxSearchResults"
                class="absolute top-[66px] w-full bg-weather-secondary px-2 py-2 text-white shadow-md"
            >
                <li
                    v-for="searchResult in mapBoxSearchResults"
                    :key="searchResult.id"
                    class="cursor-pointer py-2"
                >
                    {{ searchResult.place_name }}
                </li>
            </ul>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface MapBoxFeature {
    id: string
    place_name: string
    center: [number, number]
    bbox: [number, number, number, number]
    geometry: {
        type: string
        coordinates: [number, number]
    }
}

const searchQuery = ref<string | null>(null)
const queryTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const mapBoxSearchResults = ref<MapBoxFeature[] | null>(null)

const getSearchResults = () => {
    if (queryTimeout.value) {
        clearTimeout(queryTimeout.value)
    }

    queryTimeout.value = setTimeout(async () => {
        if (searchQuery.value) {
            try {
                const { data } = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${import.meta.env.VITE_API_MAPBOX_KEY}&types=place`
                )

                mapBoxSearchResults.value = data.features
            } catch (error) {
                console.error('Error fetching search results:', error)
                mapBoxSearchResults.value = null
            }
        } else {
            mapBoxSearchResults.value = null
        }
    }, 500)
}
</script>
