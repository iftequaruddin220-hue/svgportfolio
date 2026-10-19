import React, { useState, useEffect } from 'react';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`nav ${isScrolled ? 'is-scrolled' : ''}`} id="top">
      <a href="#top" className="nav__brand" onClick={closeMenu}>
        Mohammad&nbsp;Iftequaruddin
      </a>
      <nav className={`nav__links ${isOpen ? 'is-open' : ''}`} aria-label="Primary">
        <a 
          href="#work" 
          className={activeSection === 'work' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          Work
        </a>
        <a 
          href="#viewer" 
          className={activeSection === 'viewer' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          3D
        </a>
        <a 
          href="#reel" 
          className={activeSection === 'reel' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          Turntables
        </a>
        <a 
          href="#rigging" 
          className={activeSection === 'rigging' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          Rigging
        </a>
        <a 
          href="#unity" 
          className={activeSection === 'unity' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          Unity
        </a>
        <a 
          href="#about" 
          className={activeSection === 'about' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          About
        </a>
        <a 
          href="#experience" 
          className={activeSection === 'experience' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          Experience
        </a>
        <a 
          href="#contact" 
          className={activeSection === 'contact' ? 'is-active' : ''} 
          onClick={closeMenu}
        >
          Contact
        </a>
      </nav>
      <button 
        className="nav__toggle" 
        aria-label="Menu" 
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span><span></span><span></span>
      </button>
    </header>
  );
};
