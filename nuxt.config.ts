// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    app: { cdnURL: './', baseURL: './' },
    css: [ '~/assets/style.css' ],
    ssr: false,
    router: { options: { hashMode: true } },
    modules: [
      '@nuxt/ui',
      '@pinia/nuxt',
      '@nuxtjs/i18n',
    ],
    i18n: {
        locales: [
            { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr-FR.ts' },
            { code: 'en', iso: 'en-US', name: 'English', file: 'en-US.ts' },
        ],
        defaultLocale: 'en',
        strategy: 'no_prefix'
    },
    typescript: { shim: false },
})