import { ProjectContent } from '@/pages/Projects/ProjectContent';
import { ElementType } from '@/hooks/reducers/carouselTypes';
import '@css/Card.scss';
import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions';
import { ThreeEvent } from '@react-three/fiber';
import { MouseEvent, useRef, TouchEvent } from 'react';

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
    // const [origin, setOrigin] = useState({
    //     x: 0,
    //     y: 0,
    // });
    // const [lastTranslate, setLastTranslate] = useState({
    //     x: 0,
    //     y: 0,
    // });
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (e.targetTouches[0]) {
            e.stopPropagation();

            const eventPoint = e.targetTouches[0];
            startY = eventPoint.clientY;
            // setOrigin({ x: eventPoint.screenX, y: eventPoint.screenY });
        }
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!e.targetTouches[0]) return;
        const card = e.currentTarget.parentNode?.querySelector('.card');
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        const currentY = e.targetTouches[0].clientY;
        const isMovingUp = currentY < startY;
        const isMovingDown = currentY > startY;

        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop >= scrollHeight - clientHeight;

        if ((isMovingUp && isAtBottom) || (isMovingDown && isAtTop)) {
            (card as HTMLElement).style.touchAction = 'none';
        } else {
            (card as HTMLElement).style.touchAction = 'auto';
        }
    };

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
