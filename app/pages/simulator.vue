<template>
    <div class="flex flex-col grow h-screen w-screen overflow-hidden">
        <SimuHeader class="absolute" :model="robotModel" @model="robotSelectModalOpen = true" />
        <ThreeView />
        <UModal v-model:open="robotSelectModalOpen" title="Sélectionnez un modèle de robot" :dismissible="false" :close="false">
            <template #body>
                <div class="flex flex-col space-y-4">
                    <button v-for="model in models"
                        class="flex space-x-4 p-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-800
                               hover:border-primary hover:dark:border-primary hover:bg-primary/[0.05] hover:dark:bg-primary/[0.05] transition-colors"
                        @click="onRobotSelected(model)"
                    >
                        <div class="flex h-full justify-center items-center">
                            <img :src="model.image" alt="Robot Image" class="w-18 h-18 min-w-18 max-w-18 bg-neutral-200 dark:bg-neutral-800 rounded" />
                        </div>
                        <div class="flex flex-col justify-start text-start grow">
                            <h2 class="text-lg font-bold">{{ model.title }}</h2>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ model.description }}</p>
                        </div>
                    </button>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
import { TNY360 } from '~/assets/scripts/robots/TNY360';
import type { TNYRobot } from '~/assets/scripts/robots/TNYRobot';

const server = new TNYServer(5621);
server.on('disconnected', () => {
    close();
});

const robotModel = ref<TNYRobot>();

const robotSelectModalOpen = ref(false);
onMounted(() => {
    robotSelectModalOpen.value = true;
});

const models = ref([
    { obj: TNY360, title: 'TNY 360 - Robot chien', description: 'Un concentré de technologie compact pour comprendre, interagir et apprendre.', image: '/img/tny360.png' },
    // { name: 'TNY 90', description: 'Le modèle de robot TNY de deuxième génération avec des améliorations.', image: '/robots/tny_robot_v2.png' },
]);

function onRobotSelected(model: any) {
    robotModel.value = new model.obj();
    robotSelectModalOpen.value = false;

    server.clearHandlers();
    robotModel.value?.useTNYServer(server);
}

let lastTime = performance.now();
function update() {
    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    robotModel.value?.update(deltaTime);
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

</script>

<style></style>