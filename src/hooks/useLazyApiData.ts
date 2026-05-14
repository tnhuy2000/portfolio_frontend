'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type UseLazyApiDataOptions = {
  enabled?: boolean;
  rootMargin?: string;
};

type UseLazyApiDataResult<T> = {
  data: T | null;
  error: unknown;
  hasFetched: boolean;
  isLoading: boolean;
  ref: RefObject<HTMLElement | null>;
};

export function useLazyApiData<T>(
  fetcher: () => Promise<T>,
  options: UseLazyApiDataOptions = {}
): UseLazyApiDataResult<T> {
  const { enabled = false, rootMargin = '0px' } = options;
  const { locale } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);
  const hasTriggeredRef = useRef(enabled);
  const fetcherRef = useRef(fetcher);
  const [shouldFetch, setShouldFetch] = useState(enabled);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    const shouldFetchForLocale = enabled || hasTriggeredRef.current;

    startedRef.current = false;
    setShouldFetch(shouldFetchForLocale);
    setError(null);
    setHasFetched(false);
    setData(null);
  }, [enabled, locale]);

  useEffect(() => {
    if (shouldFetch || enabled) return;

    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasTriggeredRef.current = true;
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, rootMargin, shouldFetch]);

  useEffect(() => {
    if (!shouldFetch || startedRef.current) return;

    let isActive = true;
    hasTriggeredRef.current = true;
    startedRef.current = true;
    setIsLoading(true);

    fetcherRef.current()
      .then((response) => {
        if (!isActive) return;
        setData(response);
      })
      .catch((fetchError) => {
        if (!isActive) return;
        console.error('Failed to fetch section data:', fetchError);
        setError(fetchError);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
        setHasFetched(true);
      });

    return () => {
      isActive = false;
    };
  }, [locale, shouldFetch]);

  return { data, error, hasFetched, isLoading, ref: sectionRef };
}
