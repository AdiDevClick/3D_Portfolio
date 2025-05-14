import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle.tsx';
import { DEFAULT_PROJECTS_POSITION_SETTINGS } from '@/configs/3DCarousel.config.ts';
import { ContactContent } from '@/pages/Contact/ContactContent.tsx';
import { frustumChecker } from '@/utils/frustrumChecker.ts';
import { Html, useCursor } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router';
import { Group } from 'three';

let currentGroupPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
export function Contact({}: // scaleX,
// isMobile,
// visible,
{
    generalScaleX: number;
}) {
    const { isMobile, scaleX } = useOutletContext();
    const groupRef = useRef<Group>(null);
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
                }}
            >
                Me contacter
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
