import { ContactIconsContainer } from '@/components/3DComponents/Contact/ContactIconsContainer';
import { PagesTypes } from '@/components/3DComponents/Scene/SceneTypes';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config';
import {
    CONTACT_ICONS_POSITION_SETTINGS,
    DESKTOP_ICONS_MARGINS_POSITION_SETTINGS,
    MOBILE_ICONS_MARGINS_POSITION_SETTINGS,
} from '@/configs/ContactIcons.config';
import { animateItem } from '@/hooks/animation/useAnimateItems';
import { frustumChecker } from '@/utils/frustrumChecker';
import { Html, Sparkles, Stars, useCursor } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { memo, useRef, useState } from 'react';
import { Group } from 'three';

let currentGroupPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
let currentIconsPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

const ANIM_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.3,
    type: 'position' as const,
};
const ANIM_SCALE_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.2,
    type: 'scale' as const,
};

const MemoizedContact = memo(function Contact({
    isMobile,
    contentHeight,
    contentWidth,
    generalScaleX,
    visible,
}: PagesTypes) {
    const groupRef = useRef<Group>(null);
    const iconsRef = useRef<Group>(null);

    const frameCountRef = useRef(0);

    const [hovered, setHovered] = useState(false);
    const scale = hovered ? 1.2 : 1;

    const isActive = visible === 'contact';
    useCursor(hovered);

    currentGroupPos = isActive
        ? ACTIVE_PROJECTS_POSITION_SETTINGS.clone()
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

    currentIconsPos = isActive
        ? CONTACT_ICONS_POSITION_SETTINGS(
              contentHeight,
              contentWidth,
              isMobile
                  ? MOBILE_ICONS_MARGINS_POSITION_SETTINGS
                  : DESKTOP_ICONS_MARGINS_POSITION_SETTINGS
          )
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

    useFrame((state, delta) => {
        if (!groupRef.current || !iconsRef.current) return;
        frameCountRef.current += 1;

        // Check if the objects are in the frustum
        frustumChecker(
            [groupRef.current, iconsRef.current],
            state,
            frameCountRef.current,
            isMobile
        );

        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: groupRef,
                effectOn: currentGroupPos,
                time: 0.2,
            },
            isActive,
            groupRef,
            delta,
        });
        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: iconsRef,
                effectOn: currentIconsPos,
            },
            isActive,
            groupRef,
            delta,
        });
        animateItem({
            item: {
                ...ANIM_SCALE_CONFIG_BASE,
                ref: groupRef,
                effectOn: scale,
            },
            isActive,
            groupRef,
            delta,
        });
    });

    return (
        <group ref={groupRef} visible={isActive}>
            <FloatingTitle
                text="Me contacter sur LinkedIn"
                isClickable={true}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                }}
                onClick={onClickHandler}
                scalar={generalScaleX}
                size={30}
                name="contact-title"
                textProps={{
                    height: 20,
                    color: hovered ? '#fffff' : '#000000',
                }}
            >
                {hovered && (
                    <Html position={[0, 2, 0]}>
                        <div className="about__tooltip">
                            Visitez mon LinkedIn
                        </div>
                    </Html>
                )}
            </FloatingTitle>

            <ContactIconsContainer
                key={`contact-icons`}
                ref={iconsRef}
                scalar={generalScaleX}
                isMobile={isMobile}
            />
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
