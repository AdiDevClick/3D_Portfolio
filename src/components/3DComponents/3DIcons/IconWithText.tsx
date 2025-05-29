import { Title } from '@/components/3DComponents/Title/Title';
import { Center, Float, useCursor, useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { JSX, Suspense, use, useMemo, useRef, useState } from 'react';
import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
import { useSpring, animated } from '@react-spring/three';
import { IconsContainerContext } from '@/api/contexts/IconsContainerProvider';
import { IconsContainerContextTypes } from '@/components/3DComponents/3DIcons/IconsContainer';
import { sharedMatrices } from '@/utils/matrices';
import { PlaceholderIcon } from '@/components/3DComponents/3DIcons/PlaceHolderIcon';
import { Icons } from '@/components/3DComponents/3DIcons/Icons';
import { useFrame, useLoader } from '@react-three/fiber';
import { FontLoader } from 'three-stdlib';
import { importedFont } from '@/configs/3DFonts.config';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';

//TODO: Fix sizing for the bbox of the icon with text
type IconsTypes = {
    model: string;
    datas: { name: string; text: string };
} & JSX.IntrinsicElements['group'];

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
export function IconWithText({ model, datas, ...props }: IconsTypes) {
    const contextValue = use(IconsContainerContext);
    if (!contextValue) {
        throw new Error(
            'IconWithText must be used within IconsContainerProvider'
        );
    }

    let {
        margin,
        animations,
        mobileTextProps,
        floatOptions,
        eventsList,
        isMobile,
        iconScale,
        scalar,
        isClickable,
    } = contextValue as IconsContainerContextTypes;

    scalar = 0.8 * scalar;
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

    // const { nodes } = useLoader(GLTFLoader, model, (loader) => {
    //     const gltfLoader = loader as GLTFLoader;
    //     const dracoLoader = new DRACOLoader();
    //     dracoLoader.setDecoderPath(
    //         'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    //     );
    //     gltfLoader.setDRACOLoader(dracoLoader);
    // });

    // const [nodes, setNodes] = useState<any>(null);

    // useMemo(() => {
    //     gltfLoader.load(
    //         model,
    //         (gltf) => setNodes(gltf),
    //         undefined,
    //         (error) => console.error('Error loading model:', error)
    //     );
    // }, [model]);

    // const { nodes } = useGLTF(model);
    // const { nodes } = useGLTF(model, true);
    // const { nodes } = useLoader(GLTFLoader, model, (loader) => {
    //     // const gltfLoader = loader as GLTFLoader;
    //     const dracoLoader = new DRACOLoader();
    //     dracoLoader.setDecoderPath(
    //         'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    //     );
    //     loader.setDRACOLoader(dracoLoader);
    // });

    // const font = useLoader(
    //     FontLoader,
    //     'src/assets/fonts/helvetiker_regular.typeface.json'
    // );
    const groupRef = useRef<Group>(null!);
    // const frameCountRef = useRef(0);
    // console.log('Model loaded:', model);

    useCursor(hovered);

    // useEffect(() => {
    //     if (!groupRef.current && !animations.animatePosition.from) return;

    //     isComponentMounted = animations.animatePosition.from;

    //     return () => {
    //         isComponentMounted = animations.animatePosition.default;
    //     };
    // }, []);

    /**
     * Checks if the icon is in the camera's frustum
     * and enables/disables the scaling ease.
     */
    useFrame((_, delta) => {
        // if (!groupRef.current) return;
        // frameCountRef.current += 1;
        // if (frameCountRef.current % 4 === 0) {
        //     // const contentGrid = groupRef.current.parent?.parent;
        //     if (!animations.animatePosition) return;
        //     // if (contentGrid?.visible)
        //     easing.damp3(
        //         groupRef.current.position,
        //         isComponentMounted,
        //         0.3,
        //         delta
        //     );
        //     // easing.damp3(
        //     //     groupRef.current.position,
        //     //     !isComponentMounted
        //     //         ? animations.animatePosition.from
        //     //         : animations.animatePosition.default,
        //     //     2000,
        //     //     delta
        //     // );
        // }
    });
    // console.log('je rerender iConWithText');

    return (
        <animated.group
            name={datas.name}
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
            {/* <group
                name={datas.name}
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
                // position-x={isClickable ? -0.5 * scalar : 0}
            > */}
            <FloatingTitle
                scalar={scalar}
                isMobile={isMobile}
                size={30}
                isClickable={true}
                floatOptions={floatOptions}
                textProps={{
                    scale: 0.01 * scalar,
                }}
                name={'icons-' + datas.name + '__title'}
                right
                position-x={0.2 * scalar}
                text={datas.text}
            >
                <Center left>
                    <Icons
                        model={model}
                        hovered={hovered}
                        scale={iconScale * scalar}
                    />
                </Center>
                {/* <Title
                        right
                        isMobile={isMobile}
                        name="icons-Container__title"
                        position-x={0.2 * scalar}
                        // position-y={-0.1}
                        size={30}
                        // font={importedFont}
                        // font={font.data}
                        textProps={{ scale: 0.01 * scalar }}
                        scalar={scalar}
                        text={datas.text}
                    /> */}
            </FloatingTitle>
            {/* <Suspense fallback={<PlaceholderIcon />}> */}
            {/* <Float {...floatOptions}> */}
            {/* <Center
                        position-y={isMobile ? -0.8 * scalar : 0}
                        position-x={isMobile ? 0.1 * scalar : 0}
                        back
                        left
                        bottom={isMobile ? true : false}
                    > */}
            {/* <Suspense fallback={<PlaceholderIcon />}> */}
            {/* <Center left>
                        <Icons
                            model={model}
                            hovered={hovered}
                            scale={iconScale * scalar}
                        />
                    </Center> */}

            {/* </Suspense> */}
            {/* </Center> */}
            {/* {!isMobile ? (
                        <Title
                            right
                            isMobile={isMobile}
                            name="icons-Container__title"
                            position-x={0.2 * scalar}
                            position-y={-0.1}
                            size={30}
                            textProps={{ scale: 0.01 * scalar }}
                            scalar={scalar}
                        >
                            {datas.text}
                        </Title>
                    ) : (
                        <Center
                            {...mobileTextProps}
                            name="icons-Container__title"
                        >
                            <FallbackText>{datas.text}</FallbackText>
                        </Center>
                    )} */}
            {/* <Suspense fallback={<PlaceholderIcon />}> */}
            {/* <Suspense fallback={null}> */}
            {/* <Title
                        right
                        isMobile={isMobile}
                        name="icons-Container__title"
                        position-x={0.2 * scalar}
                        // position-y={-0.1}
                        size={30}
                        // font={importedFont}
                        // font={font.data}
                        textProps={{ scale: 0.01 * scalar }}
                        scalar={scalar}
                        text={datas.text}
                    /> */}
            {/* </Center> */}
            {/* </Suspense> */}
            {/* <mesh
                        name="clickable-box"
                        scale={isMobile ? 0.7 * scalar : 1.2 * scalar}
                        // position-y={isMobile ? -0.8 * scalar : 0}
                        // position-x={isMobile ? -0.5 * scalar : 0.2 * scalar}
                        geometry={sharedMatrices.boxGeometry}
                        visible={true}
                    /> */}
            {/* </Float> */}
            {/* </Suspense> */}
            {/* </group> */}
        </animated.group>
    );
}
