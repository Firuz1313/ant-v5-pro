// TV Interface Marks API Client
import { apiClient, handleApiError } from "./client";

// API endpoint base
const API_ENDPOINT = "/v1/tv-interface-marks";

// Types
export interface TVInterfaceMark {
  id: string;
  tv_interface_id: string;
  step_id?: string;
  name: string;
  description: string;
  mark_type: "point" | "zone" | "area";
  shape: "circle" | "rectangle" | "polygon" | "ellipse";
  position: { x: number; y: number };
  size?: { width: number; height: number };
  coordinates?: { x: number; y: number }[];
  color: string;
  background_color?: string;
  border_color?: string;
  border_width: number;
  opacity: number;
  is_clickable: boolean;
  is_highlightable: boolean;
  click_action?: string;
  hover_action?: string;
  action_value?: string;
  action_description?: string;
  expected_result?: string;
  hint_text?: string;
  tooltip_text?: string;
  warning_text?: string;
  animation?: "pulse" | "glow" | "bounce" | "shake" | "fade" | "blink" | "none";
  animation_duration?: number;
  animation_delay?: number;
  display_order: number;
  priority: "low" | "normal" | "high" | "critical";
  is_active: boolean;
  is_visible: boolean;
  metadata?: Record<string, any>;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTVInterfaceMarkData {
  tv_interface_id: string;
  step_id?: string;
  name: string;
  description?: string;
  mark_type?: "point" | "zone" | "area";
  shape?: "circle" | "rectangle" | "polygon" | "ellipse";
  position: { x: number; y: number };
  size?: { width: number; height: number };
  coordinates?: { x: number; y: number }[];
  color?: string;
  background_color?: string;
  border_color?: string;
  border_width?: number;
  opacity?: number;
  is_clickable?: boolean;
  is_highlightable?: boolean;
  click_action?: string;
  hover_action?: string;
  action_value?: string;
  action_description?: string;
  expected_result?: string;
  hint_text?: string;
  tooltip_text?: string;
  warning_text?: string;
  animation?: "pulse" | "glow" | "bounce" | "shake" | "fade" | "blink" | "none";
  animation_duration?: number;
  animation_delay?: number;
  display_order?: number;
  priority?: "low" | "normal" | "high" | "critical";
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface UpdateTVInterfaceMarkData extends Partial<CreateTVInterfaceMarkData> {
  is_active?: boolean;
  is_visible?: boolean;
}

export interface TVInterfaceMarkFilters {
  is_active?: boolean;
  is_visible?: boolean;
  mark_type?: "point" | "zone" | "area";
  step_id?: string;
}

export interface TVInterfaceMarkApiResponse {
  success: boolean;
  data?: TVInterfaceMark;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface TVInterfaceMarkListResponse {
  success: boolean;
  data?: TVInterfaceMark[];
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface TVInterfaceMarkStatsResponse {
  success: boolean;
  data?: {
    total: number;
    active: number;
    visible: number;
    points: number;
    zones: number;
    areas: number;
    interfaces_with_marks: number;
    steps_with_marks: number;
  };
  error?: string;
  message?: string;
  timestamp?: string;
}

// TV Interface Marks API service

// TV Interface Marks API service
export const tvInterfaceMarksAPI = {
  // Get marks by TV interface ID
  async getByTVInterfaceId(
    tvInterfaceId: string,
    filters?: TVInterfaceMarkFilters,
  ): Promise<TVInterfaceMarkListResponse> {
    try {
      const response = await apiClient.get<TVInterfaceMarkListResponse>(
        `${API_ENDPOINT}/tv-interface/${tvInterfaceId}`,
        { params: filters },
      );

      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Get marks by step ID
  async getByStepId(stepId: string): Promise<TVInterfaceMarkListResponse> {
    try {
      const response = await apiClient.get<TVInterfaceMarkListResponse>(
        `${API_ENDPOINT}/step/${stepId}`,
      );

      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Get mark by ID
  async getById(id: string): Promise<TVInterfaceMarkApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID отметки обязателен",
        };
      }

      const response = await apiClient.get<TVInterfaceMarkApiResponse>(
        `${API_ENDPOINT}/${id}`,
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке отметки",
      };
    }
  },

  // Create new mark
  async create(data: CreateTVInterfaceMarkData): Promise<TVInterfaceMarkApiResponse> {
    try {
      // Frontend validation
      if (!data.tv_interface_id) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      if (!data.name?.trim()) {
        return {
          success: false,
          error: "Название отметки обязательно",
        };
      }

      if (!data.position || typeof data.position !== "object") {
        return {
          success: false,
          error: "Позиция отметки обязательна",
        };
      }

      const response = await apiRequest<TVInterfaceMarkApiResponse>("", {
        method: "POST",
        body: JSON.stringify(data),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || "Отметка успешно создана",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при создании ��тметки",
      };
    }
  },

  // Update mark
  async update(
    id: string,
    data: UpdateTVInterfaceMarkData,
  ): Promise<TVInterfaceMarkApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID отметки обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceMarkApiResponse>(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || "Отметка успешно обновлена",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при обновлении отметки",
      };
    }
  },

  // Delete mark
  async delete(id: string): Promise<TVInterfaceMarkApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID отметки обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceMarkApiResponse>(`/${id}`, {
        method: "DELETE",
      });

      return {
        success: true,
        message: response.message || "Отметка успешно удалена",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при удалении отметки",
      };
    }
  },

  // Delete all marks for TV interface
  async deleteByTVInterfaceId(tvInterfaceId: string): Promise<TVInterfaceMarkApiResponse> {
    try {
      if (!tvInterfaceId) {
        return {
          success: false,
          error: "ID TV интерф��йса обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceMarkApiResponse>(
        `/tv-interface/${tvInterfaceId}`,
        {
          method: "DELETE",
        },
      );

      return {
        success: true,
        data: response.data,
        message: response.message || "Отметки TV интерфейса удалены",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при удалении отметок TV интерфейса",
      };
    }
  },

  // Delete all marks for step
  async deleteByStepId(stepId: string): Promise<TVInterfaceMarkApiResponse> {
    try {
      if (!stepId) {
        return {
          success: false,
          error: "ID шага обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceMarkApiResponse>(
        `/step/${stepId}`,
        {
          method: "DELETE",
        },
      );

      return {
        success: true,
        data: response.data,
        message: response.message || "Отметки шага удалены",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при удалении отметок шага",
      };
    }
  },

  // Reorder marks
  async reorder(
    tvInterfaceId: string,
    markIds: string[],
  ): Promise<TVInterfaceMarkApiResponse> {
    try {
      if (!tvInterfaceId) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      if (!Array.isArray(markIds)) {
        return {
          success: false,
          error: "Массив ID отметок обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceMarkApiResponse>(
        `/tv-interface/${tvInterfaceId}/reorder`,
        {
          method: "PUT",
          body: JSON.stringify({ mark_ids: markIds }),
        },
      );

      return {
        success: true,
        message: response.message || "Порядок отметок обновлен",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при изменении порядка отметок",
      };
    }
  },

  // Get marks statistics
  async getStats(): Promise<TVInterfaceMarkStatsResponse> {
    try {
      const response = await apiRequest<TVInterfaceMarkStatsResponse>("/stats");

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при получении статистики отметок",
      };
    }
  },
};

export default tvInterfaceMarksAPI;
