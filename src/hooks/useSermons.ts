import { useQuery } from '@tanstack/react-query';
import { fetchSermons } from '../api/collections';
import type { Sermon } from '../types';

export function useSermons() {
  return useQuery<Sermon[], Error>({
    queryKey: ['sermons'],
    queryFn: fetchSermons,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
