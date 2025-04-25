import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { HomeContent } from '@/pages/Home/HomeContent.tsx';
import { Billboard } from '@react-three/drei';
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
    const pageRef = useRef(null);
    // const groupRef = useRef<Group>(null);
    // const location = useLocation();

    // const [isLoaded, setIsLoaded] = useState(false);
    // const [activeURL, setActiveURL] = useState(false);

    // /**
    //  * Activate page URL and content loaded
    //  */
    // useEffect(() => {
    //     if (!pageRef.current) return;
    //     setIsLoaded(true);
    //     location.pathname === '/' ? setActiveURL(true) : setActiveURL(false);
    // }, [pageRef.current, location]);

    // /**
    //  * POSITIONING IF URL IS ACTIVE / NON ACTIVE -
    //  */
    // useFrame((_, delta) => {
    //     if (groupRef.current && isLoaded) {
    //         easing.damp3(
    //             groupRef.current.position,
    //             activeURL
    //                 ? ACTIVE_PROJECTS_POSITION_SETTINGS
    //                 : DEFAULT_PROJECTS_POSITION_SETTINGS,
    //             0.3,
    //             delta
    //         );
    //     }
    // });

    return (
        <PageContainer pageName={'/'}>
            <HomeContent
                ref={pageRef}
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
        </PageContainer>
        // <Billboard
        //     ref={groupRef}
        //     follow={true}
        //     lockX={false}
        //     lockY={false}
        //     lockZ={false}
        // >
        //     <HtmlContainer key={'home'} className="html-container">
        //         <HomeContent
        //             ref={pageRef}
        //             style={{
        //                 opacity: isLoaded ? 1 : 0,
        //                 transform: 'translate(-50%)',
        //                 transition:
        //                     'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
        //                 height: '500px',
        //                 width: 'clamp(min(52%, 100%), 100%, 52vw)',
        //                 background: 'rgba(255, 255, 255, 0.95)',
        //                 zIndex: 0,
        //             }}
        //         />
        //     </HtmlContainer>
        // </Billboard>
    );
}
