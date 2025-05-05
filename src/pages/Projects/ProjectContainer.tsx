import { ProjectContent } from '@/pages/Projects/ProjectContent';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import '@css/Card.scss';
import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { ThreeEvent } from '@react-three/fiber';
import { MouseEvent } from 'react';

type ProjectContainerTypes = {
    onClick: (
        e: PointerEvent & ThreeEvent<MouseEvent> & MouseEvent<HTMLDivElement>
    ) => void;
    card: ElementType;
};

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
    return (
        <div
            className="card"
            onClick={onClick}
            onWheel={onScrollHandler}
            {...props}
        >
            <ProjectContent card={card} {...props} />
        </div>
    );
}
