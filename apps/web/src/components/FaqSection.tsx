'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './animate-ui/components/radix/accordion';

const FAQ_ITEMS = [
  {
    title: `Quels types de projets peux-tu réaliser ?`,
    content: `Sites vitrines, portfolios, plateformes e-commerce, applications web sur mesure et interfaces d'administration. Je m'occupe aussi bien du design que du développement front-end et back-end.`,
  },
  {
    title: `Quelles technologies utilises-tu ?`,
    content: `Principalement Next.js, React et TypeScript pour le front-end, Tailwind CSS pour le style, et Supabase pour la base de données et l'authentification. Je choisis toujours la stack la plus adaptée au projet.`,
  },
  {
    title: `Travailles-tu avec des clients à distance ?`,
    content: `Oui, je travaille aussi bien en présentiel qu'à distance. Tous les échanges, points d'avancement et livraisons peuvent se faire entièrement en ligne, où que tu sois.`,
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="faq-section">
      <style>{`
        .faq-section {
          padding: 80px 32px;
          background: #ffffff;
          display: flex;
          justify-content: center;
        }

        .faq-inner {
          width: 100%;
          max-width: 720px;
        }

        .faq-accordion-wrapper {
          text-align: left;
        }

        .faq-accordion-wrapper :global([role="button"]) {
          padding: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #d0d0d0;
          cursor: pointer;
          background: none;
          transition: color 0.2s ease;
        }

        .faq-accordion-wrapper :global([role="button"]:hover) {
          color: #333;
        }

        .faq-accordion-wrapper :global([role="button"]) svg {
          width: 18px;
          height: 18px;
          color: #000;
          transition: transform 0.2s ease;
          flex-shrink: 0;
          margin-left: 16px;
        }

        .faq-accordion-wrapper :global([data-state="open"][role="button"]) svg {
          transform: rotate(180deg);
        }

        .faq-accordion-wrapper :global([role="region"]) {
          padding: 0 0 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #555;
        }

        @media (max-width: 640px) {
          .faq-section {
            padding: 60px 20px;
          }

          .faq-accordion-wrapper :global([role="button"]) {
            padding: 18px 0;
            font-size: 15px;
          }

          .faq-accordion-wrapper :global([role="region"]) {
            padding: 0 0 18px 0;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="faq-inner">
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