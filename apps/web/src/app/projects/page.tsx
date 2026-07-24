// apps/web/src/app/projects/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Star } from 'lucide-react';
import { GravityStarsBackground } from '../../components/animate-ui/components/backgrounds/gravity-stars';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  technologies: string[];
  category: string | null;
  demo_url: string | null;
  github_url: string | null;
  is_featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .order('is_featured', { ascending: false })
          .order('display_order', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8f8f8] px-6 py-28 md:px-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

        .projects-title {
          font-family: 'Germania One', cursive;
          color: #4925B0;
        }
        .projects-body {
          font-family: 'Josefin Sans', sans-serif;
        }

        .projects-stars-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .projects-content {
          margin-top: 7.5rem;
          position: relative;
          z-index: 1;
        }
      `}</style>

      <GravityStarsBackground className="projects-stars-bg" />

      <div className="projects-content mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#4925B0] projects-body">
            Portfolio
          </p>
          <h1 className="projects-title text-4xl uppercase md:text-5xl">De l'idée au déploiement</h1>
          <p className="mt-4 projects-body text-base text-slate-700 md:text-lg">
            Voici ce qui se passe quand on mélange du café, du code, et un peu trop de perfectionnisme.
          </p>
        </div>

        {loading ? (
          <p className="projects-body text-center text-slate-600">Chargement des projets...</p>
        ) : projects.length === 0 ? (
          <p className="projects-body text-center text-slate-600">
            Aucun projet publié pour l'instant. Reviens bientôt !
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  project.is_featured ? 'border-[#4925B0]' : 'border-slate-200'
                }`}
              >
                {project.image_url ? (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
                    {project.is_featured && (
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#4925B0] px-3 py-1 text-xs font-semibold text-white">
                        <Star size={12} className="fill-white" /> À la une
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#4925B0]/10 to-[#4925B0]/5">
                    <span className="projects-title text-2xl text-[#4925B0]/40">{project.title.charAt(0)}</span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {project.category && (
                    <span className="projects-body mb-2 text-xs font-semibold uppercase tracking-wider text-[#4925B0]">
                      {project.category}
                    </span>
                  )}

                  <h2 className="mb-2 text-xl font-bold text-[#111111]">{project.title}</h2>
                  <p className="projects-body mb-4 flex-1 text-sm text-slate-600">{project.description}</p>

                  {project.technologies?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-[#4925B0]/10 px-2.5 py-1 text-[11px] font-medium text-[#4925B0]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="projects-body flex-1 rounded-lg bg-[#4925B0] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#6a42d0]"
                      >
                        Voir la démo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="projects-body flex-1 rounded-lg border-2 border-[#4925B0] px-4 py-2 text-center text-sm font-semibold text-[#4925B0] transition hover:bg-[#4925B0]/10"
                      >
                        Code source
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}