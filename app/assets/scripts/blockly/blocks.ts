import { getCustomBlocks as colorBlocks } from './blocks/color';
import { getCustomBlocks as motorBlocks } from './blocks/motor';
import { getCustomBlocks as controlBlocks } from './blocks/control';

function getCustomBlocks() {
    return []
    .concat(colorBlocks() as any)
    .concat(motorBlocks() as any)
    .concat(controlBlocks() as any);
}

export { getCustomBlocks };