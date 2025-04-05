import { ProjectContent } from '@/components/projects/ProjectContent.tsx';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import { WheelEvent } from 'react';

type ProjectContainerTypes = {
    onClick: () => void;
    card: ElementType;
};

export function ProjectContainer({
    onClick,
    card,
    ...props
}: ProjectContainerTypes) {
    const onScrollHandler = (e: WheelEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="opened-content"
            onClick={onClick}
            onWheel={onScrollHandler}
            {...props}
        >
            <ProjectContent card={card} {...props} />
        </div>
    );
}
