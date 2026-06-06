import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchHealth } from '../api/client';
import { useAppStore } from '../store/app-store';

export function useHealthCheck() {
  const setLastHealthCheckAt = useAppStore((state) => state.setLastHealthCheckAt);
  const query = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    retry: 1,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (query.data?.timestamp) {
      setLastHealthCheckAt(query.data.timestamp);
    }
  }, [query.data?.timestamp, setLastHealthCheckAt]);

  return query;
}
