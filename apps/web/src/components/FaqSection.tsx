// apps/web/src/components/FaqSection.tsx

'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './animate-ui/components/radix/accordion';

const FAQ_ITEMS = [
  {
    title: 'Quels types de projets peux-tu réaliser ?',
    content:
      "Sites vitrines, portfolios, plateformes e-commerce, applications web sur mesure et interfaces d'administration. Je m'occupe aussi bien du design que du développement front-end et back-end.",
  },
  {
    title: 'Quelles technologies utilises-tu ?',
    content:
      'Principalement Next.js, React et TypeScript pour le front-end, Tailwind CSS pour le style, et Supabase pour la base de données et l’authentification. Je choisis toujours la stack la plus adaptée au projet.',
  },
  {
    title: 'Travailles-tu avec des clients à distance ?',
    content:
      'Oui, je travaille aussi bien en présentiel qu’à distance. Tous les échanges, points d’avancement et livraisons peuvent se faire entièrement en ligne, où que tu sois.',
  },
  {
    title: 'Quel est le délai moyen pour un projet ?',
    content:
      'Ça dépend de la complexité : un site vitrine peut prendre quelques jours, une plateforme plus complète plusieurs semaines. Je donne toujours une estimation précise après avoir compris le besoin.',
  },
  {
    title: 'Comment se passe la prise de contact ?',
    content:
      'Le plus simple est de m’écrire sur WhatsApp ou par téléphone (liens dans le pied de page). On discute de ton projet, de ton budget et de tes délais, puis je te propose une approche claire avant de démarrer.',
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="faq-section">
      <style>{`
        .faq-section {
          padding: 100px 32px 120px;
          background: #ffffff;
          display: flex;
          justify-content: center;
        }

        .faq-inner {
          width: 100%;
          max-width: 820px;
          text-align: center;
        }

        .faq-title {
          font-family: 'Germania One', cursive;
          font-size: 42px;
          color: #1c1230;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 12px;
        }

        .faq-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          color: #6b6377;
          margin: 0 0 48px;
        }

        .faq-accordion-wrapper {
          text-align: left;
        }

        @media (max-width: 640px) {
          .faq-section { padding: 70px 20px 90px; }
          .faq-title { font-size: 30px; }
        }
      `}</style>

      <div className="faq-inner">
        <h2 className="faq-title">Questions fréquentes</h2>
        <p className="faq-subtitle">
          Tout ce qu&apos;il faut savoir avant de démarrer un projet ensemble.
        </p>

        <div className="faq-accordion-wrapper">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger showArrow>{item.title}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}