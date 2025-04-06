import { ProjectContent } from '@/components/projects/ProjectContent.tsx';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import { WheelEvent } from 'react';
import '@css/Card.scss';

type ProjectContainerTypes = {
    onClick: () => void;
    card: ElementType;
};

export function ProjectContainer({
    onClick,
    card,
    ...props
}: ProjectContainerTypes) {
    /**
     * Réactive le scrolling quand le contenu est ouvert
     */
    const onScrollHandler = (e: WheelEvent) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (
            (scrollTop + e.deltaY > 0 && e.deltaY < 0) ||
            (scrollHeight - (scrollTop + e.deltaY) > clientHeight &&
                e.deltaY > 0)
        ) {
            e.stopPropagation();
        }
    };

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
