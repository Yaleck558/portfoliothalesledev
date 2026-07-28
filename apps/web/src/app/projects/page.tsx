'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
}

const PROJECTS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});

  // Récupérer les projets publiés
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
        console.error('Erreur fetch projets:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Extraire les catégories et technologies uniques
  const categories = useMemo(() => {
    const cats = projects
      .map((p) => p.category)
      .filter(Boolean) as string[];
    return [...new Set(cats)].sort();
  }, [projects]);

  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((p) => p.technologies?.forEach((t) => techs.add(t)));
    return Array.from(techs).sort();
  }, [projects]);

  // Filtrer les projets
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(project.category || '');

      const matchesTechs =
        selectedTechs.length === 0 ||
        selectedTechs.some((tech) =>
          project.technologies.some(
            (t) => t.toLowerCase() === tech.toLowerCase()
          )
        );

      return matchesSearch && matchesCategory && matchesTechs;
    });
  }, [projects, searchTerm, selectedCategories, selectedTechs]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(
    startIdx,
    startIdx + PROJECTS_PER_PAGE
  );

  // Projets en vedette pour la section finale
  const featuredProjects = projects.filter((p) => p.is_featured);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedTechs([]);
    setCurrentPage(1);
  };

  // Carousel functions
  const getProjectImages = (imageUrl?: string): string[] => {
    if (!imageUrl) return [];
    // Supporte les URLs séparées par | (pipe)
    return imageUrl.split('|').map(url => url.trim()).filter(Boolean);
  };

  const goToImage = (projectId: string, index: number, totalImages: number) => {
    const newIndex = (index + totalImages) % totalImages;
    setImageIndexes(prev => ({ ...prev, [projectId]: newIndex }));
  };

  const nextImage = (projectId: string, totalImages: number) => {
    const current = imageIndexes[projectId] || 0;
    goToImage(projectId, current + 1, totalImages);
  };

  const prevImage = (projectId: string, totalImages: number) => {
    const current = imageIndexes[projectId] || 0;
    goToImage(projectId, current - 1, totalImages);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Josefin Sans' }}>
        <p>Chargement des projets...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

        * { box-sizing: border-box; }

        .projects-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          min-height: 100vh;
          font-family: 'Josefin Sans', sans-serif;
        }

        .projects-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          padding: 60px 32px 30px;
          text-align: left;
          border-bottom: 2px solid #e0e0e0;
        }

        .projects-breadcrumb {
          font-size: 16px;
          color: #4925B0;
          margin-bottom: 24px;
          font-weight: 600;
        }

        .projects-breadcrumb a {
          color: #4925B0;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .projects-breadcrumb a .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .projects-breadcrumb a:hover {
          color: #6a42d0;
          text-decoration: underline;
        }

        .projects-header-title {
          font-family: 'Germania One', cursive;
          font-size: 64px;
          color: #333;
          margin: 0 0 4px;
          text-transform: capitalize;
          letter-spacing: -1px;
        }

        .projects-header-subtitle {
          font-size: 18px;
          color: #999;
          margin: 0;
          font-weight: 300;
        }

        .projects-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 32px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
        }

        @media (max-width: 1024px) {
          .projects-wrapper {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 30px 20px;
          }
        }

        @media (max-width: 768px) {
          .projects-wrapper {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 24px 16px;
          }
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 32px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        @media (max-width: 1024px) {
          .sidebar {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            position: static;
            top: auto;
            gap: 20px;
          }
        }

        .filter-section {
          background: white;
          padding: 24px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        @media (max-width: 768px) {
          .filter-section {
            padding: 18px;
          }
        }

        .filter-title {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e0e0e0;
          display: inline-flex;
          align-items: center;
          gap: 0;
        }

        .filter-title .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #4925B0;
          box-shadow: 0 0 0 3px rgba(73, 37, 176, 0.1);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-item input {
          cursor: pointer;
          accent-color: #4925B0;
          width: 18px;
          height: 18px;
        }

        .checkbox-label {
          font-size: 15px;
          color: #333;
          flex: 1;
        }

        .checkbox-count {
          font-size: 14px;
          color: #999;
          margin-left: auto;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tech-tag {
          padding: 8px 14px;
          background: #f0f0f0;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #333;
          font-weight: 600;
        }

        .tech-tag:hover {
          border-color: #4925B0;
          color: #4925B0;
        }

        .tech-tag.active {
          background: #4925B0;
          color: white;
          border-color: #4925B0;
        }

        .reset-filters {
          background: none;
          border: 1px solid #e0e0e0;
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          color: #4925B0;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reset-filters:hover {
          background: rgba(73, 37, 176, 0.05);
          border-color: #4925B0;
        }

        /* ===== MAIN CONTENT ===== */
        .projects-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        @media (max-width: 1024px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .project-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .project-card:hover {
          border-color: #4925B0;
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.1);
        }

        .project-image {
          width: 100%;
          height: 280px;
          padding: 20px;
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }

        .carousel-container {
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

        .carousel-image {
          width: 90%;
          height: 90%;
          object-fit: contain;
          transition: opacity 0.3s ease;
        }

        .carousel-nav {
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

        .carousel-nav:hover {
          background: rgba(73, 37, 176, 0.9);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-nav.prev {
          left: 12px;
        }

        .carousel-nav.next {
          right: 12px;
        }

        .carousel-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .carousel-dot.active {
          background: white;
          width: 24px;
          border-radius: 4px;
        }

        .project-card:hover .carousel-image {
          filter: brightness(1.05);
        }

        .project-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #4925B0 0%, #6a42d0 100%);
          color: white;
          font-size: 48px;
        }

        .project-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(73, 37, 176, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .project-badge .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .project-category {
          display: inline-block;
          background: rgba(73, 37, 176, 0.1);
          color: #4925B0;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          width: fit-content;
        }

        .project-title {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin: 0;
          line-height: 1.3;
        }

        .project-description {
          font-size: 15px;
          color: #666;
          margin: 0;
          line-height: 1.5;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-techs {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-top: 8px;
          border-top: 1px solid #e0e0e0;
        }

        .tech-badge {
          background: #f0f0f0;
          color: #666;
          padding: 6px 10px;
          border-radius: 3px;
          font-size: 13px;
          font-weight: 600;
        }

        .project-footer {
          padding: 18px 24px;
          border-top: 1px solid #e0e0e0;
          background: #f9f9f9;
        }

        .btn-details {
          width: 100%;
          background: #4925B0;
          color: white;
          border: none;
          padding: 13px;
          border-radius: 6px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-details .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-details:hover {
          background: #6a42d0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(73, 37, 176, 0.3);
        }

        /* ===== PAGINATION ===== */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .pagination-btn {
          padding: 10px 14px;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: #333;
        }

        .pagination-btn:hover {
          border-color: #4925B0;
          color: #4925B0;
        }

        .pagination-btn.active {
          background: #4925B0;
          color: white;
          border-color: #4925B0;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ===== SIMILAR PROJECT SECTION ===== */
        .similar-section {
          margin-top: 80px;
          padding: 60px 32px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          text-align: center;
        }

        .similar-title {
          font-family: 'Germania One', cursive;
          font-size: 36px;
          color: #333;
          margin: 0 0 12px;
        }

        .similar-subtitle {
          font-size: 16px;
          color: #999;
          margin: 0 0 32px;
        }

        .similar-btn {
          background: #4925B0;
          color: white;
          border: none;
          padding: 15px 36px;
          border-radius: 6px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .similar-btn .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .similar-btn:hover {
          background: #6a42d0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(73, 37, 176, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          border: 1px dashed #e0e0e0;
          grid-column: 1 / -1;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-state-title {
          font-size: 20px;
          color: #333;
          margin: 0 0 8px;
          font-weight: 700;
        }

        .empty-state-text {
          color: #999;
          margin: 0;
          font-size: 15px;
        }
      `}</style>

      <div className="projects-page">
        {/* Header */}
        <div className="projects-header">
          <div className="projects-breadcrumb">
            <Link href="/projects">
              Projets
            </Link>
          </div>
          <h1 className="projects-header-title">Mes Réalisations</h1>
          <p className="projects-header-subtitle">
            Découvre mon portfolio de projets et expériences professionnelles
          </p>
        </div>

        {/* Main Content */}
        <div className="projects-wrapper">
          {/* Sidebar Filtres */}
          <aside className="sidebar">
            {/* Recherche */}
            <div className="filter-section">
              <h3 className="filter-title">
                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '16px' }}>search</span>
                Rechercher
              </h3>
              <input
                type="text"
                className="search-input"
                placeholder="Un projet, une techno..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Catégories */}
            <div className="filter-section">
              <h3 className="filter-title">
                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '16px' }}>folder</span>
                Catégories
              </h3>
              <div className="checkbox-group">
                {categories.map((category) => {
                  const count = projects.filter(
                    (p) => p.category === category
                  ).length;
                  return (
                    <label key={category} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      <span className="checkbox-label">{category}</span>
                      <span className="checkbox-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Technologies */}
            {allTechs.length > 0 && (
              <div className="filter-section">
                <h3 className="filter-title">
                  <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '16px' }}>tune</span>
                  Technologies
                </h3>
                <div className="tech-tags">
                  {allTechs.map((tech) => (
                    <button
                      key={tech}
                      className={`tech-tag ${
                        selectedTechs.includes(tech) ? 'active' : ''
                      }`}
                      onClick={() => toggleTech(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset */}
            {(searchTerm || selectedCategories.length > 0 || selectedTechs.length > 0) && (
              <button className="reset-filters" onClick={resetFilters}>
                Réinitialiser
              </button>
            )}
          </aside>

          {/* Projects Grid */}
          <div className="projects-content">
            {paginatedProjects.length === 0 ? (
              <div className="projects-grid">
                <div className="empty-state">
                  <span className="material-icons" style={{ fontSize: '48px', color: '#4925B0' }}>search</span>
                  <h2 className="empty-state-title">Aucun projet trouvé</h2>
                  <p className="empty-state-text">
                    Essaie avec des mots-clés ou filtres différents
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="projects-grid">
                  {paginatedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="project-card">
                        <div className="project-image">
                          {project.image_url ? (
                            <>
                              {(() => {
                                const images = getProjectImages(project.image_url);
                                const currentIdx = imageIndexes[project.id] || 0;
                                const currentImage = images[currentIdx];
                                
                                return (
                                  <div className="carousel-container">
                                    <img 
                                      src={currentImage} 
                                      alt={`${project.title} - ${currentIdx + 1}`}
                                      className="carousel-image"
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/></svg>';
                                      }}
                                    />
                                    
                                    {images.length > 1 && (
                                      <>
                                        <button 
                                          className="carousel-nav prev"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            prevImage(project.id, images.length);
                                          }}
                                          title="Image précédente"
                                        >
                                          <span className="material-icons">chevron_left</span>
                                        </button>
                                        <button 
                                          className="carousel-nav next"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            nextImage(project.id, images.length);
                                          }}
                                          title="Image suivante"
                                        >
                                          <span className="material-icons">chevron_right</span>
                                        </button>
                                        
                                        <div className="carousel-dots">
                                          {images.map((_, idx) => (
                                            <button
                                              key={idx}
                                              className={`carousel-dot ${idx === currentIdx ? 'active' : ''}`}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                goToImage(project.id, idx, images.length);
                                              }}
                                              title={`Image ${idx + 1}`}
                                            />
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })()}
                              
                              {project.is_featured && (
                                <div className="project-badge">
                                  <span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>star</span>
                                  FEATURED
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="project-image-placeholder">
                              <span className="material-icons" style={{ fontSize: '64px', color: 'white' }}>code</span>
                            </div>
                          )}
                        </div>

                        <div className="project-body">
                          {project.category && (
                            <div className="project-category">
                              {project.category}
                            </div>
                          )}
                          <h3 className="project-title">{project.title}</h3>
                          <p className="project-description">
                            {project.description}
                          </p>

                          {project.technologies.length > 0 && (
                            <div className="project-techs">
                              {project.technologies.slice(0, 2).map((tech) => (
                                <span key={tech} className="tech-badge">
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 2 && (
                                <span className="tech-badge">
                                  +{project.technologies.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="project-footer">
                          <button className="btn-details">
                            <span className="material-icons" style={{ fontSize: '18px' }}>visibility</span>
                            Voir les détails
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Précédent
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`pagination-btn ${
                            currentPage === page ? 'active' : ''
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Similar Project Section */}
            {featuredProjects.length > 0 && (
              <div className="similar-section">
                <h2 className="similar-title">Un projet similaire en tête ?</h2>
                <p className="similar-subtitle">
                  Découvre les réalisations mises en avant qui pourraient t'intéresser
                </p>
                <Link href={`/projects/${featuredProjects[0].id}`}>
                  <button className="similar-btn">
                    <span className="material-icons" style={{ fontSize: '18px' }}>star</span>
                    Voir le projet
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}