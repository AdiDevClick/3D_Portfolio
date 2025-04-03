import { Error404 } from '@/pages/Error/404/Error404.tsx';
import { useRouteError } from 'react-router';
interface RouteError {
    data: string;
    error: {
        columnNumber: number;
        fileName: string;
        lineNumber: number;
        message: string;
        stack: string;
    };
    internal: boolean;
    status: number;
    statusText: string;
}
/**
 * Display une erreur 404 si la route est mauvaise.
 * Par défaut, display un message générique.
 */
export function PageError() {
    const error = useRouteError() as RouteError;
    if (error.status === 404) return <Error404 />;

    return (
        <>
            <div style={{ color: 'red' }} id="error-page">
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText || error.error.message}</i>
                </p>
            </div>
        </>
    );
}
