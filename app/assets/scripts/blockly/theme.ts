import { Theme, Themes } from 'blockly';

export function createTheme(darkMode: boolean) {
    Theme.defineTheme('tny', {
        base: Themes.Classic,
        blockStyles: {
            event_blocks: { colourPrimary: '#eab308', },
            logic_blocks: { colourPrimary: '#f59e0b', },
            loop_blocks: { colourPrimary: '#f59e0b', },
            math_blocks: { colourPrimary: '#22c55e', },
            variable_blocks: { colourPrimary: '#f97316', },
            list_blocks: { colourPrimary: '#ef4444', },
            procedure_blocks: { colourPrimary: '#64748b', },
            motor_blocks: { colourPrimary: '#8b5cf6', },
            motor_enum_blocks: { colourPrimary: '#a855f7', },
            colors_blocks: { colourPrimary: '#3b82f6', },
        },
        categoryStyles: {
            event_category: { colour: '#eab308' },
            controls_category: { colour: '#f59e0b' },
            math_category: { colour: '#22c55e' },
            variable_category: { colour: '#f97316' },
            list_category: { colour: '#ef4444' },
            procedure_category: { colour: '#64748b' },
            motor_category: { colour: '#8b5cf6' },
            colors_category: { colour: '#3b82f6' },
        },
        componentStyles: {
            workspaceBackgroundColour: '#0000',
            flyoutBackgroundColour: darkMode? '#334155': '#f8fafc',
            flyoutForegroundColour: darkMode? '#fff': '#000',
            toolboxBackgroundColour: darkMode? '#334155': '#f8fafc',
            toolboxForegroundColour: darkMode? '#fff': '#000',
            scrollbarColour: '#64748b',
            scrollbarOpacity: 0.5,
            flyoutOpacity: 1,
            insertionMarkerColour: '#64748b',
            insertionMarkerOpacity: 1,
            selectedGlowColour: '#fde047',
            selectedGlowOpacity: 0.5,
        },
        name: 'Tny',
        startHats: true,
    });
}
