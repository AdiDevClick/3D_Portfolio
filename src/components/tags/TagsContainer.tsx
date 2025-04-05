import { Tags } from '@/components/tags/Tags.tsx';
import { useId } from 'react';

/**
 * Crer des tags puis les affiches dans un container
 */
export function TagsContainer({ datas }) {
    Array.isArray(datas) ? datas : [datas];
    return (
        <ul className="tags_container">
            {Object.entries(datas).map(([text, logoUrl]) => {
                const id = useId();
                return (
                    <Tags logo={logoUrl} key={id}>
                        {text}
                    </Tags>
                );
            })}
        </ul>
    );
}
