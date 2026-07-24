// apps/web/src/components/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../lib/supabase';
import {
  PreviewLinkCard,
  PreviewLinkCardTrigger,
  PreviewLinkCardContent,
  PreviewLinkCardImage,
} from './PreviewLinkCard';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Erreur logout:', err);
    }
  }

  const isActive = (href: string) => pathname === href;

  function handleNav(e: React.MouseEvent, href: string) {
    e.preventDefault();
    router.push(href);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=folder_code,supervised_user_circle');

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          line-height: 1;
          display: inline-block;
          -webkit-font-smoothing: antialiased;
          font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
        }

        /* Header Desktop - Top Navigation (INCHANGÉ) */
        .header-desktop {
          display: none;
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          animation: slideDown 0.6s ease-out;
        }

        @media (min-width: 768px) {
          .header-desktop {
            display: block;
          }
        }

        .navbar-container {
          background: #ffffff;
          border: 2px solid #4925B0;
          border-radius: 50px;
          padding: 12px 24px;
          width: min(900px, calc(100% - 32px));
          max-width: 900px;
          box-shadow: 0 8px 32px rgba(73, 37, 176, 0.15);
          transition: all 0.3s ease;
        }

        .navbar-container:hover {
          border-color: #4925B0;
          box-shadow: 0 8px 32px rgba(73, 37, 176, 0.25);
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
          flex-wrap: nowrap;
        }

        /* Logo */
        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          text-decoration: none;
          color: #000000;
          transition: all 0.3s ease;
        }

        .logo-wrapper:hover {
          transform: scale(1.05);
        }

        .logo-badge {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4925B0 0%, #6a42d0 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(73, 37, 176, 0.3);
          transition: all 0.3s ease;
        }

        .logo-wrapper:hover .logo-badge {
          box-shadow: 0 0 25px rgba(73, 37, 176, 0.6);
          transform: scale(1.1);
        }

        .logo-text {
          font-family: 'Germania One', cursive;
          font-size: 16px;
          font-weight: bold;
          display: none;
          color: #4925B0;
        }

        @media (min-width: 768px) {
          .logo-text {
            display: inline;
          }
        }

        /* Navigation Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1 1 auto;
          min-width: 0;
          margin-left: 16px;
          overflow: visible;
          position: relative;
          z-index: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 20px;
          color: #000000;
          text-decoration: none;
          font-size: 14px;
          font-family: 'Josefin Sans', sans-serif;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          background: transparent;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #4925B0;
          background: rgba(73, 37, 176, 0.08);
        }

        .nav-link.active {
          background: #4925B0;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(73, 37, 176, 0.4);
        }

        .nav-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .nav-icon.material-symbols-outlined {
          width: auto;
          height: auto;
          font-size: 18px;
        }

        .nav-icon.blog-icon {
          font-size: 21px;
        }

        /* Auth Buttons */
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          min-width: 0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-family: 'Josefin Sans', sans-serif;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-family: 'Josefin Sans', sans-serif;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-admin {
          background: rgba(73, 37, 176, 0.1);
          color: #4925B0;
          border: 2px solid #4925B0;
        }

        .btn-admin:hover {
          background: rgba(73, 37, 176, 0.2);
          box-shadow: 0 0 15px rgba(73, 37, 176, 0.3);
        }

        .btn-login {
          background: #4925B0;
          color: #ffffff;
          border: 2px solid #4925B0;
          margin-left: 70px;
        }

        .btn-login:hover {
          background: #6a42d0;
          border-color: #6a42d0;
          box-shadow: 0 0 20px rgba(73, 37, 176, 0.4);
        }

        .btn-logout {
          background: rgba(0, 0, 0, 0.05);
          color: #000000;
          border: 2px solid #000000;
        }

        .btn-logout:hover {
          background: #000000;
          color: #ffffff;
        }

        /* ============================================= */
        /* Mobile Bottom Navigation — style "pilule extensible" */
        /* ============================================= */
        .header-mobile {
          display: flex;
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          animation: slideDown 0.6s ease-out;
          width: calc(100% - 32px);
          max-width: 420px;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .header-mobile {
            display: none;
          }
        }

        .mobile-nav-bar {
          background: linear-gradient(180deg, #1c1c1e 0%, #0a0a0c 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .mobile-nav-btn {
          flex: 1 1 0;
          min-width: 0;
          height: 48px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          padding: 0;
        }

        .mobile-nav-btn:hover {
          flex: 2.2 1 0;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          padding: 0 16px;
          justify-content: center;
        }

        .mobile-nav-btn.active {
          flex: 2.2 1 0;
          background: #4925B0;
          color: #ffffff;
          box-shadow: 0 0 18px rgba(73, 37, 176, 0.6);
          padding: 0 16px;
          justify-content: center;
        }

        .mobile-nav-btn.active:hover {
          background: #4925B0;
        }

        .mobile-nav-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }

        .mobile-nav-icon.material-symbols-outlined {
          width: auto;
          height: auto;
          font-size: 22px;
        }

        .mobile-nav-icon.blog-icon {
          font-size: 25px;
        }

        .mobile-nav-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          max-width: 0;
          opacity: 0;
          transition: max-width 0.35s ease, opacity 0.25s ease;
        }

        .mobile-nav-btn:hover .mobile-nav-label,
        .mobile-nav-btn.active .mobile-nav-label {
          max-width: 100px;
          opacity: 1;
          margin-left: 2px;
        }

        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      {/* Desktop Header - Top (INCHANGÉ) */}
      <header className="header-desktop">
        <nav className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <PreviewLinkCard href="/">
              <PreviewLinkCardTrigger
                className="logo-wrapper"
                onClick={(e: React.MouseEvent) => handleNav(e, '/')}
              >
                <div className="logo-badge">Ⓣ</div>
                <span className="logo-text">Thalès le Dev</span>
              </PreviewLinkCardTrigger>
              <PreviewLinkCardContent side="bottom" sideOffset={10}>
                <PreviewLinkCardImage alt="Accueil" />
              </PreviewLinkCardContent>
            </PreviewLinkCard>

            {/* Navigation Links */}
            <div className="nav-links">
              <PreviewLinkCard href="/">
                <PreviewLinkCardTrigger
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={(e: React.MouseEvent) => handleNav(e, '/')}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  <span>Accueil</span>
                </PreviewLinkCardTrigger>
                <PreviewLinkCardContent side="bottom" sideOffset={10}>
                  <PreviewLinkCardImage alt="Accueil" />
                </PreviewLinkCardContent>
              </PreviewLinkCard>

              <PreviewLinkCard href="/projects">
                <PreviewLinkCardTrigger
                  className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
                  onClick={(e: React.MouseEvent) => handleNav(e, '/projects')}
                >
                  <span className="nav-icon material-symbols-outlined">folder_code</span>
                  <span>Projets</span>
                </PreviewLinkCardTrigger>
                <PreviewLinkCardContent side="bottom" sideOffset={10}>
                  <PreviewLinkCardImage alt="Projets" />
                </PreviewLinkCardContent>
              </PreviewLinkCard>

              <PreviewLinkCard href="/blog">
                <PreviewLinkCardTrigger
                  className={`nav-link ${isActive('/blog') ? 'active' : ''} blog-link`}
                  onClick={(e: React.MouseEvent) => handleNav(e, '/blog')}
                >
                  <span className="nav-icon blog-icon material-symbols-outlined">supervised_user_circle</span>
                  <span>Blog</span>
                </PreviewLinkCardTrigger>
                <PreviewLinkCardContent side="bottom" sideOffset={10}>
                  <PreviewLinkCardImage alt="Blog" />
                </PreviewLinkCardContent>
              </PreviewLinkCard>
            </div>

            {/* Auth Buttons */}
            <div className="auth-buttons">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <PreviewLinkCard href="/admin">
                        <PreviewLinkCardTrigger
                          className={`btn btn-admin ${isActive('/admin') ? 'active' : ''}`}
                          onClick={(e: React.MouseEvent) => handleNav(e, '/admin')}
                        >
                          <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a3 3 0 100 6 3 3 0 000-6zm0 8a5 5 0 100 10 5 5 0 000-10z" />
                          </svg>
                          Admin
                        </PreviewLinkCardTrigger>
                        <PreviewLinkCardContent side="bottom" sideOffset={10}>
                          <PreviewLinkCardImage alt="Admin" />
                        </PreviewLinkCardContent>
                      </PreviewLinkCard>
                      <button onClick={handleLogout} className="btn btn-logout">
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4z" />
                        </svg>
                        Déco
                      </button>
                    </>
                  ) : (
                    <PreviewLinkCard href="/contact">
                      <PreviewLinkCardTrigger
                        className="btn btn-login"
                        title="Me contacter"
                      >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2v-2h-2v2z" />
                        </svg>
                        Me contacter
                      </PreviewLinkCardTrigger>
                      <PreviewLinkCardContent side="bottom" sideOffset={10}>
                        <PreviewLinkCardImage alt="Page de contact" />
                      </PreviewLinkCardContent>
                    </PreviewLinkCard>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation — pilule extensible façon image de référence */}
      <nav className="header-mobile">
        <div className="mobile-nav-bar">
          <PreviewLinkCard href="/">
            <PreviewLinkCardTrigger
              className={`mobile-nav-btn ${isActive('/') ? 'active' : ''}`}
              onClick={(e: React.MouseEvent) => handleNav(e, '/')}
            >
              <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="mobile-nav-label">Accueil</span>
            </PreviewLinkCardTrigger>
            <PreviewLinkCardContent side="top" sideOffset={10}>
              <PreviewLinkCardImage alt="Accueil" />
            </PreviewLinkCardContent>
          </PreviewLinkCard>

          <PreviewLinkCard href="/projects">
            <PreviewLinkCardTrigger
              className={`mobile-nav-btn ${isActive('/projects') ? 'active' : ''}`}
              onClick={(e: React.MouseEvent) => handleNav(e, '/projects')}
            >
              <span className="mobile-nav-icon material-symbols-outlined">folder_code</span>
              <span className="mobile-nav-label">Projets</span>
            </PreviewLinkCardTrigger>
            <PreviewLinkCardContent side="top" sideOffset={10}>
              <PreviewLinkCardImage alt="Projets" />
            </PreviewLinkCardContent>
          </PreviewLinkCard>

          <PreviewLinkCard href="/blog">
            <PreviewLinkCardTrigger
              className={`mobile-nav-btn ${isActive('/blog') ? 'active' : ''}`}
              onClick={(e: React.MouseEvent) => handleNav(e, '/blog')}
            >
              <span className="mobile-nav-icon blog-icon material-symbols-outlined">supervised_user_circle</span>
              <span className="mobile-nav-label">Blog</span>
            </PreviewLinkCardTrigger>
            <PreviewLinkCardContent side="top" sideOffset={10}>
              <PreviewLinkCardImage alt="Blog" />
            </PreviewLinkCardContent>
          </PreviewLinkCard>

          {!loading && user && (
            <PreviewLinkCard href="/admin">
              <PreviewLinkCardTrigger
                className={`mobile-nav-btn ${isActive('/admin') ? 'active' : ''}`}
                onClick={(e: React.MouseEvent) => handleNav(e, '/admin')}
              >
                <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a3 3 0 100 6 3 3 0 000-6zm0 8a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
                <span className="mobile-nav-label">Admin</span>
              </PreviewLinkCardTrigger>
              <PreviewLinkCardContent side="top" sideOffset={10}>
                <PreviewLinkCardImage alt="Admin" />
              </PreviewLinkCardContent>
            </PreviewLinkCard>
          )}

          {!loading && !user && (
            <PreviewLinkCard href="/contact">
              <PreviewLinkCardTrigger
                className="mobile-nav-btn"
                title="Me contacter"
              >
                <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2v-2h-2v2z" />
                </svg>
                <span className="mobile-nav-label">Contact</span>
              </PreviewLinkCardTrigger>
              <PreviewLinkCardContent side="top" sideOffset={10}>
                <PreviewLinkCardImage alt="Page de contact" />
              </PreviewLinkCardContent>
            </PreviewLinkCard>
          )}

          {!loading && user && (
            <button onClick={handleLogout} className="mobile-nav-btn" title="Déconnexion">
              <svg className="mobile-nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5z" />
              </svg>
              <span className="mobile-nav-label">Déco</span>
            </button>
          )}
        </div>
      </nav>

    </>
  );
}