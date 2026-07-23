// apps/web/src/app/admin/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demo_url: '',
    github_url: '',
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);
        await fetchProjects();
      } catch (err) {
        console.error('Erreur:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
    }
  }

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            ...formData,
            technologies: [],
          }
        ]);

      if (error) throw error;

      setFormData({ title: '', description: '', demo_url: '', github_url: '' });
      setShowAddProject(false);
      await fetchProjects();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'ajout du projet');
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Supprimer ce projet?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-amber-400">Admin Panel</div>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-slate-400">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Déconnexion
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Projects Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mes Projets</h1>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition"
            >
              {showAddProject ? 'Annuler' : '+ Ajouter un projet'}
            </button>
          </div>

          {/* Add Project Form */}
          {showAddProject && (
            <form onSubmit={handleAddProject} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 mb-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mon super projet"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du projet..."
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">URL Démo</label>
                  <input
                    type="url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">URL GitHub</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2 rounded-lg transition"
              >
                Ajouter le projet
              </button>
            </form>
          )}

          {/* Projects List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <p className="text-slate-400 col-span-full">Aucun projet pour l'instant</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{project.description.substring(0, 100)}...</p>
                  
                  <div className="flex gap-2 mb-4">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-amber-400/20 text-amber-400 px-2 py-1 rounded">
                        Démo
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-amber-400/20 text-amber-400 px-2 py-1 rounded">
                        GitHub
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="w-full text-red-400 hover:text-red-300 text-sm font-medium py-2 border border-red-400/30 rounded-lg transition"
                  >
                    Supprimer
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}