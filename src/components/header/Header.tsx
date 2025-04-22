import { Button } from '@/components/button/Button.tsx';
import { NavLink } from 'react-router';
import '@css/NavHeader.scss';
import { MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import { useTouchEvents } from '@/hooks/Touch/useTouchEvents';

export function Header({ isTouchDevice }) {
    const headerRef = useRef<RefObject<HTMLElement>>(null!);
    const buttonRef = useRef<RefObject<HTMLButtonElement>>(null!);
    const [isClicked, setClicked] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

    const click = useTouchEvents(buttonRef, headerRef);
    const active = isMoving || isClicked ? 'active' : 'inactive';

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setClicked(!isClicked);
        setIsMoving(!isClicked);
    };

    const handleMouseOver = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setIsMoving(!isMoving);
        setClicked(!isMoving);
    };

    useEffect(() => {
        headerRef.current?.removeAttribute('style');
    }, [isMoving, isClicked]);

    return (
        <header
            ref={headerRef}
            className={`main-container ${active}`}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOver}
        >
            <Button ref={buttonRef} type="button" onClick={handleClick}>
                Open
            </Button>
            {isMoving && (
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
            )}
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
