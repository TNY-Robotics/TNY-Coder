import * as Blockly from 'blockly/core';
import TYPE from './types';
import type { JavascriptGenerator } from 'blockly/javascript';
import { javascriptGenerator, Order } from 'blockly/javascript';

function getCustomBlocks() {
    return [
        /// CONTROLS ///
        // WAIT SECONDS
        {
            category: "CONTROLS",
            block: {
                type: 'function_controls_waitSeconds',
                message0: Blockly.Msg.CONTROLS_WAIT_SECONDS,
                args0: [
                    {
                        type: "input_value",
                        name: "time",
                        check: TYPE.NUMBER
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "logic_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var time = javascriptGenerator.valueToCode(block, 'time', Order.NONE);
                return `await new Promise(resolve => setTimeout(resolve, ${time} * 1000));\n`;
            }
        }
    ];
}

export { getCustomBlocks };