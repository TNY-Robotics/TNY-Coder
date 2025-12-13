<template>
    <div>
        <UModal :title="modalTitle" v-model:open="isOpen" :close="false" :dismissible="false">
            <template #body>
                <div class="flex flex-col space-y-4">
                    <UInput ref="textInput" v-model="inputValue" />
                </div>
            </template>
            <template #footer>
                <div class="flex justify-between w-full">
                    <UButton label="Annuler" variant="outline" color="neutral" @click="cancel" />
                    <UButton label="OK" variant="solid" color="primary" @click="validate" />
                </div>
            </template>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
const modalTitle = ref<string>('Title');
const isOpen = ref<boolean>(false);
const inputValue = ref<string>('');

const textInput = ref<any>(null);

let resolveCb: (value: string) => void;
let rejectCb: (reason?: any) => void;

watch(isOpen, (newVal) => {
    if (newVal) {
        nextTick(() => {
            const element = textInput?.value?.inputRef;
            element?.focus();
            element?.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') validate(); });
        });
    }
});

(window as any).prompt = (title?: string, defaultValue?: string): Promise<string> => {
    modalTitle.value = title || 'Title';
    isOpen.value = true;
    inputValue.value = defaultValue || '';

    return new Promise((resolve, reject) => {
        resolveCb = resolve;
        rejectCb = reject;
    });
}

function cancel() {
    isOpen.value = false;
    rejectCb('User cancelled the prompt');
}

function validate() {
    isOpen.value = false;
    resolveCb(inputValue.value);
}
</script>

<style></style>