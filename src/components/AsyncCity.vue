<template>
    <div></div>
</template>

<script setup>
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const getWeatherData = async () => {
    try {
        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=${import.meta.env.VITE_API_OPENWEATHER_KEY}&units=imperial`
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
</script>
