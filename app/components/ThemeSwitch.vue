<template>
    <div class="flex w-fit h-fit">
        <USelect :icon="themeIcon" v-model="$colorMode.preference" :items="themeOptions" /> 
    </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n();
const colorMode = useColorMode();

const themeIcon = computed(() => {
    switch (colorMode.preference) {
        case 'dark': return 'i-heroicons-moon';
        case 'light': return 'i-heroicons-sun';
        default: return 'i-heroicons-paint-brush';
    }
});

const themeOptions = ref([
    { value: 'system', label: t('theme.auto') },
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') }
]);

watch(() => locale.value, () => {
    themeOptions.value = [
        { value: 'system', label: t('theme.auto') },
        { value: 'light', label: t('theme.light') },
        { value: 'dark', label: t('theme.dark') }
    ];
});

</script>