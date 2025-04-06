import { Tags } from '@/components/tags/Tags.tsx';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import { useId } from 'react';
import '@css/Tags.scss';
type DatasType = {
    /** La propriété "stack" de la card contenant toute la stack technique */
    datas: ElementType['stack'];
};

/**
 * Crer des tags puis les affiches dans un container
 */
export function TagsContainer({ datas }: DatasType) {
    Array.isArray(datas) ? datas : [datas];
    return (
        <ul className="tags_container">
            {Object.entries(datas).map(([text, logoUrl]) => {
                const id = useId();
                return (
                    <Tags key={id} logo={logoUrl}>
                        {text}
                    </Tags>
                );
            })}
        </ul>
    );
}
