// apps/web/src/components/admin/SortableProjectCard.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Star, Trash2 } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  technologies: string[];
  category: string | null;
  demo_url: string | null;
  github_url: string | null;
  status: 'draft' | 'published';
  is_featured: boolean;
  display_order: number;
}

interface SortableProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
}

export function SortableProjectCard({ project, onEdit, onDelete, onToggleStatus, onToggleFeatured }: SortableProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        project.is_featured ? 'border-[#4925B0]/40' : 'border-slate-200'
      }`}
    >
      {project.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image_url} alt={project.title} className="h-36 w-full object-cover" />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-[#4925B0]/10 to-[#4925B0]/5">
          <span className="admin-title text-2xl text-[#4925B0]/40">{project.title.charAt(0)}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="shrink-0 cursor-grab text-slate-300 transition hover:text-[#4925B0] active:cursor-grabbing"
              aria-label="Déplacer"
            >
              <GripVertical size={18} />
            </button>
            <h3 className="truncate text-lg font-bold text-[#111111]">{project.title}</h3>
          </div>
          {project.is_featured && <Star size={16} className="shrink-0 fill-[#4925B0] text-[#4925B0]" />}
        </div>

        <p className="admin-body mb-3 line-clamp-2 text-sm text-slate-600">{project.description}</p>

        {project.technologies?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span key={tech} className="admin-body rounded-full bg-[#4925B0]/10 px-2 py-0.5 text-[11px] text-[#4925B0]">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mb-4 flex gap-2">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-body rounded bg-[#4925B0]/10 px-2 py-1 text-xs font-medium text-[#4925B0]"
            >
              Démo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-body rounded bg-[#4925B0]/10 px-2 py-1 text-xs font-medium text-[#4925B0]"
            >
              GitHub
            </a>
          )}
        </div>

        <div className="mt-auto space-y-2">
          <button
            onClick={onToggleStatus}
            className={`admin-body w-full rounded-lg py-1.5 text-xs font-semibold transition ${
              project.status === 'published'
                ? 'bg-[#4925B0]/10 text-[#4925B0] hover:bg-[#4925B0]/20'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {project.status === 'published' ? '● Publié — cliquer pour repasser en brouillon' : '○ Brouillon — cliquer pour publier'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onToggleFeatured}
              className="admin-body flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[#4925B0] hover:text-[#4925B0]"
            >
              <Star size={12} /> {project.is_featured ? 'Retirer' : 'Mettre en avant'}
            </button>
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[#4925B0] hover:text-[#4925B0]"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:border-red-500 hover:bg-red-50"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}