import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import { PropsWithChildren } from 'react';
import '@css/Tags.scss';
type DatasType = {
    /** La propriété "stack" de la card contenant toute la stack technique */
    datas: ElementType['stack'];
};

/**
 * Crer des tags puis les affiches dans un container
 */
export function TagsContainer({ children }: PropsWithChildren) {
    return <ul className="tags_container">{children}</ul>;
}
