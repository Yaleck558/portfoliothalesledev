# 🎯 Portfolio Monorepo - Next.js + Supabase

Un portfolio personnel **full-stack** avec système d'administration pour modifier le contenu en direct.

## 📁 Structure du projet

```
portfolio-monorepo/
├── apps/
│   └── web/                    # Application Next.js (frontend + API)
│       ├── app/
│       │   ├── page.tsx        # Homepage (public)
│       │   ├── layout.tsx
│       │   ├── api/            # API Routes (backend)
│       │   │   ├── auth/
│       │   │   ├── projects/
│       │   │   └── posts/
│       │   ├── admin/          # Dashboard admin (protégé)
│       │   └── projects/       # Pages publiques
│       ├── package.json
│       └── next.config.js
├── packages/
│   ├── ui/                     # Composants réutilisables
│   ├── config/                 # Config partagées
│   └── types/                  # Types TypeScript
├── pnpm-workspace.yaml         # Config monorepo
├── turbo.json                  # Orchestration builds
├── package.json                # Scripts racine
└── README.md
```

---

## 🚀 Démarrage rapide

### 1️⃣ Prérequis
- **Node.js** 18+ 
- **pnpm** (plus rapide que npm/yarn)

```bash
npm install -g pnpm
```

### 2️⃣ Installation

```bash
# Cloner ou créer le projet
mkdir portfolio-monorepo && cd portfolio-monorepo

# Créer la structure
mkdir -p apps/web packages/{ui,config,types}

# Installer les dépendances
pnpm install

# Ou si tu utilises npm
npm install
```

### 3️⃣ Démarrer le développement

```bash
# Lance tout en parallèle
pnpm dev

# Ou juste l'app web
cd apps/web && pnpm dev
```

L'app sera accessible sur `http://localhost:3000`

---

## 🔧 Configuration Supabase

### Créer un compte gratuit
1. Aller sur https://supabase.com
2. Créer un nouveau projet (gratuit)
3. Copier les clés API

### Variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Remplir avec tes clés Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 📝 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lancer le dev mode |
| `pnpm build` | Build pour production |
| `pnpm lint` | Checker le code |
| `pnpm type-check` | Vérifier les types TS |
| `pnpm clean` | Nettoyer les builds |

---

## 🌐 Déployer sur Vercel

### Étape 1: Préparer le code
```bash
# Initialiser git
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Étape 2: Sur Vercel
1. Aller sur https://vercel.com
2. Connecter ton repo GitHub
3. Ajouter les variables d'environnement Supabase
4. Deploy ! 🚀

---

## 📚 Prochaines étapes

- [ ] Créer les tables Supabase (users, projects, posts)
- [ ] Mettre en place l'authentification
- [ ] Créer le dashboard admin
- [ ] Ajouter les pages publiques (projets, blog)
- [ ] Déployer sur Vercel

---

## 💡 À faire

- **Authentification** (Login/Signup avec Supabase)
- **API Routes** pour gérer le contenu
- **Dashboard Admin** pour modifier ton portfolio
- **Upload d'images** gratuit
- **SEO optimisé** (meta tags, open graph)

---

## 📞 Support

Besoin d'aide? Regarde la doc:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- TurboRepo: https://turbo.build/repo/docs
