import * as Blockly from 'blockly/core';
import TYPE from './types';
import type { JavascriptGenerator } from 'blockly/javascript';
import { javascriptGenerator, Order } from 'blockly/javascript';

function getCustomBlocks() {
    let blocks = [
        // SET MOTOR ROTATION
        {
            category: "MOTORS",
            block: {
                type: 'function_motor_setRotation',
                message0: Blockly.Msg.MOTORS_SET_ROTATION,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.MOTOR
                    },
                    {
                        type: "input_value",
                        name: "angle",
                        check: TYPE.NUMBER
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "motor_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                var angle = javascriptGenerator.valueToCode(block, 'angle', Order.NONE);
                return `await window.TNYRemote.getInstance().setMotorRotation(${id}, ${angle});\n`;
            }
        },
        {
            category: "MOTORS",
            block: {
                type: 'function_motor_rotateBy',
                message0: Blockly.Msg.MOTORS_ROTATE_BY,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.MOTOR
                    },
                    {
                        type: "input_value",
                        name: "angle",
                        check: TYPE.NUMBER
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "motor_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                var angle = javascriptGenerator.valueToCode(block, 'angle', Order.NONE);
                return `await window.TNYRemote.getInstance().rotateMotorBy(${id}, ${angle});\n`;
            }
        },
        // GET MOTOR ROTATION
        {
            category: "MOTORS",
            block: {
                type: 'getter_motor_getRotation',
                message0: Blockly.Msg.MOTORS_GET_ROTATION,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.MOTOR
                    }
                ],
                output: TYPE.NUMBER,
                style: "motor_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                return [`await window.TNYRemote.getInstance().getMotorRotation(${id})`, Order.NONE]
            }
        }
    ];
    
    let motors = {
        'EAR_LEFT': 1,
        'EAR_RIGHT': 2,
        'SHOULDER_FRONT_LEFT': 3,
        'SHOULDER_FRONT_RIGHT': 4,
        'SHOULDER_BACK_LEFT': 5,
        'SHOULDER_BACK_RIGHT': 6,
        'LEG_FRONT_LEFT': 7,
        'LEG_FRONT_RIGHT': 8,
        'LEG_BACK_LEFT': 9,
        'LEG_BACK_RIGHT': 10,
        'ELBOW_FRONT_LEFT': 11,
        'ELBOW_FRONT_RIGHT': 12,
        'ELBOW_BACK_LEFT': 13,
        'ELBOW_BACK_RIGHT': 14
    };
    Object.keys(motors).forEach((motor) => {
        blocks.push({
            category: "MOTORS",
            block: {
                type: `motor_${motor}`,
                message0: Blockly.Msg[`TNY_${motor}`],
                output: TYPE.MOTOR,
                style: "motor_enum_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block) {
                return [(motors as any)[motor], Order.NONE];
            }
        } as any);
    });

    return blocks;
}

export { getCustomBlocks };