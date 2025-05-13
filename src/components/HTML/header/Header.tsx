import { Button } from '@/components/HTML/button/Button';
import { NavLink } from 'react-router';
import '@css/NavHeader.scss';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTouchEvents } from '@/hooks/Touch/useTouchEvents';

export function Header({ isTouchDevice }) {
    const headerRef = useRef<HTMLElement>(null!);
    const buttonRef = useRef<HTMLButtonElement>(null!);
    const [isOpen, setIsOpen] = useState(false);

    const { isMoving, isClickInProgress, setIsClickInProgress } =
        useTouchEvents(buttonRef, headerRef, setIsOpen);
    const active = isOpen ? 'opened' : 'closed';

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (isMoving) return;
        setIsOpen(!isOpen);
        setIsClickInProgress(false);
    };

    const handleMouseOver = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if (isOpen || isMoving || isClickInProgress) return;
        setIsOpen(true);
    };

    const handleMouseOut = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!isOpen || isMoving) return;
        setIsOpen(false);
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
            {/* {isOpen && ( */}
            <nav className={'header__nav'}>
                {/* <nav className={isOpen ? 'active' : 'closed'}> */}
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
            {/* <Button ref={buttonRef} type="button"> */}
            <Button ref={buttonRef} type="button" onClick={handleClick}>
                {isOpen ? 'Open' : 'Close'}
            </Button>
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
