import { PagesTypes } from '@/components/3DComponents/Scene/Scene';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import { DEFAULT_PROJECTS_POSITION_SETTINGS } from '@/configs/3DCarousel.config';
import { frustumChecker } from '@/utils/frustrumChecker';
import { Html, Sparkles, Stars, useCursor } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { memo, useRef, useState } from 'react';
import { Group } from 'three';

let currentGroupPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

const MemoizedContact = memo(function Contact({
    isMobile,
    generalScaleX,
    visible,
}: PagesTypes) {
    const groupRef = useRef<Group>(null);
    const frameCountRef = useRef(0);

    const [hovered, setHovered] = useState(false);
    const scale = hovered ? 1.2 : 1;

    const isActive = visible === 'contact';
    useCursor(hovered);

    currentGroupPos = isActive
        ? currentGroupPos.set(0, 0, 0)
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        frameCountRef.current += 1;

        // Check if the objects are in the frustum
        frustumChecker(
            [groupRef.current],
            state,
            frameCountRef.current,
            isMobile
        );

        if (groupRef.current.visible) {
            console.log(
                'je suis visible: ',
                groupRef.current.visible,
                'je suis active:',
                isActive
            );
            easing.damp3(
                groupRef.current.position,
                currentGroupPos,
                0.2,
                delta
            );
            easing.damp3(groupRef.current.scale, scale, 0.2, delta);

            // if (iconsRef.current.visible || groupRef.current.visible) {
            //     easing.damp3(
            //         iconsRef.current.position,
            //         DESKTOP_HTML_ICONS_POSITION_SETTINGS(
            //                         contentHeight,
            //                         contentWidth,
            //                         margin
            //                     );,
            //         0.3,
            //         delta
            //     );
            // }
        }
    });
    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onClickHandler}
            visible={isActive}
        >
            <FloatingTitle
                scale={generalScaleX}
                size={30}
                textProps={{
                    height: 20,
                    color: hovered ? '#fffff' : '#000000',
                }}
            >
                Me contacter sur LinkedIn
            </FloatingTitle>
            {hovered && (
                <Html position={[0, 2, 0]}>
                    <div className="about__tooltip">Visitez mon LinkedIn</div>
                </Html>
            )}
            {/* <group ref={iconsRef}>
                <Center>
                    <Float {...floatOptions}>
                        <Icons
                            model={GitIcon}
                            rotation={[0, 3, 0]}
                            position={[0, 0, 0]}
                        />
                    </Float>
                    <Float {...floatOptions}>
                        <Icons
                            model={LinkedIn}
                            rotation={[0, 3, 0]}
                            position={[-0.6, 0, 0]}
                        />
                    </Float>
                </Center>
            </group> */}
            <Sparkles count={30} size={6} speed={0.4} color={'blue'} />
            {isActive && (
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
            )}
        </group>
    );
});

function onClickHandler(e: ThreeEvent<globalThis.MouseEvent>) {
    e.stopPropagation();
    // if (model.includes('github') || model.includes('GitHub')) {
    window.open('https://www.linkedin.com/in/adrien-quijo');
    // } else if (model.includes('linkedin') || model.includes('LinkedIn')) {
    // window.open('https://www.github.com/AdiDevClick');
    // }
}

export default MemoizedContact;
