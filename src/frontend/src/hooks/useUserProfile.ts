import { useGetCallerUserProfile } from './useQueries';

export function useUserProfile() {
  return useGetCallerUserProfile();
}
