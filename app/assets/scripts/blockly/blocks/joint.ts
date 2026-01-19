import * as Blockly from 'blockly/core';
import TYPE from './types';
import type { JavascriptGenerator } from 'blockly/javascript';
import { javascriptGenerator, Order } from 'blockly/javascript';

function getCustomBlocks() {
    let blocks = [
        // ENABLE JOINT
        {
            category: "JOINTS",
            block: {
                type: 'function_joint_enable',
                message0: Blockly.Msg.JOINT_ENABLE,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.JOINT
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "joint_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                return `await window.remote.setJointState(${id}, true);\n`;
            }
        },
        // DISABLE JOINT
        {
            category: "JOINTS",
            block: {
                type: 'function_joint_disable',
                message0: Blockly.Msg.JOINT_DISABLE,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.JOINT
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "joint_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                return `await window.remote.setJointState(${id}, false);\n`;
            }
        },
        // SET JOINT ROTATION
        {
            category: "JOINTS",
            block: {
                type: 'function_joint_setRotation',
                message0: Blockly.Msg.JOINT_SET_ROTATION,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.JOINT
                    },
                    {
                        type: "input_value",
                        name: "angle",
                        check: TYPE.NUMBER
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "joint_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                var angle = javascriptGenerator.valueToCode(block, 'angle', Order.NONE);
                return `await window.remote.setJointTarget(${id}, ${angle});\n`;
            }
        },
        // ROTATE JOINT BY
        {
            category: "JOINTS",
            block: {
                type: 'function_joint_rotateBy',
                message0: Blockly.Msg.JOINT_ROTATE_BY,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.JOINT
                    },
                    {
                        type: "input_value",
                        name: "angle",
                        check: TYPE.NUMBER
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "joint_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                var angle = javascriptGenerator.valueToCode(block, 'angle', Order.NONE);
                return `await window.remote.setJointTarget(${id}, await window.remote.getJointPosition(${id}) + ${angle});\n`;
            }
        },
        // GET JOINT ROTATION
        {
            category: "JOINTS",
            block: {
                type: 'getter_joint_getRotation',
                message0: Blockly.Msg.JOINT_GET_ROTATION,
                args0: [
                    {
                        type: "input_value",
                        name: "id",
                        check: TYPE.JOINT
                    }
                ],
                output: TYPE.NUMBER,
                style: "joint_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var id = javascriptGenerator.valueToCode(block, 'id', Order.NONE);
                return [`await window.remote.getJointPosition(${id})`, Order.NONE];
            }
        },
        // SET BODY POSTURE
        {
            category: "JOINTS",
            block: {
                type: 'setter_joint_setBodyPosture',
                message0: Blockly.Msg.JOINT_SET_BODY_POSTURE,
                args0: [
                    {
                        type: "input_value",
                        name: "rotX",
                        check: TYPE.NUMBER
                    },
                    {
                        type: "input_value",
                        name: "rotY",
                        check: TYPE.NUMBER
                    },
                    {
                        type: "input_value",
                        name: "rotZ",
                        check: TYPE.NUMBER
                    },
                    {
                        type: "input_value",
                        name: "posX",
                        check: TYPE.NUMBER
                    },
                    {
                        type: "input_value",
                        name: "posY",
                        check: TYPE.NUMBER
                    },
                    {
                        type: "input_value",
                        name: "posZ",
                        check: TYPE.NUMBER
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                style: "joint_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block, generator: JavascriptGenerator) {
                var rotX = javascriptGenerator.valueToCode(block, 'rotX', Order.NONE);
                var rotY = javascriptGenerator.valueToCode(block, 'rotY', Order.NONE);
                var rotZ = javascriptGenerator.valueToCode(block, 'rotZ', Order.NONE);
                var posX = javascriptGenerator.valueToCode(block, 'posX', Order.NONE);
                var posY = javascriptGenerator.valueToCode(block, 'posY', Order.NONE);
                var posZ = javascriptGenerator.valueToCode(block, 'posZ', Order.NONE);
                return `await window.remote.setBodyPosture(${rotX}, ${rotY}, ${rotZ}, ${posX}, ${posY}, ${posZ});\n`;
            }
        }
    ];
    
    let joints = {
        'EAR_LEFT': 1,
        'EAR_RIGHT': 0,
        'HIP_ROLL_FL': 7,
        'HIP_ROLL_FR': 4,
        'HIP_ROLL_BL': 10,
        'HIP_ROLL_BR': 13,
        'HIP_PITCH_FL': 5,
        'HIP_PITCH_FR': 2,
        'HIP_PITCH_BL': 8,
        'HIP_PITCH_BR': 11,
        'KNEE_PITCH_FL': 6,
        'KNEE_PITCH_FR': 3,
        'KNEE_PITCH_BL': 9,
        'KNEE_PITCH_BR': 12
    };
    Object.keys(joints).forEach((joint) => {
        blocks.push({
            category: "JOINTS",
            block: {
                type: `joint_${joint}`,
                message0: Blockly.Msg[`TNY_${joint}`],
                output: TYPE.JOINT,
                style: "joint_enum_blocks",
                tooltip: "",
                helpUrl: ""
            },
            js: function (block: Blockly.Block) {
                return [(joints as any)[joint], Order.NONE];
            }
        } as any);
    });

    return blocks;
}

export { getCustomBlocks };