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
            <Center>
                <Center>
                    <FloatingTitle
                        scalar={scalar}
                        isMobile={isMobile}
                        size={textProps?.size ?? 40 * scalar}
                        isClickable={true}
                        floatOptions={floatOptions}
                        name={'icons-' + datas.name + '__title'}
                        // position-x={-0.2 * scalar}
                        top={isMobile}
                        position={
                            isMobile
                                ? [1.5 * scalar, 0.6 * scalar, 0]
                                : [0, 0, 0]
                        }
                        text={datas.text}
                        textProps={textProps}
                    />
                </Center>

                <Center
                    left
                    position-x={isMobile ? 0.2 * scalar : 0.2}
                    rotation={[0, 3.164, 0]}
                >
                    <Icons model={model} hovered={hovered} scale={iconScale} />
                </Center>
            </Center>
        </animated.group>
    );
}
