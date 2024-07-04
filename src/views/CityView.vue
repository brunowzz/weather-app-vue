<template>
    <main>
        <Suspense>
            <AsyncCity />
            <template #fallback>
                <section class="container">
                    <p>Loading...</p>
                </section>
            </template>
        </Suspense>
    </main>
</template>

<script setup lang="ts">
import AsyncCity from '../components/AsyncCity.vue'
</script>
