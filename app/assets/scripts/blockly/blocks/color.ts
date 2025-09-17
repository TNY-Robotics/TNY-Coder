import * as Blockly from 'blockly/core';
import TYPE from './types';
import type { JavascriptGenerator } from 'blockly/javascript';
import { javascriptGenerator, Order } from 'blockly/javascript';

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
                var el = javascriptGenerator.valueToCode(block, 'el', Order.NONE);
                var color = javascriptGenerator.valueToCode(block, 'color', Order.NONE);
                return `setColor(${el}, ${color})`;
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
                var el = javascriptGenerator.valueToCode(block, 'el', Order.NONE);
                return `getColor(${el})`;
            }
        }
    ];
}

export { getCustomBlocks };