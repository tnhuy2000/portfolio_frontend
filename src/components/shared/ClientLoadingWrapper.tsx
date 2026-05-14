'use client';

import { useEffect, useState } from 'react';
import { LoadingScreen } from './loading-spinner';
import { usePublicSettings } from '@/contexts/PublicSettingsContext';
import { AnimatePresence } from 'framer-motion';
import { subscribeClientApiActivity } from '@/lib/strapi';

export default function ClientLoadingWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const { isLoading: isSettingsLoading } = usePublicSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [activeApiRequests, setActiveApiRequests] = useState(0);

  useEffect(() => subscribeClientApiActivity(setActiveApiRequests), []);

  useEffect(() => {
    if (isSettingsLoading || activeApiRequests > 0) return;

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [activeApiRequests, isSettingsLoading]);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      <div
        className={`transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
}
