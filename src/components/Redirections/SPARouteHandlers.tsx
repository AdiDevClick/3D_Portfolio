import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

// ✅ Composant pour gérer les redirections SPA
export function SPARouteHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const targetRoute = params.get('target');

        if (targetRoute) {
            console.log('✅ SPA redirecting to:', targetRoute);
            navigate(targetRoute, { replace: true });
        } else {
            navigate('/', { replace: true });
        }
        return () => {
            // Nettoyage si nécessaire
            console.log('🔄 Cleanup on unmount');
        };
    }, []);

    // ✅ Affichage pendant la redirection
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                flexDirection: 'column',
            }}
        >
            <h2>🔄 Redirection en cours...</h2>
            <p>Chargement de votre page...</p>
        </div>
    );
}
