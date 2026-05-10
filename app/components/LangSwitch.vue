<template>
    <div class="flex w-fit h-fit">
        <USelect icon="i-heroicons-globe-alt" :loading="isLoading" :items="localesOptions" :model-value="locale" @update:model-value="onChange" /> 
    </div>
</template>

<script lang="ts" setup>
const { t, locale, locales, setLocale } = useI18n();

const localesOptions = computed(() => locales.value.map((locale) => ({
    value: locale.code,
    label: t(`language.${locale.code}`)
})));

const isLoading = ref(false);
async function onChange(value: string) {
    isLoading.value = true;
    await setLocale(locales.value.find((l) => l.code === value)?.code || 'en');
    isLoading.value = false;
}

</script>