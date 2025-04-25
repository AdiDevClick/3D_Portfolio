import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { AboutContent } from '@/pages/About/AboutContent.tsx';
import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Group } from 'three';

export function About() {
    const pageRef = useRef(null);
    const groupRef = useRef<Group>(null);
    const location = useLocation();

    const [isLoaded, setIsLoaded] = useState(false);
    const [activeURL, setActiveURL] = useState(false);

    /**
     * Activate page URL and content loaded
     */
    useEffect(() => {
        if (!pageRef.current) return;
        setIsLoaded(true);
        location.pathname.includes('a-propos')
            ? setActiveURL(true)
            : setActiveURL(false);
    }, [pageRef.current, location]);

    /**
     * POSITIONING IF URL IS ACTIVE / NON ACTIVE -
     */
    useFrame((_, delta) => {
        if (groupRef.current && isLoaded) {
            easing.damp3(
                groupRef.current.position,
                activeURL
                    ? ACTIVE_PROJECTS_POSITION_SETTINGS
                    : DEFAULT_PROJECTS_POSITION_SETTINGS,
                0.3,
                delta
            );
        }
    });

    return (
        <Billboard
            ref={groupRef}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
        >
            <HtmlContainer key={'about'} className="html-container">
                <AboutContent
                    ref={pageRef}
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transform: 'translate(-50%)',
                        transition:
                            'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                        height: '500px',
                        width: 'clamp(min(52%, 100%), 100%, 52vw)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 0,
                    }}
                />
            </HtmlContainer>
        </Billboard>
    );
}
