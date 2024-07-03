<template>
    <div>
        <Suspense>
            <AsyncCity />
            <template #fallback>
                <p>Loading...</p>
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import AsyncCity from '../components/AsyncCity.vue'
</script>
