// apps/web/src/components/PageContainer.tsx

import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:px-10 md:py-12 ${className}`}>
      {children}
    </div>
  );
}