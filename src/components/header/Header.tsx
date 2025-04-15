import { Button } from '@/components/button/Button.tsx';
import { NavLink } from 'react-router';
import '@css/NavHeader.scss';
import { MouseEvent, RefObject, TouchEvent, useRef, useState } from 'react';
import { useTouchEvents } from '@/hooks/Touch/useTouchEvents';

export function Header({ ...props }) {
    const headerRef = useRef<RefObject<HTMLElement>>(null!);
    const buttonRef = useRef<RefObject<HTMLButtonElement>>(null!);
    const touchRef = useRef<RefObject<TouchEvent<HTMLButtonElement>>>(null!);
    const [clicked, setClicked] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [origin, setOrigin] = useState({});

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setClicked(!clicked);
    };

    useTouchEvents(buttonRef, headerRef);
    // const handleDrag = useTouchEvents();

    const active = clicked ? 'active' : '';

    return (
        <header
            ref={headerRef}
            {...props}
            className={`main-container ${active}`}
        >
            <Button
                ref={buttonRef}
                type="button"
                {...props}
                onClick={handleClick}
                onMouseEnter={handleClick}
            >
                Open
            </Button>
            <nav>
                {/* <Logo /> */}
                <ul>
                    <li>
                        <NavLink
                            id="home-link"
                            aria-labelledby="home-link-text"
                            to="/"
                        >
                            <span id="home-link-text">Accueil</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/a-propos">A Propos</NavLink>
                    </li>
                    <li>
                        <NavLink to="/projets">Mes Projets</NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact">Me Contacter</NavLink>
                    </li>
                    <li>
                        <NavLink to="/more">More</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

/**
 * Disables the transition of an element -
 */
function disableTransition(element: HTMLElement) {
    if (!element) return;
    element.style.transition = 'none';
}
