// apps/web/src/components/admin/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
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

const STEPS = [
  { id: 1, label: 'Infos' },
  { id: 2, label: 'Visuel' },
  { id: 3, label: 'Publication' },
];

export function ProjectForm({ userId, initialValues, submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>({ ...emptyValues, ...initialValues });
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [stepError, setStepError] = useState('');

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function goNext() {
    setStepError('');
    if (step === 1 && (!values.title.trim() || !values.description.trim())) {
      setStepError('Le titre et la description sont obligatoires.');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setStepError('');
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== STEPS.length) {
      goNext();
      return;
    }
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  }

  const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100;
  const isEditing = submitLabel !== 'Ajouter le projet';

  return (
    <div className="p-6 md:p-8">
      {/* En-tête */}
      <div className="mb-6 flex items-start justify-between">
        <h3 className="admin-title text-xl text-[#111111] md:text-2xl">
          {isEditing ? 'Modifier le projet' : 'Nouveau projet'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Barre de progression par étapes */}
      <div className="mb-8">
        <div className="relative flex justify-between">
          <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-slate-100" />
          <div
            className="absolute left-0 top-5 h-1 rounded-full bg-[#4925B0] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          {STEPS.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-4 font-bold transition ${
                  step > s.id
                    ? 'border-[#4925B0] bg-[#4925B0] text-white'
                    : step === s.id
                      ? 'border-[#4925B0] bg-white text-[#4925B0]'
                      : 'border-slate-200 bg-white text-slate-300'
                }`}
              >
                {step > s.id ? <Check size={18} /> : s.id}
              </div>
              <span
                className={`admin-body text-[11px] font-medium ${
                  step >= s.id ? 'text-[#4925B0]' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {stepError && (
          <p className="admin-body rounded-lg border-l-4 border-red-400 bg-red-50 px-4 py-2.5 text-sm text-red-500">
            {stepError}
          </p>
        )}

        {/* Étape 1 — Infos générales */}
        {step === 1 && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* Étape 2 — Visuel & technologies */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Image du projet</label>
              <ImageUpload userId={userId} value={values.image_url} onChange={(url) => set('image_url', url)} />
            </div>
            <div>
              <label className={labelClass}>Technologies</label>
              <TagInput tags={values.technologies} onChange={(tags) => set('technologies', tags)} />
            </div>
          </div>
        )}

        {/* Étape 3 — Liens & publication */}
        {step === 3 && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="admin-body rounded-lg border border-slate-200 px-6 py-2.5 font-medium text-slate-600 transition hover:bg-slate-100"
            >
              ← Retour
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="admin-body rounded-lg border border-slate-200 px-6 py-2.5 font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Annuler
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="admin-body flex-1 rounded-lg bg-[#4925B0] py-2.5 font-bold text-white transition hover:bg-[#6a42d0] disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : step === STEPS.length ? submitLabel : 'Continuer →'}
          </button>
        </div>
      </form>
    </div>
  );
}