import MemoizedIconsContainer from '@/components/3DComponents/3DIcons/IconsContainer';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { Hud, PerspectiveCamera } from '@react-three/drei';
import { memo, useRef, useState } from 'react';
import { Group, Matrix4 } from 'three';
import iconsWithText from '@data/hud-menu.json';
import {
    DESKTOP_HUD_ICONS_POSITION_SETTINGS,
    MOBILE_HUD_ICONS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { handleHudClick } from '@/components/3DComponents/Header/HudFonctions';
import { useNavigate } from 'react-router';

const floatOptions = {
    autoInvalidate: true,
    speed: 0.8,
    rotationIntensity: 0.2,
    floatIntensity: 0.2,
    floatingRange: [-0.1, 0.1] as [number, number],
};

const MemoizedHudMenu = memo(function HudMenu({
    reducer,
    renderPriority = 1,
    matrix = new Matrix4(),
}: {
    reducer: ReducerType;
    /** @defaultValue 0.5 */
    margin?: number;
}) {
    const navigate = useNavigate();
    // const [hovered, setHovered] = useState(false);

    const { isMobile, contentWidth, contentHeight, generalScaleX } = reducer;

    const eventsList = {
        onClick: (event: ThreeEvent<MouseEvent>) => {
            handleHudClick(event, navigate);
        },
        // onPointerOver: (e: ThreeEvent<MouseEvent>) => {
        //     console.log(e);
        //     e.stopPropagation();
        //     setHovered(true);
        // },
        // onPointerOut: (e: ThreeEvent<MouseEvent>) => {
        //     e.stopPropagation();
        //     setHovered(false);
        // },
    };

    const gridOptions = {
        columnsNumber: isMobile ? 4 : 1,
        rowOffset: 0,
        marginX: isMobile ? 2.5 : 2.5,
        marginY: isMobile ? 0.5 : 1.5,
        windowMargin: 1,
        forceColumnsNumber: isMobile ? true : false,
    };

    // const animations = {
    //     scale: 1.2,
    //     config: {
    //         mass: 1,
    //         tension: 170,
    //         friction: 26,
    //         precision: 0.001,
    //         duration: 200,
    //     },
    //     delay: 100,
    // };

    const animations = {
        propertiesToCheck: ['scale', 'rotation'],
        hovered: true,
        scale: { hovered: 1.2, default: 1 },
        rotation: { hovered: [-0.1, 0, 0.05], default: [0, 0, 0] },
        config: {
            mass: 1.5,
            tension: 100,
            friction: 26,
            precision: 0.001,
            duration: 200,
        },
        delay: 100,
    };

    const calculatedHeight = contentHeight - contentHeight * generalScaleX;

    const iconsPos = DESKTOP_HUD_ICONS_POSITION_SETTINGS(
        calculatedHeight,
        contentWidth,
        { x: -0.5, y: 0.5 }
    );

    const iconsPosMobile = MOBILE_HUD_ICONS_POSITION_SETTINGS(
        contentHeight,
        contentWidth,
        { x: 0.2, y: 0.25 }
    );

    const { camera, viewport } = useThree();
    useFrame(() => {
        // Spin mesh to the inverse of the default cameras matrix
        matrix.copy(camera.matrix).invert();
        // mesh.current.quaternion.setFromRotationMatrix(matrix);
    });

    return (
        <Hud renderPriority={renderPriority}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />

            <group
                scale={[-1, 1, -1]}
                position={
                    isMobile
                        ? [iconsPosMobile.x, iconsPosMobile.y, iconsPosMobile.z]
                        : [-iconsPos.x, iconsPos.y, iconsPos.z]
                }
            >
                <MemoizedIconsContainer
                    width={contentWidth ?? 1}
                    icons={iconsWithText}
                    scalar={0.4 * generalScaleX}
                    gridOptions={gridOptions}
                    iconScale={10}
                    floatOptions={floatOptions}
                    isMobile={isMobile}
                    eventsList={eventsList}
                    mobileTextProps={{
                        right: true,
                        position: [-0.1, 0, 0],
                    }}
                    // hovered={hovered}
                    animations={animations}
                />
            </group>
        </Hud>
    );
});

// const iconsWithText = useMemo(() => getIconsWithText(), []);
export default MemoizedHudMenu;
