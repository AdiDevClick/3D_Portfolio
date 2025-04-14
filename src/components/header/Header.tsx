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

    const onTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
        console.log('ca commence');
        if (e.targetTouches) {
            if (e.targetTouches.length > 1) {
                e.preventDefault();
            } else {
                if (e.target === e.targetTouches[0].target) {
                    setClicked(true);
                }
                e = e.targetTouches[0];
            }
        }
        setOrigin((prev) => ({ x: e.screenX, y: e.screenY }));
        disableTransition(headerRef.current);
    };

    const onTouchMove = (e: TouchEvent<HTMLButtonElement>) => {
        if (origin) {
            console.log('je bouge');
            const pressionPoint = e.targetTouches[0];
            const translate = {
                x: pressionPoint.screenX - origin.x,
                y: pressionPoint.screenY - origin.y,
            };
            if (
                e.targetTouches &&
                Math.abs(translate.x) > Math.abs(translate.y)
            ) {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
                setClicked(false);
            }
            const baseWidth = headerRef.current.clientWidth / 100;
            // console.log(translate);
            headerRef.current.style.width = `${baseWidth + translate.x}px`;
            // headerRef.current.style.width = `translate(${translate.x}px, ${translate.y}px)`;
            setIsMoving(true);
        }
    };

    const onTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
        console.log('je ne touche plus');
    };

    const onTouchCancel = (e: TouchEvent<HTMLButtonElement>) => {
        console.log('Je cancel mon touch');
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
                // onTouchStart={onTouchStart}
                // onTouchMove={onTouchMove}
                // onTouchEnd={onTouchEnd}
                // onTouchCancel={onTouchCancel}
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
