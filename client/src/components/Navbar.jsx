import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Boxes, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">
            <Boxes size={24} />
          </span>
          <span className="brand-name">
            Stock<span>Wise</span>
          </span>
        </Link>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <a href="/#features" onClick={closeMenu}>
            Features
          </a>
          <a href="/#how-it-works" onClick={closeMenu}>
            How it works
          </a>
          <a href="/#benefits" onClick={closeMenu}>
            Benefits
          </a>

          <div className="mobile-nav-actions">
            <Link to="/login" className="nav-login" onClick={closeMenu}>
              Log in
            </Link>
            <Link
              to="/register"
              className="nav-signup"
              onClick={closeMenu}
            >
              Get started <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        <div className="desktop-nav-actions">
          <Link to="/login" className="nav-login">
            Log in
          </Link>
          <Link to="/register" className="nav-signup">
            Get started <ArrowUpRight size={17} />
          </Link>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
    </header>
  );
}