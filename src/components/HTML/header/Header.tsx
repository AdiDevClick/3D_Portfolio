import { Button } from '@/components/HTML/button/Button';
import { NavLink } from 'react-router';
import '@css/NavHeader.scss';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTouchEvents } from '@/hooks/Touch/useTouchEvents';

export function Header({ isTouchDevice }) {
    const headerRef = useRef<HTMLElement>(null!);
    const buttonRef = useRef<HTMLButtonElement>(null!);
    const [isOpen, setIsOpen] = useState(false);

    const { isMoving, setDrawerState } = useTouchEvents(buttonRef, headerRef, {
        onStateChange: (newIsOpen) => setIsOpen(newIsOpen),
    });
    const active = isOpen ? 'active' : 'inactive';

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleMouseOver = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleMouseOut = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!isOpen) return;
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        headerRef.current?.removeAttribute('style');
    }, [isOpen]);

    return (
        <header
            ref={headerRef}
            className={`main-container ${active}`}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOut}
        >
            <Button ref={buttonRef} type="button" onClick={handleClick}>
                Open
            </Button>
            {/* {isOpen && ( */}
            <nav className={isOpen ? 'active' : 'inactive'}>
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
            {/* )} */}
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
