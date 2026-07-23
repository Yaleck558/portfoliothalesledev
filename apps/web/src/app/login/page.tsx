// apps/web/src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        // Inscription
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        setMessage('Inscription réussie! Vérifie ton email pour confirmer.');
        setEmail('');
        setPassword('');
      } else {
        // Connexion
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        setMessage('Connexion réussie!');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Thales</h1>
          <p className="text-slate-400">
            {isSignUp ? 'Créer un compte' : 'Se connecter'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400 text-sm">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold py-2 rounded-lg transition"
          >
            {loading ? 'En cours...' : isSignUp ? 'S\'inscrire' : 'Se connecter'}
          </button>

          {/* Toggle */}
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              {isSignUp ? 'Tu as déjà un compte? ' : 'Pas de compte? '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                {isSignUp ? 'Se connecter' : 'S\'inscrire'}
              </button>
            </p>
          </div>
        </form>

        {/* Back link */}
        <div className="text-center mt-8">
          <a href="/" className="text-slate-400 hover:text-white text-sm">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}