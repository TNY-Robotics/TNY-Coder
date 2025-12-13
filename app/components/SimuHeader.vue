<template>
    <div class="flex p-1.5 w-full h-fit">
        <div class="flex rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-neutral-200 dark:border-neutral-900 w-full h-fit p-2">
            <div class="flex w-fit items-center pr-4">
                <h1 class="text-xl font-extrabold whitespace-nowrap px-1">TNY Simulator</h1>
            </div>
            <div class="flex grow w-full h-full items-center">
                <UDropdownMenu :items="addMenuItems">
                    <UButton label="Ajouter" variant="subtle" color="neutral" icon="i-lucide-plus" />
                </UDropdownMenu>
            </div>
            <div class="flex w-fit items-center pl-4">
                <UButton :label="model?.name" variant="outline" color="primary" icon="i-lucide-bot" @click="emit('model')" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const toast = useToast();

defineProps<{
    model: any;
}>();

const emit = defineEmits<{
    model: any;
}>();

const addMenuItems = ref([
  [
    {
        label: 'Cube',
        icon: 'i-lucide-box',
        onSelect: (e: Event) => {

        }
    },
    {
        label: 'Sphère',
        icon: 'i-lucide-globe',
        onSelect: (e: Event) => {
            
        }
    },
    {
        label: 'Cone',
        icon: 'i-lucide-cone',
        onSelect: (e: Event) => {
            
        }
    },
  ]
]);
</script>

<style>
</style>