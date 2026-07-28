// apps/web/src/app/contact/page.tsx

'use client';

import { useState } from 'react';

type Preference = 'email' | 'whatsapp' | 'peu_importe';

interface FormState {
  typeProjet: string;
  objectif: string;
  etat: string;
  budget: string;
  budgetLibre: string;
  delai: string;
  nom: string;
  email: string;
  whatsapp: string;
  description: string;
  preference: Preference | '';
}

const STEPS = ['Projet', 'Objectif', 'État', 'Budget', 'Délai', 'Coordonnées', 'Envoyé'];

const TYPE_OPTIONS = [
  { value: 'Site vitrine', desc: 'Une image pro et soignée pour votre activité.' },
  { value: 'Boutique en ligne', desc: 'Vendez vos produits ou services 24h/24.' },
  { value: 'Landing page', desc: 'Une page pensée pour convertir vos visiteurs.' },
  { value: 'Application web', desc: 'Un outil sur-mesure pour votre activité.' },
  { value: 'Plateforme (LMS)', desc: 'Diffusez et vendez vos contenus en ligne.' },
  { value: 'Refonte de site', desc: 'Donnez un coup de neuf à l\u2019existant.' },
  { value: 'Autre', desc: 'On en discute ensemble, sans pression.' },
];

const OBJECTIF_OPTIONS = [
  { value: 'Vendre en ligne', desc: 'Transformer vos visiteurs en clients.' },
  { value: 'Présenter mon activité', desc: 'Donner une image claire et professionnelle.' },
  { value: 'Générer des leads', desc: 'Récolter des contacts qualifiés.' },
  { value: 'Automatiser une tâche métier', desc: 'Gagner du temps sur vos process.' },
  { value: 'Pas encore défini', desc: 'On en parle ensemble pour clarifier.' },
];

const ETAT_OPTIONS = [
  { value: 'Rien, tout est à faire', desc: 'On part d\u2019une page blanche.' },
  { value: 'J\u2019ai un cahier des charges', desc: 'Vous savez déjà ce qu\u2019il vous faut.' },
  { value: 'J\u2019ai déjà une maquette', desc: 'Figma ou autre, prête à être développée.' },
  { value: 'J\u2019ai un site existant à refondre', desc: 'On modernise l\u2019existant.' },
];

const BUDGET_OPTIONS = [
  'Moins de 100K FCFA',
  '100K – 250K FCFA',
  '250K – 500K FCFA',
  '500K – 1M FCFA',
  'Plus d\u20191M FCFA',
  'Pas de budget défini',
  'Montant libre',
];

const DELAI_OPTIONS = [
  { value: 'Urgent (< 2 semaines)', desc: 'Il faut avancer vite.' },
  { value: 'Dans le mois', desc: 'Un délai raisonnable.' },
  { value: 'Flexible', desc: 'Pas de pression particulière.' },
];

const initialState: FormState = {
  typeProjet: '',
  objectif: '',
  etat: '',
  budget: '',
  budgetLibre: '',
  delai: '',
  nom: '',
  email: '',
  whatsapp: '',
  description: '',
  preference: '',
};

export default function ContactPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canContinue = (() => {
    switch (step) {
      case 0:
        return !!form.typeProjet;
      case 1:
        return !!form.objectif;
      case 2:
        return !!form.etat;
      case 3:
        return form.budget && (form.budget !== 'Montant libre' || form.budgetLibre.trim());
      case 4:
        return !!form.delai;
      case 5:
        return form.nom.trim() && form.email.trim() && form.description.trim() && form.preference;
      default:
        return true;
    }
  })();

  function next() {
    if (!canContinue) return;
    if (step === 5) {
      handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function buildWhatsappSummary() {
    const budgetAffiche =
      form.budget === 'Montant libre' && form.budgetLibre
        ? `Montant libre : ${form.budgetLibre} FCFA`
        : form.budget;

    return (
      `Nouvelle demande de projet — Thalès le Dev\n\n` +
      `Nom : ${form.nom}\n` +
      `Email : ${form.email}\n` +
      `Type de projet : ${form.typeProjet}\n` +
      `Objectif : ${form.objectif}\n` +
      `État actuel : ${form.etat}\n` +
      `Budget : ${budgetAffiche}\n` +
      `Délai souhaité : ${form.delai}\n\n` +
      `Description : ${form.description}`
    );
  }

  async function handleSubmit() {
    setSending(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur inconnue');
      }

      setStep(6);
    } catch (err: any) {
      setErrorMsg(
        'Un souci est survenu pendant l\u2019envoi. Vous pouvez réessayer, ou m\u2019écrire directement sur WhatsApp.'
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .funnel-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          padding: 130px 24px 100px;
          display: flex;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .funnel-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(73, 37, 176, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: floatFunnel 6s ease-in-out infinite;
          pointer-events: none;
        }

        .funnel-section::after {
          content: '';
          position: absolute;
          bottom: -20%;
          left: -8%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(73, 37, 176, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: floatFunnel 8s ease-in-out infinite reverse;
          pointer-events: none;
        }

        @keyframes floatFunnel {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        .funnel-container {
          width: 100%;
          max-width: 980px;
          position: relative;
          z-index: 1;
        }

        .funnel-header {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeInUpFunnel 0.6s ease-out;
        }

        .funnel-title {
          font-family: 'Germania One', cursive;
          font-size: 54px;
          color: #4925B0;
          margin: 0 0 12px;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        @media (max-width: 640px) {
          .funnel-title { font-size: 36px; }
        }

        .funnel-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 18px;
          color: #555555;
          font-weight: 300;
          max-width: 600px;
          margin: 0 auto;
        }

        .funnel-stepper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .funnel-step-dot-wrap {
          display: flex;
          align-items: center;
        }

        .funnel-step-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: 2px solid #d8d3ea;
          color: #a79fcb;
          background: #ffffff;
          transition: all 0.3s ease;
        }

        .funnel-step-dot.active {
          border-color: #4925B0;
          color: #4925B0;
          box-shadow: 0 0 0 4px rgba(73, 37, 176, 0.12);
        }

        .funnel-step-dot.done {
          background: #4925B0;
          border-color: #4925B0;
          color: #ffffff;
        }

        .funnel-step-line {
          width: 24px;
          height: 2px;
          background: #d8d3ea;
          margin: 0 2px;
        }

        @media (max-width: 640px) {
          .funnel-step-line { width: 12px; }
        }

        .funnel-step-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #a79fcb;
          text-align: center;
          margin-top: 6px;
        }

        .funnel-step-label.active { color: #4925B0; font-weight: 600; }

        .funnel-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 56px 64px;
          box-shadow: 0 20px 60px rgba(73, 37, 176, 0.08);
          border: 1px solid rgba(73, 37, 176, 0.08);
          animation: fadeInUpFunnel 0.5s ease-out;
        }

        @media (max-width: 640px) {
          .funnel-card { padding: 32px 24px; }
        }

        .funnel-question {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 30px;
          font-weight: 700;
          color: #111111;
          margin: 0 0 12px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .funnel-question { font-size: 22px; }
        }

        .funnel-hint {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 17px;
          color: #888888;
          text-align: center;
          margin: 0 0 36px;
          font-weight: 300;
        }

        .funnel-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 8px;
        }

        @media (max-width: 640px) {
          .funnel-options { grid-template-columns: 1fr; }
        }

        .funnel-option {
          background: #f8f8fb;
          border: 1.5px solid transparent;
          border-radius: 14px;
          padding: 24px;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Josefin Sans', sans-serif;
        }

        .funnel-option:hover {
          border-color: rgba(73, 37, 176, 0.4);
          background: #ffffff;
        }

        .funnel-option.selected {
          border-color: #4925B0;
          background: rgba(73, 37, 176, 0.06);
          box-shadow: 0 0 0 3px rgba(73, 37, 176, 0.1);
        }

        .funnel-option-title {
          font-size: 18px;
          font-weight: 700;
          color: #111111;
          margin: 0 0 6px;
        }

        .funnel-option-desc {
          font-size: 15px;
          color: #888888;
          font-weight: 300;
          margin: 0;
          line-height: 1.45;
        }

        .funnel-option-simple {
          background: #f8f8fb;
          border: 1.5px solid transparent;
          border-radius: 14px;
          padding: 20px 22px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 17px;
          font-weight: 600;
          color: #111111;
        }

        .funnel-option-simple:hover {
          border-color: rgba(73, 37, 176, 0.4);
          background: #ffffff;
        }

        .funnel-option-simple.selected {
          border-color: #4925B0;
          background: rgba(73, 37, 176, 0.06);
          color: #4925B0;
          box-shadow: 0 0 0 3px rgba(73, 37, 176, 0.1);
        }

        .funnel-budget-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 640px) {
          .funnel-budget-grid { grid-template-columns: 1fr; }
        }

        .funnel-input-libre {
          margin-top: 16px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          color: #111111;
          background: #f8f8fb;
          border: 1.5px solid #4925B0;
          border-radius: 10px;
          padding: 13px 16px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        .funnel-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .funnel-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          color: #4925B0;
          font-weight: 600;
        }

        .funnel-input,
        .funnel-textarea {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 17px;
          color: #111111;
          background: #f8f8fb;
          border: 1.5px solid transparent;
          border-radius: 10px;
          padding: 16px 18px;
          outline: none;
          transition: all 0.25s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .funnel-input:focus,
        .funnel-textarea:focus {
          border-color: #4925B0;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(73, 37, 176, 0.1);
        }

        .funnel-textarea {
          resize: vertical;
          min-height: 110px;
          line-height: 1.5;
        }

        .funnel-pref-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 640px) {
          .funnel-pref-row { grid-template-columns: 1fr; }
        }

        .funnel-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 36px;
        }

        .funnel-back {
          background: transparent;
          border: none;
          color: #888888;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          padding: 10px 4px;
        }

        .funnel-back:hover { color: #4925B0; }
        .funnel-back:disabled { visibility: hidden; }

        .funnel-continue {
          background: #4925B0;
          color: #ffffff;
          padding: 16px 38px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 17px;
          font-weight: 600;
          border: 2px solid #4925B0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .funnel-continue:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .funnel-continue:not(:disabled):hover {
          background: #6a42d0;
          border-color: #6a42d0;
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.3);
          transform: translateY(-2px);
        }

        .funnel-error {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: #c0392b;
          text-align: center;
          margin-top: 16px;
        }

        .funnel-success {
          text-align: center;
          padding: 20px 0;
        }

        .funnel-success-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(73, 37, 176, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .funnel-success-title {
          font-family: 'Germania One', cursive;
          font-size: 28px;
          color: #4925B0;
          margin: 0 0 12px;
          text-transform: uppercase;
        }

        .funnel-success-text {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          color: #333333;
          font-weight: 300;
          line-height: 1.6;
          max-width: 440px;
          margin: 0 auto 28px;
        }

        .funnel-whatsapp-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #4925B0;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: 2px solid #4925B0;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .funnel-whatsapp-link:hover {
          background: rgba(73, 37, 176, 0.1);
          transform: translateY(-2px);
        }

        @keyframes fadeInUpFunnel {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="funnel-section">
        <div className="funnel-container">
          <div className="funnel-header">
            <h1 className="funnel-title">Parlons de votre projet</h1>
            <p className="funnel-subtitle">
              Quelques questions rapides pour bien cerner votre besoin — 2 minutes suffisent.
            </p>
          </div>

          {step < 6 && (
            <div className="funnel-stepper">
              {STEPS.slice(0, 6).map((label, i) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      className={
                        'funnel-step-dot' +
                        (i === step ? ' active' : '') +
                        (i < step ? ' done' : '')
                      }
                    >
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={'funnel-step-label' + (i === step ? ' active' : '')}>
                      {label}
                    </span>
                  </div>
                  {i < 5 && <div className="funnel-step-line" />}
                </div>
              ))}
            </div>
          )}

          <div className="funnel-card">
            {step === 0 && (
              <>
                <h2 className="funnel-question">Quel type de projet avez-vous en tête ?</h2>
                <p className="funnel-hint">Choisissez ce qui se rapproche le plus de votre besoin. Rien n'est figé.</p>
                <div className="funnel-options">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={'funnel-option' + (form.typeProjet === opt.value ? ' selected' : '')}
                      onClick={() => setForm({ ...form, typeProjet: opt.value })}
                    >
                      <p className="funnel-option-title">{opt.value}</p>
                      <p className="funnel-option-desc">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="funnel-question">Quel est l'objectif principal ?</h2>
                <p className="funnel-hint">Ça m'aide à orienter les bonnes décisions dès le départ.</p>
                <div className="funnel-options">
                  {OBJECTIF_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={'funnel-option' + (form.objectif === opt.value ? ' selected' : '')}
                      onClick={() => setForm({ ...form, objectif: opt.value })}
                    >
                      <p className="funnel-option-title">{opt.value}</p>
                      <p className="funnel-option-desc">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="funnel-question">Où en êtes-vous aujourd'hui ?</h2>
                <p className="funnel-hint">Pas de mauvaise réponse — on s'adapte à votre point de départ.</p>
                <div className="funnel-options">
                  {ETAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={'funnel-option' + (form.etat === opt.value ? ' selected' : '')}
                      onClick={() => setForm({ ...form, etat: opt.value })}
                    >
                      <p className="funnel-option-title">{opt.value}</p>
                      <p className="funnel-option-desc">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="funnel-question">Quel budget envisagez-vous ?</h2>
                <p className="funnel-hint">Une estimation suffit — ça évite de perdre du temps de part et d'autre.</p>
                <div className="funnel-budget-grid">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={'funnel-option-simple' + (form.budget === opt ? ' selected' : '')}
                      onClick={() => setForm({ ...form, budget: opt })}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {form.budget === 'Montant libre' && (
                  <input
                    className="funnel-input-libre"
                    type="text"
                    placeholder="Précisez votre budget (ex: 150 000 FCFA)"
                    value={form.budgetLibre}
                    onChange={(e) => setForm({ ...form, budgetLibre: e.target.value })}
                  />
                )}
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="funnel-question">Quel délai souhaitez-vous ?</h2>
                <p className="funnel-hint">Ça m'aide à organiser mon planning en conséquence.</p>
                <div className="funnel-options">
                  {DELAI_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={'funnel-option' + (form.delai === opt.value ? ' selected' : '')}
                      onClick={() => setForm({ ...form, delai: opt.value })}
                    >
                      <p className="funnel-option-title">{opt.value}</p>
                      <p className="funnel-option-desc">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h2 className="funnel-question">Vos coordonnées</h2>
                <p className="funnel-hint">Dernière étape avant l'envoi.</p>

                <div className="funnel-field">
                  <label className="funnel-label">Nom</label>
                  <input
                    className="funnel-input"
                    type="text"
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  />
                </div>

                <div className="funnel-field">
                  <label className="funnel-label">Email</label>
                  <input
                    className="funnel-input"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="funnel-field">
                  <label className="funnel-label">WhatsApp</label>
                  <input
                    className="funnel-input"
                    type="tel"
                    placeholder="+229 XX XX XX XX"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  />
                </div>

                <div className="funnel-field">
                  <label className="funnel-label">Décrivez votre projet en quelques mots</label>
                  <textarea
                    className="funnel-textarea"
                    placeholder="Parlez-moi de votre projet..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="funnel-field">
                  <label className="funnel-label">Comment préférez-vous être recontacté ?</label>
                  <div className="funnel-pref-row">
                    {[
                      { value: 'email', label: 'Email' },
                      { value: 'whatsapp', label: 'WhatsApp' },
                      { value: 'peu_importe', label: 'Peu importe' },
                    ].map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        className={'funnel-option-simple' + (form.preference === p.value ? ' selected' : '')}
                        onClick={() => setForm({ ...form, preference: p.value as Preference })}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 6 && (
              <div className="funnel-success">
                <div className="funnel-success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" stroke="#4925B0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="funnel-success-title">Message envoyé !</h2>
                <p className="funnel-success-text">
                  Merci {form.nom.split(' ')[0] || ''} ! Votre demande a bien été reçue. Je vous recontacte d'ici peu, généralement sous 24h.
                </p>
                <a
                  href={`https://wa.me/2290196171313?text=${encodeURIComponent(buildWhatsappSummary())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="funnel-whatsapp-link"
                >
                  Confirmer aussi sur WhatsApp
                </a>
              </div>
            )}

            {step < 6 && (
              <div className="funnel-nav">
                <button className="funnel-back" onClick={back} disabled={step === 0}>
                  ← Retour
                </button>
                <button className="funnel-continue" onClick={next} disabled={!canContinue || sending}>
                  {step === 5 ? (sending ? 'Envoi en cours...' : 'Envoyer') : 'Continuer →'}
                </button>
              </div>
            )}

            {errorMsg && <p className="funnel-error">{errorMsg}</p>}
          </div>
        </div>
      </section>
    </>
  );
}