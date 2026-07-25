// apps/web/src/components/admin/AddProjectCard.tsx
'use client';

import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { Cross } from '@/components/animate-ui/icons/cross';

interface AddProjectCardProps {
  onClick: () => void;
}

export function AddProjectCard({ onClick }: AddProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="admin-body group flex h-full min-h-[280px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#4925B0]/30 bg-[#4925B0]/5 text-[#4925B0] transition hover:border-[#4925B0] hover:bg-[#4925B0]/10"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4925B0]/10 transition group-hover:bg-[#4925B0]/20">
        <AnimateIcon animateOnHover>
          <Cross size={28} />
        </AnimateIcon>
      </span>
      <span className="text-base font-bold">Ajouter un projet</span>
    </button>
  );
}