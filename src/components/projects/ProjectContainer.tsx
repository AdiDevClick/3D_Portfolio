import { ProjectContent } from '@/components/projects/ProjectContent.tsx';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';

type ProjectContainerTypes = {
    onClick: () => void;
    card: ElementType;
};

export function ProjectContainer({
    onClick,
    card,
    ...props
}: ProjectContainerTypes) {
    return (
        <div className="opened-content" onClick={onClick} {...props}>
            <ProjectContent card={card} {...props} />
        </div>
    );
}
