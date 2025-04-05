import { PropsWithChildren } from 'react';

/**
 * Affiche un Tag contenant un texte ainsi qu'un logo
 */
export function Tags({ children }: PropsWithChildren) {
    return <li className="tag">{children}</li>;
}
