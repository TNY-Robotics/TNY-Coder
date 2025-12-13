<template>
    <UModal v-model:open="(model as boolean)" title="Paramètres" :dismissible="false">
        <template #body>
            <div class="space-y-4">
                <div class="flex space-x-8 justify-between w-full h-fit">
                    <div class="flex items-center">
                        <p> Langue </p>
                    </div>
                    <div class="flex items-center">
                        <LangSwitch />
                    </div>
                </div>
                <div class="flex space-x-8 justify-between w-full h-fit">
                    <div class="flex items-center">
                        <p> Thème </p>
                    </div>
                    <div class="flex items-center">
                        <ThemeSwitch />
                    </div>
                </div>
            </div>
        </template>
    </UModal>
</template>

<script lang="ts" setup>
const model = defineModel();
</script>

<style></style>