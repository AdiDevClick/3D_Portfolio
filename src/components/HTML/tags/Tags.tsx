import { TagsTypes } from '@/components/HTML/HTMLtypes';

/**
 * Affiche un Tag contenant un texte ainsi qu'un logo
 * @param logo - Url du logo
 */
export function Tags({ children, logo }: TagsTypes) {
    return (
        <li className="tag">
            <img src={logo} alt={children?.toString()} />
            {children}
        </li>
    );
}
