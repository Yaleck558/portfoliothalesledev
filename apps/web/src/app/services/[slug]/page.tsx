// apps/web/src/app/services/[slug]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { services, getServiceBySlug } from '../data';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} — Thalès le Dev`,
    description: service.tagline,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const suggestions = services.filter((s) => s.slug !== service.slug && s.category === service.category).slice(0, 3);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .sd-hero {
          position: relative;
          padding: 150px 32px 0;
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          overflow: hidden;
        }

        .sd-hero-wrap {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .sd-breadcrumb {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: #888888;
          margin-bottom: 20px;
        }

        .sd-breadcrumb a {
          color: #4925B0;
          text-decoration: none;
          font-weight: 600;
        }

        .sd-badge {
          display: inline-block;
          background: rgba(73, 37, 176, 0.1);
          color: #4925B0;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 20px;
        }

        .sd-title {
          font-family: 'Germania One', cursive;
          font-size: 48px;
          color: #111111;
          margin: 0 0 16px;
          line-height: 1.15;
        }

        @media (max-width: 768px) {
          .sd-title { font-size: 32px; }
        }

        .sd-title span {
          color: #4925B0;
        }

        .sd-tagline {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 19px;
          color: #555555;
          font-weight: 300;
          max-width: 640px;
          line-height: 1.6;
          margin: 0 0 36px;
        }

        .sd-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 8;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(73, 37, 176, 0.15);
        }

        .sd-image {
          object-fit: cover;
        }

        .sd-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 32px 100px;
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 56px;
        }

        @media (max-width: 900px) {
          .sd-body { grid-template-columns: 1fr; gap: 40px; }
        }

        .sd-section-title {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #111111;
          margin: 0 0 16px;
        }

        .sd-description {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          color: #444444;
          line-height: 1.75;
          font-weight: 300;
          margin: 0 0 40px;
        }

        .sd-inclus-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sd-inclus-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          color: #333333;
          line-height: 1.5;
        }

        .sd-inclus-check {
          min-width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(73, 37, 176, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }

        .sd-sidebar {
          position: sticky;
          top: 110px;
          align-self: start;
        }

        .sd-sidebar-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 16px 48px rgba(73, 37, 176, 0.1);
          border: 1px solid rgba(73, 37, 176, 0.08);
        }

        .sd-sidebar-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          color: #888888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 6px;
        }

        .sd-sidebar-price {
          font-family: 'Germania One', cursive;
          font-size: 26px;
          color: #4925B0;
          margin: 0 0 24px;
        }

        .sd-sidebar-delai {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: #444444;
          margin: 0 0 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f0f0f0;
        }

        .sd-sidebar-delai strong {
          display: block;
          color: #111111;
          margin-bottom: 4px;
        }

        .sd-cta-button {
          display: block;
          text-align: center;
          background: #4925B0;
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 10px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid #4925B0;
          transition: all 0.3s ease;
        }

        .sd-cta-button:hover {
          background: #6a42d0;
          border-color: #6a42d0;
          transform: translateY(-2px);
        }

        .sd-cta-note {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          color: #999999;
          text-align: center;
          margin: 12px 0 0;
        }

        .sd-suggestions {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px 100px;
        }

        .sd-suggestions-title {
          font-family: 'Germania One', cursive;
          font-size: 26px;
          color: #4925B0;
          text-transform: uppercase;
          margin: 0 0 28px;
        }

        .sd-suggestions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 900px) {
          .sd-suggestions-grid { grid-template-columns: 1fr; }
        }

        .sd-suggestion-card {
          display: block;
          text-decoration: none;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(73, 37, 176, 0.08);
          transition: all 0.3s ease;
        }

        .sd-suggestion-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(73, 37, 176, 0.12);
        }

        .sd-suggestion-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
        }

        .sd-suggestion-image {
          object-fit: cover;
        }

        .sd-suggestion-title {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #111111;
          margin: 0;
          padding: 16px;
        }
      `}</style>

      <section className="sd-hero">
        <div className="sd-hero-wrap">
          <p className="sd-breadcrumb">
            <Link href="/services">Services</Link> / {service.badge}
          </p>
          <span className="sd-badge">{service.badge}</span>
          <h1 className="sd-title">{service.title}</h1>
          <p className="sd-tagline">{service.tagline}</p>

          <div className="sd-image-wrap">
            <Image src={service.image} alt={service.title} fill className="sd-image" sizes="1100px" priority />
          </div>
        </div>
      </section>

      <div className="sd-body">
        <div>
          <h2 className="sd-section-title">Le projet en détail</h2>
          <p className="sd-description">{service.description}</p>

          <h2 className="sd-section-title">Ce qui est inclus</h2>
          <ul className="sd-inclus-list">
            {service.inclus.map((item) => (
              <li key={item} className="sd-inclus-item">
                <span className="sd-inclus-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" stroke="#4925B0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="sd-sidebar">
          <div className="sd-sidebar-card">
            <p className="sd-sidebar-label">Tarif</p>
            <p className="sd-sidebar-price">Sur devis</p>

            <div className="sd-sidebar-delai">
              <strong>Délai indicatif</strong>
              {service.delai}
            </div>

            <Link href="/contact" className="sd-cta-button">
              Discuter de mon projet
            </Link>
            <p className="sd-cta-note">Réponse sous 24h en général</p>
          </div>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <div className="sd-suggestions">
          <h2 className="sd-suggestions-title">Autres services qui pourraient vous intéresser</h2>
          <div className="sd-suggestions-grid">
            {suggestions.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="sd-suggestion-card">
                <div className="sd-suggestion-image-wrap">
                  <Image src={s.image} alt={s.title} fill className="sd-suggestion-image" sizes="360px" />
                </div>
                <p className="sd-suggestion-title">{s.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}