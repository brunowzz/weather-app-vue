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
                class="absolute top-[66px] w-full bg-weather-secondary px-1 py-2 text-white shadow-md"
                v-if="mapBoxSearchResults"
            >
                <p class="py-2" v-if="searchError">
                    Sorry, something went wrong, please try again.
                </p>
                <p
                    class="py-2"
                    v-if="!searchError && mapBoxSearchResults.length === 0"
                >
                    No results match your query, try a different term.
                </p>
                <template v-else>
                    <li
                        v-for="searchResult in mapBoxSearchResults"
                        :key="searchResult.id"
                        @click="previewCity(searchResult)"
                        class="cursor-pointer py-2"
                    >
                        {{ searchResult.place_name }}
                    </li>
                </template>
            </ul>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
const searchError = ref<boolean>(false)

const { push } = useRouter()

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
                searchError.value = true
            }
        }
    }, 500)
}

const previewCity = (searchResult) => {
    const [city, state] = searchResult.place_name.split(', ')
    push({
        name: 'cityView',
        params: { state, city },
        query: {
            lat: searchResult.geometry.coordinates[1],
            lng: searchResult.geometry.coordinates[0],
            preview: true,
        },
    })
}
</script>
