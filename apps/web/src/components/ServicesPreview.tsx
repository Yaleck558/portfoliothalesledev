'use client';

import Link from 'next/link';
import Image from 'next/image';
import { services } from '../app/services/data';

const previewSlugs = ['site-vitrine', 'application-web', 'identite-visuelle', 'referencement-seo'];

export default function ServicesPreview() {
  const preview = previewSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean) as typeof services;

  return (
    <>
      <style>{`
        .sp-section {
          padding: 100px 32px;
          background: #ffffff;
        }
        .sp-wrapper { max-width: 1200px; margin: 0 auto; }
        .sp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          gap: 24px;
          flex-wrap: wrap;
        }
        .sp-title {
          font-family: 'Germania One', cursive;
          font-size: 42px;
          color: #4925B0;
          margin: 0;
          text-transform: uppercase;
        }
        .sp-link {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #4925B0;
          text-decoration: none;
          white-space: nowrap;
        }
        .sp-link:hover { text-decoration: underline; }
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) { .sp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .sp-grid { grid-template-columns: 1fr; } }
        .sp-card {
          display: block;
          text-decoration: none;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(73, 37, 176, 0.08);
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.05);
          transition: all 0.3s ease;
        }
        .sp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(73, 37, 176, 0.15);
        }
        .sp-card-image-wrap { position: relative; width: 100%; aspect-ratio: 16 / 10; background: #111; }
        .sp-card-image { object-fit: cover; }
        .sp-card-body { padding: 18px 18px 16px; }
        .sp-card-title {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.3;
        }
      `}</style>

      <section className="sp-section">
        <div className="sp-wrapper">
          <div className="sp-header">
            <h2 className="sp-title">Mes services</h2>
            <Link href="/services" className="sp-link">Voir tous les services →</Link>
          </div>
          <div className="sp-grid">
            {preview.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="sp-card">
                <div className="sp-card-image-wrap">
                  <Image src={s.image} alt={s.title} fill className="sp-card-image" sizes="280px" />
                </div>
                <div className="sp-card-body">
                  <h3 className="sp-card-title">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}