# ⚡ Quickstart - En 15 minutes

Démarre ton portfolio en 15 minutes top chrono! ⏱️

---

## **5 minutes: Setup local** 💻

```bash
# 1. Cloner les fichiers et créer la structure
mkdir portfolio-monorepo && cd portfolio-monorepo

# 2. Installer pnpm (si pas déjà installé)
npm install -g pnpm

# 3. Copier les fichiers de config
# (pnpm-workspace.yaml, turbo.json, package.json, etc.)

# 4. Installer les dépendances
pnpm install

# 5. Créer Next.js dans apps/web
cd apps/web
pnpm create next-app@latest . --typescript --tailwind
# Répondre "Yes" à tout

# 6. Revenir à la racine et lancer
cd ../..
pnpm dev
```

✅ Ton app tourne sur http://localhost:3000

---

## **5 minutes: Setup Supabase** 🗄️

```bash
# 1. Aller sur https://supabase.com
# 2. Créer un compte/projet
# 3. Copier les clés API

# 4. Créer .env.local à la racine
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...

# 5. SQL Editor → copier supabase-setup.sql → Run
# ✅ Tables créées!
```

---

## **5 minutes: Premier test** 🧪

Créer un fichier `apps/web/src/app/test/page.tsx`:

```typescript
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    async function test() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        setStatus('✅ Connected to Supabase!');
      } catch (err) {
        setStatus('❌ Connection failed: ' + String(err));
      }
    }
    test();
  }, []);

  return <div className="p-10">{status}</div>;
}
```

Aller sur http://localhost:3000/test → Vérifier que ça marche ✅

---

## **Architecture de base**

```
frontend (public)
  ├── / (homepage)
  ├── /projects
  └── /blog

+ backend (API)
  ├── /api/auth/* (login/logout)
  ├── /api/projects/* (CRUD)
  └── /api/posts/* (CRUD)

+ admin panel (protégé)
  ├── /admin/projects (gérer projets)
  ├── /admin/posts (gérer articles)
  └── /admin/profile (ton profil)

+ database (Supabase)
  ├── projects
  ├── posts
  └── portfolio_data
```

---

## **Prochaines étapes** 🚀

1. ✅ Fait maintenant: **Setup de base**
2. ➡️ À faire: **Authentification** (login/logout)
3. ➡️ À faire: **Dashboard admin**
4. ➡️ À faire: **Pages publiques** (projects, blog)
5. ➡️ À faire: **Déployer sur Vercel**

---

## **Commandes utiles**

```bash
# Démarrer le dev
pnpm dev

# Build pour production
pnpm build

# Lancer le build
pnpm start

# Nettoyer les caches
pnpm clean

# Vérifier le code
pnpm lint
```

---

## **Besoin d'aide?**

- 📖 Installation complète → `INSTALLATION.md`
- 🗄️ Supabase → `SUPABASE_SETUP.md`
- 📚 Docs → `README.md`

---

## **Pour la prochaine étape:**

Je vais créer:
1. **Authentification** (login/signup)
2. **Dashboard admin** (interface pour gérer ton contenu)
3. **API routes** (endpoints CRUD)
4. **Pages publiques** (afficher tes projets)

Prêt? 🚀
