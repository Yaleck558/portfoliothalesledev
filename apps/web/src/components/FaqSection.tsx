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
    title: `Combien coûte un site web ?`,
    content: `Avant de parler de prix, il est essentiel de bien comprendre votre projet. Contactez-moi pour discuter de vos besoins et recevoir un devis personnalisé.`,
  },
  {
    title: `Combien de temps pour réaliser mon projet ?`,
    content: `Un site vitrine prend en général 1 à 2 semaines. Une application plus complexe (avec authentification, base de données, dashboard admin) demande plutôt 3 à 6 semaines. Je te communique un planning précis dès le départ et je te tiens informé à chaque étape.`,
  },
  {
    title: `Quelles technologies utilises-tu ?`,
    content: `Principalement Next.js, React et TypeScript pour le front-end, Tailwind CSS pour le design, et Supabase pour la base de données et l'authentification. Je choisis toujours la stack la plus adaptée à ton projet, pas juste ce que je préfère.`,
  },
  {
    title: `Proposes-tu la maintenance après la livraison ?`,
    content: `Oui. Je propose un suivi post-lancement pour corriger d'éventuels bugs, ajouter du contenu ou faire évoluer le site. On peut convenir d'un forfait mensuel ou d'interventions ponctuelles selon tes besoins.`,
  },
  {
    title: `Comment se passe le paiement ?`,
    content: `En général, je demande un acompte de 30 à 50% au démarrage du projet, puis le solde à la livraison. Pour les projets plus longs, on peut aussi découper le paiement par étapes.`,
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
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .faq-section {
          width: 100%;
          background: #ffffff;
          display: flex;
          justify-content: center;
          padding: 100px 32px;
        }

        .faq-inner {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .faq-eyebrow {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #4925B0;
          margin-bottom: 12px;
        }

        .faq-title {
          font-family: 'Germania One', cursive;
          font-size: 42px;
          line-height: 1.2;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
        }

        .faq-title span {
          color: #4925B0;
        }

        .faq-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: #555555;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .faq-section { padding: 64px 20px; }
          .faq-title { font-size: 32px; }
        }

        /* --- Accordion override, ciblé via data-slot pour ne pas dépendre des classes Tailwind générées --- */

        .faq-inner [data-slot="accordion-item"] {
          border-bottom: 1px solid #e6e1f5 !important;
        }

        .faq-inner [data-slot="accordion-trigger"] {
          font-family: 'Josefin Sans', sans-serif !important;
          font-size: 17px !important;
          font-weight: 600 !important;
          color: #111111 !important;
          padding: 22px 0 !important;
          text-decoration-color: #4925B0 !important;
        }

        .faq-inner [data-slot="accordion-trigger"][data-state="open"] {
          color: #4925B0 !important;
        }

        .faq-inner [data-slot="accordion-trigger"] svg {
          color: #4925B0 !important;
          width: 20px !important;
          height: 20px !important;
        }

        .faq-inner [data-slot="accordion-content"] > div {
          font-family: 'Josefin Sans', sans-serif !important;
          font-size: 25px !important;
          font-weight: 300 !important;
          color: #555555 !important;
          line-height: 1.7 !important;
          padding-bottom: 24px !important;
        }
      `}</style>

      <div className="faq-inner">
        <div className="faq-header">
          <p className="faq-eyebrow">On répond à tes questions</p>
          <h2 className="faq-title">
            Questions <span>fréquentes</span>
          </h2>
          <p className="faq-subtitle">
            Tout ce que tu dois savoir avant de te lancer dans ton projet avec moi.
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger showArrow>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}