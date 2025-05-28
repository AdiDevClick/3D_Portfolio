import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
import { TitleTypes } from '@/components/3DComponents/Title/TitlesTypes';
import { importedFont } from '@/configs/3DFonts.config';
import { wait } from '@/functions/promises';
import { use3DIntersectionObserver } from '@/hooks/use3DIntersectionObserver';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { frustumChecker } from '@/utils/frustrumChecker';
import { Center, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { act, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Group } from 'three';

/**
 * 3D Title component that displays a 3D text in the center of the screen.
 * It uses the Montserrat font and allows for customization of size and other properties.
 *
 * @param children - Text to display
 * @param size - Text size (default = 30)
 * @param isMobile - If true, will use mobile settings (default = false)
 * @param textProps - Text3D properties
 * @param position - Position of the Center and NOT THE TEXT
 * @param rotation - Rotation of the Center and NOT THE TEXT
 * @param props - Center properties
 */
export function Title({
    children,
    ref,
    name,
    size = 40,
    isMobile = false,
    textProps = {},
    scalar,
    options = { priority: 'low', enabled: true },
    ...props
}: TitleTypes) {
    const { priority = 'medium', enabled = true } = options;
    const [isLoaded, setIsLoaded] = useState(false);
    const [isTextLoaded, setIsTextLoaded] = useState(false);
    const textRef = useRef<Group>(null);
    const actualRef = ref || textRef;
    const frameCountRef = useRef(0);

    // Délais basés sur la priorité
    const getLoadDelay = useCallback(() => {
        const delays = {
            high: 100, // Titre principal - charge vite
            medium: 300, // Titres de section
            low: 500, // Titres d'icônes
        };

        const baseDelay = delays[priority];

        // Ajouter un délai aléatoire pour éviter le chargement simultané
        const randomOffset = Math.random() * 200;

        return baseDelay + randomOffset;
    }, [priority]);

    // const { intersectRef, isIntersecting, isReady } = use3DIntersectionObserver(
    //     {
    //         threshold: 0.1,
    //         rootMargin: '50px',
    //         triggerOnce: true,
    //         enabled,
    //         loadDelay: getLoadDelay(),
    //         onIntersect: () => {
    //             console.log(`Loading Text3D for: ${name || 'unnamed'}`);
    //             setIsTextLoaded(true);
    //         },
    //     }
    // );

    // const { wasIntersecting, isIntersecting } =
    //     useIntersectionObserver(actualRef);
    const onText3DLoaded = useCallback(async () => {
        if (isTextLoaded) return;
        // frameCountRef.current += 1;
        // await wait(800);
        // if (frameCountRef.current % 100 !== 0) {
        // if (isLoaded || (!ref.current && !textRef.current)) return;
        setIsTextLoaded(true);
        // console.log('loaded');
        // }
    }, []);

    useFrame((state, delta) => {
        if (!actualRef.current || isTextLoaded) return;
        frameCountRef.current += 1;
        frustumChecker(
            actualRef.current,
            state,
            frameCountRef.current,
            isMobile,
            { mobileTime: 10, desktopTime: 20, name: name || 'title' }
        );

        if (actualRef.current.visible) {
            console.log(actualRef.current);
            easing.damp3(actualRef.current.position, [0, 0, 0], 0.2, delta);
        } else {
            easing.damp3(actualRef.current.position, [0, 0, 10], 0.2, delta);
        }
    });

    return (
        <Center front ref={actualRef} name={name} {...props}>
            <group>
                {isTextLoaded && (
                    <Text3D
                        castShadow
                        receiveShadow
                        bevelEnabled={true}
                        curveSegments={isMobile ? 4 : 32}
                        bevelSegments={isMobile ? 2 : 4}
                        bevelThickness={1}
                        bevelSize={1.5}
                        bevelOffset={0.5}
                        scale={0.01}
                        size={size}
                        height={1}
                        smooth={1}
                        letterSpacing={2.5}
                        font={importedFont}
                        visible={isTextLoaded}
                        {...textProps}
                    >
                        {children}
                        {/* <meshNormalMaterial /> */}
                        {/* <MeshTransmissionMaterial
                            clearcoat={1}
                            samples={isMobile ? 1 : 8}
                            thickness={40}
                            chromaticAberration={isMobile ? 0.05 : 0.25}
                            anisotropy={isMobile ? 0 : 0.4}
                            resolution={isMobile ? 256 : 2048}
                            distortion={0}
                        /> */}
                        {/* <meshLambertMaterial color={'grey'} /> */}
                        {/* <meshStandardMaterial
                    color="#757575"
                    metalness={0.2}
                    roughness={0.5}
                    envMapIntensity={1}
                /> */}
                        {/* <meshStandardMaterial
                    color="#ffffff"
                    emissive="#4facfe" // Bleu néon vif
                    emissiveIntensity={1.2}
                    metalness={0.2}
                    roughness={0.2}
                    envMapIntensity={2}
                /> */}
                        <meshStandardMaterial
                            color="black"
                            metalness={0.7}
                            roughness={0.3}
                            envMapIntensity={2.5}
                        />
                        {/* <Outlines
                    transparent
                    opacity={0.95}
                    color="#00f2fe" // Cyan brillant pour le contour
                    thickness={0.05}
                    screenspace={false}
                    pulse={1.5} // Effet de pulsation
                /> */}
                        {/* <meshMatcapMaterial color={'grey'} /> */}
                    </Text3D>
                    // <LazyText3D
                    //     ref={textRef}
                    //     name={name}
                    //     size={size}
                    //     isMobile={isMobile}
                    //     textProps={{
                    //         ...textProps,
                    //         onAfterRender: onText3DLoaded,
                    //         position: [0, 0, 0],
                    //         scale: scalar ? 0.01 * scalar : 0.01,
                    //     }}
                    //     scalar={scalar}
                    // >
                    //     {children}
                    // </LazyText3D>
                )}
                {!isTextLoaded && (
                    // <Center
                    //     front
                    //     // ref={ref ? ref : (ref = textRef)}
                    //     name={name}
                    //     {...props}
                    // >
                    <group>
                        <FallbackText
                            onAfterRender={onText3DLoaded}
                            position={[0, 0, 0.1]}
                            // position-x={1}
                            // position-y={1}
                        >
                            {children}
                        </FallbackText>
                    </group>

                    // </Center>
                )}
            </group>
        </Center>
    );
}

function LazyText3D({
    children,
    size = 40,
    isMobile = false,
    textProps = {},
    scalar,
    ...props
}: TitleTypes) {
    const [isLoaded, setIsLoaded] = useState(false);
    const textRef = useRef<Group>(null);

    useEffect(() => {
        if (textRef.current) {
            setIsLoaded(true);
        }
    }, []);

    return (
        <Text3D
            castShadow
            receiveShadow
            bevelEnabled={true}
            curveSegments={isMobile ? 4 : 32}
            bevelSegments={isMobile ? 2 : 4}
            bevelThickness={1}
            bevelSize={1.5}
            bevelOffset={0.5}
            scale={0.01}
            size={size}
            height={1}
            smooth={1}
            letterSpacing={2.5}
            font={importedFont}
            {...textProps}
        >
            {children}
            <meshStandardMaterial
                color="black"
                metalness={0.7}
                roughness={0.3}
                envMapIntensity={2.5}
            />
        </Text3D>
    );
}
