'use client';

import { useEffect, useRef, useState } from 'react';
import { Code2, Check, Copy } from 'lucide-react';

interface CodeDemoProps {
  duration: number;
  delay: number;
  writing: boolean;
  cursor: boolean;
}

/* Plusieurs textes qui s'enchaînent en boucle */
const SNIPPETS = [
  {
    filename: 'votre-projet.tsx',
    code: `'use client';

// Bonjour 👋 et bienvenue

type VotreProjet = {
  idée: string;
  délai: 'serré' | 'flexible';
};

function transformerEnRéalité({ idée }: VotreProjet) {
  return (
    <SiteWeb
      rapide
      moderne
      surMesure
      pensé="pour vos clients"
    />
  );
}

export { transformerEnRéalité };

// Discutons de votre projet 🚀`,
  },
  {
    filename: 'pourquoi-moi.tsx',
    code: `'use client';

// Ce que vous obtenez avec moi

const engagement = {
  écoute: 'réelle',
  délais: 'respectés',
  suivi: 'après la livraison',
};

function collaborer() {
  return (
    <Résultat
      rapide
      fiable
      pensé="pour votre business"
    />
  );
}

export { collaborer };

// Prêt à démarrer ? Écrivez-moi 📩`,
  },
  {
    filename: 'process.tsx',
    code: `'use client';

// Comment on travaille ensemble

const étapes = [
  'échange sur vos besoins',
  'proposition claire',
  'développement',
  'retours & ajustements',
  'mise en ligne',
];

function démarrerProjet(étapes: string[]) {
  return (
    <Accompagnement
      transparent
      réactif
      pensé="du brief au déploiement"
    />
  );
}

export { démarrerProjet };

// Une idée en tête ? Parlons-en 💬`,
  },
];

/* Vitesse de frappe fixe et lisible (ms par caractère) */
const CHAR_DELAY_MS = 45;
/* Pause avant de repartir sur le texte suivant */
const LOOP_PAUSE_MS = 15000;

export const CodeDemo = ({ delay, writing, cursor }: CodeDemoProps) => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [copied, setCopied] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bodyRef = useRef<HTMLPreElement>(null);

  const current = SNIPPETS[snippetIndex];

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => {
    if (!writing) {
      setDisplayed(current.code);
      return;
    }

    clearTimers();
    setDisplayed('');

    const startDelay = snippetIndex === 0 ? Math.max(delay, 0) * 1000 : 0;

    const startTyping = setTimeout(() => {
      let i = 0;
      const type = () => {
        i++;
        setDisplayed(current.code.slice(0, i));
        if (i < current.code.length) {
          timers.current.push(setTimeout(type, CHAR_DELAY_MS));
        } else {
          // Texte terminé : on attend 15s puis on passe au suivant
          timers.current.push(
            setTimeout(() => {
              setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
            }, LOOP_PAUSE_MS)
          );
        }
      };
      type();
    }, startDelay);

    timers.current.push(startTyping);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetIndex, writing]);

  // Défilement automatique : on suit la frappe jusqu'en bas du bloc
  useEffect(() => {
    const el = bodyRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [displayed]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Erreur copie:', err);
    }
  }

  return (
    <>
      <style>{`
        .code-demo {
          width: min(420px, 100%);
          height: 372px;
          background: #1c1c1e;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(73, 37, 176, 0.25);
          display: flex;
          flex-direction: column;
          font-family: 'Menlo', 'Consolas', monospace;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .code-demo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #141416;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }

        .code-demo-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }

        .code-demo-dots {
          display: flex;
          gap: 6px;
          margin-right: 4px;
        }

        .code-demo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .code-demo-dot.red { background: #ff5f57; }
        .code-demo-dot.yellow { background: #febc2e; }
        .code-demo-dot.green { background: #28c840; }

        .code-demo-copy {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .code-demo-copy:hover {
          color: #ffffff;
        }

        .code-demo-body {
          flex: 1;
          padding: 16px;
          overflow: auto;
          margin: 0;
          color: #e4e4e7;
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
          scroll-behavior: smooth;
        }

        .code-demo-cursor {
          display: inline-block;
          width: 7px;
          height: 15px;
          background: #4925B0;
          margin-left: 2px;
          vertical-align: middle;
          animation: code-demo-blink 1s step-end infinite;
        }

        @keyframes code-demo-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="code-demo">
        <div className="code-demo-header">
          <div className="code-demo-header-left">
            <span className="code-demo-dots">
              <span className="code-demo-dot red" />
              <span className="code-demo-dot yellow" />
              <span className="code-demo-dot green" />
            </span>
            <Code2 size={14} />
            <span>{current.filename}</span>
          </div>
          <button className="code-demo-copy" onClick={handleCopy} title="Copier le code">
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>

        <pre className="code-demo-body" ref={bodyRef}>
          {displayed}
          {cursor && <span className="code-demo-cursor" />}
        </pre>
      </div>
    </>
  );
};