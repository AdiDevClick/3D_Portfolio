import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer';
import { BillboardPageContainerProps } from '@/components/3DComponents/Html/HtmlPagesTypes';
import {
    DEFAULT_HTML_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
} from '@/configs/3DCarousel.config';
import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Group } from 'three';

/**
 * PageContainer component
 *
 * @description This component is used to create a container for the HTML content of a page.
 * The container will have a default .html-container class.
 * It will always face the camera
 * By default, the content will be on the right side of the position 0 of the container
 * If not needed, specify transform: translate(-50%); in the css of the content class
 *
 * @param pageName - Name of the page
 * @returns
 */
export function BillboardPageContainer({
    children,
    pageName,
}: BillboardPageContainerProps) {
    const groupRef = useRef<Group>(null);
    const location = useLocation();

    const [activeURL, setActiveURL] = useState(false);

    /**
     * Activate page URL and content loaded
     */
    useEffect(() => {
        if (!groupRef.current) return;
        console.log(location.pathname);
        location.pathname === pageName
            ? setActiveURL(true)
            : setActiveURL(false);
    }, [location]);

    /**
     * POSITIONING IF URL IS ACTIVE / NON ACTIVE -
     */
    useFrame((_, delta) => {
        if (groupRef.current) {
            easing.damp3(
                groupRef.current.position,
                activeURL
                    ? (DEFAULT_HTML_POSITION_SETTINGS as [
                          number,
                          number,
                          number
                      ])
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
            // lockX={false}
            // lockY={true}
            // lockZ={true}
        >
            <HtmlContainer key={pageName} className="html-container">
                {children}
            </HtmlContainer>
        </Billboard>
    );
}
