import MemoizedIconsContainer from '@/components/3DComponents/3DIcons/IconsContainer';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { Hud, PerspectiveCamera } from '@react-three/drei';
import { memo, useRef } from 'react';
import { Group } from 'three';
import iconsWithText from '@data/hud-menu.json';
import {
    DESKTOP_HUD_ICONS_POSITION_SETTINGS,
    MOBILE_HUD_ICONS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config';
import { ThreeEvent } from '@react-three/fiber';
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
    margin = 0.5,
}: {
    reducer: ReducerType;
    /** @defaultValue 0.5 */
    margin?: number;
}) {
    const navigate = useNavigate();

    const { isMobile, contentWidth, contentHeight, generalScaleX } = reducer;

    const eventsList = {
        onClick: (event: ThreeEvent<MouseEvent>) => {
            handleHudClick(event, navigate);
        },
    };

    const gridOptions = {
        columnsNumber: isMobile ? 4 : 1,
        rowOffset: 0,
        marginX: isMobile ? 2.5 : 2.5,
        marginY: isMobile ? 0.5 : 1.5,
        windowMargin: 0.5,
        forceColumnsNumber: isMobile ? true : false,
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

    return (
        <Hud>
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
                    mobileTextProps={{ right: true }}
                />
            </group>
        </Hud>
    );
});

// const iconsWithText = useMemo(() => getIconsWithText(), []);
export default MemoizedHudMenu;
