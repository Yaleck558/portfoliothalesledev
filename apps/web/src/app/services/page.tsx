// apps/web/src/app/services/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { services } from './data';

export const metadata = {
  title: 'Services — Thalès le Dev',
  description: 'Développement web et design pour votre projet, du site vitrine à l\u2019application sur-mesure.',
};

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <div className="service-card-image-wrap">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="service-card-image"
          sizes="(max-width: 768px) 100vw, 380px"
        />
        <span className="service-card-badge">{service.badge}</span>
      </div>
      <div className="service-card-body">
        <h3 className="service-card-title">{service.title}</h3>
        <p className="service-card-tagline">{service.tagline}</p>
        <div className="service-card-footer">
          <span className="service-card-price">Sur devis</span>
          <span className="service-card-cta">Découvrir →</span>
        </div>
      </div>
    </Link>
  );
}

export default function ServicesPage() {
  const devServices = services.filter((s) => s.category === 'dev');
  const designServices = services.filter((s) => s.category === 'design');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .services-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          padding: 150px 32px 100px;
          position: relative;
          overflow: hidden;
        }

        .services-section::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(73, 37, 176, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .services-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .services-header {
          text-align: center;
          margin-bottom: 64px;
          animation: fadeInUpServices 0.8s ease-out;
        }

        .services-title {
          font-family: 'Germania One', cursive;
          font-size: 52px;
          color: #4925B0;
          margin: 0 0 14px;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        @media (max-width: 768px) {
          .services-title { font-size: 36px; }
        }

        .services-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 18px;
          color: #555555;
          font-weight: 300;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .services-category-title {
          font-family: 'Germania One', cursive;
          font-size: 28px;
          color: #4925B0;
          text-transform: uppercase;
          margin: 0 0 28px;
          letter-spacing: -0.5px;
        }

        .services-category {
          margin-bottom: 64px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr; }
        }

        .service-card {
          display: block;
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid rgba(73, 37, 176, 0.08);
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.05);
          transition: all 0.3s ease;
          animation: fadeInUpServices 0.6s ease-out both;
        }

        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(73, 37, 176, 0.15);
        }

        .service-card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #111111;
        }

        .service-card-image {
          object-fit: cover;
        }

        .service-card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #ffffff;
          color: #4925B0;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .service-card-body {
          padding: 22px 22px 20px;
        }

        .service-card-title {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #111111;
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .service-card-tagline {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: #777777;
          font-weight: 300;
          line-height: 1.5;
          margin: 0 0 18px;
        }

        .service-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid #f0f0f0;
        }

        .service-card-price {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #4925B0;
          text-transform: uppercase;
        }

        .service-card-cta {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #4925B0;
        }

        @keyframes fadeInUpServices {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="services-section">
        <div className="services-wrapper">
          <div className="services-header">
            <h1 className="services-title">Mes services</h1>
            <p className="services-subtitle">
              Du site vitrine à l'application sur-mesure, en passant par le design de votre identité — un accompagnement complet pour votre projet.
            </p>
          </div>

          <div className="services-category">
            <h2 className="services-category-title">Développement web</h2>
            <div className="services-grid">
              {devServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>

          <div className="services-category">
            <h2 className="services-category-title">Design graphique</h2>
            <div className="services-grid">
              {designServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}