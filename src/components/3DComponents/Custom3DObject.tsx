import { Bone, BoxGeometry, PlaneGeometry, SphereGeometry } from "three";


export function Custom3DObject({type, size, segments,  ...props}) {
    let ThreeDObject
    switch (type) {
        case "box":
            ThreeDObject = new BoxGeometry(size.width, size.height, size.depth)
            break;
        case "plane" : 
        ThreeDObject = new PlaneGeometry(size.width, size.height)
        break;
        case "sphere" : 
        ThreeDObject = new SphereGeometry(size.width, size.height,  size.depth)
        break;
        default:
            break;
    }
    ThreeDObject.width = size.width
    ThreeDObject.height = size.height
    ThreeDObject.depth = size.depth

    ThreeDObject.depth = size.depth
    ThreeDObject.depth = size.depth
    ThreeDObject.depth = size.depth


    const bones = new Bone
    ThreeDObject
    return ()
}

function inCollision(object1, object2) {
    return 
}