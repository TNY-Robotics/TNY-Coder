<template>
    <div class="flex grow min-h-full h-fit w-full justify-center items-center">
        <div class="flex flex-col max-w-[32em]">
            <div class="flex flex-col p-8 space-y-8 justify-center items-center">
                <h1 class="text-2xl font-bold text-center whitespace-nowrap text-primary"> {{ $t('index.title') }} </h1>
                <p class="text-center whitespace-nowrap"> {{ $t('index.subtitle') }} </p>
                <div
                    class="flex rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 px-2 py-1 space-x-2 w-fit">
                    <p class="text-center whitespace-nowrap"> {{ $t('index.isElectron') }} </p>
                    <p :class="electron.isElectron ? 'text-green-500' : 'text-red-500'"> {{ $t('index.' +electron.isElectron) }} </p>
                </div>
            </div>
            <div class="flex w-full justify-between items-center p-2">
                <ThemeSwitch />
                <LangSwitch />
            </div>
            <Separator orientation="horizontal" />
            <div class="flex w-full justify-center items-center p-2">
                <UButton variant="link" to="https://github.com/FurWaz" target="_blank" icon="i-heroicons-arrow-top-right-on-square" trailing>
                    {{ $t('index.author') }}
                </UButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const electron = useElectron();
</script>

<style></style>