import { ProjectContent } from '@/pages/Projects/ProjectContent';
import { ElementType } from '@/hooks/reducers/carouselTypes';
import '@css/Card.scss';
import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { MouseEvent, useEffect, useRef, useState } from 'react';

type ProjectContainerTypes = {
    onClick: (
        e: PointerEvent & ThreeEvent<MouseEvent> & MouseEvent<HTMLDivElement>
    ) => void;
    card: ElementType;
};

let startY = 0;
let startCameraY = 0;
/**
 * Contains the project content/informations.
 * @param onClick - Clic function from the card.
 * @param card - Card data.
 * @param props - Additional props.
 */
export function ProjectContainer({
    onClick,
    card,
    ...props
}: ProjectContainerTypes) {
    // const { camera } = useThree();
    const containerRef = useRef<HTMLDivElement>(null);
    const [origin, setOrigin] = useState({
        x: 0,
        y: 0,
    });
    const [lastTranslate, setLastTranslate] = useState({
        x: 0,
        y: 0,
    });
    const handleTouchStart = (e: TouchEvent) => {
        if (e.targetTouches[0]) {
            e.preventDefault();
            e.stopPropagation();

            const eventPoint = e.targetTouches[0];
            startY = eventPoint.clientY;
            setOrigin({ x: eventPoint.screenX, y: eventPoint.screenY });
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!e.targetTouches[0]) return;
        const card = e.currentTarget.parentNode.querySelector('.card');
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        const currentY = e.targetTouches[0].clientY;
        const isMovingUp = currentY < startY;
        const isMovingDown = currentY > startY;

        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop >= scrollHeight - clientHeight;
        // const isAtBottom = scrollTop >= scrollHeight - clientHeight - 1;
        console.log('📍 Touch info:', {
            scrollTop,
            scrollHeight,
            clientHeight,
            isAtTop,
            isAtBottom,
            isMovingUp,
            isMovingDown,
            currentY,
            startY,
        });
        const pressionPoint = e.targetTouches[0];
        const translate = {
            x: pressionPoint.screenX - origin.x,
            y: pressionPoint.screenY - origin.y,
        };
        // console.log(translate.y, '📍 translate.y');
        const deltaY = startY - e.touches[0].clientY;
        const isScrollingUp = deltaY > 0;
        const isScrollingDown = deltaY < 0;
        setLastTranslate(translate);
        // console.log(scrollTop, '📍 scrollTop');
        // console.log(deltaY, '📍 deltaY');
        // e.preventDefault();
        // e.stopPropagation();
        // ✅ Logique de décision
        // if (isScrollingUp && scrollTop - deltaY < 0) {
        //     console.log('je scroll vers le haut');
        //     // ✅ Scroll vers haut mais plus de contenu → Caméra
        //     // camera.position.y = startCameraY + deltaY * 0.01;
        //     card.style.touchAction = 'none';
        // } else if (isScrollingDown && scrollTop < scrollHeight - clientHeight) {
        //     // ✅ Scroll vers bas mais plus de contenu → Caméra
        //     console.log('objectif je scroll vers le bas');
        //     // camera.position.y = startCameraY + deltaY * 0.01;
        //     card.style.touchAction = 'none';
        // } else {
        //     card.removeAttribute('style');
        // }
        // ✅ Sinon laisser scroll HTML normal
        if ((isMovingUp && isAtBottom) || (isMovingDown && isAtTop)) {
            // ✅ Essai de scroll au-delà des limites → Activer caméra
            card.style.touchAction = 'none';
            console.log('🔒 TouchAction disabled - Boundary reached');
        } else {
            // ✅ Scroll possible → Laisser HTML
            card.style.touchAction = 'auto';
            console.log('📜 TouchAction enabled - HTML scroll');
        }
    };

    // useEffect(() => {
    // if (!containerRef.current) return;

    // const container = containerRef.current;

    // const handleTouchStart = (e: TouchEvent) => {
    //     startY = e.touches[0].clientY;
    //     startCameraY = camera.position.y;
    // };

    // const handleTouchMove = (e: TouchEvent) => {
    //     const deltaY = startY - e.touches[0].clientY;
    //     const isScrollingUp = deltaY > 0;
    //     const isScrollingDown = deltaY < 0;

    //     // ✅ Logique de décision
    //     if (isScrollingUp && !canScrollUp) {
    //         // ✅ Scroll vers haut mais plus de contenu → Caméra
    //         camera.position.y = startCameraY + deltaY * 0.01;
    //         e.preventDefault();
    //     } else if (isScrollingDown && !canScrollDown) {
    //         // ✅ Scroll vers bas mais plus de contenu → Caméra
    //         camera.position.y = startCameraY + deltaY * 0.01;
    //         e.preventDefault();
    //     }
    //     // ✅ Sinon laisser scroll HTML normal
    // };

    // container.addEventListener('touchstart', handleTouchStart, { passive: true });
    // container.addEventListener('touchmove', handleTouchMove, { passive: false });

    // return () => {
    //     container.removeEventListener('touchstart', handleTouchStart);
    //     container.removeEventListener('touchmove', handleTouchMove);
    // };
    // }, [isActive, canScrollUp, canScrollDown, camera]);
    return (
        <div
            ref={containerRef}
            className="card"
            onClick={onClick}
            onWheel={onScrollHandler}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            {...props}
        >
            <ProjectContent clickEvent={onClick} card={card} {...props} />
        </div>
    );
}

// function handleTouchStart(
//     e: PointerEvent & ThreeEvent<MouseEvent> & MouseEvent<HTMLDivElement>
// ) {
//     // Prevent default touch behavior to avoid scrolling
//     e.preventDefault();
// }

// function handleTouchMove(
//     e: PointerEvent & ThreeEvent<MouseEvent> & MouseEvent<HTMLDivElement>
// ) {
//     // Prevent default touch behavior to avoid scrolling
//     e.preventDefault();
// }
