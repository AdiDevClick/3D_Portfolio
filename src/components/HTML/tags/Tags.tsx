import { ReactNode } from 'react';
type TagsTypes = {
    children: ReactNode;
    /** url du logo */
    logo: string;
};

/**
 * Affiche un Tag contenant un texte ainsi qu'un logo
 * @param logo - Url du logo
 */
export function Tags({ children, logo }: TagsTypes) {
    return (
        <li className="tag">
            <img src={logo} alt={children} />
            {children}
        </li>
    );
}
