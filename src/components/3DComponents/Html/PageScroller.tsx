import { Scroll } from '@react-three/drei';
import '@css/PageScroller.scss';
import { useRef } from 'react';

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

// const ScrollContext = createContext(0);
// export const useScrollPosition = () => useContext(ScrollContext);

/**
 * Composant ScrollSync - Alternative à Scroll html
 * Synchronise le scroll HTML avec ScrollControls
 */
// export function ScrollSync({ children, pages }) {
//     const [scrollY, setScrollY] = useState(0);
//     const scrollRef = useRef(null!);

//     // Accéder au contexte de ScrollControls
//     useFrame(({ gl, viewport, events, scene }) => {
//         // Lire la position de scroll depuis les events de THREE
//         if (events.handlers?.scroll) {
//             const scrollPos = events.handlers.scroll.offset;
//             if (scrollPos !== undefined && scrollPos !== scrollY) {
//                 setScrollY(scrollPos);
//             }
//         }
//     });

//     return (
//         <ScrollContext.Provider value={scrollY}>
//             <HtmlContainer
//                 transform={false}
//                 className="html-container"
//             >
//                 <div
//                     className="scroll-container"
//                     style={{
//                         position: 'sticky',
//                         top: `${scrollY}px`,
//                         height: `${pages} * 100vh`,
//                         transform: 'translate(0)',
//                         transformStyle: 'preserve-3d',
//                     }}
//                 >
//                 </div>
//             </HtmlContainer>
//         </ScrollContext.Provider>
//     );
// }

/**
 * Composant Section - Pour créer des sections HTML synchronisées
 * avec le défilement 3D
 */
// export function ScrollSection({ children, style, className, page = 0 }) {
//     return (
//         <div
//             className={className}
//             style={{
//                 position: 'absolute',
//                 top: `${page * 100}vh`,
//                 width: '100%',
//                 ...style,
//             }}
//         >
//             {children}
//         </div>
//     );
// }
