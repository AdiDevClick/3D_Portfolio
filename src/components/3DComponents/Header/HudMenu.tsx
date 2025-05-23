import MemoizedIconsContainer from '@/components/3DComponents/3DIcons/IconsContainer';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { Center, Hud } from '@react-three/drei';
import { memo, useRef } from 'react';
import { Group } from 'three';
import iconsWithText from '@data/hud-menu.json';
import { DESKTOP_HTML_ICONS_POSITION_SETTINGS } from '@/configs/3DCarousel.config';

const floatOptions = {
    autoInvalidate: true,
    speed: 1.5,
    rotationIntensity: 0.5,
    floatIntensity: 0.5,
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
    const homeButonRef = useRef<Group>(null!);
    const aboutButtonRef = useRef<Group>(null!);
    const contactButtonRef = useRef<Group>(null!);
    const projectsButtonRef = useRef<Group>(null!);

    const { isMobile, contentWidth, contentHeight, generalScaleX } = reducer;

    const gridOptions = {
        columnsNumber: isMobile ? 4 : 1,
        rowOffset: 0,
        marginX: 2.5,
        marginY: 1.5,
        windowMargin: 1,
    };
    const calculatedHeight =
        -contentHeight + contentHeight - 0.5 * generalScaleX;
    const iconsPos = DESKTOP_HTML_ICONS_POSITION_SETTINGS(
        calculatedHeight,
        contentWidth,
        0.5
    );

    return (
        <Hud>
            {/* <Center> */}
            <MemoizedIconsContainer
                width={contentWidth ?? 1}
                icons={iconsWithText}
                scalar={0.4 * generalScaleX}
                gridOptions={gridOptions}
                iconScale={10}
                floatOptions={floatOptions}
                // position-y={
                //     isMobile
                //         ? -2 * generalScaleX - margin
                //         : 0 * generalScaleX - margin
                // }
                // position-x={
                //     isMobile
                //         ? -2 * generalScaleX - margin
                //         : 2 * generalScaleX - margin
                // }
                position={iconsPos}
                isMobile={isMobile}
            />
            {/* </Center> */}
        </Hud>
    );
});

// const iconsWithText = useMemo(() => getIconsWithText(), []);
export default MemoizedHudMenu;
