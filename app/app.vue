<template>
    <div>
        <NuxtRouteAnnouncer />
        <UApp :toaster="{ position: 'bottom-center' }">
            <NuxtPage />
        </UApp>
    </div>
</template>

<script lang="ts" setup>
declare global {
  interface Window {
    ipc?: {
      send: (channel: string, data: any) => void;
      invoke: (channel: string, data: any) => Promise<any>;
      on: (channel: string, func: (_event: any, ...args: any[]) => void) => void;
    }
  }
}
</script>