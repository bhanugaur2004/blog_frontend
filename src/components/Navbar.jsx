import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(e.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">✦</span>
                    <span className="brand-text">BlogVerse</span>
                </Link>

                {/* Desktop nav links */}
                <div className="navbar-links">
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? (
                            <span className="theme-icon">🌙</span>
                        ) : (
                            <span className="theme-icon">☀️</span>
                        )}
                    </button>

                    <Link to="/" className="nav-link">
                        Home
                    </Link>

                    <Link to="/contact" className="nav-link">
                        Contact
                    </Link>

                    {user ? (
                        <>
                            <Link to="/create" className="nav-link nav-link-create">
                                <span className="create-icon">+</span> Write
                            </Link>
                            <Link to={`/profile/${user._id}`} className="nav-link">
                                <span className="nav-avatar">
                                    {user.username?.charAt(0).toUpperCase()}
                                </span>
                                {user.username}
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link nav-link-admin">
                                    Admin
                                </Link>
                            )}
                            <button onClick={logout} className="nav-btn-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/signup" className="nav-link nav-link-signup">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile: theme toggle + hamburger */}
                <div className="mobile-nav-actions">
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? (
                            <span className="theme-icon">🌙</span>
                        ) : (
                            <span className="theme-icon">☀️</span>
                        )}
                    </button>

                    <button
                        ref={hamburgerRef}
                        className={`mobile-menu-btn${isMenuOpen ? ' open' : ''}`}
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                </div>
            </div>

            {/* Mobile menu overlay */}
            <div
                className={`mobile-overlay${isMenuOpen ? ' open' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* Mobile slide-down menu */}
            <div
                ref={menuRef}
                className={`mobile-menu${isMenuOpen ? ' open' : ''}`}
                role="navigation"
                aria-label="Mobile navigation"
            >
                <Link to="/" className="mobile-menu-link" onClick={closeMenu}>
                    <span className="mobile-menu-icon">🏠</span> Home
                </Link>
                <Link to="/contact" className="mobile-menu-link" onClick={closeMenu}>
                    <span className="mobile-menu-icon">✉️</span> Contact
                </Link>

                {user ? (
                    <>
                        <Link to="/create" className="mobile-menu-link mobile-menu-link-create" onClick={closeMenu}>
                            <span className="mobile-menu-icon">✍️</span> Write
                        </Link>
                        <Link to={`/profile/${user._id}`} className="mobile-menu-link" onClick={closeMenu}>
                            <span className="mobile-menu-avatar">
                                {user.username?.charAt(0).toUpperCase()}
                            </span>
                            {user.username}
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="mobile-menu-link mobile-menu-link-admin" onClick={closeMenu}>
                                <span className="mobile-menu-icon">⚙️</span> Admin
                            </Link>
                        )}
                        <button
                            onClick={() => { logout(); closeMenu(); }}
                            className="mobile-menu-link mobile-menu-logout"
                        >
                            <span className="mobile-menu-icon">🚪</span> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mobile-menu-link" onClick={closeMenu}>
                            <span className="mobile-menu-icon">🔑</span> Login
                        </Link>
                        <Link to="/signup" className="mobile-menu-link mobile-menu-link-signup" onClick={closeMenu}>
                            <span className="mobile-menu-icon">🚀</span> Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
