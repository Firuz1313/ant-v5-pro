import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  Device,
  Problem,
  Step,
  Remote,
  StepAction,
  DiagnosticSession,
  ChangeLog,
  SiteSettings,
  APIResponse,
  PaginatedResponse,
  FilterOptions,
  SearchResults,
  ExportOptions,
  ImportResult,
} from "@/types";

// API Service
class APIService {
  private baseURL = "/api/v1";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Generic CRUD operations
  async getAll<T>(
    entity: string,
    filters?: FilterOptions,
  ): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<T[]>(`/${entity}${query}`);
  }

  async getById<T>(entity: string, id: string): Promise<APIResponse<T>> {
    return this.request<T>(`/${entity}/${id}`);
  }

  async create<T>(entity: string, data: Partial<T>): Promise<APIResponse<T>> {
    return this.request<T>(`/${entity}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update<T>(
    entity: string,
    id: string,
    data: Partial<T>,
  ): Promise<APIResponse<T>> {
    return this.request<T>(`/${entity}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(entity: string, id: string): Promise<APIResponse<void>> {
    return this.request<void>(`/${entity}/${id}`, {
      method: "DELETE",
    });
  }
}

// Default data for development
const defaultDevices: Device[] = [
  {
    id: "openbox",
    name: "OpenBox",
    brand: "OpenBox",
    model: "Standard",
    description: "Стандартные ��риставки OpenBox для цифрового телевидения",
    color: "from-blue-500 to-blue-600",
    order: 1,
    status: "active",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "uclan",
    name: "UCLAN",
    brand: "UCLAN",
    model: "HD Series",
    description: "Высококачественные HD приставки UCLAN",
    color: "from-green-500 to-green-600",
    order: 2,
    status: "active",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "hdbox",
    name: "HDBox",
    brand: "HDBox",
    model: "Pro",
    description: "Профессиональные приставки HDBox",
    color: "from-purple-500 to-purple-600",
    order: 3,
    status: "active",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "openbox_gold",
    name: "OpenBox Gold",
    brand: "OpenBox",
    model: "Gold Edition",
    description: "Премиум приставки OpenBox Gold с расширенными возможностями",
    color: "from-yellow-500 to-yellow-600",
    order: 4,
    status: "active",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
];

const defaultSiteSettings: SiteSettings = {
  id: "settings",
  siteName: "ANT Support",
  siteDescription:
    "Профессиональ��ая платформа для диагностики цифр��вых ТВ-приставок",
  defaultLanguage: "ru",
  supportedLanguages: ["ru", "tj", "uz"],
  theme: "professional",
  primaryColor: "#3b82f6",
  accentColor: "#10b981",
  enableAnalytics: true,
  enableFeedback: true,
  enableOfflineMode: false,
  enableNotifications: true,
  maxStepsPerProblem: 20,
  maxMediaSize: 10,
  sessionTimeout: 30,
  apiSettings: {
    baseUrl: "/api/v1",
    timeout: 30000,
    retryAttempts: 3,
    rateLimiting: true,
    caching: true,
    compression: true,
  },
  emailSettings: {
    enabled: false,
  },
  storageSettings: {
    provider: "local",
    maxFileSize: 10485760, // 10MB
    allowedFormats: ["jpg", "jpeg", "png", "gif", "svg", "mp4", "webm"],
    compression: true,
  },
  isActive: true,
  createdAt: "2024-01-15T00:00:00Z",
  updatedAt: "2024-01-20T00:00:00Z",
};

// Context interface
interface DataContextType {
  // API service
  api: APIService;

  // Loading states
  loading: {
    devices: boolean;
    problems: boolean;
    steps: boolean;
    remotes: boolean;
    stepActions: boolean;
  };

  // Error states
  errors: {
    devices?: string;
    problems?: string;
    steps?: string;
    remotes?: string;
    stepActions?: string;
  };

  // Data
  devices: Device[];
  problems: Problem[];
  steps: Step[];
  remotes: Remote[];
  stepActions: StepAction[];
  sessions: DiagnosticSession[];
  changeLogs: ChangeLog[];
  siteSettings: SiteSettings;

  // CRUD operations
  createDevice: (data: Partial<Device>) => Promise<Device>;
  updateDevice: (id: string, data: Partial<Device>) => Promise<Device>;
  deleteDevice: (id: string) => Promise<void>;
  getDevice: (id: string) => Device | undefined;
  getDeviceById: (id: string) => Device | undefined; // Alias for getDevice

  createProblem: (data: Partial<Problem>) => Promise<Problem>;
  updateProblem: (id: string, data: Partial<Problem>) => Promise<Problem>;
  deleteProblem: (id: string) => Promise<void>;
  getProblem: (id: string) => Problem | undefined;

  createStep: (data: Partial<Step>) => Promise<Step>;
  updateStep: (id: string, data: Partial<Step>) => Promise<Step>;
  deleteStep: (id: string) => Promise<void>;
  getStep: (id: string) => Step | undefined;
  reorderSteps: (problemId: string, stepIds: string[]) => Promise<void>;

  createRemote: (data: Partial<Remote>) => Promise<Remote>;
  updateRemote: (id: string, data: Partial<Remote>) => Promise<Remote>;
  deleteRemote: (id: string) => Promise<void>;
  getRemote: (id: string) => Remote | undefined;
  getRemoteById: (id: string) => Remote | undefined; // Alias for getRemote
  getDefaultRemote: () => Remote | undefined;
  getDefaultRemoteForDevice: (deviceId: string) => Remote | undefined;
  getRemoteUsageCount: (remoteId: string) => number;
  canDeleteRemote: (remoteId: string) => {
    canDelete: boolean;
    reason?: string;
  };
  getActiveRemotes: () => Remote[];

  // Relationship queries
  getActiveDevices: () => Device[];
  getDeviceProblems: (deviceId: string) => Problem[];
  getProblemsForDevice: (deviceId: string) => Problem[]; // Alias for getDeviceProblems
  getProblemSteps: (problemId: string) => Step[];
  getStepsForProblem: (problemId: string) => Step[]; // Alias for getProblemSteps
  getDeviceRemotes: (deviceId: string) => Remote[];
  getRemotesForDevice: (deviceId: string) => Remote[]; // Alias for getDeviceRemotes
  getStepActions: (stepId: string) => StepAction[];

  // Bulk operations
  bulkUpdateDevices: (
    updates: { id: string; data: Partial<Device> }[],
  ) => Promise<Device[]>;
  bulkDeleteProblems: (ids: string[]) => Promise<void>;
  duplicateProblem: (
    problemId: string,
    targetDeviceId?: string,
  ) => Promise<Problem>;

  // Search and filtering
  searchDevices: (
    query: string,
    filters?: FilterOptions,
  ) => Promise<SearchResults<Device>>;
  searchProblems: (
    query: string,
    filters?: FilterOptions,
  ) => Promise<SearchResults<Problem>>;
  searchSteps: (
    query: string,
    filters?: FilterOptions,
  ) => Promise<SearchResults<Step>>;

  // Import/Export
  exportData: (options: ExportOptions) => Promise<{ downloadUrl: string }>;
  importData: (file: File, options: any) => Promise<ImportResult>;

  // Analytics and sessions
  createSession: (
    sessionData: Partial<DiagnosticSession>,
  ) => Promise<DiagnosticSession>;
  updateSession: (
    sessionId: string,
    data: Partial<DiagnosticSession>,
  ) => Promise<DiagnosticSession>;
  getActiveSessions: () => DiagnosticSession[];

  // Settings
  updateSiteSettings: (
    settings: Partial<SiteSettings>,
  ) => Promise<SiteSettings>;

  // Utilities
  refreshData: () => Promise<void>;
  clearCache: () => void;
  getEntityStats: (entity: string) => {
    total: number;
    active: number;
    inactive: number;
  };
  validateEntity: (
    entity: string,
    data: any,
  ) => { isValid: boolean; errors: string[] };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [api] = useState(new APIService());

  // Loading states
  const [loading, setLoading] = useState({
    devices: false,
    problems: false,
    steps: false,
    remotes: false,
    stepActions: false,
  });

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Data states
  const [devices, setDevices] = useState<Device[]>(() => {
    const stored = localStorage.getItem("ant-support-devices");
    return stored ? JSON.parse(stored) : defaultDevices;
  });

  const [problems, setProblems] = useState<Problem[]>(() => {
    const stored = localStorage.getItem("ant-support-problems");
    return stored ? JSON.parse(stored) : [];
  });

  const [steps, setSteps] = useState<Step[]>(() => {
    const stored = localStorage.getItem("ant-support-steps");
    return stored ? JSON.parse(stored) : [];
  });

  const [remotes, setRemotes] = useState<Remote[]>(() => {
    const stored = localStorage.getItem("ant-support-remotes");
    return stored ? JSON.parse(stored) : [];
  });

  const [stepActions, setStepActions] = useState<StepAction[]>(() => {
    const stored = localStorage.getItem("ant-support-step-actions");
    return stored ? JSON.parse(stored) : [];
  });

  const [sessions, setSessions] = useState<DiagnosticSession[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const stored = localStorage.getItem("ant-support-settings");
    return stored ? JSON.parse(stored) : defaultSiteSettings;
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem("ant-support-devices", JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem("ant-support-problems", JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem("ant-support-steps", JSON.stringify(steps));
  }, [steps]);

  useEffect(() => {
    localStorage.setItem("ant-support-remotes", JSON.stringify(remotes));
  }, [remotes]);

  useEffect(() => {
    localStorage.setItem(
      "ant-support-step-actions",
      JSON.stringify(stepActions),
    );
  }, [stepActions]);

  useEffect(() => {
    localStorage.setItem("ant-support-settings", JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Helper functions
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const createTimestamp = () => {
    return new Date().toISOString();
  };

  const logChange = (
    entityType: string,
    entityId: string,
    action: string,
    changes: any,
  ) => {
    const changeLog: ChangeLog = {
      id: generateId(),
      entityType: entityType as any,
      entityId,
      action: action as any,
      changes,
      userId: "admin", // TODO: Get from auth context
      userRole: "admin",
      isActive: true,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
    };

    setChangeLogs((prev) => [changeLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
  };

  // Device operations
  const createDevice = useCallback(
    async (data: Partial<Device>): Promise<Device> => {
      try {
        setLoading((prev) => ({ ...prev, devices: true }));

        const newDevice: Device = {
          id: generateId(),
          name: data.name || "",
          brand: data.brand || "",
          model: data.model || "",
          description: data.description || "",
          color: data.color || "from-gray-500 to-gray-600",
          order: data.order || devices.length + 1,
          status: data.status || "active",
          isActive: true,
          createdAt: createTimestamp(),
          updatedAt: createTimestamp(),
          ...data,
        };

        setDevices((prev) => [...prev, newDevice]);
        logChange("device", newDevice.id, "create", { new: newDevice });

        return newDevice;
      } catch (error) {
        console.error("Error creating device:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, devices: false }));
      }
    },
    [devices.length],
  );

  const updateDevice = useCallback(
    async (id: string, data: Partial<Device>): Promise<Device> => {
      try {
        setLoading((prev) => ({ ...prev, devices: true }));

        const oldDevice = devices.find((d) => d.id === id);
        if (!oldDevice) {
          throw new Error("Device not found");
        }

        const updatedDevice: Device = {
          ...oldDevice,
          ...data,
          updatedAt: createTimestamp(),
        };

        setDevices((prev) =>
          prev.map((d) => (d.id === id ? updatedDevice : d)),
        );
        logChange("device", id, "update", {
          old: oldDevice,
          new: updatedDevice,
        });

        return updatedDevice;
      } catch (error) {
        console.error("Error updating device:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, devices: false }));
      }
    },
    [devices],
  );

  const deleteDevice = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading((prev) => ({ ...prev, devices: true }));

        const device = devices.find((d) => d.id === id);
        if (!device) {
          throw new Error("Device not found");
        }

        // Check for dependent data
        const dependentProblems = problems.filter((p) => p.deviceId === id);
        if (dependentProblems.length > 0) {
          throw new Error(
            `Cannot delete device with ${dependentProblems.length} active problems`,
          );
        }

        setDevices((prev) => prev.filter((d) => d.id !== id));
        logChange("device", id, "delete", { old: device });
      } catch (error) {
        console.error("Error deleting device:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, devices: false }));
      }
    },
    [devices, problems],
  );

  const getDevice = useCallback(
    (id: string): Device | undefined => {
      return devices.find((d) => d.id === id);
    },
    [devices],
  );

  const getDeviceById = useCallback(
    (id: string): Device | undefined => {
      return getDevice(id);
    },
    [getDevice],
  );

  // Problem operations
  const createProblem = useCallback(
    async (data: Partial<Problem>): Promise<Problem> => {
      try {
        setLoading((prev) => ({ ...prev, problems: true }));

        const newProblem: Problem = {
          id: generateId(),
          deviceId: data.deviceId || "",
          title: data.title || "",
          description: data.description || "",
          category: data.category || "other",
          icon: data.icon || "HelpCircle",
          color: data.color || "from-blue-500 to-blue-600",
          tags: data.tags || [],
          priority: data.priority || 1,
          estimatedTime: data.estimatedTime || 5,
          difficulty: data.difficulty || "beginner",
          successRate: data.successRate || 0,
          completedCount: data.completedCount || 0,
          status: data.status || "draft",
          isActive: true,
          createdAt: createTimestamp(),
          updatedAt: createTimestamp(),
          ...data,
        };

        setProblems((prev) => [...prev, newProblem]);
        logChange("problem", newProblem.id, "create", { new: newProblem });

        return newProblem;
      } catch (error) {
        console.error("Error creating problem:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, problems: false }));
      }
    },
    [],
  );

  const updateProblem = useCallback(
    async (id: string, data: Partial<Problem>): Promise<Problem> => {
      try {
        setLoading((prev) => ({ ...prev, problems: true }));

        const oldProblem = problems.find((p) => p.id === id);
        if (!oldProblem) {
          throw new Error("Problem not found");
        }

        const updatedProblem: Problem = {
          ...oldProblem,
          ...data,
          updatedAt: createTimestamp(),
        };

        setProblems((prev) =>
          prev.map((p) => (p.id === id ? updatedProblem : p)),
        );
        logChange("problem", id, "update", {
          old: oldProblem,
          new: updatedProblem,
        });

        return updatedProblem;
      } catch (error) {
        console.error("Error updating problem:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, problems: false }));
      }
    },
    [problems],
  );

  const deleteProblem = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading((prev) => ({ ...prev, problems: true }));

        const problem = problems.find((p) => p.id === id);
        if (!problem) {
          throw new Error("Problem not found");
        }

        // Check for dependent steps
        const dependentSteps = steps.filter((s) => s.problemId === id);
        if (dependentSteps.length > 0) {
          throw new Error(
            `Cannot delete problem with ${dependentSteps.length} active steps`,
          );
        }

        setProblems((prev) => prev.filter((p) => p.id !== id));
        logChange("problem", id, "delete", { old: problem });
      } catch (error) {
        console.error("Error deleting problem:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, problems: false }));
      }
    },
    [problems, steps],
  );

  const getProblem = useCallback(
    (id: string): Problem | undefined => {
      return problems.find((p) => p.id === id);
    },
    [problems],
  );

  // Step operations
  const createStep = useCallback(
    async (data: Partial<Step>): Promise<Step> => {
      try {
        setLoading((prev) => ({ ...prev, steps: true }));

        const problemSteps = steps.filter(
          (s) => s.problemId === data.problemId,
        );
        const maxStepNumber =
          problemSteps.length > 0
            ? Math.max(...problemSteps.map((s) => s.stepNumber))
            : 0;

        const newStep: Step = {
          id: generateId(),
          problemId: data.problemId || "",
          deviceId: data.deviceId || "",
          stepNumber: data.stepNumber || maxStepNumber + 1,
          title: data.title || "",
          description: data.description || "",
          instruction: data.instruction || "",
          estimatedTime: data.estimatedTime || 30,
          isActive: true,
          createdAt: createTimestamp(),
          updatedAt: createTimestamp(),
          ...data,
        };

        setSteps((prev) => [...prev, newStep]);
        logChange("step", newStep.id, "create", { new: newStep });

        return newStep;
      } catch (error) {
        console.error("Error creating step:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, steps: false }));
      }
    },
    [steps],
  );

  const updateStep = useCallback(
    async (id: string, data: Partial<Step>): Promise<Step> => {
      try {
        setLoading((prev) => ({ ...prev, steps: true }));

        const oldStep = steps.find((s) => s.id === id);
        if (!oldStep) {
          throw new Error("Step not found");
        }

        const updatedStep: Step = {
          ...oldStep,
          ...data,
          updatedAt: createTimestamp(),
        };

        setSteps((prev) => prev.map((s) => (s.id === id ? updatedStep : s)));
        logChange("step", id, "update", { old: oldStep, new: updatedStep });

        return updatedStep;
      } catch (error) {
        console.error("Error updating step:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, steps: false }));
      }
    },
    [steps],
  );

  const deleteStep = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading((prev) => ({ ...prev, steps: true }));

        const step = steps.find((s) => s.id === id);
        if (!step) {
          throw new Error("Step not found");
        }

        setSteps((prev) => prev.filter((s) => s.id !== id));
        logChange("step", id, "delete", { old: step });
      } catch (error) {
        console.error("Error deleting step:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, steps: false }));
      }
    },
    [steps],
  );

  const getStep = useCallback(
    (id: string): Step | undefined => {
      return steps.find((s) => s.id === id);
    },
    [steps],
  );

  const reorderSteps = useCallback(
    async (problemId: string, stepIds: string[]): Promise<void> => {
      try {
        setLoading((prev) => ({ ...prev, steps: true }));

        const updatedSteps = steps.map((step) => {
          if (step.problemId === problemId) {
            const newIndex = stepIds.indexOf(step.id);
            if (newIndex >= 0) {
              return {
                ...step,
                stepNumber: newIndex + 1,
                updatedAt: createTimestamp(),
              };
            }
          }
          return step;
        });

        setSteps(updatedSteps);
        logChange("step", problemId, "reorder", { new: stepIds });
      } catch (error) {
        console.error("Error reordering steps:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, steps: false }));
      }
    },
    [steps],
  );

  // Remote operations
  const createRemote = useCallback(
    async (data: Partial<Remote>): Promise<Remote> => {
      try {
        setLoading((prev) => ({ ...prev, remotes: true }));

        const newRemote: Remote = {
          id: generateId(),
          name: data.name || "",
          manufacturer: data.manufacturer || "",
          model: data.model || "",
          description: data.description || "",
          layout: data.layout || "standard",
          colorScheme: data.colorScheme || "dark",
          dimensions: data.dimensions || { width: 200, height: 500 },
          buttons: data.buttons || [],
          zones: data.zones || [],
          isDefault: data.isDefault || false,
          usageCount: 0,
          isActive: true,
          createdAt: createTimestamp(),
          updatedAt: createTimestamp(),
          ...data,
        };

        setRemotes((prev) => [...prev, newRemote]);
        logChange("remote", newRemote.id, "create", { new: newRemote });

        return newRemote;
      } catch (error) {
        console.error("Error creating remote:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, remotes: false }));
      }
    },
    [],
  );

  const updateRemote = useCallback(
    async (id: string, data: Partial<Remote>): Promise<Remote> => {
      try {
        setLoading((prev) => ({ ...prev, remotes: true }));

        const oldRemote = remotes.find((r) => r.id === id);
        if (!oldRemote) {
          throw new Error("Remote not found");
        }

        const updatedRemote: Remote = {
          ...oldRemote,
          ...data,
          updatedAt: createTimestamp(),
        };

        setRemotes((prev) =>
          prev.map((r) => (r.id === id ? updatedRemote : r)),
        );
        logChange("remote", id, "update", {
          old: oldRemote,
          new: updatedRemote,
        });

        return updatedRemote;
      } catch (error) {
        console.error("Error updating remote:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, remotes: false }));
      }
    },
    [remotes],
  );

  const deleteRemote = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading((prev) => ({ ...prev, remotes: true }));

        const remote = remotes.find((r) => r.id === id);
        if (!remote) {
          throw new Error("Remote not found");
        }

        // Check for usage in steps
        const usedInSteps = steps.filter((s) => s.remoteId === id);
        if (usedInSteps.length > 0) {
          throw new Error(
            `Cannot delete remote used in ${usedInSteps.length} steps`,
          );
        }

        setRemotes((prev) => prev.filter((r) => r.id !== id));
        logChange("remote", id, "delete", { old: remote });
      } catch (error) {
        console.error("Error deleting remote:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, remotes: false }));
      }
    },
    [remotes, steps],
  );

  const getRemote = useCallback(
    (id: string): Remote | undefined => {
      return remotes.find((r) => r.id === id);
    },
    [remotes],
  );

  const getRemoteById = useCallback(
    (id: string): Remote | undefined => {
      return getRemote(id);
    },
    [getRemote],
  );

  // Relationship queries
  const getActiveDevices = useCallback((): Device[] => {
    return devices.filter((d) => d.isActive);
  }, [devices]);

  const getDeviceProblems = useCallback(
    (deviceId: string): Problem[] => {
      return problems.filter((p) => p.deviceId === deviceId && p.isActive);
    },
    [problems],
  );

  const getProblemsForDevice = useCallback(
    (deviceId: string): Problem[] => {
      return getDeviceProblems(deviceId);
    },
    [getDeviceProblems],
  );

  const getProblemSteps = useCallback(
    (problemId: string): Step[] => {
      return steps
        .filter((s) => s.problemId === problemId && s.isActive)
        .sort((a, b) => a.stepNumber - b.stepNumber);
    },
    [steps],
  );

  const getStepsForProblem = useCallback(
    (problemId: string): Step[] => {
      return getProblemSteps(problemId);
    },
    [getProblemSteps],
  );

  const getDeviceRemotes = useCallback(
    (deviceId: string): Remote[] => {
      return remotes.filter((r) => r.deviceId === deviceId || !r.deviceId);
    },
    [remotes],
  );

  const getRemotesForDevice = useCallback(
    (deviceId: string): Remote[] => {
      return getDeviceRemotes(deviceId);
    },
    [getDeviceRemotes],
  );

  const getDefaultRemote = useCallback((): Remote | undefined => {
    return (
      remotes.find((r) => r.isDefault && r.isActive) ||
      remotes.find((r) => r.isActive)
    );
  }, [remotes]);

  const getDefaultRemoteForDevice = useCallback(
    (deviceId: string): Remote | undefined => {
      const deviceRemotes = getDeviceRemotes(deviceId);
      return deviceRemotes.find((r) => r.isDefault) || deviceRemotes[0];
    },
    [getDeviceRemotes],
  );

  const getRemoteUsageCount = useCallback(
    (remoteId: string): number => {
      return steps.filter((step) => step.remoteId === remoteId).length;
    },
    [steps],
  );

  const canDeleteRemote = useCallback(
    (remoteId: string): { canDelete: boolean; reason?: string } => {
      const usageCount = getRemoteUsageCount(remoteId);
      const remote = getRemote(remoteId);

      if (!remote) {
        return { canDelete: false, reason: "Пульт не найден" };
      }

      if (remote.isDefault) {
        return {
          canDelete: false,
          reason: "Нельзя удалить пульт по умолчанию",
        };
      }

      if (usageCount > 0) {
        return {
          canDelete: false,
          reason: `Пульт используется в ${usageCount} шагах диагностики`,
        };
      }

      return { canDelete: true };
    },
    [getRemoteUsageCount, getRemote],
  );

  const getActiveRemotes = useCallback((): Remote[] => {
    return remotes.filter((r) => r.isActive);
  }, [remotes]);

  const getStepActions = useCallback(
    (stepId: string): StepAction[] => {
      return stepActions.filter((a) => a.stepId === stepId && a.isActive);
    },
    [stepActions],
  );

  // Bulk operations
  const bulkUpdateDevices = useCallback(
    async (
      updates: { id: string; data: Partial<Device> }[],
    ): Promise<Device[]> => {
      const updatedDevices: Device[] = [];

      setDevices((prev) => {
        const newDevices = prev.map((device) => {
          const update = updates.find((u) => u.id === device.id);
          if (update) {
            const updated = {
              ...device,
              ...update.data,
              updatedAt: createTimestamp(),
            };
            updatedDevices.push(updated);
            return updated;
          }
          return device;
        });
        return newDevices;
      });

      return updatedDevices;
    },
    [],
  );

  const bulkDeleteProblems = useCallback(
    async (ids: string[]): Promise<void> => {
      setProblems((prev) => prev.filter((p) => !ids.includes(p.id)));
    },
    [],
  );

  const duplicateProblem = useCallback(
    async (problemId: string, targetDeviceId?: string): Promise<Problem> => {
      const originalProblem = problems.find((p) => p.id === problemId);
      if (!originalProblem) {
        throw new Error("Problem not found");
      }

      return createProblem({
        ...originalProblem,
        title: `${originalProblem.title} (копия)`,
        deviceId: targetDeviceId || originalProblem.deviceId,
        status: "draft",
      });
    },
    [problems, createProblem],
  );

  // Search operations - simplified for now
  const searchDevices = useCallback(
    async (
      query: string,
      filters?: FilterOptions,
    ): Promise<SearchResults<Device>> => {
      const filteredDevices = devices.filter(
        (device) =>
          device.name.toLowerCase().includes(query.toLowerCase()) ||
          device.brand.toLowerCase().includes(query.toLowerCase()),
      );

      return {
        results: filteredDevices,
        total: filteredDevices.length,
        query,
        filters: filters || {},
        suggestions: [],
      };
    },
    [devices],
  );

  const searchProblems = useCallback(
    async (
      query: string,
      filters?: FilterOptions,
    ): Promise<SearchResults<Problem>> => {
      const filteredProblems = problems.filter(
        (problem) =>
          problem.title.toLowerCase().includes(query.toLowerCase()) ||
          problem.description.toLowerCase().includes(query.toLowerCase()),
      );

      return {
        results: filteredProblems,
        total: filteredProblems.length,
        query,
        filters: filters || {},
        suggestions: [],
      };
    },
    [problems],
  );

  const searchSteps = useCallback(
    async (
      query: string,
      filters?: FilterOptions,
    ): Promise<SearchResults<Step>> => {
      const filteredSteps = steps.filter(
        (step) =>
          step.title.toLowerCase().includes(query.toLowerCase()) ||
          step.description.toLowerCase().includes(query.toLowerCase()),
      );

      return {
        results: filteredSteps,
        total: filteredSteps.length,
        query,
        filters: filters || {},
        suggestions: [],
      };
    },
    [steps],
  );

  // Import/Export operations
  const exportData = useCallback(
    async (options: ExportOptions): Promise<{ downloadUrl: string }> => {
      const dataToExport: any = {};

      if (options.entities.includes("devices")) {
        dataToExport.devices = devices;
      }
      if (options.entities.includes("problems")) {
        dataToExport.problems = problems;
      }
      if (options.entities.includes("steps")) {
        dataToExport.steps = steps;
      }
      if (options.entities.includes("remotes")) {
        dataToExport.remotes = remotes;
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      return { downloadUrl: url };
    },
    [devices, problems, steps, remotes],
  );

  const importData = useCallback(
    async (file: File, options: any): Promise<ImportResult> => {
      const text = await file.text();
      const data = JSON.parse(text);

      let importedCount = 0;
      const createdIds: string[] = [];

      if (data.devices && Array.isArray(data.devices)) {
        for (const deviceData of data.devices) {
          const device = await createDevice(deviceData);
          createdIds.push(device.id);
          importedCount++;
        }
      }

      return {
        success: true,
        importedCount,
        failedCount: 0,
        errors: [],
        warnings: [],
        createdIds,
        updatedIds: [],
      };
    },
    [createDevice],
  );

  // Session operations
  const createSession = useCallback(
    async (
      sessionData: Partial<DiagnosticSession>,
    ): Promise<DiagnosticSession> => {
      const newSession: DiagnosticSession = {
        id: generateId(),
        deviceId: sessionData.deviceId || "",
        problemId: sessionData.problemId || "",
        sessionId: generateId(),
        startTime: createTimestamp(),
        completedSteps: 0,
        totalSteps: 0,
        success: false,
        duration: 0,
        errorSteps: [],
        isActive: true,
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        ...sessionData,
      };

      setSessions((prev) => [...prev, newSession]);
      return newSession;
    },
    [],
  );

  const updateSession = useCallback(
    async (
      sessionId: string,
      data: Partial<DiagnosticSession>,
    ): Promise<DiagnosticSession> => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      const updatedSession = {
        ...session,
        ...data,
        updatedAt: createTimestamp(),
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? updatedSession : s)),
      );
      return updatedSession;
    },
    [sessions],
  );

  const getActiveSessions = useCallback((): DiagnosticSession[] => {
    return sessions.filter((s) => s.isActive && !s.endTime);
  }, [sessions]);

  // Settings operations
  const updateSiteSettings = useCallback(
    async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
      const updatedSettings = {
        ...siteSettings,
        ...settings,
        updatedAt: createTimestamp(),
      };

      setSiteSettings(updatedSettings);
      return updatedSettings;
    },
    [siteSettings],
  );

  // Utility operations
  const refreshData = useCallback(async (): Promise<void> => {
    console.log("Refreshing data...");
  }, []);

  const clearCache = useCallback((): void => {
    localStorage.clear();
    setDevices(defaultDevices);
    setProblems([]);
    setSteps([]);
    setRemotes([]);
    setStepActions([]);
    setSiteSettings(defaultSiteSettings);
  }, []);

  const getEntityStats = useCallback(
    (entity: string) => {
      let data: any[] = [];

      switch (entity) {
        case "devices":
          data = devices;
          break;
        case "problems":
          data = problems;
          break;
        case "steps":
          data = steps;
          break;
        case "remotes":
          data = remotes;
          break;
        default:
          data = [];
      }

      return {
        total: data.length,
        active: data.filter((item) => item.isActive).length,
        inactive: data.filter((item) => !item.isActive).length,
      };
    },
    [devices, problems, steps, remotes],
  );

  const validateEntity = useCallback(
    (entity: string, data: any): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!data.id) errors.push("ID is required");
      if (!data.name && entity !== "step") errors.push("Name is required");
      if (!data.title && entity === "step") errors.push("Title is required");

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    [],
  );

  const value: DataContextType = {
    api,
    loading,
    errors,
    devices,
    problems,
    steps,
    remotes,
    stepActions,
    sessions,
    changeLogs,
    siteSettings,
    createDevice,
    updateDevice,
    deleteDevice,
    getDevice,
    getDeviceById,
    createProblem,
    updateProblem,
    deleteProblem,
    getProblem,
    createStep,
    updateStep,
    deleteStep,
    getStep,
    reorderSteps,
    createRemote,
    updateRemote,
    deleteRemote,
    getRemote,
    getRemoteById,
    getDefaultRemote,
    getDefaultRemoteForDevice,
    getRemoteUsageCount,
    canDeleteRemote,
    getActiveRemotes,
    getActiveDevices,
    getDeviceProblems,
    getProblemsForDevice,
    getProblemSteps,
    getStepsForProblem,
    getDeviceRemotes,
    getRemotesForDevice,
    getStepActions,
    bulkUpdateDevices,
    bulkDeleteProblems,
    duplicateProblem,
    searchDevices,
    searchProblems,
    searchSteps,
    exportData,
    importData,
    createSession,
    updateSession,
    getActiveSessions,
    updateSiteSettings,
    refreshData,
    clearCache,
    getEntityStats,
    validateEntity,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
