import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle.tsx';
import {
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_HTML_ICONS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { frustumChecker } from '@/utils/frustrumChecker.ts';
import { Html, Sparkles, Stars, useCursor } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router';
import { Group } from 'three';
// import GitIcon from '@models/optimized/Github_mobile_model.glb';
// import LinkedIn from '@models/optimized/Linkedin_model.glb';

let currentGroupPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
// const floatOptions = {
//     autoInvalidate: true,
//     speed: 1.5,
//     rotationIntensity: 0.5,
//     floatIntensity: 0.5,
//     floatingRange: [-0.1, 0.1] as [number, number],
// };

export function Contact() {
    const { isMobile, scaleX } = useOutletContext();
    const groupRef = useRef<Group>(null);
    // const iconsRef = useRef<Group>(null);
    const frameCountRef = useRef(0);

    const [hovered, setHovered] = useState(false);
    const scale = hovered ? 1.2 : 1;

    useCursor(hovered);

    // const isActive = visible === 'home';

    // currentGroupPos = isActive
    //     ? currentGroupPos.set(0, 0, 0)
    //     : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
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
            // if (groupRef.current.visible || isActive) {
            easing.damp3(groupRef.current.position, [0, 0, 0], 0.2, delta);
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
        >
            {/* <group ref={groupRef} visible={isActive}> */}
            <FloatingTitle
                scale={scaleX}
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
            {/* <PageContainer pageName={'/contact'}>
                <ContactContent
                    onWheel={onScrollHandler}
                    className="contact"
                    style={{
                        // opacity: isLoaded ? 1 : 0,
                        transform: 'translate(-50%)',
                        transition:
                            'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        height: '500px',
                        width: 'clamp(min(52%, 100%), 100%, 52vw)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 0,
                    }}
                />
            </PageContainer> */}
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
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
        </group>
    );
}

function onClickHandler(e: ThreeEvent<globalThis.MouseEvent>) {
    e.stopPropagation();
    // if (model.includes('github') || model.includes('GitHub')) {
    window.open('https://www.linkedin.com/in/adrien-quijo');
    // } else if (model.includes('linkedin') || model.includes('LinkedIn')) {
    // window.open('https://www.github.com/AdiDevClick');
    // }
}
