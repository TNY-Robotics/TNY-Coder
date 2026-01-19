import { getCustomBlocks as colorBlocks } from './blocks/color';
import { getCustomBlocks as jointBlocks } from './blocks/joint';
import { getCustomBlocks as controlBlocks } from './blocks/control';

function getCustomBlocks() {
    return []
    .concat(colorBlocks() as any)
    .concat(jointBlocks() as any)
    .concat(controlBlocks() as any);
}

export { getCustomBlocks };