import { Center, useCursor } from '@react-three/drei';
import { Group } from 'three';
import { use, useMemo, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Icons } from '@/components/3DComponents/3DIcons/Icons';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import { IconsContainerContext } from '@/api/contexts/IconsContainerProvider';
import {
    IconsContainerContextTypes,
    IconsWithTextProps,
} from '@/components/3DComponents/3DIcons/IconsTypes';

let isComponentMounted = false;

/**
 * IconWithText component that displays a 3D icon with text.
 *
 * @description This container is Floating.
 *
 * @param model - Model URL
 * @param props - Additional properties for the 3D group element
 * @param datas - Data containing the name and text for the icon
 * @returns
 */
export function IconWithText({ model, datas, ...props }: IconsWithTextProps) {
    const {
        scalar,
        isMobile,
        iconScale,
        animations,
        eventsList,
        floatOptions,
        textProps,
    } = use(IconsContainerContext) as IconsContainerContextTypes;
    const [hovered, set] = useState(false);

    const newAnimationObject = useMemo(() => {
        const newObject = { ...animations };
        if (
            'hovered' in animations &&
            animations.hovered &&
            animations.propertiesToCheck
        ) {
            animations.propertiesToCheck.forEach((animationKey) => {
                if (animations[animationKey]) {
                    newObject[animationKey] = hovered
                        ? animations[animationKey].hovered
                        : animations[animationKey].default;
                }
            });
        }
        return newObject;
    }, [animations, hovered, isComponentMounted]);

    const animationSpring = useSpring(newAnimationObject);

    const groupRef = useRef<Group>(null!);

    useCursor(hovered);

    /**
     * Checks if the icon is in the camera's frustum
     * and enables/disables the scaling ease.
     */
    // useFrame((_, delta) => {
    //     // if (!groupRef.current) return;
    //     // frameCountRef.current += 1;
    //     // if (frameCountRef.current % 4 === 0) {
    //     //     // const contentGrid = groupRef.current.parent?.parent;
    //     //     if (!animations.animatePosition) return;
    //     //     // if (contentGrid?.visible)
    //     //     easing.damp3(
    //     //         groupRef.current.position,
    //     //         isComponentMounted,
    //     //         0.3,
    //     //         delta
    //     //     );
    //     //     // easing.damp3(
    //     //     //     groupRef.current.position,
    //     //     //     !isComponentMounted
    //     //     //         ? animations.animatePosition.from
    //     //     //         : animations.animatePosition.default,
    //     //     //     2000,
    //     //     //     delta
    //     //     // );
    //     // }
    // });
    // console.log('je rerender iConWithText');

    return (
        <animated.group
            name={'icon__content-' + datas.name}
            ref={groupRef as any}
            onPointerOver={(e) => {
                e.stopPropagation();
                set(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                set(false);
            }}
            {...eventsList}
            {...props}
            {...animationSpring}
        >
            <FloatingTitle
                scalar={scalar}
                isMobile={isMobile}
                size={textProps?.size ?? 40 * scalar}
                isClickable={true}
                floatOptions={floatOptions}
                name={'icons-' + datas.name + '__title'}
                right
                position-x={0.2 * scalar}
                text={datas.text}
                textProps={textProps}
            >
                <Center left>
                    <Icons model={model} hovered={hovered} scale={iconScale} />
                </Center>
            </FloatingTitle>
        </animated.group>
    );
}
