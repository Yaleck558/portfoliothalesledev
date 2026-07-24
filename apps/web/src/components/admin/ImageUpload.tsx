// apps/web/src/components/admin/ImageUpload.tsx
'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  userId: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

const MAX_SIZE_MB = 5;

export function ImageUpload({ userId, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image trop lourde (max ${MAX_SIZE_MB} Mo).`);
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (err) {
      console.error('Erreur upload image:', err);
      setError("Erreur lors de l'upload. Réessaie.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {value ? (
        <div className="group relative h-48 w-full overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Aperçu du projet" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow transition hover:bg-red-600 hover:text-white"
            aria-label="Retirer l'image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="admin-body flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#4925B0]/30 bg-[#4925B0]/5 text-[#4925B0]/70 transition hover:border-[#4925B0] hover:bg-[#4925B0]/10 hover:text-[#4925B0] disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Envoi en cours...</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm font-medium">Cliquer pour ajouter une image</span>
              <span className="text-xs text-[#4925B0]/50">PNG, JPG — max {MAX_SIZE_MB} Mo</span>
            </>
          )}
        </button>
      )}

      {error && <p className="admin-body mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}