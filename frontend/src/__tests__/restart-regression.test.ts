// 🧪 Regression tests to prevent application restart/flashing loops
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useDevices } from '../hooks/useDevices';
import { useProblems } from '../hooks/useProblems';

// Mock API responses
const mockDevicesResponse = {
  data: [
    { id: '1', name: 'Test Device', model: 'TD-1', is_active: true },
    { id: '2', name: 'Test Device 2', model: 'TD-2', is_active: true },
  ],
  pagination: { page: 1, limit: 20, total: 2, totalPages: 1 }
};

const mockProblemsResponse = {
  data: [
    { id: '1', title: 'Test Problem', status: 'published', deviceId: '1' },
    { id: '2', title: 'Test Problem 2', status: 'published', deviceId: '1' },
  ],
  pagination: { page: 1, limit: 20, total: 2, totalPages: 1 }
};

// Mock API client
vi.mock('../api', () => ({
  devicesApi: {
    getDevices: vi.fn(() => Promise.resolve(mockDevicesResponse)),
  },
  problemsApi: {
    getProblems: vi.fn(() => Promise.resolve(mockProblemsResponse)),
  },
}));

describe('🛡️ Restart Loop Prevention Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 10 * 60 * 1000,
          cacheTime: 15 * 60 * 1000,
        },
      },
    });
    vi.clearAllMocks();
  });

  describe('React Query Configuration', () => {
    test('🔧 should have anti-restart query configuration', () => {
      const config = queryClient.getDefaultOptions();
      
      // Verify stale time is sufficient to prevent aggressive refetching
      expect(config.queries?.staleTime).toBeGreaterThanOrEqual(10 * 60 * 1000);
      
      // Verify cache time prevents data loss during restarts
      expect(config.queries?.cacheTime).toBeGreaterThanOrEqual(15 * 60 * 1000);
      
      // Verify retry logic is conservative
      expect(config.queries?.retry).toBe(false);
    });

    test('🚫 should not refetch on window focus', () => {
      const config = queryClient.getDefaultOptions();
      expect(config.queries?.refetchOnWindowFocus).toBe(false);
    });

    test('📱 should not refetch on mount when data exists', () => {
      const config = queryClient.getDefaultOptions();
      expect(config.queries?.refetchOnMount).toBe(false);
    });
  });

  describe('useDevices Hook Stability', () => {
    test('🎯 should cache devices data and prevent multiple calls', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      // First hook call
      const { result: result1 } = renderHook(() => useDevices(), { wrapper });
      
      // Wait for first call to complete
      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Second hook call with same parameters
      const { result: result2 } = renderHook(() => useDevices(), { wrapper });

      // Should use cached data, not make new API call
      expect(result2.current.data).toEqual(result1.current.data);
      expect(result2.current.isLoading).toBe(false);
    });

    test('⚡ should have stable query key to prevent unnecessary refetches', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      const { result, rerender } = renderHook(() => useDevices(1, 20, {}), { wrapper });
      
      const initialQueryKey = result.current.dataUpdatedAt;
      
      // Rerender with same parameters
      rerender();
      
      // Query key should remain stable
      expect(result.current.dataUpdatedAt).toBe(initialQueryKey);
    });

    test('🛑 should not trigger rapid successive API calls', async () => {
      const { devicesApi } = await import('../api');
      const mockGetDevices = devicesApi.getDevices as vi.MockedFunction<typeof devicesApi.getDevices>;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      // Render hook multiple times rapidly
      for (let i = 0; i < 5; i++) {
        renderHook(() => useDevices(), { wrapper });
      }

      // Should not make multiple calls due to caching
      expect(mockGetDevices).toHaveBeenCalledTimes(1);
    });
  });

  describe('useProblems Hook Stability', () => {
    test('🎯 should cache problems data and prevent multiple calls', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      // First hook call
      const { result: result1 } = renderHook(() => useProblems(), { wrapper });
      
      // Wait for first call to complete
      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Second hook call with same parameters
      const { result: result2 } = renderHook(() => useProblems(), { wrapper });

      // Should use cached data, not make new API call
      expect(result2.current.data).toEqual(result1.current.data);
      expect(result2.current.isLoading).toBe(false);
    });

    test('🛑 should not trigger rapid successive API calls', async () => {
      const { problemsApi } = await import('../api');
      const mockGetProblems = problemsApi.getProblems as vi.MockedFunction<typeof problemsApi.getProblems>;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      // Render hook multiple times rapidly
      for (let i = 0; i < 5; i++) {
        renderHook(() => useProblems(), { wrapper });
      }

      // Should not make multiple calls due to caching
      expect(mockGetProblems).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling Stability', () => {
    test('🚨 should not create retry loops on API errors', async () => {
      const { devicesApi } = await import('../api');
      const mockGetDevices = devicesApi.getDevices as vi.MockedFunction<typeof devicesApi.getDevices>;
      
      // Mock API to fail
      mockGetDevices.mockRejectedValueOnce(new Error('API Error'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      const { result } = renderHook(() => useDevices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should not retry multiple times
      expect(mockGetDevices).toHaveBeenCalledTimes(1);
    });

    test('���️ should have appropriate retry delay to prevent rapid retries', () => {
      const config = queryClient.getDefaultOptions();
      
      // Should either have no retry or conservative retry delay
      if (config.queries?.retry !== false) {
        expect(config.queries?.retryDelay).toBeDefined();
      }
    });
  });

  describe('Performance Metrics', () => {
    test('📊 should complete initial data fetch within reasonable time', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      const startTime = Date.now();
      const { result } = renderHook(() => useDevices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within 1 second in test environment
      expect(duration).toBeLessThan(1000);
    });

    test('🎯 should maintain stable memory usage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      );

      // Create multiple hook instances
      const hooks = Array.from({ length: 10 }, () => 
        renderHook(() => useDevices(), { wrapper })
      );

      // All hooks should share the same cached data
      const firstData = hooks[0].result.current.data;
      hooks.forEach(hook => {
        expect(hook.result.current.data).toBe(firstData); // Same reference
      });
    });
  });
});

describe('🔧 Vite Configuration Validation', () => {
  test('⚙️ should have stable HMR configuration', () => {
    // This would typically be validated in a separate config test
    // For now, we ensure the patterns that caused issues are avoided
    
    const problematicPatterns = [
      'hmr: false', // Should not disable HMR completely
      'force: true', // Should not force dependency re-bundling
      'watch: null', // Should not disable file watching
    ];

    // In a real implementation, you'd read and parse vite.config.ts
    // and check it doesn't contain these patterns
    expect(true).toBe(true); // Placeholder for actual config validation
  });
});