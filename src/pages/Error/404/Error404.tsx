import '@css/404.css';
import { Link, NavLink } from 'react-router';

/**
 * Affiche la page 404
 */
export function Error404() {
    return (
        <>
            <h1 className="fourofour">404</h1>
            <div className="cloak__wrapper">
                <div className="cloak__container">
                    <div className="cloak"></div>
                </div>
            </div>
            <div className="info">
                <h2 className="fourofour">Cette page est introuvable</h2>
                <p className="fourofour">
                    Cette page était là auparavant, peut-être pas d'ailleurs...
                    Mais il semble que tu sois parti à sa recherches !
                </p>
                <p>Le bouton ci-dessous te ramènera en lieux sûrs</p>
                <NavLink
                    to={'/'}
                    className="btn fourofour"
                    rel="noreferrer noopener"
                >
                    Accueil
                </NavLink>
            </div>
            {/* <NavLink className="error__link" to={'/test'}>
                Retourner sur la page d’accueil
            </NavLink> */}
        </>
    );
}
