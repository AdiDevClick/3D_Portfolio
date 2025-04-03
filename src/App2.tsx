import { PropsWithChildren } from 'react';

/**
 * Render le contenu principal de l'App
 * Il prend en paramètre un Children JSX
 */
export default function App({ children }: PropsWithChildren) {
    return (
        <main
            className="main-container"
            style={{ height: '100%', minHeight: 'min-content' }}
        >
            {children}
        </main>
    );
}
