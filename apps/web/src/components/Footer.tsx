// apps/web/src/components/Footer.tsx

'use client';

import { useRouter } from 'next/navigation';
import { SocialContactsList } from './SocialContactsList';

export default function Footer() {
  const router = useRouter();

  function handleNav(e: React.MouseEvent, href: string) {
    e.preventDefault();
    router.push(href);
  }

  return (
    <footer className="site-footer">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .site-footer {
          position: relative;
          background: #E3D9FA;
          padding-top: 1px; /* évite un collapse de marge avec la vague */
        }

        .footer-wave {
          display: block;
          width: 100%;
          height: 110px;
          margin-bottom: -1px;
        }

        .footer-content {
          max-width: 1240px;
          margin: 0 auto;
          padding: 20px 32px 40px;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-logo-badge {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #4925B0;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Germania One', cursive;
          font-size: 18px;
        }

        .footer-logo-text {
          font-family: 'Germania One', cursive;
          font-size: 20px;
          color: #1c1230;
          letter-spacing: 0.5px;
        }

        .footer-tagline {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: #4a4356;
          line-height: 1.6;
          max-width: 260px;
        }

        .footer-col-title {
          font-family: 'Germania One', cursive;
          font-size: 16px;
          color: #1c1230;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 18px;
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: #4a4356;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: #4925B0;
        }

        .footer-follow {
          display: flex;
          flex-direction: column;
        }

        .footer-bottom {
          margin-top: 48px;
          padding-top: 22px;
          border-top: 1px solid rgba(28, 18, 48, 0.12);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .footer-copyright,
        .footer-signature {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          color: #6b6377;
        }

        @media (max-width: 900px) {
          .footer-columns {
            grid-template-columns: 1fr 1fr;
            row-gap: 36px;
          }
        }

        @media (max-width: 560px) {
          .footer-wave { height: 70px; }
          .footer-columns { grid-template-columns: 1fr; }
          .footer-content { padding: 10px 20px 30px; }
        }
      `}</style>

      <svg
        className="footer-wave"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,90 C240,10 420,150 700,70 C980,-10 1180,120 1440,40 L1440,0 L0,0 Z"
          fill="#ffffff"
        />
        <path
          d="M0,90 C240,10 420,150 700,70 C980,-10 1180,120 1440,40 L1440,160 L0,160 Z"
          fill="#E3D9FA"
        />
      </svg>

      <div className="footer-content">
        <div className="footer-columns">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-badge">Ⓣ</div>
              <span className="footer-logo-text">Thalès le Dev</span>
            </div>
            <p className="footer-tagline">
              Étudiant en développement web &amp; freelance — je conçois des
              sites et applications sur mesure, du design au code.
            </p>
          </div>

          <div>
            <h3 className="footer-col-title">Explorer</h3>
            <ul className="footer-links">
              <li>
                <a href="/" onClick={(e) => handleNav(e, '/')}>
                  Accueil
                </a>
              </li>
              <li>
                <a href="/projects" onClick={(e) => handleNav(e, '/projects')}>
                  Mes projets
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => handleNav(e, '/blog')}>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">À propos</h3>
            <ul className="footer-links">
              <li>
                <a href="#faq">Questions fréquentes</a>
              </li>
              <li>
                <a href="/" onClick={(e) => handleNav(e, '/')}>
                  Qui suis-je
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2290196171313"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Me contacter
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-follow">
            <h3 className="footer-col-title">Me suivre</h3>
            <SocialContactsList variant="dark" style={{ marginTop: 0 }} />
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} Thalès le Dev. Tous droits réservés.
          </span>
          <span className="footer-signature">
            Conçu &amp; développé avec Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}