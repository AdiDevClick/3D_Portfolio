import { Tags } from '@/components/tags/Tags.tsx';

/**
 * Crer des tags puis les affiches dans un container
 */
export function TagsContainer({ datas }) {
    Array.isArray(datas) ? datas : [datas];

    return (
        <ul className="tags_container">
            {datas.map((text, index) => (
                <Tags key={index}>{text}</Tags>
            ))}
        </ul>
    );
}
