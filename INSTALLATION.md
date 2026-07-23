# 📖 Guide d'Installation Complet

Suivre les étapes dans l'ordre pour configurer ton monorepo.

---

## **ÉTAPE 1: Prérequis** ✅

### Vérifier que tu as Node.js
```bash
node --version  # Doit être v18+ (v20 recommandé)
```

### Installer pnpm
```bash
npm install -g pnpm

# Vérifier l'installation
pnpm --version
```

---

## **ÉTAPE 2: Créer la structure** 📁

```bash
# Créer le dossier racine
mkdir portfolio-monorepo
cd portfolio-monorepo

# Initialiser git
git init

# Créer la structure des dossiers
mkdir -p apps/web
mkdir -p packages/{ui,config,types}
```

---

## **ÉTAPE 3: Copier les fichiers de config** 📋

Copie ces fichiers dans la racine du projet:
- `pnpm-workspace.yaml`
- `turbo.json`
- `package.json`
- `.env.example`
- `README.md`
- `INSTALLATION.md`
- `tsconfig.json`

```bash
# Vérifier la structure
tree -L 2
# Doit afficher:
# .
# ├── apps/
# │   └── web/
# ├── packages/
# │   ├── ui/
# │   ├── config/
# │   └── types/
# ├── pnpm-workspace.yaml
# ├── turbo.json
# ├── package.json
# └── ...
```

---

## **ÉTAPE 4: Installer les dépendances** 📦

```bash
# À la racine du projet
pnpm install

# Ça va installer pour tous les workspaces automatiquement
```

---

## **ÉTAPE 5: Créer l'app Next.js** 🚀

```bash
# Se mettre dans apps/web
cd apps/web

# Créer un Next.js project (répondre aux questions)
pnpm create next-app@latest . --typescript --tailwind

# Ou tu peux copier le package.json qu'on a créé
# et faire: pnpm install
```

**Questions à répondre:**
```
? Would you like to use TypeScript? › Yes
? Would you like to use ESLint? › Yes
? Would you like to use Tailwind CSS? › Yes
? Would you like your code inside a `src/` directory? › Yes
? Would you like to use App Router? › Yes
? Would you like to use Turbopack? › Yes (optionnel)
? Would you like to customize the import alias? › No
```

---

## **ÉTAPE 6: Configurer Supabase** 🔐

### Créer un compte Supabase
1. Aller sur https://supabase.com
2. Cliquer sur "Start your project"
3. Se connecter avec GitHub
4. Créer une organisation
5. Créer un nouveau projet
   - **Name:** `portfolio`
   - **Password:** Sauvegarder quelque part
   - **Region:** `ap-southeast-1` (Asie, plus rapide pour toi au Bénin)

### Récupérer les clés

1. Aller dans **Settings > API**
2. Copier:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Créer le fichier .env.local

```bash
# À la racine du projet
cp .env.example .env.local

# Éditer .env.local et ajouter:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## **ÉTAPE 7: Tester le démarrage** ▶️

```bash
# À la racine
pnpm dev

# Ou juste l'app web
cd apps/web && pnpm dev
```

**Doit afficher:**
```
> portfolio-monorepo@ dev
> turbo run dev --parallel

█ Packages in scope: @portfolio/web
█ Running dev in 1 packages

@portfolio/web:dev: 
@portfolio/web:dev: > next dev
@portfolio/web:dev:   ▲ Next.js 14.x.x
@portfolio/web:dev:   - Local:        http://localhost:3000
@portfolio/web:dev:   - Environments: .env.local
```

👉 **Ouvrir http://localhost:3000** dans le navigateur

---

## **ÉTAPE 8: Commit initial** 💾

```bash
# À la racine
git add .
git commit -m "Initial commit: monorepo setup"
```

---

## ✅ Tu es prêt!

La structure est complète et testée. 

**Prochaines étapes:**
1. Créer les tables Supabase
2. Ajouter l'authentification
3. Créer les API routes
4. Faire le dashboard admin

Besoin d'aide? Dis-moi à quelle étape tu es bloqué! 🚀
