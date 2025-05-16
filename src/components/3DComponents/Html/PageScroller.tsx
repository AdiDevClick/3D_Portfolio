import { Scroll } from '@react-three/drei';
import '@css/PageScroller.scss';
import { createContext, useContext, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer.tsx';

/**
 * PageScroller component - !! IMPORTANT !!
 *
 * @description This component is used to create a scrollable area in the 3D scene.
 * @returns PageScroller component
 */
export function PageScroller() {
    const containerRef = useRef(null);
    return (
        <group ref={containerRef}>
            {containerRef.current && (
                <Scroll html>
                    <div className="scroll-container"></div>
                </Scroll>
            )}
        </group>
    );
}

{
    /* // <Html
            //     as="div"
            //     className="scroll-container"
            //     style={{
            //         position: 'relative',
            //         // top: 0,
            //         // left: 0,
            //         // width: '100%',
            //         height: `${virtualPageCount} * 100vh`,
            //         maxHeight: '100%',
            //         minHeight: '100vh',
            //         transform: 'translate(-50%, -50%)',
            //         // userSelect: 'none',
            //         transformStyle: 'preserve-3d',
            //         // background: 'black',
            //     }}
            // >
            // </Html> */
}
const ScrollContext = createContext(0);
export const useScrollPosition = () => useContext(ScrollContext);

/**
 * Composant ScrollSync - Alternative à Scroll html
 * Synchronise le scroll HTML avec ScrollControls
 */
export function ScrollSync({ children, pages }) {
    const [scrollY, setScrollY] = useState(0);
    const scrollRef = useRef(null!);

    // Accéder au contexte de ScrollControls
    useFrame(({ gl, viewport, events, scene }) => {
        // Lire la position de scroll depuis les events de THREE
        if (events.handlers?.scroll) {
            const scrollPos = events.handlers.scroll.offset;
            if (scrollPos !== undefined && scrollPos !== scrollY) {
                setScrollY(scrollPos);
            }
        }
    });

    return (
        <ScrollContext.Provider value={scrollY}>
            <HtmlContainer
                // fullscreen
                transform={false}
                // as="div"
                className="html-container"
                // style={{ top: `${scrollY}px` }}
            >
                <div
                    // as="div"
                    className="scroll-container"
                    style={{
                        position: 'sticky',
                        // top: 0,
                        // left: 0,
                        // width: '100%',
                        // inset: 0,
                        top: `${scrollY}px`,
                        // height: `${pages}`,
                        // height: `${pages} * 100vh`,
                        height: `${pages} * 100vh`,
                        // scale: 10,
                        // maxHeight: '100%',
                        // minHeight: `${pages} * 1000vh`,
                        // minHeight: '100vh',
                        // minHeight: '100%',
                        transform: 'translate(0)',
                        // userSelect: 'none',
                        transformStyle: 'preserve-3d',
                        // background: 'black',
                    }}
                    // transform={true}
                    // fullscreen
                >
                    {/* {children} */}
                </div>
            </HtmlContainer>
        </ScrollContext.Provider>
    );
}

/**
 * Composant Section - Pour créer des sections HTML synchronisées
 * avec le défilement 3D
 */
export function ScrollSection({ children, style, className, page = 0 }) {
    return (
        <div
            className={className}
            style={{
                position: 'absolute',
                top: `${page * 100}vh`,
                width: '100%',
                ...style,
            }}
        >
            {children}
        </div>
    );
}
