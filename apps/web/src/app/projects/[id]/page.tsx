'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  category?: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProject() {
      try {
        console.log('🔍 Fetching project:', projectId);
        
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('status', 'published')
          .single();

        if (fetchError) {
          console.error('❌ Fetch error:', fetchError);
          setError(`Erreur: ${fetchError.message}`);
          setLoading(false);
          return;
        }

        if (!data) {
          console.error('❌ No data returned');
          setError('Projet non trouvé');
          setLoading(false);
          return;
        }

        console.log('✅ Project fetched:', data.title);
        setProject(data);

        // Récupérer les projets connexes
        const { data: related, error: relatedError } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .neq('id', projectId)
          .eq('category', data.category)
          .limit(3);

        if (!relatedError) {
          setRelatedProjects(related || []);
        }

        setLoading(false);
      } catch (err) {
        console.error('🔥 Catch error:', err);
        setError(`Erreur: ${err}`);
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Carousel functions
  const getProjectImages = (imageUrl?: string): string[] => {
    if (!imageUrl) return [];
    return imageUrl.split('|').map(url => url.trim()).filter(Boolean);
  };

  const handlePrevImage = () => {
    const images = getProjectImages(project?.image_url);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    const images = getProjectImages(project?.image_url);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Josefin Sans',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Chargement du projet...
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Josefin Sans',
          fontSize: '18px',
          color: '#d32f2f',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <div>
          <p>❌ {error || 'Projet non trouvé'}</p>
          <Link href="/projects" style={{ color: '#4925B0', textDecoration: 'underline' }}>
            ← Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const images = getProjectImages(project.image_url);
  const currentImage = images[currentImageIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

        * { box-sizing: border-box; }

        .project-detail-hero {
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          padding: 40px 32px;
          border-bottom: 2px solid #e0e0e0;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #4925B0;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 24px;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .back-link:hover {
          color: #6a42d0;
          transform: translateX(-4px);
        }

        .back-link .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .breadcrumb {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: #666;
        }

        .breadcrumb a {
          color: #4925B0;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .breadcrumb a:hover {
          color: #6a42d0;
        }

        .breadcrumb-sep {
          color: #ccc;
        }

        .project-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 32px;
          font-family: 'Josefin Sans', sans-serif;
        }

        .project-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        @media (max-width: 1024px) {
          .project-detail-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .project-images {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .project-main-image {
          width: 100%;
          height: 400px;
          padding: 20px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e0e0e0;
          position: relative;
        }

        .carousel-main-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .carousel-main-image {
          width: 90%;
          height: 90%;
          object-fit: contain;
          transition: opacity 0.3s ease;
        }

        .carousel-nav-main {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(73, 37, 176, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 18px;
          z-index: 10;
        }

        .carousel-nav-main:hover {
          background: rgba(73, 37, 176, 0.9);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-nav-main.prev {
          left: 12px;
        }

        .carousel-nav-main.next {
          right: 12px;
        }

        .project-thumbnails {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
        }

        .project-thumbnail {
          width: 100%;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          background: #f0f0f0;
          border: 2px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-thumbnail:hover {
          border-color: #4925B0;
          transform: scale(1.05);
        }

        .project-thumbnail.active {
          border-color: #4925B0;
          box-shadow: 0 0 0 2px rgba(73, 37, 176, 0.2);
        }

        .project-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-info {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .project-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .project-category-badge {
          display: inline-block;
          background: rgba(73, 37, 176, 0.1);
          color: #4925B0;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        .project-detail-title {
          font-family: 'Germania One', cursive;
          font-size: 56px;
          color: #333;
          margin: 0;
          text-transform: capitalize;
          letter-spacing: -1px;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .project-detail-title {
            font-size: 42px;
          }
        }

        .project-detail-description {
          font-size: 18px;
          color: #333;
          line-height: 1.7;
          margin: 0;
        }

        .project-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 24px;
          background: #f9f9f9;
          border-radius: 12px;
          border-left: 4px solid #4925B0;
        }

        @media (max-width: 768px) {
          .project-meta {
            grid-template-columns: 1fr;
          }
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .meta-label {
          font-size: 13px;
          font-weight: 600;
          color: #4925B0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 15px;
          color: #333;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tech-badge-detail {
          background: white;
          color: #4925B0;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #4925B0;
          display: inline-block;
        }

        .project-links {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-link {
          flex: 1;
          min-width: 180px;
          padding: 14px 24px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid #4925B0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-demo {
          background: #4925B0;
          color: white;
        }

        .btn-demo:hover {
          background: #6a42d0;
          border-color: #6a42d0;
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.3);
          transform: translateY(-2px);
        }

        .btn-github {
          background: transparent;
          color: #4925B0;
        }

        .btn-github:hover {
          background: rgba(73, 37, 176, 0.1);
          transform: translateY(-2px);
        }

        .btn-link .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .about-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          padding: 60px 0;
          border-top: 2px solid #e0e0e0;
        }

        @media (max-width: 768px) {
          .about-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .about-title {
          font-family: 'Germania One', cursive;
          font-size: 36px;
          color: #333;
          margin: 0 0 24px;
          text-transform: capitalize;
        }

        .about-text {
          font-size: 18px;
          color: #333;
          line-height: 1.7;
          margin: 0;
        }

        .cta-section {
          background: linear-gradient(135deg, #4925B0 0%, #6a42d0 100%);
          color: white;
          padding: 48px 40px;
          border-radius: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
          margin: 80px 0;
        }

        .cta-title {
          font-family: 'Germania One', cursive;
          font-size: 32px;
          margin: 0;
          text-transform: capitalize;
        }

        .cta-text {
          font-size: 18px;
          line-height: 1.7;
          margin: 0;
          max-width: 500px;
        }

        .cta-button {
          background: white;
          color: #4925B0;
          border: none;
          padding: 15px 40px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
        }

        .cta-button .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .related-section {
          padding-top: 60px;
          border-top: 2px solid #e0e0e0;
        }

        .related-title {
          font-family: 'Germania One', cursive;
          font-size: 36px;
          color: #333;
          margin: 0 0 40px;
          text-transform: capitalize;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .related-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }

        .related-card:hover {
          border-color: #4925B0;
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(73, 37, 176, 0.15);
        }

        .related-image {
          width: 100%;
          height: 160px;
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .related-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .related-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .related-name {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .related-desc {
          font-size: 15px;
          color: #666;
          margin: 0;
          line-height: 1.4;
          flex: 1;
        }

        .featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #4925B0;
          font-weight: 600;
          margin-top: 12px;
          font-size: 15px;
        }

        .featured-badge .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <section className="project-detail-hero">
        <div className="project-detail-container">
          <Link href="/projects" className="back-link">
            <span className="material-icons">arrow_back</span>
            Retour aux projets
          </Link>
          <div className="breadcrumb">
            <Link href="/projects">Projets</Link>
            <span className="breadcrumb-sep">/</span>
            {project.category && (
              <>
                <span>{project.category}</span>
                <span className="breadcrumb-sep">/</span>
              </>
            )}
            <span>{project.title}</span>
          </div>
        </div>
      </section>

      <div className="project-detail-container">
        <div className="project-detail-grid">
          <div className="project-images">
            <div className="project-main-image">
              {images.length > 0 && currentImage ? (
                <div className="carousel-main-container">
                  <img 
                    src={currentImage} 
                    alt={`${project.title} - ${currentImageIndex + 1}`}
                    className="carousel-main-image"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/></svg>';
                    }}
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        className="carousel-nav-main prev"
                        onClick={handlePrevImage}
                        title="Image précédente"
                      >
                        <span className="material-icons">chevron_left</span>
                      </button>
                      <button 
                        className="carousel-nav-main next"
                        onClick={handleNextImage}
                        title="Image suivante"
                      >
                        <span className="material-icons">chevron_right</span>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #4925B0 0%, #6a42d0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}>
                  <span className="material-icons" style={{ fontSize: '64px', color: 'white' }}>code</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="project-thumbnails">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`project-thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }} />
                  </div>
                ))}
              </div>
            )}

            {project.is_featured && (
              <div className="featured-badge">
                <span className="material-icons">star</span>
                Projet en vedette
              </div>
            )}
          </div>

          <div className="project-info">
            <div className="project-header">
              {project.category && (
                <div className="project-category-badge">{project.category}</div>
              )}
              <h1 className="project-detail-title">{project.title}</h1>
              <p className="project-detail-description">{project.description}</p>
            </div>

            {project.technologies.length > 0 && (
              <div className="project-meta">
                <div className="meta-item">
                  <div className="meta-label">
                    <span className="material-icons" style={{ display: 'inline', marginRight: '4px', fontSize: '14px', verticalAlign: 'middle' }}>tune</span>
                    Technologies
                  </div>
                  <div className="meta-value">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-badge-detail">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="project-links">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-link btn-demo"
                >
                  <span className="material-icons">visibility</span>
                  Voir le site
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-link btn-github"
                >
                  <span className="material-icons">code</span>
                  Voir le code
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Section Call-to-Action */}
        <div style={{ marginTop: '80px', marginBottom: '80px' }}>
          <div className="cta-section">
            <h2 className="cta-title">Vous avez un projet similaire?</h2>
            <p className="cta-text">
              Parlons de votre projet! Je suis disponible pour discuter de vos besoins et vous proposer les meilleures solutions.
            </p>
            <a 
              href="https://wa.me/2290196171313?text=Bonjour%20Thales%2C%20j'aime%20ton%20travail%20et%20j'aurai%20un%20projet%20pour%20toi"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              <span className="material-icons">chat</span>
              Discutons sur WhatsApp
            </a>
          </div>
        </div>

      
        {/* Projets connexes */}
        {relatedProjects.length > 0 && (
          <div className="related-section">
            <h2 className="related-title">Projets similaires</h2>
            <div className="related-grid">
              {relatedProjects.map((related) => (
                <Link
                  key={related.id}
                  href={`/projects/${related.id}`}
                  className="related-card"
                >
                  <div className="related-image">
                    {related.image_url ? (
                      <img src={related.image_url.split('|')[0]} alt={related.title} />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #4925B0 0%, #6a42d0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}>
                        <span className="material-icons" style={{ fontSize: '32px', color: 'white' }}>code</span>
                      </div>
                    )}
                  </div>
                  <div className="related-content">
                    <h3 className="related-name">{related.title}</h3>
                    <p className="related-desc">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}