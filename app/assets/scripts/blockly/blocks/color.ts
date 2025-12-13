import * as Blockly from 'blockly/core';
import TYPE from './types';
import type { JavascriptGenerator } from 'blockly/javascript';
import { javascriptGenerator, Order } from 'blockly/javascript';
import '@blockly/field-colour-hsv-sliders';

function getCustomBlocks() {
    return [
        /// COLORS ///
        // SET COLOUR
        {
            category: "COLORS",
            block: {
                type: 'function_color_setColour',
                message0: 'Set color of LED %1 %2 to %3',
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.NUMBER
                    },
                    { type: "input_dummy" },
                    {
                        type: "input_value",
                        name: "colour",
                        check: TYPE.COLOUR
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "colors_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var el = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                var colour = javascriptGenerator.valueToCode(block, 'colour', Order.NONE);
                return `await window.remote.setLEDColor(${el}, ${colour});\n`;
            }
        },
        // GET COLOR
        {
            category: "COLORS",
            block: {
                type: 'getter_color_getColour',
                message0: 'Get colour of LED %1',
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.NUMBER
                    }
                ],
                output: TYPE.COLOUR,
                style: "colors_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var el = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                return [`await window.remote.getLEDColor(${el})`, Order.NONE];
            }
        },
        // COLOR PICKER
        {
            category: "COLORS",
            block: {
                type: 'colour_hsv_sliders',
                message0: 'hsv %1',
                output: TYPE.COLOUR,
                style: "colors_blocks",
                tooltip: "",
                helpUrl: "",
                args0: [
                    {
                        type: 'field_colour_hsv_sliders',
                        name: 'colour',
                        colour: '#ff0000',
                    },
                ],
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                const colour = generator.quote_(block.getFieldValue('colour'));
                return [colour, Order.ATOMIC];
            }
        }
    ];
}

export { getCustomBlocks };