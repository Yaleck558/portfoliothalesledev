// apps/web/src/app/admin/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProjectsManager } from '../../components/admin/ProjectsManager';
import { GravityStarsBackground } from '../../components/animate-ui/components/backgrounds/gravity-stars';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/accederamoncompte');
          return;
        }

        setUser(user);
      } catch (err) {
        console.error('Erreur:', err);
        router.push('/accederamoncompte');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const fontImports = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

      .admin-title {
        font-family: 'Germania One', cursive;
        color: #4925B0;
      }
      .admin-body {
        font-family: 'Josefin Sans', sans-serif;
      }
      .admin-stars-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
      }
      .admin-content {
        margin-top: 6rem;
        position: relative;
        z-index: 1;
      }
    `}</style>
  );

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f8f8f8] flex items-center justify-center">
        {fontImports}
        <GravityStarsBackground className="admin-stars-bg" />
        <p className="admin-body relative z-10 text-[#4925B0]">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f8f8]">
      {fontImports}
      <GravityStarsBackground className="admin-stars-bg" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#4925B0]/10 bg-[#f8f8f8]/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <div className="admin-title text-xl uppercase tracking-wide md:text-2xl">
            Panel Admin
          </div>
          <div className="flex items-center gap-4">
            <p className="admin-body hidden text-sm text-slate-600 sm:block">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="admin-body flex items-center gap-2 rounded-lg border-2 border-[#4925B0] px-4 py-2 text-sm font-semibold text-[#4925B0] transition hover:bg-[#4925B0] hover:text-white"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="admin-content mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <div className="mb-10 text-center md:text-left">
          <p className="admin-body mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#4925B0]">
            Espace privé
          </p>
          <h1 className="admin-title text-4xl uppercase md:text-5xl">Gère ton portfolio</h1>
          <p className="admin-body mt-4 text-base text-slate-700 md:text-lg">
            Ajoute, modifie et publie tes projets — tout se met à jour en direct sur ton site.
          </p>
        </div>

        {user && <ProjectsManager userId={user.id} />}
      </main>
    </div>
  );
}