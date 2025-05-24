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
        case 'Home':
            navigate('/');
            break;
        case 'A Propos':
            navigate('/a-propos');
            break;
        case 'Projets':
            navigate('/projets');
            break;
        case 'Contact':
            navigate('/contact');
            break;
        default:
            break;
    }
}
