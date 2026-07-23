// apps/web/src/components/PainPoints.tsx

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimateIcon } from '../components/animate-ui/icons/icon';
import { ChevronLeft } from '../components/animate-ui/icons/chevron-left';
import { ChevronRight } from '../components/animate-ui/icons/chevron-right';
import { ArrowLeft } from '../components/animate-ui/icons/arrow-left';
import { ArrowRight } from '../components/animate-ui/icons/arrow-right';
import { X } from '../components/animate-ui/icons/x';
import { CircleCheckBig } from '../components/animate-ui/icons/circle-check-big';

const PROBLEMS = [
  'Deadlines ratées',
  'Bugs en production',
  'Site cassé sur mobile',
  'Vous relancez sans réponse',
  'Budget qui explose',
];

const SOLUTIONS = [
  'Deadlines toujours tenues',
  'Code testé, zéro surprise',
  'Site fluide sur tous les écrans',
  'Vous savez où en est le projet',
  'Budget respecté du début à la fin',
];

export default function PainPoints() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isPressed = useRef(false);
  const [sliderPosition, setSliderPosition] = useState(100); // 100 = "Sans moi" visible par défaut

  const clamp = (val: number) => Math.max(0, Math.min(100, val));

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    setSliderPosition(clamp((x / rect.width) * 100));
  }, []);

  const handleMouseDown = () => {
    isPressed.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPressed.current) return;
    updateFromClientX(e.clientX);
  };

  const handleTouchStart = () => {
    isPressed.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPressed.current) return;
    updateFromClientX(e.touches[0].clientX);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setSliderPosition((prev) => clamp(prev + (e.deltaY > 0 ? 2 : -2)));
  };

  useEffect(() => {
    const handleUp = () => {
      isPressed.current = false;
    };
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
  }, []);

  const showSolutionHint = sliderPosition > 50;
  // La barre "bottom-nav" est fixe au centre (50%) du slider.
  // Le fond violet (solution) ne recouvre ce point que si sliderPosition <= 50.
  const isNavOverSolution = sliderPosition <= 50;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .pp-section {
          background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
          padding: 80px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pp-container {
          max-width: 1000px;
          width: 100%;
        }

        .pp-title {
          font-family: 'Germania One', cursive;
          font-size: 44px;
          color: #4925B0;
          text-align: center;
          margin-bottom: 60px;
          letter-spacing: -1px;
          line-height: 1.25;
        }

        @media (max-width: 768px) {
          .pp-title {
            font-size: 30px;
            margin-bottom: 40px;
          }
        }

        .pp-slider {
          position: relative;
          height: 450px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(73, 37, 176, 0.18);
          border: 2px solid rgba(73, 37, 176, 0.15);
          animation: ppSlideUp 0.8s ease-out;
          cursor: grab;
          user-select: none;
        }

        .pp-slider:active {
          cursor: grabbing;
        }

        @keyframes ppSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pp-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 50px 60px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .pp-slider { height: 420px; }
          .pp-slide { padding: 35px 32px; }
        }

        @media (max-width: 480px) {
          .pp-slider { height: 460px; }
          .pp-slide { padding: 30px 24px; }
        }

        /* === SANS MOI : fond blanc, violet clair === */
        .pp-slide-problem {
          background: linear-gradient(135deg, #ffffff 0%, #f5f2fb 100%);
          color: #1a1a1a;
          z-index: 1;
        }

        /* === AVEC MOI : fond violet plein === */
        .pp-slide-solution {
          background: linear-gradient(135deg, #4925B0 0%, #341a80 100%);
          color: #ffffff;
          z-index: 2;
          transition: clip-path 0.05s linear;
        }

        .pp-slide-header {
          margin-bottom: 28px;
          position: relative;
          z-index: 2;
        }

        .pp-slide-name {
          font-family: 'Germania One', cursive;
          font-size: 34px;
          text-transform: uppercase;
          margin-bottom: 14px;
          font-weight: bold;
          letter-spacing: -0.5px;
        }

        @media (max-width: 768px) {
          .pp-slide-name { font-size: 28px; }
        }

        @media (max-width: 480px) {
          .pp-slide-name { font-size: 24px; }
        }

        .pp-slide-problem .pp-slide-name { color: #4925B0; }
        .pp-slide-solution .pp-slide-name { color: #ffffff; }

        .pp-slide-badge {
          display: inline-flex;
          align-items: center;
          padding: 7px 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Josefin Sans', sans-serif;
        }

        @media (max-width: 480px) {
          .pp-slide-badge { font-size: 12px; padding: 6px 14px; }
        }

        .pp-slide-problem .pp-slide-badge {
          background: rgba(73, 37, 176, 0.08);
          color: #4925B0;
          border: 1.5px solid rgba(73, 37, 176, 0.35);
        }

        .pp-slide-solution .pp-slide-badge {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: 1.5px solid rgba(255, 255, 255, 0.5);
        }

        /* === LISTE DE POINTS : gros texte, très lisible === */
        .pp-list {
          list-style: none;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pp-list-item {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 22px;
          font-weight: 600;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .pp-list-item { font-size: 19px; gap: 12px; }
        }

        @media (max-width: 480px) {
          .pp-list-item { font-size: 16px; gap: 10px; }
        }

        .pp-list-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pp-slide-problem .pp-list-icon { color: #4925B0; }
        .pp-slide-solution .pp-list-icon { color: #ffffff; }

        .pp-slide-problem .pp-list-item { color: #262626; }
        .pp-slide-solution .pp-list-item { color: #ffffff; }

        /* === BARRE VERTICALE DE SÉPARATION === */
        .pp-reveal-bar {
          position: absolute;
          top: 0;
          left: 50%;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, #ffffff 50%, transparent 100%);
          z-index: 20;
          transform: translateX(-50%);
          box-shadow: 0 0 30px rgba(73, 37, 176, 0.9);
          pointer-events: none;
        }

        .pp-reveal-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: #4925B0;
          border: 3px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 25;
          cursor: grab;
          box-shadow: 0 0 40px rgba(73, 37, 176, 0.6);
          user-select: none;
        }

        .pp-reveal-handle:active { cursor: grabbing; }

        @media (max-width: 768px) {
          .pp-reveal-handle { width: 70px; height: 70px; }
        }

        @media (max-width: 480px) {
          .pp-reveal-handle { width: 60px; height: 60px; }
        }

        .pp-handle-chevrons {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #ffffff;
          animation: ppPulse 1.5s ease-in-out infinite;
        }

        @keyframes ppPulse {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.2); }
        }

        .pp-bottom-nav {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 15;
          user-select: none;
        }

        .pp-bottom-arrow {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          border: 1.5px solid transparent;
        }

        /* Variante quand le fond derrière est BLANC (côté problème) */
        .pp-bottom-arrow.on-light {
          background: rgba(73, 37, 176, 0.08);
          border-color: rgba(73, 37, 176, 0.25);
          color: #4925B0;
        }

        .pp-bottom-arrow.on-light:hover {
          background: rgba(73, 37, 176, 0.15);
        }

        .pp-bottom-arrow.on-light.active {
          background: #4925B0;
          border-color: #4925B0;
          color: #ffffff;
          box-shadow: 0 0 16px rgba(73, 37, 176, 0.6);
          animation: ppPulse 1.5s ease-in-out infinite;
        }

        /* Variante quand le fond derrière est VIOLET (côté solution) */
        .pp-bottom-arrow.on-dark {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
        }

        .pp-bottom-arrow.on-dark:hover {
          background: rgba(255, 255, 255, 0.22);
        }

        .pp-bottom-arrow.on-dark.active {
          background: #ffffff;
          border-color: #ffffff;
          color: #4925B0;
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.6);
          animation: ppPulse 1.5s ease-in-out infinite;
        }

        .pp-bottom-text {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .pp-bottom-text.on-light { color: #4925B0; }
        .pp-bottom-text.on-dark { color: #ffffff; }

        @media (max-width: 480px) {
          .pp-bottom-text { font-size: 10px; }
          .pp-bottom-arrow { width: 28px; height: 28px; }
        }
      `}</style>

      <section className="pp-section" id="painpoints">
        <div className="pp-container">
          <h2 className="pp-title">Sans moi ou avec moi ? Glissez pour voir la différence</h2>

          <div
            className="pp-slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onWheel={handleWheel}
          >
            {/* SLIDE PROBLEM (FOND) */}
            <div className="pp-slide pp-slide-problem">
              <div className="pp-slide-header">
                <div className="pp-slide-name">Sans moi</div>
                <span className="pp-slide-badge">Problème</span>
              </div>
              <ul className="pp-list">
                {PROBLEMS.map((item) => (
                  <li className="pp-list-item" key={item}>
                    <span className="pp-list-icon">
                      <AnimateIcon animateOnHover>
                        <X size={20} />
                      </AnimateIcon>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* SLIDE SOLUTION (RÉVÉLÉE PAR LA BARRE) */}
            <div
              className="pp-slide pp-slide-solution"
              style={{
                clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`,
              }}
            >
              <div className="pp-slide-header">
                <div className="pp-slide-name">Avec moi</div>
                <span className="pp-slide-badge">Solution</span>
              </div>
              <ul className="pp-list">
                {SOLUTIONS.map((item) => (
                  <li className="pp-list-item" key={item}>
                    <span className="pp-list-icon">
                      <AnimateIcon animateOnHover>
                        <CircleCheckBig size={20} />
                      </AnimateIcon>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* HANDLE (cercle + barre, un seul bloc synchronisé) */}
            <div
              className="pp-reveal-handle"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="pp-reveal-bar" />
              <div className="pp-handle-chevrons">
                <ChevronLeft size={26} animateOnHover />
                <ChevronRight size={26} animateOnHover />
              </div>
            </div>

            {/* INDICATEUR BAS — couleur adaptée au fond réellement visible sous la barre */}
            <div className="pp-bottom-nav">
              <button
                className={`pp-bottom-arrow ${isNavOverSolution ? 'on-dark' : 'on-light'} ${
                  !showSolutionHint ? 'active' : ''
                }`}
                aria-label="Voir la solution"
                onClick={() => setSliderPosition(0)}
              >
                <ArrowLeft size={16} animateOnHover />
              </button>
              <span className={`pp-bottom-text ${isNavOverSolution ? 'on-dark' : 'on-light'}`}>
                {showSolutionHint
                  ? 'Appuyez vers la gauche pour la solution'
                  : 'Appuyez vers la droite pour le problème'}
              </span>
              <button
                className={`pp-bottom-arrow ${isNavOverSolution ? 'on-dark' : 'on-light'} ${
                  showSolutionHint ? 'active' : ''
                }`}
                aria-label="Voir le problème"
                onClick={() => setSliderPosition(100)}
              >
                <ArrowRight size={16} animateOnHover />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}