'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLanguage } from './LanguageContext';
import { getCategories, getContactInfo, getProfile, getProject, getStat } from '@/lib/api';
import type { Category, ContactInfo, Profile, Project, Stat } from '@/types';

type PortfolioData = {
  categories: Category[];
  contactInfo: ContactInfo | null;
  profile: Profile | null;
  projects: Project[];
  stats: Stat[];
};

type PortfolioDataContextType = PortfolioData & {
  error: unknown;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

const initialData: PortfolioData = {
  categories: [],
  contactInfo: null,
  profile: null,
  projects: [],
  stats: [],
};

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

async function safeFetch<T>(fetcher: () => Promise<T>, label: string) {
  try {
    return await fetcher();
  } catch (error) {
    console.error(`Failed to fetch ${label}:`, error);
    return null;
  }
}

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  const requestIdRef = useRef(0);
  const [data, setData] = useState<PortfolioData>(initialData);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPortfolioData = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);

    const [profile, stats, projects, categories, contactInfo] = await Promise.all([
      safeFetch(getProfile, 'profile'),
      safeFetch(getStat, 'stats'),
      safeFetch(getProject, 'projects'),
      safeFetch(getCategories, 'categories'),
      safeFetch(getContactInfo, 'contact info'),
    ]);

    if (requestIdRef.current !== requestId) return;

    setData((previousData) => ({
      profile: profile ?? previousData.profile,
      stats: stats ?? previousData.stats,
      projects: projects ?? previousData.projects,
      categories: categories ?? previousData.categories,
      contactInfo: contactInfo ?? previousData.contactInfo,
    }));

    const firstError = [profile, stats, projects, categories, contactInfo].some((item) => item === null)
      ? new Error('One or more portfolio API requests failed')
      : null;

    setError(firstError);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData, locale]);

  return (
    <PortfolioDataContext.Provider
      value={{
        ...data,
        error,
        isLoading,
        refetch: fetchPortfolioData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);

  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }

  return context;
}
