import {
  TVInterface,
  CreateTVInterfaceData,
  UpdateTVInterfaceData,
  TVInterfaceFilters,
  TVInterfaceApiResponse,
  TVInterfaceListResponse,
} from "@/types/tvInterface";
import { apiClient, handleApiError } from "./client";

// API endpoint base
const API_ENDPOINT = "/v1/tv-interfaces";

// TV Interface API service
export const tvInterfacesAPI = {
  // Получить все TV интерфейсы
  async getAll(filters?: TVInterfaceFilters): Promise<TVInterfaceListResponse> {
    try {
      const response = await apiClient.get<TVInterfaceListResponse>(
        API_ENDPOINT,
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

  // Получить TV интерфейс по ID
  async getById(id: string): Promise<TVInterfaceApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      const response = await apiClient.get<TVInterfaceApiResponse>(
        `${API_ENDPOINT}/${id}`,
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Получить TV интерфейсы по deviceId
  async getByDeviceId(deviceId: string): Promise<TVInterfaceListResponse> {
    try {
      if (!deviceId) {
        return {
          success: false,
          error: "ID устройства обязателен",
        };
      }

      const response = await apiClient.get<TVInterfaceListResponse>(
        `${API_ENDPOINT}/device/${deviceId}`,
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

  // Создать новый TV интерфейс
  async create(data: CreateTVInterfaceData): Promise<TVInterfaceApiResponse> {
    try {
      // Валидация на фронтенде
      if (!data.name?.trim()) {
        return {
          success: false,
          error: "Название интерфейса обязательно",
        };
      }

      if (!data.type) {
        return {
          success: false,
          error: "Тип интерфейса обязателен",
        };
      }

      if (!data.deviceId) {
        return {
          success: false,
          error: "Выберите устройство",
        };
      }

      // Подготавливаем данные для отправки на бэкенд
      const requestData = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
        type: data.type,
        device_id: data.deviceId,
        screenshot_data: data.screenshotData,
        clickable_areas: data.clickableAreas || [],
        highlight_areas: data.highlightAreas || [],
      };

      const response = await apiClient.post<TVInterfaceApiResponse>(
        API_ENDPOINT,
        requestData,
      );

      return {
        success: true,
        data: response.data,
        message: response.message || "TV интерфейс успешно создан",
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Обновить TV интерфейс
  async update(
    id: string,
    data: UpdateTVInterfaceData,
  ): Promise<TVInterfaceApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      // Подготавливаем данные для отправки на бэкенд
      const requestData: Record<string, any> = {};

      if (data.name !== undefined) requestData.name = data.name.trim();
      if (data.description !== undefined)
        requestData.description = data.description?.trim() || "";
      if (data.type !== undefined) requestData.type = data.type;
      if (data.deviceId !== undefined) requestData.device_id = data.deviceId;
      if (data.screenshotData !== undefined)
        requestData.screenshot_data = data.screenshotData;
      if (data.clickableAreas !== undefined)
        requestData.clickable_areas = data.clickableAreas;
      if (data.highlightAreas !== undefined)
        requestData.highlight_areas = data.highlightAreas;
      if (data.isActive !== undefined) requestData.is_active = data.isActive;

      const response = await apiRequest<TVInterfaceApiResponse>(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(requestData),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || "TV интерфейс успешно обновлен",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при обновлении TV интерфейса",
      };
    }
  },

  // Удалить TV интерфейс
  async delete(id: string): Promise<TVInterfaceApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceApiResponse>(`/${id}`, {
        method: "DELETE",
      });

      return {
        success: true,
        message: response.message || "TV интерфейс успешно удален",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при удалении TV интерфейса",
      };
    }
  },

  // Активировать/деактивировать TV интерфейс
  async toggleStatus(id: string): Promise<TVInterfaceApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceApiResponse>(
        `/${id}/toggle`,
        {
          method: "PATCH",
        },
      );

      return {
        success: true,
        data: response.data,
        message: response.message || "Статус TV интерфейса изменен",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при изменении статуса TV интерфейса",
      };
    }
  },

  // Дублировать TV интерфейс
  async duplicate(
    id: string,
    newName?: string,
  ): Promise<TVInterfaceApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      const requestData = newName ? { name: newName } : {};

      const response = await apiRequest<TVInterfaceApiResponse>(
        `/${id}/duplicate`,
        {
          method: "POST",
          body: JSON.stringify(requestData),
        },
      );

      return {
        success: true,
        data: response.data,
        message: response.message || "TV интерфейс успешно дублирован",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при дублировании TV интерфейса",
      };
    }
  },

  // Получить статистику TV интерфейсов
  async getStats(): Promise<TVInterfaceApiResponse> {
    try {
      const response = await apiRequest<TVInterfaceApiResponse>("/stats");

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
            : "Ошибка при получении статистики TV интерфейсов",
      };
    }
  },

  // Экспортировать TV интерфейс
  async export(id: string): Promise<TVInterfaceApiResponse> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID TV интерфейса обязателен",
        };
      }

      const response = await apiRequest<TVInterfaceApiResponse>(
        `/${id}/export`,
      );

      return {
        success: true,
        data: response.data,
        message: response.message || "TV интерфейс успешно экспортирован",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при экспорте TV интерфейса",
      };
    }
  },
};

export default tvInterfacesAPI;
