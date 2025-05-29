import { ThreeEvent } from '@react-three/fiber';
import { NavigateFunction } from 'react-router';

/**
 * Will create a navigation for the router
 */
export function handleHudClick(
    event: ThreeEvent<MouseEvent>,
    navigate: NavigateFunction
) {
    event.stopPropagation();
    switch (event.eventObject.name) {
        case 'icon__content-Home':
            navigate('/');
            break;
        case 'icon__content-A Propos':
            navigate('/a-propos');
            break;
        case 'icon__content-Projets':
            navigate('/projets');
            break;
        case 'icon__content-Contact':
            navigate('/contact');
            break;
        default:
            break;
    }
}
