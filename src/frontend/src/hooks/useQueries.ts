import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, WakeUpSettings } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetWakeUpTime() {
  const { actor, isFetching } = useActor();

  return useQuery<WakeUpSettings | null>({
    queryKey: ['wakeUpTime'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWakeUpTime();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetWakeUpTime() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: WakeUpSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setWakeUpTime(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wakeUpTime'] });
    },
  });
}

export function useGetPhotoSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['photoSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPhotoSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoUrl: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPhoto(photoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photoSubmissions'] });
    },
  });
}
