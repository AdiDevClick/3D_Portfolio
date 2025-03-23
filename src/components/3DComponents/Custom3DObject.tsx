import { Bone, BoxGeometry, PlaneGeometry, SphereGeometry } from "three";

export function Custom3DObject(type = string, size = [],  ...props) {
    let ThreeDObject
    switch (type) {
        case "box":
            ThreeDObject = new BoxGeometry()
            break;
        case "plane" : 
        ThreeDObject = new PlaneGeometry()
        break;
        case "sphere" : 
        ThreeDObject = new SphereGeometry()
        break;
        default:
            break;
    }
    ThreeDObject.width = width
    const bones = new Bone
    ThreeDObject
    return ()
}

function inCollision(object1, object2) {
    return 
}