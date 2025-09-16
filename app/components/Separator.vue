<template>
    <div class="flex p-2" :class="orientation === 'horizontal' ? 'w-full h-fit' : 'w-fit h-full'">
        <span class="bg-slate-200 dark:bg-slate-600 rounded-full" :class="orientation === 'horizontal' ? 'w-full h-1' : 'w-1 h-full'" />
    </div>
</template>

<script lang="ts" setup>
type OrientationType = 'horizontal' | 'vertical';
const props = defineProps<{
    orientation: OrientationType;
}>();
</script>
