// apps/web/src/app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GravityStarsBackground } from '../components/animate-ui/components/backgrounds/gravity-stars';
import { CodeDemo } from '../components/CodeDemo';
import { SocialContactsList } from '../components/SocialContactsList';
import PainPoints from '../components/PainPoints';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';
import {
  PreviewLinkCard,
  PreviewLinkCardTrigger,
  PreviewLinkCardContent,
  PreviewLinkCardImage,
} from '../components/PreviewLinkCard';


export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('count', { count: 'exact', head: true });

        if (error) {
          console.error('Erreur Supabase:', error);
          setIsConnected(false);
        } else {
          setIsConnected(true);
        }

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error('Erreur:', err);
      }
    }

    checkConnection();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .hero-section {
          min-height: 115vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 32px 160px;  /* padding-bottom augmenté : laisse la place au texte fantôme + trait sans chevaucher les liens sociaux */
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(73, 37, 176, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: -20%;
          left: -5%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(73, 37, 176, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        .hero-stars-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .hero-content {
          margin-top: 6rem;
          max-width: 1000px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .hero-bg-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 20%;
          opacity: 0.99;
          z-index: 0;
          pointer-events: none;
        }

        .hero-bg-name {
              position: absolute;
              bottom: 38px;                /* descendu : laisse la marge sous les liens sociaux, texte entier visible */
              left: 50%;
              transform: translateX(-50%);
              font-family: 'Germania One', cursive;
              font-size: 72px;
              color: #4925B0;
              opacity: 0.15;
              text-transform: uppercase;
              letter-spacing: 2px;
              white-space: nowrap;
              z-index: 0;
              pointer-events: none;
          }

        @media (max-width: 768px) {
            .hero-bg-name {
                  font-size: 38px;
                  bottom: 26px;
                }
            }

        .hero-bottom-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: #4925B0;
          overflow: hidden;
          z-index: 2;
          box-shadow: 0 0 8px rgba(73, 37, 176, 0.55);
          pointer-events: none;
        }

        .hero-bottom-line-glow {
          position: absolute;
          top: 0;
          left: -30%;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #ffffff, transparent);
          animation: heroLineSweep 2.5s linear infinite;
        }

        @keyframes heroLineSweep {
          0% { left: -30%; }
          100% { left: 130%; }
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-family: 'Germania One', cursive;
          font-size: 56px;
          line-height: 1.2;
          color: #4925B0;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -1px;
          animation: fadeInUp 0.8s ease-out;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 42px; }
        }

        .hero-title span {
          display: inline;
          color: #000000;
        }

        .hero-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 18px;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          font-weight: 300;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        @media (max-width: 768px) {
          .hero-subtitle { font-size: 16px; }
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .btn-primary {
          background: #4925B0;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid #4925B0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-primary:hover {
          background: #6a42d0;
          border-color: #6a42d0;
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.3);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: #4925B0;
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid #4925B0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-secondary:hover {
          background: rgba(73, 37, 176, 0.1);
          transform: translateY(-2px);
        }

        .hero-right {
              display: flex;
              align-items: flex-start;   /* était: center */
              justify-content: center;
              animation: fadeInUp 0.8s ease-out 0.6s both;
             position: relative;
             z-index: 1;
             margin-top: 7rem;          /* nouveau : fait descendre CodeDemo */
          }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="hero-section">
        <GravityStarsBackground className="hero-stars-bg" />

        <img
          src="/img/profil.png"
          alt="Thalès le Dev"
          className="hero-bg-photo"
        />
        <span className="hero-bg-name">Thalès le Dev</span>

        <div className="hero-bottom-line">
          <span className="hero-bottom-line-glow" />
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              <span>Salut! Je suis</span> Thalès le Dev
            </h1>

            <p className="hero-subtitle">
              Du site vitrine à l'application web, chaque projet est conçu avec soin pour offrir une expérience fluide, un design soigné et des performances optimales.
            </p>

            <div className="hero-buttons">
              <PreviewLinkCard href="#projects">
                <PreviewLinkCardTrigger className="btn-primary">
                  Voir mes projets
                </PreviewLinkCardTrigger>
                <PreviewLinkCardContent side="bottom" sideOffset={10}>
                  <PreviewLinkCardImage alt="Mes projets" />
                </PreviewLinkCardContent>
              </PreviewLinkCard>

              <PreviewLinkCard href="#contact">
                <PreviewLinkCardTrigger className="btn-secondary">
                  En savoir plus
                </PreviewLinkCardTrigger>
                <PreviewLinkCardContent side="bottom" sideOffset={10}>
                  <PreviewLinkCardImage alt="En savoir plus" />
                </PreviewLinkCardContent>
              </PreviewLinkCard>
            </div>

            <SocialContactsList />
          </div>

          <div className="hero-right">
            <CodeDemo duration={0.05} delay={0.02} writing={true} cursor={true} />
          </div>
        </div>
      </section>
      <PainPoints />
      <FaqSection />
      <Footer />
    </>
  );
}