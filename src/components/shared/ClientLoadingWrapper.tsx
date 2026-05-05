'use client';

import { useState } from 'react';
import { LoadingScreen } from './loading-spinner';

export default function ClientLoadingWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
}