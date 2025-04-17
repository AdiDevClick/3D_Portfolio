import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { useMutationObserver } from '@/hooks/useMutationObserver.tsx';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Group } from 'three';

const handleObserver = (mutationsList, observer) => {
    console.log('Mutation détectée:', mutationsList.length);
    mutationsList.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            console.log('Nœuds ajoutés:', mutation.addedNodes.length);
            const addedNodes = mutation.addedNodes[0].children;
            for (const node of addedNodes) {
                // if (this.#inputsToListen.includes(node.type)) {
                // Setting which input can be empty
                // setObjectPropertyTo(
                //     this.options.whichInputCanBeEmpty,
                //     node,
                //     node.name,
                //     'canBeEmpty',
                //     true
                // );
                // Setting which input can accept special char
                // setObjectPropertyTo(
                //     this.options.whichInputAllowSpecialCharacters,
                //     node,
                //     node.name,
                //     'allowSpecialCharacters',
                //     true
                // );
                // Creating valid / invalid icon for each inputs
                // this.#createIconContainer(node);
                // // Main dynamic checker
                // node.addEventListener(
                //     'input',
                //     debounce((e) => {
                //         this.#dynamicCheck(e.target);
                //     }, this.debounceDelay)
                // );
                // }
            }
        }
    });
};

export function Home() {
    const containerRef = useRef(null);
    const groupRef = useRef<Group>(null);
    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeURL, setActiveURL] = useState(false);
    // const homeRef = useRef(null);
    // const { setRef, node, observer } = useMutationObserver(handleObserver);

    useEffect(() => {
        if (!containerRef.current) return;
        setIsLoaded(true);
        !location.pathname.includes('projets')
            ? setActiveURL(true)
            : setActiveURL(false);
    }, [containerRef.current, location]);

    /**
     * POSITIONING IF URL IS ACTIVE / NON ACTIVE -
     */
    useFrame((state, delta) => {
        if (!groupRef.current && !isLoaded) return;
        easing.damp3(
            groupRef.current.position,
            activeURL
                ? ACTIVE_PROJECTS_POSITION_SETTINGS
                : DEFAULT_PROJECTS_POSITION_SETTINGS,
            0.2,
            delta
        );
    });

    return (
        <group ref={groupRef}>
            <HtmlContainer className="html-container">
                <HomeContent
                    ref={containerRef}
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transform: 'translate(-50%) rotateY(180deg)',
                        transition:
                            'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        height: '500px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 0,
                    }}
                />
            </HtmlContainer>
        </group>
    );
}
export function HomeContent({ ...props }) {
    return (
        <div
            {...props}
            // className="lateral-menu"
        >
            <h1 style={{ color: 'black' }}>Accueil</h1>
            <p style={{ color: 'black' }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, voluptatibus. Lorem ipsum dolor sit amet{' '}
            </p>
        </div>
    );
}
