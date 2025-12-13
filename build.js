// eslint-disable-next-line @typescript-eslint/no-var-requires
const builder = require('electron-builder');
const Platform = builder.Platform;

/** @type {import('electron-builder').Configuration}*/
const options = {
    appId: 'com.tny-robotics.tny-coder',
    productName: 'TNY Coder',
    asar: true,
    // protocols: {
    //     name: 'Your deeplink',
    //     // - Don't forget to set `MimeType: "x-scheme-handler/deeplink"` for `linux.desktop` entry!
    //     schemes: ['deeplink']
    // },
    // // - Electron auto-updater config
    publish: [
        {
            provider: 'github',
            owner: 'TNY-Robotics',
            repo: 'TNY-Coder',
            releaseType: 'release'
        }
    ],

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
        artifactName: '${productName}-Setup-${version}-win.${ext}',
        target: [
            {
                target: 'nsis',
                arch: ['x64'],
            },
        ],
        icon: 'build/icon.png',
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'TNY Coder',
    },
    mac: {
        category: 'public.app-category.developer-tools',
        artifactName: '${productName}-Setup-${version}-mac.${ext}',
        hardenedRuntime: false,
        gatekeeperAssess: false,
        target: [
            {
                target: 'default',
                arch: ['x64', 'arm64'],
            },
        ],
        icon: 'build/icon.png',
    },
    linux: {
        maintainer: 'TNY Robotics',
        artifactName: '${productName}-Setup-${version}-linux.${ext}',
        desktop: {
            StartupNotify: 'false',
            Encoding: 'UTF-8',
            MimeType: 'x-scheme-handler/deeplink',
        },
        target: ['AppImage', 'deb'],
        category: 'Development',
        icon: 'build/icon.png',
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

const osMap = {
    win32: 'WINDOWS',
    darwin: 'MAC',
    linux: 'LINUX'
};
const currentPlatform = osMap[process.platform];
const isCI = process.env.GITHUB_ACTIONS === 'true';

console.log(`Build launched on platform : ${currentPlatform}`);
console.log(`CI detected : ${isCI}`);

// strip down options to only the current platform to avoid linux trying to build windows/mac and so on
if (currentPlatform === 'LINUX') {
    delete options.win;
    delete options.nsis;
    delete options.mac;
} else if (currentPlatform === 'WINDOWS') {
    delete options.linux;
    delete options.mac;
} else if (currentPlatform === 'MAC') {
    delete options.linux;
    delete options.win;
    delete options.nsis;
    if (isCI) {
        // force arm64 architecture only (GH Actions macOS runners are arm64)
        options.mac.target = [{ target: 'default', arch: 'arm64' }];
    }
}

builder.build({
    targets: null, // auto-detect targets
    publish: isCI ? 'always' : 'never',
    config: {
        ...options,
        compression: isCI ? 'normal' : 'store', // use compression for production builds (slower build time, but smaller files)
    }
}).then((result) => {
    console.log('----------------------------');
    console.log('Build completed successfully!');
    console.log('Generated files:', JSON.stringify(result, null, 2));
}).catch((error) => {
    console.error('Error during build:', error);
    process.exit(1); // Important for GitHub Actions to know that it failed
});
