<template>
    <div class="font-roboto h-[450vh] bg-weather-primary">
        <SiteNavigation />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import SiteNavigation from './components/SiteNavigation.vue'
export default {
    components: { SiteNavigation },
}
</script>
