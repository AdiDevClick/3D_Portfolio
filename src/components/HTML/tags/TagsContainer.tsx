import '@css/Tags.scss';
import { TagsContainerProps } from '@/components/HTML/HTMLtypes';

/**
 * Crer des tags puis les affiches dans un container
 */
export function TagsContainer({ children }: TagsContainerProps) {
    return <ul className="tags_container">{children}</ul>;
}
