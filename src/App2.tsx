export default function App({ children }) {
    return (
        <main
            className="main-container"
            style={{ height: '100%', minHeight: 'min-content' }}
        >
            {children}
        </main>
    );
}
