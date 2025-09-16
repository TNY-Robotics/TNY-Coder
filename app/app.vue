<template>
    <div>
        <NuxtRouteAnnouncer />
        <UApp>
            <NuxtPage />
        </UApp>
    </div>
</template>

<script lang="ts" setup>
const electron = useElectron();
</script>