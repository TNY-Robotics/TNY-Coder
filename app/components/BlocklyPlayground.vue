<template>
    <div class="relative h-full w-full">
        <div id="blocklyDiv" class="h-full w-full max-h-full min-h-0"></div>
        <div class="absolute h-full w-full top-0 left-0 z-50 pointer-events-none">
            <div class="absolute bottom-4 right-4 space-x-3 pointer-events-auto">
                <UButton icon="i-lucide-arrow-right" size="lg" class="w-fit h-fit" @click="onStepPressed" />
                <UButton v-if="currentInstruction !== null || running" icon="i-lucide-square" size="lg" class="w-fit h-fit" @click="onStopPressed" />
                <UButton v-if="running" icon="i-lucide-pause" size="lg" class="w-fit h-fit" @click="onPausePressed" />
                <UButton v-if="!running" icon="i-lucide-play" size="lg" class="w-fit h-fit" @click="onPlayPressed" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import En from '~/assets/scripts/blockly/en';
import Fr from '~/assets/scripts/blockly/fr';
import { getCustomBlocks } from '~/assets/scripts/blockly/blocks';
import { createTheme } from '~/assets/scripts/blockly/theme';
import defaultToolbox from '~/assets/toolbox.json';

const toast = useToast();

// get locale from nuxt
const { locale } = useI18n();

function loadBlocklyBlocks(workspace: Blockly.Workspace, blocks: any) {
    Blockly.serialization.workspaces.load({blocks: {blocks: blocks, languageVersion: 0}}, workspace);
}

function saveBlocklyBlocks(workspace: Blockly.Workspace) {
    return Blockly.serialization.workspaces.save(workspace);
}

function spawnDefaultWorkspace(workspace: Blockly.Workspace) {
    // setup event
    Blockly.Blocks['event_setup'] = {
        init: function() {
            this.appendDummyInput().appendField(Blockly.Msg['TNY_SETUP_TITLE']);
            this.appendStatementInput("insts").setCheck(null);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setMovable(true);
            this.setStyle("event_blocks");
            this.suppressPrefixSuffix = true;
        }
    };
    javascriptGenerator.forBlock['event_setup'] = function(block: Blockly.Block) {
        const insts = javascriptGenerator.statementToCode(block, 'insts');
        return `window.blockly_setup = async () => {\n${insts}}\n`;
    };

    // loop event
    Blockly.Blocks['event_loop'] = {
        init: function() {
            this.appendDummyInput().appendField(Blockly.Msg['TNY_LOOP_TITLE']);
            this.appendStatementInput("insts").setCheck(null);
            this.setTooltip("");
            this.setHelpUrl("");
            this.setMovable(true);
            this.setStyle("event_blocks");
            this.suppressPrefixSuffix = true;
        }
    };
    javascriptGenerator.forBlock['event_loop'] = function(block: Blockly.Block) {
        const insts = javascriptGenerator.statementToCode(block, 'insts');
        return `window.blockly_loop = async () => {\n${insts}}\n`;
    };

    loadBlocklyBlocks(workspace, [{
        type: 'event_setup',
        deletable: false,
        x: 60,
        y: 60
    }, {
        type: 'event_loop',
        deletable: false,
        x: 540,
        y: 60
    }]);
}

let compileCode: () => Promise<void> = async () => {};
async function initBlockly() {
    const locales = {
        en: En,
        fr: Fr
    };
    
    if (locale.value in locales) {
        Blockly.setLocale((locales as any)[locale.value]);
    } else {
        Blockly.setLocale(locales.en as any);
    }

    Blockly.Scrollbar.scrollbarThickness = 14;

    const toolbox = {
        kind: "categoryToolbox",
        contents: defaultToolbox.map((categ) => ({
            ...categ,
            name: Blockly.Msg[`TNY_CTG_${categ.id?.toUpperCase()}`]
        }))
    };

    getCustomBlocks().forEach((block: any) => {
        if (Blockly.Blocks[block.block.type]) {
            console.error("Le bloc "+block.type+" existe déjà");
            return;
        }

        Blockly.defineBlocksWithJsonArray([block.block]);
        javascriptGenerator.forBlock[block.block.type] = block.js;

        const categIndex = toolbox.contents.findIndex(categ => categ.id === block.category);
        if (categIndex < 0) {
            console.error("Impossible de trouver la catégorie "+block.category+" dans la toolbox")
            return;
        }
        const categ = toolbox.contents[categIndex] as any;
        categ.contents.push({
            kind: "block",
            type: block.block.type
        });
    });

    const workspace = Blockly.inject(
        'blocklyDiv',
        {
            toolbox: toolbox,
            theme: 'tny',
            renderer: 'zelos',
            grid: {
                spacing: 40,
                length: 4,
                colour: '#8888',
                snap: true
            },
            move: {
                scrollbars: true,
                drag: true,
                wheel: false
            },
            zoom: {
                controls: false,
                wheel: true,
                startScale: 0.8,
                pinch: false
            },
            trashcan: false,
            sounds: false
        }
    );

    // add setup() and loop() endpoints
    spawnDefaultWorkspace(workspace);

    // Set the prompt function for Blockly
    Blockly.dialog.setPrompt(function(message: string, defaultValue: string, callback: (result: string | null) => void) {
        (window as any).BlocklyPrompt(message, defaultValue, callback);
    });

    // define run button
    compileCode = async () => {
        return new Promise((resolve, reject) => {
            javascriptGenerator.STATEMENT_PREFIX = 'if (onBlockStart(%1)) {\n';
            javascriptGenerator.STATEMENT_SUFFIX = '}\nif (!onBlockEnd(%1)) return;\n';
            javascriptGenerator.addReservedWords('onBlockStart');
            javascriptGenerator.addReservedWords('onBlockEnd');
            const code = javascriptGenerator.workspaceToCode(workspace)
                .replaceAll('\nfunction', '\nasync function'); // make all functions async;
            console.log(code);
            
            try { eval(code); resolve(); }
            catch (e) { console.error('Error evaluating code', e); reject(e); }
        })
    }
}

const currentInstruction = ref<string|null>(null);
const shouldOnlyStep = ref(false);
const running = ref(false);

// Called before block execution, returns true if we should execute the block (false to skip it)
function onBlockStart(id: string) {
    if (!running.value) return false; // Don't execute block if not running

    if (!(window as any).remote) {
        throw new TimeoutError();
    }

    const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    workspace.highlightBlock(id);

    if (currentInstruction.value !== null) {
        // Execute next block if targeted (it's a resume call, we try to reach the current instruction from code start)
        if (currentInstruction.value === id) {
            // marking execution for next block
            currentInstruction.value = null;
        }
        return false;
    }
    // current instruction is null, it's a normal execution. Mark this block as current instruction, and proceed
    currentInstruction.value = id;
    return true;
}
if (import.meta.client) { (window as any).onBlockStart = onBlockStart; } // doing this to avoid function removal by minifier

// Called when block ended execution, returns true if we should continue (false to stop execution)
function onBlockEnd(id: string) {
    const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    workspace.highlightBlock(null);
    
    if (!running.value) return false; // Stop execution if not running

    if (currentInstruction.value !== null && currentInstruction.value !== id) {
        // Resume has been called, just continue to try to reach the current instruction
        return true;
    }

    if (shouldOnlyStep.value) {
        if (currentInstruction.value === null) {
            // Skipping to let next block execute
            return true;
        }
        
        // We only wanted to step, stop execution
        shouldOnlyStep.value = false;
        running.value = false;
        return false;
    }

    // We finished this block execution, reset current instruction and continue as normal
    currentInstruction.value = null;
    return true;
}
if (import.meta.client) { (window as any).onBlockEnd = onBlockEnd; } // doing this to avoid function removal by minifier

function handleCompileError(e: any) {
    console.error('Error during code compilation', e);
    running.value = false;
    currentInstruction.value = null;
    const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    workspace.highlightBlock(null);
    
    toast.add({
        title: 'Erreur de compilation',
        description: 'Ils semble que votre code contient une erreur et ne peut pas être exécuté. Corrigez les erreurs et réessayez.',
        icon: 'i-lucide-circle-x',
        color: 'error'
    });
}

function handleRuntimeError(e: any) {
    console.error('Error during code execution', e);
    running.value = false;
    currentInstruction.value = null;
    const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    workspace.highlightBlock(null);

    if (e instanceof RobotError) {
        toast.add({
            title: 'Erreur du robot',
            description: 'Le robot a renvoyé une erreur lors de l\'exécution du code : '+e.message,
            icon: 'i-lucide-bot',
            color: 'error'
        });
        return;
    }

    if (e instanceof TimeoutError) {
        running.value = false;
        currentInstruction.value = null;
        const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
        workspace.highlightBlock(null);
        toast.add({
            title: 'Connexion perdue',
            description: 'La connexion avec le robot a été perdue, arrêt de l\'exécution du code.',
            icon: 'i-lucide-wifi-off',
            color: 'warning'
        });
        return;
    }

    toast.add({
        title: 'Erreur d\'exécution',
        description: 'Ils semble que votre code ait provoqué une erreur lors de son exécution. Corrigez les erreurs et réessayez.',
        icon: 'i-lucide-circle-x',
        color: 'error'
    });
}

// Play pressed, start from the beginning
// or continue from the current instruction if it exists
async function onPlayPressed() {
    shouldOnlyStep.value = false;
    if (currentInstruction.value === null) {
        // first click on it, compile and start from the beginning
        compileCode()
        .then(() => runCode())
        .catch(e => handleCompileError(e));
    }
}

// Pause pressed, keep current instruction in memory
// and stop the execution
async function onPausePressed() {
    running.value = false;
}

// Stop pressed, reset the current instruction in memory
// and stop the execution
async function onStopPressed() {
    currentInstruction.value = null;
    running.value = false;
}

async function onStepPressed() {
    shouldOnlyStep.value = true;
    if (currentInstruction.value === null) {
        // first click on it, compile and start from the beginning
        compileCode()
        .then(() => runCode())
        .catch(e => handleCompileError(e));
    }
}

async function runCode() {
    if (!(window as any).remote) {
        toast.add({
            title: 'Robot non connecté',
            description: 'Connectez votre robot pour exécuter le code.',
            icon: 'i-lucide-wifi-off',
            color: 'warning'
        });
        return;
    }

    running.value = true;
    try {
        await (window as any).blockly_setup?.();
    } catch (e) {
        handleRuntimeError(e);
        return;
    }

    function loop() {
        if (running.value) {
            try {
                (window as any).blockly_loop?.().then(() => {
                    setTimeout(loop, 0);
                }).catch((e: any) => {
                    handleRuntimeError(e);
                });
            } catch (e) {
                handleRuntimeError(e);
            }
        }
    }
    loop();
}

onMounted(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    createTheme(darkMode);
    initBlockly();
});

</script>

<style></style>