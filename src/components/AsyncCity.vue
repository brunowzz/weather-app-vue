<template>
    <div class="flex flex-1 flex-col items-center">
        <div
            v-if="route.query.preview"
            class="w-full bg-weather-secondary p-4 text-center text-white"
        >
            <p>
                You are currently previewing this city, click the "+" icon to
                start tracking this city.
            </p>
        </div>
        <div class="flex flex-col items-center py-12 text-white">
            <h1 class="mb-2 text-4xl">{{ route.params.city }}</h1>
            <p class="mb-12 text-sm" v-if="dayMonth && hour">
                {{ dayMonth }},
                {{ hour }}
            </p>
            <p class="mb-8 text-8xl">
                {{ Math.round(weatherData.current.temp) }}&deg;
            </p>
            <p>
                Feels like
                {{ Math.round(weatherData.current.feels_like) }} &deg;
            </p>
            <p class="capitalize">
                {{ weatherData.current.weather[0].description }}
            </p>
            <img
                class="h-auto w-[150px]"
                :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
                alt=""
            />
        </div>

        <hr class="w-full border border-white border-opacity-10" />

        <div class="w-full max-w-screen-md py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">Hourly Weather</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div
                        v-for="hourData in weatherData.hourly"
                        :key="hourData.dt"
                        class="flex flex-col items-center gap-4"
                    >
                        <p class="text-md whitespace-nowrap">
                            {{
                                new Date(
                                    hourData.currentTime
                                ).toLocaleTimeString('en-us', {
                                    hour: 'numeric',
                                })
                            }}
                        </p>
                        <img
                            class="h-[50px] w-auto object-cover"
                            :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
                            alt=""
                        />
                        <p class="text-xl">
                            {{ Math.round(hourData.temp) }}&deg;
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="w-full border border-white border-opacity-10" />

        <div class="w-full max-w-screen-md py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">7 Day Forecast</h2>
                <div
                    v-for="day in weatherData.daily"
                    :key="day.dt"
                    class="flex items-center"
                >
                    <p class="flex-1">
                        {{
                            new Date(day.dt * 1000).toLocaleDateString(
                                'en-us',
                                {
                                    weekday: 'long',
                                }
                            )
                        }}
                    </p>
                    <img
                        class="h-[50px] w-[50px] object-cover"
                        :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                        alt=""
                    />
                    <div class="flex flex-1 justify-end gap-2">
                        <p>H: {{ Math.round(day.temp.max) }}</p>
                        <p>L: {{ Math.round(day.temp.min) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="flex cursor-pointer items-center gap-2 py-12 text-white duration-150 hover:text-red-500"
            @click="removeCity"
        >
            <i class="fa-solid fa-trash"></i>
            <p>Remove City</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const dayMonth = ref<null | string>(null)
const hour = ref<null | string>(null)

const getWeatherData = async () => {
    try {
        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=${import.meta.env.VITE_API_OPENWEATHER_KEY}&units=metric`
        )

        const localOffset = new Date().getTimezoneOffset() * 60000
        const utc = weatherData.data.current.dt * 1000 + localOffset
        weatherData.data.currentTime =
            utc + 1000 * weatherData.data.timezone_offset

        weatherData.data.hourly.forEach((hour) => {
            const utc = hour.dt * 1000 + localOffset
            hour.currentTime = utc + 1000 * weatherData.data.timezone_offset
        })

        return weatherData.data
    } catch (err) {
        console.log(err)
    }
}

const weatherData = await getWeatherData()

dayMonth.value = new Date(weatherData.currentTime).toLocaleDateString('en-us', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
})

hour.value = new Date(weatherData.currentTime).toLocaleTimeString('en-us', {
    timeStyle: 'short',
})

const removeCity = () => {
    const cities = JSON.parse(localStorage.getItem('savedCities'))
    const updatedCities = cities.filter((city) => city.id !== route.query.id)
    localStorage.setItem('savedCities', JSON.stringify(updatedCities))
    router.push({
        name: 'home',
    })
}
</script>
