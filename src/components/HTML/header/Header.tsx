import { Button } from '@/components/HTML/button/Button';
import { NavLink } from 'react-router';
import '@css/NavHeader.scss';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTouchEvents } from '@/hooks/Touch/useTouchEvents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPortrait,
    faHouse,
    faFolderOpen,
    faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { HeadersProps } from '@/components/HTML/HTMLtypes';

export function Header({ isMobile }: HeadersProps) {
    const headerRef = useRef<HTMLElement>(null!);
    const buttonRef = useRef<HTMLButtonElement>(null!);
    const [isOpen, setIsOpen] = useState(false);

    const { isMoving, isClickInProgress, setIsClickInProgress } =
        useTouchEvents(buttonRef, isMobile, headerRef, setIsOpen);
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
            className={isMobile ? '' : active}
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
                            <FontAwesomeIcon icon={faHouse} />
                            <span id="home-link-text">Accueil</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/a-propos">
                            <FontAwesomeIcon icon={faPortrait} />
                            <span>A Propos</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/projets">
                            <FontAwesomeIcon icon={faFolderOpen} />
                            <span>Projets</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact">
                            <FontAwesomeIcon icon={faPhone} />
                            <span>Me Contacter</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            {/* )} */}
            {/* {!isMobile && ( */}
            <Button ref={buttonRef} type="button" onClick={handleClick}>
                {isOpen ? 'Open' : 'Close'}
            </Button>
            {/* )} */}
        </header>
    );
}
