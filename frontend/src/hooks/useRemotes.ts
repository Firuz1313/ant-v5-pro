import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { remotesApi } from "@/api";
import type { Remote } from "@/types";
import type { RemoteCreateData, RemoteUpdateData, RemoteFilters } from "@/api/remotes";

// Query keys
export const remotesKeys = {
  all: ["remotes"] as const,
  lists: () => [...remotesKeys.all, "list"] as const,
  list: (filters: RemoteFilters) => [...remotesKeys.lists(), filters] as const,
  details: () => [...remotesKeys.all, "detail"] as const,
  detail: (id: string) => [...remotesKeys.details(), id] as const,
  byDevice: (deviceId: string) => [...remotesKeys.all, "byDevice", deviceId] as const,
  defaultForDevice: (deviceId: string) => [...remotesKeys.all, "default", deviceId] as const,
  stats: (deviceId?: string) => [...remotesKeys.all, "stats", deviceId] as const,
};

/**
 * Hook for fetching all remotes with filters
 */
export function useRemotes(filters: RemoteFilters = {}) {
  console.log("useRemotes called with filters:", filters);

  const result = useQuery({
    queryKey: remotesKeys.list(filters),
    queryFn: () => {
      console.log("useRemotes queryFn called, calling remotesApi.getAll");
      return remotesApi.getAll(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log("useRemotes result:", result);
  return result;
}

/**
 * Hook for fetching a single remote by ID
 */
export function useRemote(id: string) {
  return useQuery({
    queryKey: remotesKeys.detail(id),
    queryFn: () => remotesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching remotes by device
 */
export function useRemotesByDevice(deviceId: string) {
  return useQuery({
    queryKey: remotesKeys.byDevice(deviceId),
    queryFn: () => remotesApi.getByDevice(deviceId),
    enabled: !!deviceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching default remote for device
 */
export function useDefaultRemoteForDevice(deviceId: string) {
  return useQuery({
    queryKey: remotesKeys.defaultForDevice(deviceId),
    queryFn: () => remotesApi.getDefaultForDevice(deviceId),
    enabled: !!deviceId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook for fetching remote stats
 */
export function useRemoteStats(deviceId?: string) {
  return useQuery({
    queryKey: remotesKeys.stats(deviceId),
    queryFn: () => remotesApi.getStats(deviceId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for creating a new remote
 */
export function useCreateRemote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoteCreateData) => remotesApi.create(data),
    onSuccess: (newRemote) => {
      // Invalidate and refetch all remote lists
      queryClient.invalidateQueries({ queryKey: remotesKeys.lists() });
      
      // Invalidate device-specific queries if device_id is present
      if (newRemote.device_id) {
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.byDevice(newRemote.device_id) 
        });
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.defaultForDevice(newRemote.device_id) 
        });
      }
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: remotesKeys.stats() });
      if (newRemote.device_id) {
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.stats(newRemote.device_id) 
        });
      }
    },
  });
}

/**
 * Hook for updating a remote
 */
export function useUpdateRemote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RemoteUpdateData }) =>
      remotesApi.update(id, data),
    onSuccess: (updatedRemote, { id }) => {
      // Update the specific remote in cache
      queryClient.setQueryData(remotesKeys.detail(id), updatedRemote);
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: remotesKeys.lists() });
      
      // Invalidate device-specific queries
      if (updatedRemote.device_id) {
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.byDevice(updatedRemote.device_id) 
        });
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.defaultForDevice(updatedRemote.device_id) 
        });
      }
    },
  });
}

/**
 * Hook for deleting a remote
 */
export function useDeleteRemote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remotesApi.delete(id),
    onSuccess: (deletedRemote, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: remotesKeys.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: remotesKeys.lists() });
      
      // Invalidate device-specific queries
      if (deletedRemote.device_id) {
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.byDevice(deletedRemote.device_id) 
        });
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.defaultForDevice(deletedRemote.device_id) 
        });
      }
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: remotesKeys.stats() });
    },
  });
}

/**
 * Hook for setting remote as default
 */
export function useSetDefaultRemote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ remoteId, deviceId }: { remoteId: string; deviceId: string }) =>
      remotesApi.setAsDefault(remoteId, deviceId),
    onSuccess: (_, { deviceId }) => {
      // Invalidate all device-related queries to refresh defaults
      queryClient.invalidateQueries({ 
        queryKey: remotesKeys.byDevice(deviceId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: remotesKeys.defaultForDevice(deviceId) 
      });
      queryClient.invalidateQueries({ queryKey: remotesKeys.lists() });
    },
  });
}

/**
 * Hook for duplicating a remote
 */
export function useDuplicateRemote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) =>
      remotesApi.duplicate(id, data),
    onSuccess: (newRemote) => {
      // Invalidate lists to show the new duplicate
      queryClient.invalidateQueries({ queryKey: remotesKeys.lists() });
      
      if (newRemote.device_id) {
        queryClient.invalidateQueries({ 
          queryKey: remotesKeys.byDevice(newRemote.device_id) 
        });
      }
    },
  });
}

/**
 * Hook for incrementing remote usage
 */
export function useIncrementRemoteUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remotesApi.incrementUsage(id),
    onSuccess: (_, id) => {
      // Update the specific remote's usage count in cache
      queryClient.invalidateQueries({ queryKey: remotesKeys.detail(id) });
      // Invalidate stats to update usage statistics
      queryClient.invalidateQueries({ queryKey: remotesKeys.stats() });
    },
  });
}
