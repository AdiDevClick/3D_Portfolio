import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '@css/PageScroller.scss';

/**
 * PageScroller - Solution sans erreur avec portail React natif
 */
export function PageScrolling({ virtualPageCount }) {
    // Référence pour suivre la position de scroll
    const scrollPosRef = useRef(0);
    // État pour forcer le rendu quand le conteneur est prêt
    const [container, setContainer] = useState(null);

    // Créer un conteneur dédié au premier rendu
    useEffect(() => {
        // Vérifier si le conteneur existe déjà
        let scrollContainer = document.getElementById('scroll-html-container');

        // Sinon, le créer
        if (!scrollContainer) {
            scrollContainer = document.createElement('div');
            scrollContainer.id = 'scroll-html-container';
            scrollContainer.style.position = 'fixed';
            scrollContainer.style.top = '0';
            scrollContainer.style.left = '0';
            scrollContainer.style.width = '100%';
            scrollContainer.style.height = '100vh';
            scrollContainer.style.pointerEvents = 'none';
            scrollContainer.style.zIndex = '10';
            document.body.appendChild(scrollContainer);
        }

        setContainer(scrollContainer);

        // Nettoyage à la désinstallation du composant
        return () => {
            // Optionnel: supprimer le conteneur si vous voulez un nettoyage complet
            // document.body.removeChild(scrollContainer);
        };
    }, []);

    // Suivre la position de scroll depuis les contrôles R3F
    useFrame(({ events }) => {
        if (events.handlers?.scroll && container) {
            const scrollPos = events.handlers.scroll.offset;
            if (scrollPosRef.current !== scrollPos) {
                scrollPosRef.current = scrollPos;
                // Appliquer la transformation directement au DOM
                const scrollContent = container.firstChild;
                if (scrollContent) {
                    scrollContent.style.transform = `translateY(${
                        -scrollPos * 100
                    }vh)`;
                }
            }
        }
    });

    // Ne rien rendre dans la scène R3F
    // Le contenu HTML est rendu via createPortal
    if (!container) return null;

    // Utiliser createPortal pour éviter le conflit de root React
    return ReactDOM.createPortal(
        <div
            className="scroll-container"
            style={{
                height: `${virtualPageCount * 100}vh`,
                width: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
                transition: 'transform 100ms ease-out',
            }}
        >
            {/* Section Accueil */}
            <div
                style={{
                    position: 'absolute',
                    top: '40vh',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                    pointerEvents: 'auto',
                }}
            >
                <h1>Bienvenue</h1>
                <div>↓ Scrollez pour explorer ↓</div>
            </div>

            {/* Section À propos */}
            <div
                style={{
                    position: 'absolute',
                    top: '140vh',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                    pointerEvents: 'auto',
                }}
            >
                <h2>À propos</h2>
            </div>
        </div>,
        container
    );
}
