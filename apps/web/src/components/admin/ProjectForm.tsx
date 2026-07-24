// apps/web/src/components/admin/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { TagInput } from './TagInput';
import { ImageUpload } from './ImageUpload';

export interface ProjectFormValues {
  title: string;
  description: string;
  image_url: string | null;
  technologies: string[];
  category: string;
  demo_url: string;
  github_url: string;
  status: 'draft' | 'published';
  is_featured: boolean;
}

interface ProjectFormProps {
  userId: string;
  initialValues?: Partial<ProjectFormValues>;
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel: () => void;
}

const emptyValues: ProjectFormValues = {
  title: '',
  description: '',
  image_url: null,
  technologies: [],
  category: '',
  demo_url: '',
  github_url: '',
  status: 'draft',
  is_featured: false,
};

const inputClass =
  'admin-body w-full rounded-lg border border-slate-200 bg-[#f8f8f8] px-4 py-2.5 text-[#111111] placeholder-slate-400 transition focus:border-[#4925B0] focus:outline-none focus:ring-1 focus:ring-[#4925B0]/30';

const labelClass = 'admin-body mb-2 block text-sm font-semibold text-slate-700';

export function ProjectForm({ userId, initialValues, submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>({ ...emptyValues, ...initialValues });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 space-y-6 rounded-2xl border border-[#4925B0]/15 bg-white p-6 shadow-sm md:p-8"
    >
      {/* Titre */}
      <div>
        <label className={labelClass}>Titre *</label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Mon super projet"
          className={inputClass}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Description du projet..."
          rows={4}
          className={`${inputClass} resize-none`}
          required
        />
      </div>

      {/* Image */}
      <div>
        <label className={labelClass}>Image du projet</label>
        <ImageUpload userId={userId} value={values.image_url} onChange={(url) => set('image_url', url)} />
      </div>

      {/* Technologies */}
      <div>
        <label className={labelClass}>Technologies</label>
        <TagInput tags={values.technologies} onChange={(tags) => set('technologies', tags)} />
      </div>

      {/* Catégorie */}
      <div>
        <label className={labelClass}>Catégorie</label>
        <input
          type="text"
          value={values.category}
          onChange={(e) => set('category', e.target.value)}
          placeholder="Web, Mobile, Design..."
          className={inputClass}
        />
      </div>

      {/* Liens (facultatifs) */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>URL Démo</label>
          <input
            type="url"
            value={values.demo_url}
            onChange={(e) => set('demo_url', e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>URL GitHub</label>
          <input
            type="url"
            value={values.github_url}
            onChange={(e) => set('github_url', e.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Statut + mise en avant */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Statut</label>
          <div className="flex overflow-hidden rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => set('status', 'draft')}
              className={`admin-body flex-1 py-2.5 text-sm font-semibold transition ${
                values.status === 'draft' ? 'bg-slate-700 text-white' : 'bg-[#f8f8f8] text-slate-500 hover:bg-slate-100'
              }`}
            >
              Brouillon
            </button>
            <button
              type="button"
              onClick={() => set('status', 'published')}
              className={`admin-body flex-1 py-2.5 text-sm font-semibold transition ${
                values.status === 'published' ? 'bg-[#4925B0] text-white' : 'bg-[#f8f8f8] text-slate-500 hover:bg-slate-100'
              }`}
            >
              Publié
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Mise en avant</label>
          <button
            type="button"
            onClick={() => set('is_featured', !values.is_featured)}
            className={`admin-body w-full rounded-lg border py-2.5 text-sm font-semibold transition ${
              values.is_featured
                ? 'border-[#4925B0] bg-[#4925B0]/10 text-[#4925B0]'
                : 'border-slate-200 bg-[#f8f8f8] text-slate-500 hover:bg-slate-100'
            }`}
          >
            {values.is_featured ? '★ Projet mis en avant' : '☆ Mettre en avant'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="admin-body flex-1 rounded-lg bg-[#4925B0] py-2.5 font-bold text-white transition hover:bg-[#6a42d0] disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="admin-body rounded-lg border border-slate-200 px-6 py-2.5 font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}