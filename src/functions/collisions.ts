import { ElementType } from '@/hooks/reducers/carouselTypes.ts';

export function effectiveRadius(
    actualCard: ElementType,
    othersCard: ElementType
): number {
    const radiusA =
        actualCard.ref?.current.children[0].geometry.parameters.radius;
    const radiusB =
        othersCard.ref?.current.children[0].geometry.parameters.radius;
    return radiusA + radiusB;
}

export function isNeighbor(a, b) {
    return b === a + 1 || b === a - 1;
}

export function getCollision(actualObject, otherObject, c, d) {
    // const { position } = actualObject
    const thisObject = actualObject.sidePositions;
    const othersObjects = otherObject.sidePositions;
    // console.log(otherObject.sidePositions);
    // if (thisObject.front + thisObject.back !== 0) {
    const zCollision =
        thisObject.front >= othersObjects.back &&
        thisObject.back <= othersObjects.front &&
        thisObject.front + thisObject.back !== 0;
    // }

    // if (thisObject.right + thisObject.left !== 0) {
    const xCollision =
        thisObject.right >= othersObjects.left &&
        thisObject.left <= othersObjects.right &&
        thisObject.right + thisObject.left !== 0;
    // }

    // if (thisObject.top + thisObject.bottom !== 0) {
    const yCollision =
        thisObject.bottom <= othersObjects.top &&
        thisObject.top >= othersObjects.bottom &&
        thisObject.top + thisObject.bottom !== 0;
    // }
    // const { position } = otherObject
    if (xCollision) {
        // console.log('X collision on :', c, '\n and :', d);
    }

    if (yCollision) {
        console.log('Y Collision');
    }

    if (zCollision) {
        console.log('z collision');
    }

    if (xCollision && yCollision && zCollision) {
        console.log(console.log('collision'));
    }
}
