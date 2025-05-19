import { ReducerContext } from '@/App';
import { useCarousel } from '@/hooks/reducers/useCarousel.tsx';
import { createContext, ReactNode, use, useEffect } from 'react';

const initialCameraFov = 20;
const vFov = (initialCameraFov * Math.PI) / 180;
const height = 2 * Math.tan(vFov / 2) * 20;

// export const RecuderContext = createContext(null);
export function SceneParams({
    children,
    size,
    SETTINGS,
}: {
    children: ReactNode;
}) {
    const reducer = useCarousel();

    //Specify boundaries & responsive boundaries
    const aspectRatio = size[0] / size[1];
    const width = height * aspectRatio;

    const scaleX = Math.max(0.5, size[0] / 1920);
    const scaleY = Math.max(0.5, size[1] / 1080);

    // const responsiveBoundaries = {
    //     x: SETTINGS.x * scaleX,
    //     y: SETTINGS.y * scaleY,
    //     z: SETTINGS.z,
    // };

    useEffect(() => {
        reducer.setMobile(size[0] < 768);
        reducer.setTablet(size[0] < 1024);
        reducer.setContentWidth(width);
        reducer.setContentSizes(size);
        reducer.setContentHeight(height);
        // reducer.setGeneralScales({ scaleX: scaleX, scaleY: scaleY });
        reducer.setGeneralScaleX(scaleX);
        reducer.setGeneralScaleY(scaleY);
        // reducer.setViewMode(viewMode);
    }, [size[0]]);

    // console.log('je render le scene params');
    return <ReducerContext value={reducer}> {children}</ReducerContext>;
    // return {
    //     camera: {
    //         fov: 75,
    //         near: 0.1,
    //         far: 1000,
    //         position: [0, 0, 5],
    //     },
    //     renderer: {
    //         antialias: true,
    //         alpha: true,
    //         powerPreference: 'high-performance',
    //     },
    //     controls: {
    //         enableDamping: true,
    //         dampingFactor: 0.25,
    //         minPolarAngle: Math.PI / 4,
    //         maxPolarAngle: (Math.PI * 3) / 4,
    //     },
    // };
}
