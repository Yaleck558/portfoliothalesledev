# 🗄️ Configuration Supabase

Guide complet pour mettre en place ta base de données gratuite.

---

## **ÉTAPE 1: Créer un compte Supabase** 🔐

1. Aller sur https://supabase.com
2. Cliquer sur **"Start your project"**
3. Se connecter avec GitHub (plus simple)
4. Créer une organisation
5. Créer un nouveau projet:
   - **Name:** `portfolio`
   - **Password:** Sauvegarder (tu en auras besoin)
   - **Region:** `Singapore` (ap-southeast-1) - Plus proche de toi 🌏
   - **Free plan** ✅

Le projet va se créer en ~2 minutes ⏳

---

## **ÉTAPE 2: Récupérer les clés API** 🔑

Une fois le projet créé:

1. Cliquer sur **Settings** (engrenage en bas à gauche)
2. Aller dans **API**
3. Copier ces valeurs:
   ```
   Project URL → NEXT_PUBLIC_SUPABASE_URL
   anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
   service_role secret → SUPABASE_SERVICE_ROLE_KEY
   ```

4. Créer le fichier `.env.local` à la racine:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```

---

## **ÉTAPE 3: Créer les tables** 📋

### Méthode 1: Copier-coller (Facile)

1. Dans Supabase, aller dans **SQL Editor** (à gauche)
2. Cliquer sur **+ New Query**
3. Copier tout le contenu de `supabase-setup.sql`
4. Coller dans l'éditeur
5. Cliquer sur **Run** (ou Ctrl+Enter)

✅ Tables créées!

### Méthode 2: Interface Supabase (Longue)

1. Aller dans **Table Editor**
2. Créer manuellement:
   - `projects` (titre, description, image, etc.)
   - `posts` (blog)
   - `portfolio_data` (bio, avatar, liens sociaux)

---

## **ÉTAPE 4: Authentification (Auth)** 👤

### Activer les providers

1. Aller dans **Authentication** (à gauche)
2. Cliquer sur **Providers**
3. Activer:
   - ✅ **Email** (gratuit)
   - ✅ **Google** (optionnel)
   - ✅ **GitHub** (optionnel)

### Configurer Google OAuth (Optionnel)

Si tu veux que tes visiteurs se connectent avec Google:

1. Aller sur https://console.cloud.google.com
2. Créer un nouveau projet
3. Activer l'API "Google+ API"
4. Créer des identifiants OAuth 2.0
5. Copier les clés dans Supabase > Authentication > Google

---

## **ÉTAPE 5: Tester la connexion** ✅

Créer un fichier test dans ton app:

```typescript
// apps/web/src/lib/test-supabase.ts
import { supabase } from './supabase';

export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log('✅ Supabase connecté!');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    return false;
  }
}
```

Appeler cette fonction au démarrage pour vérifier:

```typescript
// Dans ton page.tsx ou layout.tsx
import { testConnection } from '@/lib/test-supabase';

useEffect(() => {
  testConnection();
}, []);
```

---

## **ÉTAPE 6: Limites du plan gratuit** ⚠️

| Ressource | Limite | Suffisant? |
|-----------|--------|-----------|
| **Stockage BD** | 500 MB | ✅ Oui |
| **Bande passante** | 2 GB/mois | ✅ Oui |
| **Auth users** | Illimité | ✅ Oui |
| **Connexions API** | Illimité | ✅ Oui |
| **Edge Functions** | 500k/mois | ✅ Oui |

**Pour un portfolio:** Largement suffisant! 🎉

---

## **ÉTAPE 7: Sauvegarder ton BD** 💾

Supabase fait des backups automatiques.

Pour exporter manuellement:
1. **SQL Editor** → **+ New Query**
2. Copier tous les `SELECT * FROM ...;`
3. Sauvegarder le SQL

---

## **Dépannage**

### "Erreur: Connection refused"
→ Vérifier que les variables d'env sont bonnes
→ Vérifier que le projet Supabase est bien créé

### "Erreur: 401 Unauthorized"
→ Copier la bonne clé `anon public`
→ Vérifier qu'il n'y a pas d'espaces

### "Tables vides"
→ Créer des données de test via Supabase

---

## ✅ Tu es prêt!

La base de données est opérationnelle. Tu peux maintenant:
- ✅ Créer des utilisateurs
- ✅ Stocker des projets
- ✅ Écrire des articles
- ✅ Tout gérer depuis ton admin panel

Besoin d'aide? Fais-moi signe! 🚀
