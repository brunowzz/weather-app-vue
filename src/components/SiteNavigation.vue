<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
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
                >
                </i>
                <i
                    class="fa-solid fa-plus cursor-pointer text-xl duration-150 hover:text-weather-secondary"
                ></i>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts"></script>
