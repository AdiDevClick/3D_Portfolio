import { useFrame } from '@react-three/fiber';
import {
    useScroll,
    useTexture,
    ScrollControls,
    Scroll,
} from '@react-three/drei';
import {
    ReactNode,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import '../../../utils/util.tsx';
import Carousel from '@/components/3DComponents/Carousel/Carousel';
import MemoizedAbout from '@/pages/About/About';
import { PageScroller } from '@/components/3DComponents/Html/PageScroller';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';
import MemoizedHome from '@/pages/Home/Home';
import { ReducerType } from '@/hooks/reducers/carouselTypes';
import { SettingsType } from '@/configs/3DCarouselSettingsTypes';
import MemoizedContact from '@/pages/Contact/Contact';

export type PagesTypes = {
    contentWidth: ReducerType['contentWidth'];
    contentHeight: ReducerType['contentHeight'];
    generalScaleX: ReducerType['generalScaleX'];
    visible: ReducerType['visible'];
    isMobile: ReducerType['isMobile'];
};

/**
 * Scene component
 * @description : Depending on the page, it will create virtual pages
 * so the user can scroll the contents.
 *
 * @param SETTINGS - Settings defined in the 3DCarouselSettingsTypes.tsx
 * @param boundaries - Boundaries of the carousel
 * @param reducer - ReducerType
 * @param children - Children to be rendered if used in the Router
 * @returns
 */
export function Scene({
    children,
    SETTINGS,
    boundaries,
    reducer,
}: {
    children: ReactNode;
    SETTINGS: SettingsType;
    boundaries: { x: number; y: number; z: number };
    reducer: ReducerType;
}) {
    const {
        generalScaleX,
        contentHeight,
        contentWidth,
        activeContent,
        isMobile,
        showElements,
        activateElement,
        clickElement,
        visible,
        allCardsLoaded,
        addElements,
        updateElements,
        deleteElements,
        updateBending,
        updateWidth,
    } = reducer;

    const pagesRef = useRef(null!);

    const [virtualPageCount, setVirtualPageCount] = useState(0);

    /**
     * Detect route change -
     * @description : This will automatically
     * apply virtual page count to enable scroll and scroll damping
     */
    useEffect(() => {
        switch (visible) {
            case 'home':
                setVirtualPageCount(5);
                break;
            case 'about':
                setVirtualPageCount(1.3);
                break;
            default:
                setVirtualPageCount(0);
        }
    }, [visible]);

    const pagesMemoProps = useMemo(
        () => ({
            contentWidth: contentWidth,
            contentHeight: contentHeight,
            isMobile: isMobile,
            generalScaleX: generalScaleX,
            visible: visible,
        }),
        [contentWidth, contentHeight, isMobile, generalScaleX, visible]
    );

    return (
        <>
            {/* <Perf minimal={true} antialias={false} position={'bottom-left'} /> */}
            {/* <Preload all /> */}

            <ScrollControls
                pages={virtualPageCount}
                distance={0.3}
                damping={0.5}
            >
                <Scroll ref={pagesRef}>
                    {/* <Suspense fallback={<PlaceholderIcon />}> */}
                    {/* <Suspense fallback={null}> */}
                    <MemoizedHome {...pagesMemoProps} />
                    {/* </Suspense> */}
                    {/* <Suspense fallback={<PlaceholderIcon />}> */}
                    <MemoizedAbout {...pagesMemoProps} />
                    {/* </Suspense> */}
                    <MemoizedContact {...pagesMemoProps} />
                    {/* </Suspense> */}
                </Scroll>
                {/* <PageScroller /> */}
                {/* {pagesRef.current && <PageScroller />} */}
                {pagesRef.current && isMobile && <PageScroller />}
            </ScrollControls>
            {/* <Banner position={[0, -0.15, 0]} /> */}

            {/* <Rig> */}
            {/* <Rig rotation={[0, 0, 0.15]}> */}

            {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={80}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                    />
                </mesh> */}
            <Suspense fallback={<PlaceholderIcon />}>
                <Carousel
                    reducer={reducer}
                    boundaries={boundaries}
                    SETTINGS={SETTINGS}
                />
            </Suspense>

            {/* </Rig> */}

            {/* <Banner position={[0, -0.15, 0]} /> */}

            {children}
        </>
    );
}

// function Rig(props) {
//     const ref = useRef(null);
//     const scroll = useScroll();
//     useFrame((state, delta) => {
//         // ref.current.lookAt(1, 0, -1); // Look at center

//         ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
//         state.events.update(); // Raycasts every frame rather than on pointer-move
//         // Move camera
//         // easing.damp3(
//         //     state.camera.position,
//         //     [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
//         //     0.3,
//         //     delta
//         // );
//         // state.camera.lookAt(0, 0, 0); // Look at center
//     });
//     return <group ref={ref} {...props} />;
// }

{
    /* {hovered && (
                <MotionPathControls
                    ref={motionPathRef}
                    object={ref}
                    curves={[
                        new THREE.CubicBezierCurve3(
                            new THREE.Vector3(-5, -5, 0),
                            new THREE.Vector3(-10, 0, 0),
                            new THREE.Vector3(0, 3, 0),
                            new THREE.Vector3(6, 3, 0)
                        ),
                        new THREE.CubicBezierCurve3(
                            new THREE.Vector3(6, 3, 0),
                            new THREE.Vector3(10, 5, 5),
                            new THREE.Vector3(5, 3, 5),
                            new THREE.Vector3(5, 5, 5)
                        ),
                    ]}
                />
            )} */
}

// function Banner(props) {
//     const ref = useRef();
//     const texture = useTexture('../images/work_.png');
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     const scroll = useScroll();
//     useFrame((state, delta) => {
//         ref.current.material.time.value += Math.abs(scroll.delta) * 4;
//         ref.current.material.map.offset.x += delta / 2;
//     });
//     return (
//         <mesh ref={ref} {...props}>
//             <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
//             <meshSineMaterial
//                 map={texture}
//                 map-anisotropy={16}
//                 map-repeat={[30, 1]}
//                 side={THREE.DoubleSide}
//                 toneMapped={false}
//             />
//         </mesh>
//     );
// }
