async function redirect() {
    const redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;

    // Si on a un paramètre p dans l'URL (venant de 404.html)
    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get('p');

    if (redirectPath) {
        // Effacer le paramètre p de l'URL visible
        history.replaceState(null, '', window.location.pathname + redirectPath);
    } else if (redirect && redirect !== window.location.href) {
        // Support pour une ancienne méthode de redirection si présente
        history.replaceState(null, '', redirect);
    }
}

if (document.readyState !== 'loading') {
    redirect();
} else {
    window.addEventListener('DOMContentLoaded', redirect);
}
