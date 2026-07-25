// apps/web/src/components/admin/ProjectsManager.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { supabase } from '../../lib/supabase';
import { AddProjectCard } from './AddProjectCard';
import { ProjectForm, type ProjectFormValues } from './ProjectForm';
import { SortableProjectCard, type Project } from './SortableProjectCard';

interface ProjectsManagerProps {
  userId: string;
}

export function ProjectsManager({ userId }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
      setError('Impossible de charger les projets.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(values: ProjectFormValues) {
    // Place le nouveau projet juste à côté de la carte "Ajouter un projet" (en tête de liste)
    const nextOrder = projects.length > 0 ? Math.min(...projects.map((p) => p.display_order)) - 1 : 0;

    const { error } = await supabase.from('projects').insert([
      {
        user_id: userId,
        title: values.title,
        description: values.description,
        image_url: values.image_url,
        technologies: values.technologies,
        category: values.category || null,
        demo_url: values.demo_url || null,
        github_url: values.github_url || null,
        status: values.status,
        is_featured: values.is_featured,
        display_order: nextOrder,
      },
    ]);

    if (error) {
      console.error('Erreur:', error);
      alert("Erreur lors de l'ajout du projet");
      return;
    }

    setShowForm(false);
    await fetchProjects();
  }

  async function handleUpdate(id: string, values: ProjectFormValues) {
    const { error } = await supabase
      .from('projects')
      .update({
        title: values.title,
        description: values.description,
        image_url: values.image_url,
        technologies: values.technologies,
        category: values.category || null,
        demo_url: values.demo_url || null,
        github_url: values.github_url || null,
        status: values.status,
        is_featured: values.is_featured,
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du projet');
      return;
    }

    setEditingProject(null);
    await fetchProjects();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce projet ?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleToggleStatus(project: Project) {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p)));

    const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', project.id);
    if (error) {
      console.error('Erreur:', error);
      await fetchProjects();
    }
  }

  async function handleToggleFeatured(project: Project) {
    const newFeatured = !project.is_featured;
    setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, is_featured: newFeatured } : p)));

    const { error } = await supabase.from('projects').update({ is_featured: newFeatured }).eq('id', project.id);
    if (error) {
      console.error('Erreur:', error);
      await fetchProjects();
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);

    setProjects(reordered);

    // Persiste le nouvel ordre en base
    const updates = reordered.map((project, index) =>
      supabase.from('projects').update({ display_order: index }).eq('id', project.id)
    );

    try {
      await Promise.all(updates);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'ordre:', err);
      await fetchProjects();
    }
  }

  const isModalOpen = showForm || !!editingProject;

  function closeModal() {
    setShowForm(false);
    setEditingProject(null);
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="admin-title text-2xl uppercase md:text-3xl">Mes Projets</h2>
      </div>

      {error && <p className="admin-body mb-4 text-red-500">{error}</p>}

      {loading ? (
        <p className="admin-body text-slate-500">Chargement des projets...</p>
      ) : (
        <>
          <p className="admin-body mb-4 text-xs text-slate-400">Glisse-dépose les cartes pour changer l'ordre d'affichage public.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AddProjectCard
              onClick={() => {
                setEditingProject(null);
                setShowForm(true);
              }}
            />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={projects.map((p) => p.id)} strategy={rectSortingStrategy}>
                {projects.map((project) => (
                  <SortableProjectCard
                    key={project.id}
                    project={project}
                    onEdit={() => {
                      setShowForm(false);
                      setEditingProject(project);
                    }}
                    onDelete={() => handleDelete(project.id)}
                    onToggleStatus={() => handleToggleStatus(project)}
                    onToggleFeatured={() => handleToggleFeatured(project)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </>
      )}

      {/* Modale d'ajout / édition — formulaire multi-étapes */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {showForm && (
              <ProjectForm
                userId={userId}
                submitLabel="Ajouter le projet"
                onSubmit={handleCreate}
                onCancel={closeModal}
              />
            )}

            {editingProject && (
              <ProjectForm
                userId={userId}
                submitLabel="Enregistrer les modifications"
                initialValues={{
                  title: editingProject.title,
                  description: editingProject.description,
                  image_url: editingProject.image_url,
                  technologies: editingProject.technologies,
                  category: editingProject.category || '',
                  demo_url: editingProject.demo_url || '',
                  github_url: editingProject.github_url || '',
                  status: editingProject.status,
                  is_featured: editingProject.is_featured,
                }}
                onSubmit={(values) => handleUpdate(editingProject.id, values)}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}