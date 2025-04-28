import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';
import {
    DEFAULT_HTML_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config.ts';
import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Group } from 'three';

type PageContainerTypes = { children: ReactNode; pageName: string };

export function PageContainer({ children, pageName }: PageContainerTypes) {
    const groupRef = useRef<Group>(null);
    const location = useLocation();

    const [activeURL, setActiveURL] = useState(false);
    // const { lookAtSmooth } = useLookAtSmooth();

    /**
     * Activate page URL and content loaded
     */
    useEffect(() => {
        if (!groupRef.current) return;
        location.pathname === pageName
            ? setActiveURL(true)
            : setActiveURL(false);
    }, [location]);

    // useEffect(() => {
    // if (!groupRef.current || !activeURL) return;
    // const timer = setTimeout(() => {
    // lookAtSmooth(groupRef.current.position);
    // return () => clearTimeout(timer);
    // }, 100);
    // }, [activeURL]);

    /**
     * POSITIONING IF URL IS ACTIVE / NON ACTIVE -
     */
    useFrame((_, delta) => {
        if (groupRef.current) {
            easing.damp3(
                groupRef.current.position,
                activeURL
                    ? DEFAULT_HTML_POSITION_SETTINGS
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
            <HtmlContainer key={pageName} className="html-container">
                {children}
            </HtmlContainer>
        </Billboard>
    );
}
