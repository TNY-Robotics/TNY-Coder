<template>
    <div ref="el" class="flex grow"
        :class="axis === 'x' ? 'h-fit px-1.5 py-0.5 cursor-row-resize' : 'w-fit py-1.5 px-0.5 cursor-col-resize'">
        <div class="flex bg-neutral-200 dark:bg-neutral-900 rounded-full"
            :class="axis === 'x' ? ' h-1 w-full' : ' h-full w-1'" />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    axis: 'x' | 'y'
}>();

const el = ref<HTMLElement | null>(null);
onMounted(() => {
    if (!el.value) return;

    let isResizing = false;
    let lastDownPos = 0;
    el.value.addEventListener('mousedown', (e) => {
        isResizing = true;
        lastDownPos = props.axis === 'x' ? e.clientY : e.clientX;
        e.preventDefault();
        e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const offset = (props.axis === 'x' ? e.clientY : e.clientX) - lastDownPos;
        lastDownPos = props.axis === 'x' ? e.clientY : e.clientX;
        const parent = el.value?.parentElement;
        if (!parent) return;
        const first = parent.children[0] as HTMLElement;
        const second = parent.children[2] as HTMLElement;
        if (props.axis === 'x') {
            const bounds = parent.getBoundingClientRect();
            const percent = (e.clientY - bounds.top) / bounds.height * 100;
            if (percent < 5 || percent > 95) return;
            first.style.height = `${percent}%`;
            second.style.height = `${100 - percent}%`;
        } else {
            const bounds = parent.getBoundingClientRect();
            const percent = (e.clientX - bounds.left) / bounds.width * 100;
            if (percent < 5 || percent > 95) return;
            first.style.width = `${percent}%`;
            second.style.width = `${100 - percent}%`;
        }
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new Event('resize'));
    });

    window.addEventListener('mouseup', () => {
        isResizing = false;
    });
});

</script>

<style></style>