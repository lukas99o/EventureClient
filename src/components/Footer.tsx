export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-light text-center py-3" style={{ borderTop: '2px solid #f7931e' }}>
            <div className="container">
                <p className="mb-1"><strong>Eventure App</strong> - A social networking platform</p>
                <p className="mb-1">
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/lukas99o/EventureClient" className="link-light text-primary me-3 text-decoration-none">GitHub</a>
                    <a target="_blank" rel="noopener noreferrer" href="mailto:lukas99o@hotmail.com" className="link-light text-primary me-3 text-decoration-none">Contact</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.lukas99o.com" className="link-light text-primary text-decoration-none">Portfolio</a>
                </p>
                <p className="mb-0">&copy; {currentYear} Eventure App. All rights reserved.</p>
            </div>
        </footer>
    );
}
