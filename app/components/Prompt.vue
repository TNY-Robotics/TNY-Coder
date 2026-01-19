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

// Au lieu d'écraser window.prompt, on crée une fonction dédiée
const showBlocklyPrompt = (message: string, defaultValue: string, callback: (result: string | null) => void) => {
    modalTitle.value = message;
    inputValue.value = defaultValue;
    isOpen.value = true;
    
    // On garde le callback de Blockly en mémoire
    resolveCb = (val) => callback(val);
    rejectCb = () => callback(null); // Null annule l'opération dans Blockly
};

// On expose cette fonction au monde extérieur (pour le setup de Blockly)
defineExpose({ showBlocklyPrompt });

// Si tu préfères le global (plus simple pour setup Blockly ailleurs) :
onMounted(() => {
    (window as any).BlocklyPrompt = showBlocklyPrompt;
});

function validate() {
    isOpen.value = false;
    if (resolveCb) resolveCb(inputValue.value);
}
function cancel() {
    isOpen.value = false;
    if (rejectCb) rejectCb();
}
</script>

<style></style>