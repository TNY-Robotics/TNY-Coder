<template>
    <div class="flex p-1.5 w-full h-fit">
        <div class="flex rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-neutral-200 dark:border-neutral-900 w-full h-fit p-2">
        <div class="flex w-fit items-center pr-4">
            <h1 class="text-xl font-extrabold whitespace-nowrap px-1">TNY Coder</h1>
        </div>
        <div class="flex grow w-full h-full items-center">
            <UDropdownMenu :items="fileItems">
                <UButton label="Fichier" variant="soft" color="neutral" />
            </UDropdownMenu>
        </div>
        <div class="flex w-fit items-center">
            <UButton v-if="TNYRemote.getRef().value" label="Déconnecter" icon="i-lucide-link-2-off" @click="onDisconnectClicked" />
            <UModal v-model:open="modalOpen" title="Connecter à un robot" description="Connecter votre editeur à un robot y exécuter votre code">
                <UButton v-if="!TNYRemote.getRef().value" label="Connecter" icon="i-lucide-link-2" />

                <template #body="{ close }">
                    <div class="space-y-8">
                        <div class="space-y-2">
                            <div class="flex flex-col space-y-2">
                                <h2>Entrez l'adresse de votre robot ci-dessous</h2>
                                <UButton label="Comment trouver l'adresse ?" class="w-fit p-0" size="sm" variant="link" href="https://docs.tny-robotics.com/TNY-360/usage/configuration/connecting/" target="_blank" />
                            </div>
                            <div class="flex py-2 justify-center items-center w-full h-fit space-x-2">
                                <input ref="ip1" type="text" class="w-12 text-center border border-neutral-300 dark:border-neutral-700 rounded-md pt-0.5" /> <p>.</p>
                                <input ref="ip2" type="text" class="w-12 text-center border border-neutral-300 dark:border-neutral-700 rounded-md pt-0.5" /> <p>.</p>
                                <input ref="ip3" type="text" class="w-12 text-center border border-neutral-300 dark:border-neutral-700 rounded-md pt-0.5" /> <p>.</p>
                                <input ref="ip4" type="text" class="w-12 text-center border border-neutral-300 dark:border-neutral-700 rounded-md pt-0.5" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex flex-col space-y-2">
                                <h2>Vous n'avez pas de robot ?</h2>
                                <UButton label="Utiliser le simulateur" class="w-fit p-0" size="sm" variant="link" @click="onSimulatorClicked(close)" icon="i-lucide-arrow-right" trailing :disabled="isConnectLoading || isConnected" :loading="isSimulatorLoading" />
                                <UButton label="Commander un robot" class="w-fit p-0" size="sm" variant="link" href="https://tny-robotics.com/robots" target="_blank" icon="i-lucide-square-arrow-out-up-right" trailing />
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer="{ close }">
                    <UButton label="Annuler" color="neutral" variant="outline" @click="close" class="mr-auto" />
                    <UButton label="Se connecter" icon="i-lucide-arrow-right" trailing :loading="isConnectLoading" :disabled="isSimulatorLoading || isConnected" @click="onConnectClicked(close)" />
                </template>
            </UModal>
        </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const toast = useToast();

const fileItems = ref([
  [
    {
      label: 'Nouveau',
      icon: 'i-lucide-file-plus',
    },
    {
      label: 'Charger',
      icon: 'i-lucide-upload',
    },
    {
      label: 'Sauvegarder',
      icon: 'i-lucide-save',
    },
    {
      label: 'Paramètres',
      icon: 'i-lucide-cog',
    }
  ]
]);

const isConnectLoading = ref(false);
const isSimulatorLoading = ref(false);
const isConnected = ref(false);
const modalOpen = ref(false);

function onConnectClicked(onSuccess: ()=>void) {
    isConnectLoading.value = true;
    const ip = getIP();
    console.log('Connecting to', ip);
    if (!ip) {
        toast.add({
            title: 'Adresse IP invalide',
            description: 'L\'adresse IP entrée est invalide, veuillez vérifier et réessayer.',
            icon: 'i-lucide-alert-circle',
            color: 'error'
        });
        isConnectLoading.value = false;
        return;
    }

    const remote = new TNYRemote('ws://'+ip+':5621');
    remote.on('connected', () => {
        toast.add({
            title: 'Connecté au robot',
            description: 'L\'éditeur est maintenant connecté au robot, tout est prêt.',
            icon: 'i-lucide-monitor-check',
            color: 'success'
        });
        isConnectLoading.value = false;
        isConnected.value = true;
        onSuccess();
    });
    remote.on('disconnected', () => {
        toast.add({
            title: 'Déconnecté du robot',
            description: 'L\'éditeur a été déconnecté du robot.',
            icon: 'i-lucide-monitor-off',
            color: 'warning'
        });
        isConnectLoading.value = false;
        isConnected.value = false;
    });
    remote.on('error', () => {
        toast.add({
            title: 'Connexion au robot impossible',
            description: 'Le robot ne semble pas répondre. Vérifiez que l\'adresse IP est correcte et que le robot est allumé et connecté au même réseau que cet ordinateur.',
            icon: 'i-lucide-screen-share-off',
            color: 'error',
            duration: 10000
        });
        isConnectLoading.value = false;
        isConnected.value = false;
    });
}

function onDisconnectClicked() {
    TNYRemote.getInstance()?.close();
}

function onModalOpenChange(open: boolean) {
    const ips = [ip1, ip2, ip3, ip4];
    ips.forEach(ip => {
        ip.value?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                onConnectClicked(() => {});
            }
            if (e.key === '.' || e.key === 'ArrowRight') {
                if (ip.value) {
                    const next = ips[ips.indexOf(ip)+1];
                    next?.value?.focus();
                    next?.value?.select();
                }
                e.preventDefault();
            } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
                if (ip.value && ip.value.selectionStart === 0 && ip.value.selectionEnd === 0) {
                    const prev = ips[ips.indexOf(ip)-1];
                    prev?.value?.focus();
                    prev?.value?.setSelectionRange(prev.value.value.length, prev.value.value.length);
                    e.preventDefault();
                }
            }
        });
    });
}
watch(modalOpen, (newVal) => { setTimeout(() => onModalOpenChange(newVal), 100); });

const ip1 = ref<HTMLInputElement|null>(null);
const ip2 = ref<HTMLInputElement|null>(null);
const ip3 = ref<HTMLInputElement|null>(null);
const ip4 = ref<HTMLInputElement|null>(null);
function getIP() {
    if (!ip1.value || !ip2.value || !ip3.value || !ip4.value) {
        return null;
    }
    if (!ip1.value.value || !ip2.value.value || !ip3.value.value || !ip4.value.value) {
        return null;
    }
    if (!(ip1.value.value.length > 0) || !(ip2.value.value.length > 0) || !(ip3.value.value.length > 0) || !(ip4.value.value.length > 0)) {
        return null;
    }
    return ip1.value.value+'.'+ip2.value.value+'.'+ip3.value.value+'.'+ip4.value.value;
}

function onSimulatorClicked(onSuccess: ()=>void) {
    isSimulatorLoading.value = true;
    if (!window.ipc) {
        console.error('IPC is not available');
        return;
    }

    const popupTimeout = setTimeout(() => {
        toast.add({
            title: 'Erreur de création du simulateur',
            description: 'Le simulateur semble ne pas pouvoir se lancer. Veuillez réessayer plus tard.',
            icon: 'i-lucide-screen-share-off',
            color: 'error'
        });
        isSimulatorLoading.value = false;
    }, 10000);

    const simulatorSpawnPromise = window.ipc.invoke('open-simulator', {});
    simulatorSpawnPromise.then(() => {
        clearTimeout(popupTimeout);
        const remoteTimeout = setTimeout(() => {
            toast.add({
                title: 'Connexion impossible au simulateur',
                description: 'Le simulateur ne semble pas répondre. Essayez de fermer la fenêtre du simulateur et recommencez.',
                icon: 'i-lucide-screen-share-off',
                color: 'warning'
            });
            isSimulatorLoading.value = false;
        }, 10000);

        const remote = new TNYRemote('ws://localhost:5621');
        remote.on('connected', () => {
            clearTimeout(remoteTimeout);
            toast.add({
                title: 'Connecté au simulateur',
                description: 'L\'éditeur est maintenant connecté au simulateur, tout est prêt.',
                icon: 'i-lucide-monitor-check',
                color: 'success'
            });
            isSimulatorLoading.value = false;
            isConnected.value = true;
            onSuccess();
        });

        remote.on('disconnected', () => {
            clearTimeout(popupTimeout);
            toast.add({
                title: 'Déconnecté du simulateur',
                description: 'L\'éditeur a été déconnecté du simulateur.',
                icon: 'i-lucide-monitor-off',
                color: 'warning'
            });
            isSimulatorLoading.value = false;
            isConnected.value = false;
        });
    });
    // if (!simulatorSpawnPromise) {
    //     toast.add({
    //         title: 'Impossible de lancer le simulateur',
    //         description: 'Désolé, un problème s\'est produit lors du lancement du simulateur. Vérifiez que les popups sont autorisées.',
    //         icon: 'i-lucide-circle-slash',
    //         color: 'error'
    //     });
    //     isSimulatorLoading.value = false;
    //     return;
    // }

    // TODO : callback if invoke timeout
}
</script>

<style>
</style>