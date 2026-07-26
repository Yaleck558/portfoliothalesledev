'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category?: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  technologies: string;
  demo_url: string;
  github_url: string;
  status: 'draft' | 'published';
  is_featured: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    technologies: '',
    demo_url: '',
    github_url: '',
    status: 'draft',
    is_featured: false,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);

  // Vérifier l'authentification
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      fetchProjects(user.id);
    }
    checkAuth();
  }, [router]);

  // Récupérer les projets
  const fetchProjects = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Erreur fetch projets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ouvrir modal de création
  const handleNewProject = () => {
    setEditingProject(null);
    setUploadedImages([]);
    setFormData({
      title: '',
      description: '',
      category: '',
      technologies: '',
      demo_url: '',
      github_url: '',
      status: 'draft',
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  // Ouvrir modal d'édition
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setUploadedImages(project.image_url ? project.image_url.split('|') : []);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category || '',
      technologies: project.technologies.join(', '),
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      status: project.status,
      is_featured: project.is_featured,
    });
    setIsModalOpen(true);
  };

  // Upload image(s)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files) return;

    setUploadingImage(true);
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        setUploadedImages((prev) => [...prev, publicUrl]);
      }
    } catch (err) {
      console.error('Erreur upload image:', err);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Supprimer une image uploadée
  const handleRemoveImage = (imageUrl: string) => {
    setUploadedImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  // Soumettre le formulaire
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !formData.title || !formData.description) {
      alert('Titre et description requis');
      return;
    }

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category || null,
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        image_url: uploadedImages.length > 0 ? uploadedImages.join('|') : null,
        demo_url: formData.demo_url || null,
        github_url: formData.github_url || null,
        status: formData.status,
        is_featured: formData.is_featured,
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            user_id: user.id,
            display_order: projects.length,
          });

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchProjects(user.id);
    } catch (err) {
      console.error('Erreur save projet:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Supprimer un projet
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Confirmer la suppression?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchProjects(user.id);
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // Mettre à jour le statut
  const handleToggleStatus = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: project.status === 'draft' ? 'published' : 'draft' })
        .eq('id', project.id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchProjects(user.id);
    } catch (err) {
      console.error('Erreur update status:', err);
    }
  };

  // Mettre à jour featured
  const handleToggleFeatured = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: !project.is_featured })
        .eq('id', project.id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchProjects(user.id);
    } catch (err) {
      console.error('Erreur update featured:', err);
    }
  };

  // Drag and drop réordonner
  const handleDragStart = (projectId: string) => {
    setDraggedProject(projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropReorder = async (targetProjectId: string) => {
    if (!draggedProject || draggedProject === targetProjectId) return;

    const draggedIndex = projects.findIndex((p) => p.id === draggedProject);
    const targetIndex = projects.findIndex((p) => p.id === targetProjectId);

    const newProjects = [...projects];
    [newProjects[draggedIndex], newProjects[targetIndex]] = [
      newProjects[targetIndex],
      newProjects[draggedIndex],
    ];

    setProjects(newProjects);

    try {
      for (let i = 0; i < newProjects.length; i++) {
        await supabase
          .from('projects')
          .update({ display_order: i })
          .eq('id', newProjects[i].id);
      }
    } catch (err) {
      console.error('Erreur reorder:', err);
    }

    setDraggedProject(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Josefin Sans' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Germania+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

        * { box-sizing: border-box; }

        body { margin: 0; padding: 0; }

        .admin-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          min-height: 100vh;
          font-family: 'Josefin Sans', sans-serif;
        }

        .admin-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          padding: 100px 32px 40px;
          border-bottom: 2px solid #e0e0e0;
        }

        .admin-header-title {
          font-family: 'Germania One', cursive;
          font-size: 64px;
          color: #333;
          margin: 0 0 12px;
          text-transform: capitalize;
          letter-spacing: -1px;
        }

        .admin-header-subtitle {
          font-size: 18px;
          color: #999;
          margin: 0;
          font-weight: 300;
        }

        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 32px;
        }

        .admin-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .admin-stats {
          font-size: 15px;
          color: #666;
          font-weight: 600;
        }

        .btn-new-project {
          background: #4925B0;
          color: white;
          border: none;
          padding: 13px 28px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-new-project:hover {
          background: #6a42d0;
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.3);
          transform: translateY(-2px);
        }

        .btn-new-project .material-icons {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .project-row {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr 150px 150px 150px 200px;
          gap: 16px;
          align-items: center;
          transition: all 0.3s ease;
          cursor: grab;
          user-select: none;
        }

        .project-row:hover {
          border-color: #4925B0;
          box-shadow: 0 4px 12px rgba(73, 37, 176, 0.1);
        }

        .project-row:active {
          cursor: grabbing;
        }

        .project-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .project-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .project-category {
          font-size: 13px;
          color: #999;
          margin: 0;
        }

        .project-status {
          text-align: center;
        }

        .status-badge {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        .status-draft {
          background: rgba(73, 37, 176, 0.1);
          color: #4925B0;
          border: 1px solid #4925B0;
        }

        .status-draft:hover {
          background: #4925B0;
          color: white;
        }

        .status-published {
          background: rgba(73, 37, 176, 0.2);
          color: #4925B0;
          border: 1px solid #4925B0;
        }

        .status-published:hover {
          background: #4925B0;
          color: white;
        }

        .project-featured {
          text-align: center;
        }

        .featured-btn {
          background: transparent;
          border: 2px solid #4925B0;
          color: #4925B0;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .featured-btn.active {
          background: #4925B0;
          color: white;
          border-color: #4925B0;
        }

        .featured-btn:hover {
          background: #4925B0;
          color: white;
          border-color: #4925B0;
        }

        .featured-btn .material-icons {
          display: inline;
          vertical-align: middle;
          margin-right: 4px;
        }

        .project-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .btn-edit, .btn-delete {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          font-family: 'Josefin Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-edit {
          background: #4925B0;
          color: white;
        }

        .btn-edit:hover {
          background: #6a42d0;
          box-shadow: 0 4px 12px rgba(73, 37, 176, 0.3);
        }

        .btn-delete {
          background: rgba(73, 37, 176, 0.15);
          color: #4925B0;
          border: 1px solid #4925B0;
        }

        .btn-delete:hover {
          background: #4925B0;
          color: white;
          box-shadow: 0 4px 12px rgba(73, 37, 176, 0.3);
        }

        .btn-edit .material-icons, 
        .btn-delete .material-icons {
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .project-row {
            grid-template-columns: 1fr 120px;
            gap: 12px;
          }

          .project-status,
          .project-featured,
          .project-actions {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .admin-header {
            padding: 80px 20px 30px;
          }

          .admin-header-title {
            font-size: 48px;
          }

          .admin-container {
            padding: 24px 16px;
          }

          .admin-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-new-project {
            justify-content: center;
            width: 100%;
          }

          .project-row {
            grid-template-columns: 1fr;
            padding: 16px;
          }

          .project-actions {
            grid-column: 1;
            justify-content: flex-start;
          }

          .project-status,
          .project-featured {
            display: block;
            text-align: left;
          }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4925B0;
        }

        .empty-state-title {
          font-family: 'Germania One', cursive;
          font-size: 24px;
          color: #333;
          margin: 0 0 8px;
        }

        /* ===== MODAL ===== */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 40px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #4925B0;
        }

        .modal-title {
          font-family: 'Germania One', cursive;
          font-size: 28px;
          color: #333;
          margin: 0 0 24px;
          text-transform: capitalize;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4925B0;
          box-shadow: 0 0 0 3px rgba(73, 37, 176, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .form-checkbox input {
          cursor: pointer;
          accent-color: #4925B0;
          width: 18px;
          height: 18px;
        }

        .image-upload-area {
          border: 2px dashed #4925B0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background: rgba(73, 37, 176, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .image-upload-area:hover {
          background: rgba(73, 37, 176, 0.1);
          border-color: #6a42d0;
        }

        .image-upload-area input {
          display: none;
        }

        .image-upload-area .material-icons {
          display: inline;
          vertical-align: middle;
        }

        .uploaded-images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .uploaded-image {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #f0f0f0;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .uploaded-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(73, 37, 176, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .remove-image-btn:hover {
          background: #4925B0;
          transform: scale(1.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .btn-submit, .btn-cancel {
          flex: 1;
          padding: 14px;
          border-radius: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: 2px solid #4925B0;
          transition: all 0.3s ease;
        }

        .btn-submit {
          background: #4925B0;
          color: white;
        }

        .btn-submit:hover {
          background: #6a42d0;
          border-color: #6a42d0;
          box-shadow: 0 8px 24px rgba(73, 37, 176, 0.3);
        }

        .btn-cancel {
          background: transparent;
          color: #4925B0;
        }

        .btn-cancel:hover {
          background: rgba(73, 37, 176, 0.1);
        }
      `}</style>

      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-header-title">Admin Projets</h1>
          <p className="admin-header-subtitle">Gère tes projets et contenus</p>
        </div>

        {/* Main Container */}
        <div className="admin-container">
          <div className="admin-toolbar">
            <div className="admin-stats">
              {`${projects.length} projet${projects.length !== 1 ? 's' : ''} au total`}
            </div>
            <button className="btn-new-project" onClick={handleNewProject}>
              <span className="material-icons">add</span>
              Nouveau Projet
            </button>
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons" style={{ fontSize: '64px', color: '#4925B0' }}>folder_open</span>
              <h2 className="empty-state-title">Aucun projet</h2>
              <p>Crée ton premier projet pour commencer!</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-row"
                  draggable
                  onDragStart={() => handleDragStart(project.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropReorder(project.id)}
                >
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-category">{project.category || 'Sans catégorie'}</p>
                  </div>

                  <div className="project-status">
                    <button
                      className={`status-badge status-${project.status}`}
                      onClick={() => handleToggleStatus(project)}
                      title="Cliquer pour changer"
                    >
                      {project.status === 'draft' ? 'Brouillon' : 'Publié'}
                    </button>
                  </div>

                  <div className="project-featured">
                    <button
                      className={`featured-btn ${project.is_featured ? 'active' : ''}`}
                      onClick={() => handleToggleFeatured(project)}
                      title="Cliquer pour featured"
                    >
                      {project.is_featured ? (
                        <>
                          <span className="material-icons" style={{ fontSize: '14px' }}>star</span>
                          Featured
                        </>
                      ) : (
                        <>
                          <span className="material-icons" style={{ fontSize: '14px' }}>star_outline</span>
                          Featured
                        </>
                      )}
                    </button>
                  </div>

                  <div className="project-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEditProject(project)}
                    >
                      <span className="material-icons">edit</span>
                      Éditer
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <span className="material-icons">delete</span>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="material-icons">close</span>
            </button>

            <h2 className="modal-title">
              {editingProject ? 'Éditer Projet' : 'Nouveau Projet'}
            </h2>

            <form onSubmit={handleSubmitProject}>
              <div className="form-group">
                <label className="form-label">Titre *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Titre du projet"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripton détaillée"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="ex: Web, Mobile, Design"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies (séparées par des virgules)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  placeholder="React, Next.js, Tailwind"
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Démo</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.demo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, demo_url: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL GitHub</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  placeholder="https://github.com/user/repo"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Images (séparées par | dans la BD)</label>
                <div
                  className="image-upload-area"
                  onClick={(e) =>
                    e.currentTarget.querySelector('input')?.click()
                  }
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  <p>
                    {uploadingImage ? (
                      <>
                        <span className="material-icons" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}>cloud_upload</span>
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <span className="material-icons" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}>photo_library</span>
                        Clique ou glisse les images
                      </>
                    )}
                  </p>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="uploaded-images">
                    {uploadedImages.map((imageUrl) => (
                      <div key={imageUrl} className="uploaded-image">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(imageUrl)}
                        >
                          <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.status === 'published'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                  />
                  Publier directement
                </label>
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                  />
                  Mettre en avant (Featured)
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingProject ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}