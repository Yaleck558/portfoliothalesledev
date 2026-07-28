'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  category?: string;
  technologies: string[];
  image_url?: string;
  is_featured: boolean;
}

export default function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .limit(3);

      if (!error) setProjects(data || []);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading || projects.length === 0) return null;

  const firstImage = (imageUrl?: string) => imageUrl?.split('|')[0]?.trim();

  return (
    <>
      <style>{`
        .pp-section { padding: 100px 32px; background: #f8f8f8; }
        .pp-wrapper { max-width: 1200px; margin: 0 auto; }
        .pp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          gap: 24px;
          flex-wrap: wrap;
        }
        .pp-title {
          font-family: 'Germania One', cursive;
          font-size: 42px;
          color: #4925B0;
          margin: 0;
          text-transform: uppercase;
        }
        .pp-link {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #4925B0;
          text-decoration: none;
          white-space: nowrap;
        }
        .pp-link:hover { text-decoration: underline; }
        .pp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 900px) { .pp-grid { grid-template-columns: 1fr; } }
        .pp-card {
          display: block;
          text-decoration: none;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(73, 37, 176, 0.08);
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.05);
          transition: all 0.3s ease;
        }
        .pp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(73, 37, 176, 0.15);
        }
        .pp-card-image-wrap {
          width: 100%;
          aspect-ratio: 16 / 10;
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .pp-card-image { width: 100%; height: 100%; object-fit: cover; }
        .pp-card-body { padding: 20px; }
        .pp-card-title {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #111;
          margin: 0 0 8px;
        }
        .pp-card-desc {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: #777;
          font-weight: 300;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <section className="pp-section">
        <div className="pp-wrapper">
          <div className="pp-header">
            <h2 className="pp-title">Mes projets</h2>
            <Link href="/projects" className="pp-link">Voir tous les projets →</Link>
          </div>
          <div className="pp-grid">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="pp-card">
                <div className="pp-card-image-wrap">
                  {firstImage(p.image_url) ? (
                    <img src={firstImage(p.image_url)} alt={p.title} className="pp-card-image" />
                  ) : null}
                </div>
                <div className="pp-card-body">
                  <h3 className="pp-card-title">{p.title}</h3>
                  <p className="pp-card-desc">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}