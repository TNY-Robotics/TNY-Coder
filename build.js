// eslint-disable-next-line @typescript-eslint/no-var-requires
const builder = require('electron-builder');
const Platform = builder.Platform;

/** @type {import('electron-builder').Configuration}*/
const options = {
    appId: 'com.tny-robotics.tny-coder',
    productName: 'tny-coder',
    asar: true,
    // protocols: {
    //     name: 'Your deeplink',
    //     // - Don't forget to set `MimeType: "x-scheme-handler/deeplink"` for `linux.desktop` entry!
    //     schemes: ['deeplink']
    // },
    // // - Electron auto-updater config
    // publish: [
    //     {
    //         provider: 'github',
    //         owner: 'your-github-username',
    //         repo: 'your-github-repo',
    //         releaseType: 'release'
    //     }
    // ],

    // "store" | "normal" | "maximum" - For testing builds, use 'store' to reduce build time significantly.
    compression: 'store',
    removePackageScripts: true,

    nodeGypRebuild: false,
    buildDependenciesFromSource: false,

    files: [
        'package.json',
        {
            from: ".output/electron",
            to: ".",
            filter: ["**/*"]
        },
        {
            from: ".output/public",
            to: "public",
            filter: ["**/*"]
        }
    ],
    directories: {
        output: 'release/${version}',
    },
    win: {
        // eslint-disable-next-line no-template-curly-in-string
        artifactName: '${productName}-Setup-${version}.${ext}',
        target: [
            {
                target: 'nsis',
                arch: ['x64', 'ia32'],
            },
        ],
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: true,
    },
    mac: {
        category: 'public.app-category.entertainment',
        hardenedRuntime: false,
        gatekeeperAssess: false,
        target: [
            {
                target: 'default',
                arch: ['x64', 'arm64'],
            },
        ],
    },
    linux: {
        maintainer: 'Your Name',
        desktop: {
            StartupNotify: 'false',
            Encoding: 'UTF-8',
            MimeType: 'x-scheme-handler/deeplink',
        },
        target: ['AppImage', 'rpm', 'deb'],
    }
};

const platform = 'WINDOWS' // "MAC" | "LINUX" | "WINDOWS" - Change this to build for other platforms
builder.build({
    targets: Platform[platform].createTarget(),
    config: options
}).then((result) => {
    console.log('----------------------------');
    console.log('Platform:', platform);
    console.log('Output:', JSON.stringify(result, null, 2));
});