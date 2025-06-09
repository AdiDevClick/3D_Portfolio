async function redirect() {
    // Si on a un paramètre spa-route dans l'URL (venant de 404.html)
    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get('spa-route');

    if (redirectPath) {
        history.replaceState(null, '', window.location.pathname + redirectPath);
    }
}

if (document.readyState !== 'loading') {
    redirect();
} else {
    window.addEventListener('DOMContentLoaded', redirect);
}
