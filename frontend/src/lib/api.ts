import axios from 'axios';
import { ApiResponse, EventSearch, Pagination } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const eventsApi = {
  search: async (query: string): Promise<EventSearch> => {
    const { data } = await apiClient.post<ApiResponse<EventSearch>>('/events/search', { query });
    if (!data.success || !data.data) throw new Error(data.message || 'Search failed');
    return data.data;
  },

  getHistory: async (page = 1, limit = 10): Promise<{ events: EventSearch[]; pagination: Pagination }> => {
    const { data } = await apiClient.get<ApiResponse<EventSearch[]>>('/events/history', {
      params: { page, limit },
    });
    if (!data.success) throw new Error(data.message || 'Failed to load history');
    return { events: data.data || [], pagination: data.pagination! };
  },

  getById: async (id: string): Promise<EventSearch> => {
    const { data } = await apiClient.get<ApiResponse<EventSearch>>(`/events/${id}`);
    if (!data.success || !data.data) throw new Error(data.message || 'Not found');
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/events/${id}`);
    if (!data.success) throw new Error(data.message || 'Delete failed');
  },

  getStats: async (): Promise<{ totalSearches: number; searchesToday: number }> => {
    const { data } = await apiClient.get<ApiResponse<{ totalSearches: number; searchesToday: number }>>('/events/stats');
    if (!data.success || !data.data) throw new Error('Failed to load stats');
    return data.data;
  },
};
