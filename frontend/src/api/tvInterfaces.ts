import {
  TVInterface,
  CreateTVInterfaceData,
  UpdateTVInterfaceData,
  TVInterfaceFilters,
  TVInterfaceApiResponse,
  TVInterfaceListResponse,
} from "@/types/tvInterface";

// Базовый URL для API
const API_BASE_URL = "/api/v1/tv-interfaces";

// Функция для повторных попыток
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Если это сетевая ошибка и не последняя попытка, повторяем
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch") &&
        attempt < maxRetries
      ) {
        console.warn(
          `🔄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        continue;
      }

      // Если это не сетевая ошибка или последняя попытка, прекращаем
      throw error;
    }
  }

  throw lastError!;
};

// Helper функция для HTTP запросов
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    timeout: 30000, // 30 секунд
    ...options,
  };

  try {
    // Добавляем отладочную информацию
    console.log(`🔄 API Request: ${options.method || "GET"} ${url}`);

    const response = await fetch(url, defaultOptions);

    console.log(`✅ API Response: ${response.status} for ${url}`);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const errorMessage =
        errorData.error ||
        errorData.message ||
        `HTTP error! status: ${response.status} (${response.statusText})`;
      console.error(`❌ API Error: ${errorMessage} for ${url}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`📦 API Data received for ${url}:`, {
      size: JSON.stringify(data).length,
    });
    return data;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      console.error(`🌐 Network Error for ${url}:`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
        url,
        options: defaultOptions,
      });
      throw new Error(
        `Сетевая ошибка: Не удается подключиться к серверу. Проверьте интернет-соединение.`,
      );
    }

    console.error(`💥 API Request failed for ${url}:`, {
      error: error.message,
      type: error.constructor.name,
      url,
      options: defaultOptions,
    });
    throw error;
  }
};

// Построение query параметров
const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// TV Interface API service
export const tvInterfacesAPI = {
  // Получить все TV интерфейсы
  async getAll(filters?: TVInterfaceFilters): Promise<TVInterfaceListResponse> {
    try {
      const queryParams = buildQueryParams(filters || {});
      const response = await withRetry(() =>
        apiRequest<TVInterfaceListResponse>(`${queryParams}`),
      );

      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке TV интерфейсов",
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

      const response = await apiRequest<TVInterfaceApiResponse>(`/${id}`);

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
            : "Ошибка при загрузке TV интерфейса",
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

      const response = await withRetry(() =>
        apiRequest<TVInterfaceListResponse>(`/device/${deviceId}`),
      );

      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке TV интерфейсов для устройства",
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

      const response = await apiRequest<TVInterfaceApiResponse>("", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || "TV интерфейс успешно создан",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при создании TV интерфейса",
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
