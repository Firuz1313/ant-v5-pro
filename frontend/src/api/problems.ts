import { apiClient } from "./client";
import {
  Problem,
  APIResponse,
  PaginatedResponse,
  FilterOptions,
} from "../types";

export interface ProblemFilters extends FilterOptions {
  deviceId?: string;
  category?: "critical" | "moderate" | "minor" | "other";
  status?: "draft" | "published" | "archived";
  includeDetails?: boolean;
  admin?: boolean;
}

export interface ProblemCreateData {
  id?: string;
  deviceId: string;
  title: string;
  description?: string;
  category?: "critical" | "moderate" | "minor" | "other";
  icon?: string;
  color?: string;
  tags?: string[];
  priority?: number;
  estimatedTime?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  successRate?: number;
  status?: "draft" | "published" | "archived";
  metadata?: Record<string, any>;
}

export interface ProblemUpdateData extends Partial<ProblemCreateData> {
  completedCount?: number;
  isActive?: boolean;
}

export interface ProblemStats {
  total: number;
  active: number;
  published: number;
  draft: number;
  critical: number;
  moderate: number;
  minor: number;
  avgSuccessRate: number;
  totalCompletions: number;
}

export interface ProblemWithDetails extends Problem {
  deviceName?: string;
  deviceBrand?: string;
  deviceModel?: string;
  deviceColor?: string;
  stepsCount?: number;
  activeStepsCount?: number;
  sessionsCount?: number;
  successfulSessionsCount?: number;
  avgCompletionTime?: number;
}

export class ProblemsApi {
  private readonly basePath = "/problems";

  /**
   * Получение списка проблем
   */
  async getProblems(
    page: number = 1,
    limit: number = 20,
    filters: ProblemFilters = {},
  ): Promise<PaginatedResponse<ProblemWithDetails>> {
    return apiClient.get<PaginatedResponse<ProblemWithDetails>>(this.basePath, {
      params: {
        page,
        limit,
        ...filters,
      },
    });
  }

  /**
   * Получение проблемы по ID
   */
  async getProblem(
    id: string,
    includeDetails: boolean = false,
  ): Promise<APIResponse<ProblemWithDetails>> {
    return apiClient.get<APIResponse<ProblemWithDetails>>(
      `${this.basePath}/${id}`,
      {
        params: { include_details: includeDetails },
      },
    );
  }

  /**
   * Создание новой проблемы
   */
  async createProblem(data: ProblemCreateData): Promise<APIResponse<Problem>> {
    // Маппинг полей для соответствия backend API
    const backendData = {
      device_id: data.deviceId,
      title: data.title,
      description: data.description,
      category: data.category,
      icon: data.icon,
      color: data.color,
      tags: data.tags,
      priority: data.priority,
      estimated_time: data.estimatedTime,
      difficulty: data.difficulty,
      success_rate: data.successRate,
      status: data.status,
      metadata: data.metadata
    };

    console.log('📤 Отправка данных проблемы:', backendData);
    return apiClient.post<APIResponse<Problem>>(this.basePath, backendData);
  }

  /**
   * Обновление проблемы
   */
  async updateProblem(
    id: string,
    data: ProblemUpdateData,
  ): Promise<APIResponse<Problem>> {
    // Маппинг полей для соответствия backend API
    const backendData: any = {};

    if (data.deviceId !== undefined) backendData.device_id = data.deviceId;
    if (data.title !== undefined) backendData.title = data.title;
    if (data.description !== undefined) backendData.description = data.description;
    if (data.category !== undefined) backendData.category = data.category;
    if (data.icon !== undefined) backendData.icon = data.icon;
    if (data.color !== undefined) backendData.color = data.color;
    if (data.tags !== undefined) backendData.tags = data.tags;
    if (data.priority !== undefined) backendData.priority = data.priority;
    if (data.estimatedTime !== undefined) backendData.estimated_time = data.estimatedTime;
    if (data.difficulty !== undefined) backendData.difficulty = data.difficulty;
    if (data.successRate !== undefined) backendData.success_rate = data.successRate;
    if (data.status !== undefined) backendData.status = data.status;
    if (data.completedCount !== undefined) backendData.completed_count = data.completedCount;
    if (data.isActive !== undefined) backendData.is_active = data.isActive;
    if (data.metadata !== undefined) backendData.metadata = data.metadata;

    console.log('📤 Обновление данных проблемы:', backendData);
    return apiClient.put<APIResponse<Problem>>(`${this.basePath}/${id}`, backendData);
  }

  /**
   * Удаление проблемы
   */
  async deleteProblem(
    id: string,
    force: boolean = false,
  ): Promise<APIResponse<Problem>> {
    return apiClient.delete<APIResponse<Problem>>(`${this.basePath}/${id}`, {
      params: { force },
    });
  }

  /**
   * Восстановление архивированной проблемы
   */
  async restoreProblem(id: string): Promise<APIResponse<Problem>> {
    return apiClient.post<APIResponse<Problem>>(
      `${this.basePath}/${id}/restore`,
    );
  }

  /**
   * Поиск проблем
   */
  async searchProblems(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<APIResponse<ProblemWithDetails[]>> {
    return apiClient.get<APIResponse<ProblemWithDetails[]>>(
      `${this.basePath}/search`,
      {
        params: { q: query, limit, offset },
      },
    );
  }

  /**
   * Получение популярных проблем
   */
  async getPopularProblems(
    limit: number = 10,
  ): Promise<APIResponse<ProblemWithDetails[]>> {
    return apiClient.get<APIResponse<ProblemWithDetails[]>>(
      `${this.basePath}/popular`,
      {
        params: { limit },
      },
    );
  }

  /**
   * Получение проблем по устройству
   */
  async getProblemsByDevice(
    deviceId: string,
    status?: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<APIResponse<ProblemWithDetails[]>> {
    return apiClient.get<APIResponse<ProblemWithDetails[]>>(
      `${this.basePath}/device/${deviceId}`,
      {
        params: { status, limit, offset },
      },
    );
  }

  /**
   * Получение проблем по категории
   */
  async getProblemsByCategory(
    category: string,
    deviceId?: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<APIResponse<ProblemWithDetails[]>> {
    return apiClient.get<APIResponse<ProblemWithDetails[]>>(
      `${this.basePath}/category/${category}`,
      {
        params: { device_id: deviceId, limit, offset },
      },
    );
  }

  /**
   * Дублирование проблемы
   */
  async duplicateProblem(
    id: string,
    targetDeviceId?: string,
  ): Promise<APIResponse<Problem>> {
    return apiClient.post<APIResponse<Problem>>(
      `${this.basePath}/${id}/duplicate`,
      {
        target_device_id: targetDeviceId,
      },
    );
  }

  /**
   * Публикация проблемы
   */
  async publishProblem(id: string): Promise<APIResponse<Problem>> {
    return apiClient.post<APIResponse<Problem>>(
      `${this.basePath}/${id}/publish`,
    );
  }

  /**
   * Снятие проблемы с публикации
   */
  async unpublishProblem(id: string): Promise<APIResponse<Problem>> {
    return apiClient.post<APIResponse<Problem>>(
      `${this.basePath}/${id}/unpublish`,
    );
  }

  /**
   * Обновление статистики проблемы
   */
  async updateProblemStats(
    id: string,
    sessionResult: "success" | "failure",
  ): Promise<APIResponse<Problem>> {
    return apiClient.post<APIResponse<Problem>>(
      `${this.basePath}/${id}/update-stats`,
      {
        session_result: sessionResult,
      },
    );
  }

  /**
   * Получение статистики проблем
   */
  async getProblemStats(): Promise<APIResponse<ProblemStats>> {
    return apiClient.get<APIResponse<ProblemStats>>(`${this.basePath}/stats`);
  }

  /**
   * Экспорт проблем
   */
  async exportProblems(
    format: string = "json",
    deviceId?: string,
    includeSteps: boolean = false,
  ): Promise<APIResponse<ProblemWithDetails[]>> {
    return apiClient.get<APIResponse<ProblemWithDetails[]>>(
      `${this.basePath}/export`,
      {
        params: { format, device_id: deviceId, include_steps: includeSteps },
      },
    );
  }
}

// Export singleton instance
export const problemsApi = new ProblemsApi();
export default problemsApi;
