import { apiClient } from './client';
import { Step, APIResponse, PaginatedResponse, FilterOptions } from '../types';

export interface StepFilters extends FilterOptions {
  problemId?: string;
  deviceId?: string;
  includeDetails?: boolean;
}

export interface StepCreateData {
  id?: string;
  problemId: string;
  deviceId: string;
  stepNumber?: number;
  title: string;
  description?: string;
  instruction: string;
  estimatedTime?: number;
  highlightRemoteButton?: string;
  highlightTVArea?: string;
  tvInterfaceId?: string;
  remoteId?: string;
  actionType?: string;
  buttonPosition?: { x: number; y: number };
  svgPath?: string;
  zoneId?: string;
  requiredAction?: string;
  validationRules?: any[];
  successCondition?: string;
  failureActions?: any[];
  hint?: string;
  warningText?: string;
  successText?: string;
  media?: any[];
  nextStepConditions?: any[];
  metadata?: Record<string, any>;
}

export interface StepUpdateData extends Partial<StepCreateData> {
  isActive?: boolean;
}

export interface StepWithDetails extends Step {
  remoteName?: string;
  remoteManufacturer?: string;
  remoteModel?: string;
  tvInterfaceName?: string;
  tvInterfaceType?: string;
  problemTitle?: string;
  problemDeviceId?: string;
  deviceName?: string;
  deviceBrand?: string;
  remoteImageData?: string;
  remoteDimensions?: { width: number; height: number };
  tvScreenshotData?: string;
}

export interface StepUsageStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  skippedExecutions: number;
  avgTimeSpent: number | null;
  minTimeSpent: number | null;
  maxTimeSpent: number | null;
  successRate: number;
}

export interface StepOrderValidation {
  isValid: boolean;
  duplicates: Array<{ step_number: number; count: number }>;
}

export interface StepReorderRequest {
  problemId: string;
  stepIds: string[];
}

export interface StepInsertRequest {
  problemId: string;
  afterStepNumber: number;
  [key: string]: any;
}

export class StepsApi {
  private readonly basePath = '/v1/steps';

  /**
   * Получение списка шагов
   */
  async getSteps(
    page: number = 1,
    limit: number = 20,
    filters: StepFilters = {}
  ): Promise<PaginatedResponse<StepWithDetails>> {
    return apiClient.get<PaginatedResponse<StepWithDetails>>(this.basePath, {
      params: {
        page,
        limit,
        ...filters,
      },
    });
  }

  /**
   * Получение шага по ID
   */
  async getStep(
    id: string,
    includeDetails: boolean = false,
    includeStats: boolean = false
  ): Promise<APIResponse<StepWithDetails & { usageStats?: StepUsageStats }>> {
    return apiClient.get<APIResponse<StepWithDetails & { usageStats?: StepUsageStats }>>(
      `${this.basePath}/${id}`,
      {
        params: { include_details: includeDetails, include_stats: includeStats },
      }
    );
  }

  /**
   * Создание нового шага
   */
  async createStep(data: StepCreateData): Promise<APIResponse<Step>> {
    return apiClient.post<APIResponse<Step>>(this.basePath, data);
  }

  /**
   * Обновление шага
   */
  async updateStep(
    id: string,
    data: StepUpdateData
  ): Promise<APIResponse<Step>> {
    return apiClient.put<APIResponse<Step>>(`${this.basePath}/${id}`, data);
  }

  /**
   * Удаление шага
   */
  async deleteStep(
    id: string,
    force: boolean = false,
    reorder: boolean = true
  ): Promise<APIResponse<Step>> {
    return apiClient.delete<APIResponse<Step>>(`${this.basePath}/${id}`, {
      params: { force, reorder },
    });
  }

  /**
   * Восстановление архивированного шага
   */
  async restoreStep(id: string): Promise<APIResponse<Step>> {
    return apiClient.post<APIResponse<Step>>(`${this.basePath}/${id}/restore`);
  }

  /**
   * Получение шагов по проблеме
   */
  async getStepsByProblem(
    problemId: string,
    isActive: boolean = true
  ): Promise<APIResponse<StepWithDetails[]>> {
    return apiClient.get<APIResponse<StepWithDetails[]>>(
      `${this.basePath}/problem/${problemId}`,
      {
        params: { is_active: isActive },
      }
    );
  }

  /**
   * Поиск шагов
   */
  async searchSteps(
    query: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<APIResponse<StepWithDetails[]>> {
    return apiClient.get<APIResponse<StepWithDetails[]>>(`${this.basePath}/search`, {
      params: { q: query, limit, offset },
    });
  }

  /**
   * Переупорядочивание шагов
   */
  async reorderSteps(
    problemId: string,
    stepIds: string[]
  ): Promise<APIResponse<Step[]>> {
    return apiClient.put<APIResponse<Step[]>>(`${this.basePath}/reorder`, {
      problem_id: problemId,
      step_ids: stepIds,
    });
  }

  /**
   * Вставка шага между существующими шагами
   */
  async insertStep(
    problemId: string,
    afterStepNumber: number,
    stepData: Omit<StepCreateData, 'problemId'>
  ): Promise<APIResponse<Step>> {
    return apiClient.post<APIResponse<Step>>(`${this.basePath}/insert`, {
      problem_id: problemId,
      after_step_number: afterStepNumber,
      ...stepData,
    });
  }

  /**
   * Дублирование шага
   */
  async duplicateStep(
    id: string,
    targetProblemId?: string
  ): Promise<APIResponse<Step>> {
    return apiClient.post<APIResponse<Step>>(`${this.basePath}/${id}/duplicate`, {
      target_problem_id: targetProblemId,
    });
  }

  /**
   * Получение следующего шага
   */
  async getNextStep(id: string): Promise<APIResponse<Step>> {
    return apiClient.get<APIResponse<Step>>(`${this.basePath}/${id}/next`);
  }

  /**
   * Получение предыдущего шага
   */
  async getPreviousStep(id: string): Promise<APIResponse<Step>> {
    return apiClient.get<APIResponse<Step>>(`${this.basePath}/${id}/previous`);
  }

  /**
   * Получение статистики использования шага
   */
  async getStepStats(id: string): Promise<APIResponse<StepUsageStats>> {
    return apiClient.get<APIResponse<StepUsageStats>>(`${this.basePath}/${id}/stats`);
  }

  /**
   * Валидация порядка шагов в проблеме
   */
  async validateStepOrder(problemId: string): Promise<APIResponse<StepOrderValidation>> {
    return apiClient.get<APIResponse<StepOrderValidation>>(
      `${this.basePath}/validate/${problemId}`
    );
  }

  /**
   * Автоматическое исправление нумерации шагов
   */
  async fixStepNumbering(problemId: string): Promise<APIResponse<Step[]>> {
    return apiClient.post<APIResponse<Step[]>>(
      `${this.basePath}/fix-numbering/${problemId}`
    );
  }
}

// Export singleton instance
export const stepsApi = new StepsApi();
export default stepsApi;
