import { Button } from '@/components/HTML/button/Button';
import { MouseEvent } from 'react';

/**
 * Contenu HTML de la page contact
 */
export function ContactContent({ ...props }) {
    return (
        <div {...props}>
            <h1 style={{ color: 'black' }}>Me Contacter</h1>
            <p style={{ color: 'black' }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, voluptatibus. Lorem ipsum dolor sit amet{' '}
            </p>
        </div>
    );
}

const positions = [
    { id: 1, name: 'Antennes Telecom', lat: 43.612, lon: 1.458 },
    { id: 2, name: "Château d'eau", lat: 43.614, lon: 1.466 },
    { id: 3, name: 'Relais urbain', lat: 43.609, lon: 1.452 },
] as const;
interface POIProps<T = {}> {
    positions: T;
}

/**
 *
 * @param positions- Props for the CoordViewer component
 */
export function POIViewer<T>({ positions }: POIProps<T>) {
    positions = Array.isArray(positions) ? positions : [positions];
    const handleCoordOnClick = async (
        e: MouseEvent<HTMLButtonElement>,
        pos
    ) => {
        e.preventDefault();
        try {
            const clipBoard = await navigator.clipboard.write(pos);
            if (!clipBoard) {
                console.error("Le presse-papiers n'est pas accessible.");
                return;
            }
            console.error(
                'Les coordonnées ont été copiées dans le presse-papiers.'
            );
        } catch (error) {
            console.error(
                'Erreur lors de la copie dans le presse-papiers:',
                error
            );
            return;
        }
    };

    return (
        <ul className="position-list_container">
            {positions.map((pos) => {
                return (
                    <li key={pos.id} className="position-list__item">
                        <p>
                            {pos.name} - Lat: {pos.lat}, Lon: {pos.lon}
                        </p>
                        <button
                            className="position-list__button"
                            name="copy-coord"
                            type="button"
                            onClick={(e) => handleCoordOnClick(e, pos)}
                        >
                            Copier les coordonnées
                        </button>
                        <a
                            className="position-list__link"
                            href={`www.OpenStreeMap.org?long=${pos.lon}&lat=${pos.lat}`}
                            rel="noreferrer noopener"
                            target="_blank"
                        >
                            Ouvrir sur OpenStreetMap
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
