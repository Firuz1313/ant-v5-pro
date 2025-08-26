import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Move,
  Search,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreVertical,
  Layers,
  PlayCircle,
  MousePointer,
  Target,
  Palette,
  ImageIcon,
  Save,
  Tv,
  EyeOff,
  Monitor,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDevices } from "@/hooks/useDevices";
import { useProblems } from "@/hooks/useProblems";
import { tvInterfacesAPI } from "@/api/tvInterfaces";
import { TVInterface, tvInterfaceUtils } from "@/types/tvInterface";
import { stepsApi, remotesApi } from "@/api";
import TVInterfaceAreaEditor from "@/components/admin/TVInterfaceAreaEditor";

// Мемоизированный компонент формы для предот��ращения потери фокуса
const StepFormFieldsComponent = React.memo(
  ({
    isEdit = false,
    formData,
    handleFieldChange,
    handleDeviceChange,
    getActiveDevices,
    getAvailableProblems,
    getAvailableRemotes,
    devices,
    tvInterfaces,
    loadingTVInterfaces,
    openTVInterfaceEditor,
    openRemoteEditor,
  }: {
    isEdit?: boolean;
    formData: any;
    handleFieldChange: (field: string, value: any) => void;
    handleDeviceChange: (value: string) => void;
    getActiveDevices: () => any[];
    getAvailableProblems: () => any[];
    getAvailableRemotes: () => any[];
    devices: any[];
    tvInterfaces: any[];
    loadingTVInterfaces: boolean;
    openTVInterfaceEditor: (tvInterface: any) => Promise<void>;
    openRemoteEditor: () => void;
  }) => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-deviceId" : "deviceId"}>
            Приставка
          </Label>
          <Select value={formData.deviceId} onValueChange={handleDeviceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите приставку" />
            </SelectTrigger>
            <SelectContent>
              {getActiveDevices().map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`}
                    />
                    {device.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-problemId" : "problemId"}>
            Проблема
          </Label>
          <Select
            value={formData.problemId}
            onValueChange={(value) => handleFieldChange("problemId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выб��рите пробл��му" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableProblems().map((problem) => (
                <SelectItem key={problem.id} value={problem.id}>
                  {problem.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-title" : "title"}>Название шага</Label>
        <Input
          id={isEdit ? "edit-title" : "title"}
          value={formData.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="Введит�� название шага"
        />
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-description" : "description"}>
          Описание
        </Label>
        <Textarea
          id={isEdit ? "edit-description" : "description"}
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Краткое описание шага"
        />
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-instruction" : "instruction"}>
          Инст��укция
        </Label>
        <Textarea
          id={isEdit ? "edit-instruction" : "instruction"}
          value={formData.instruction}
          onChange={(e) => handleFieldChange("instruction", e.target.value)}
          placeholder="Подробная инструкция для ��ользователя"
        />
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-tvInterfaceId" : "tvInterfaceId"}>
          Созданный интерфейс
        </Label>
        <div className="flex space-x-2">
          <Select
            value={formData.tvInterfaceId}
            onValueChange={(value) => handleFieldChange("tvInterfaceId", value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Выберите интерфейс" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без и��терф��йса</SelectItem>
              {loadingTVInterfaces ? (
                <SelectItem value="loading" disabled>
                  Загрузка...
                </SelectItem>
              ) : (
                tvInterfaces.map((tvInterface) => (
                  <SelectItem key={tvInterface.id} value={tvInterface.id}>
                    <div className="flex items-center">
                      <Monitor className="w-3 h-3 mr-2" />
                      {tvInterface.name}
                      <span className="ml-2 text-xs text-gray-500">
                        ({tvInterface.type})
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {formData.tvInterfaceId !== "none" && (
            <Button
              variant="outline"
              onClick={() => {
                const tvInterface = tvInterfaces.find(
                  (ti) => ti.id === formData.tvInterfaceId,
                );
                if (tvInterface) openTVInterfaceEditor(tvInterface);
              }}
              size="sm"
            >
              <Target className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-remoteId" : "remoteId"}>Пульт</Label>
        <div className="flex space-x-2">
          <Select
            value={formData.remoteId}
            onValueChange={(value) => handleFieldChange("remoteId", value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Выберите пуль��" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без пульта</SelectItem>
              {getAvailableRemotes().map((remote) => {
                const device = devices.find((d) => d.id === remote.deviceId);
                return (
                  <SelectItem key={remote.id} value={remote.id}>
                    <div className="flex items-center">
                      {device && (
                        <div
                          className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`}
                        />
                      )}
                      {remote.name}
                      {remote.isDefault && (
                        <span className="ml-2 text-xs text-blue-600">
                          (по умолчанию)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {formData.remoteId !== "none" && (
            <Button variant="outline" onClick={openRemoteEditor} size="sm">
              <MousePointer className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-hint" : "hint"}>Подсказка</Label>
        <Textarea
          id={isEdit ? "edit-hint" : "hint"}
          value={formData.hint}
          onChange={(e) => handleFieldChange("hint", e.target.value)}
          placeholder="Главна�� ��одсказка данного шага решения"
        />
      </div>

      {formData.buttonPosition.x > 0 && formData.buttonPosition.y > 0 && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            Позиция кнопки: ({Math.round(formData.buttonPosition.x)},{" "}
            {Math.round(formData.buttonPosition.y)})
          </p>
        </div>
      )}
    </div>
  ),
);

interface DiagnosticStep {
  id: string;
  problemId: string;
  deviceId: string;
  stepNumber?: number; // Optional - backend will auto-assign
  title: string;
  description: string;
  instruction: string;
  highlightRemoteButton?: string;
  highlightTVArea?: string;
  tvInterface?: "home" | "settings" | "channels" | "no-signal";
  tvInterfaceId?: string; // ID созданного TV интерфейса
  requiredAction?: string;
  hint?: string;
  remoteId?: string;
  buttonPosition?: { x: number; y: number };
  isActive: boolean;
  createdAt?: string; // Optional - backend will auto-assign
  updatedAt?: string; // Optional - backend will auto-assign
}

const StepsManager = () => {
  const { data: devicesResponse } = useDevices();
  const { data: problemsResponse } = useProblems();

  // Извлекаем массивы данных из ответа API
  const devices = devicesResponse?.data || [];
  const problems = problemsResponse?.data || [];

  // Local state for steps and remotes
  const [steps, setSteps] = useState<DiagnosticStep[]>([]);
  const [remotes, setRemotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load steps
      const stepsResponse = await stepsApi.getSteps(1, 1000); // Get first 1000 steps
      console.log("🔍 Steps response:", stepsResponse);

      // PaginatedResponse has data property, but check both formats
      const stepsData = stepsResponse?.data || stepsResponse || [];
      setSteps(Array.isArray(stepsData) ? stepsData : []);

      // Load remotes
      const remotesResponse = await remotesApi.getAll();
      console.log("🔍 Remotes response:", remotesResponse);

      // API response format: { success: true, data: [...] }
      const remotesData = remotesResponse?.data || remotesResponse || [];
      setRemotes(Array.isArray(remotesData) ? remotesData : []);

      console.log("✅ Loaded data:", {
        steps: Array.isArray(stepsData) ? stepsData.length : 0,
        remotes: Array.isArray(remotesData) ? remotesData.length : 0,
        stepsType: typeof stepsData,
        remotesType: typeof remotesData,
      });
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert camelCase to snake_case for API
  const convertToSnakeCase = (obj: any): any => {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      result[snakeKey] = value;
    }
    return result;
  };

  // Step management functions
  const createStep = async (step: DiagnosticStep) => {
    try {
      // Convert camelCase to snake_case for backend validation
      const stepPayload = convertToSnakeCase(step);

      // Remove frontend-only fields and let backend set timestamps
      delete stepPayload.created_at;
      delete stepPayload.updated_at;
      // Remove step_number to let backend auto-assign
      delete stepPayload.step_number;

      // Ensure ID is included (backend validation requires it)
      if (!stepPayload.id) {
        stepPayload.id =
          step.id ||
          `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Convert empty strings to undefined for optional fields
      if (stepPayload.required_action === "") {
        delete stepPayload.required_action;
      }
      if (stepPayload.hint === "") {
        delete stepPayload.hint;
      }
      if (stepPayload.description === "") {
        delete stepPayload.description;
      }

      // Remove fields that should not be sent if they are 'none' or undefined
      if (
        stepPayload.remote_id === "none" ||
        stepPayload.remote_id === undefined
      ) {
        delete stepPayload.remote_id;
      }
      if (
        stepPayload.tv_interface_id === "none" ||
        stepPayload.tv_interface_id === undefined
      ) {
        delete stepPayload.tv_interface_id;
      }
      if (
        stepPayload.highlight_remote_button === "none" ||
        stepPayload.highlight_remote_button === undefined
      ) {
        delete stepPayload.highlight_remote_button;
      }
      if (
        stepPayload.highlight_tv_area === "none" ||
        stepPayload.highlight_tv_area === undefined
      ) {
        delete stepPayload.highlight_tv_area;
      }

      console.log(
        "📤 Sending step payload (backend will auto-assign step_number):",
        stepPayload,
      );

      const response = await stepsApi.createStep(stepPayload);
      const newStep = response.data;

      // Refresh the steps data to ensure we have the latest state
      console.log("✅ Step created successfully, refreshing data...");
      await loadInitialData();

      return newStep;
    } catch (error) {
      console.error("Error creating step:", error);
      // Don't show toast here - let handleCreate handle error messaging
      throw error;
    }
  };

  const updateStep = async (id: string, data: any) => {
    try {
      // Convert camelCase to snake_case for backend validation
      const updatePayload = convertToSnakeCase(data);

      // Remove frontend-only fields
      delete updatePayload.created_at;
      delete updatePayload.updated_at;

      // Convert empty strings to undefined for optional fields
      if (updatePayload.required_action === "") {
        delete updatePayload.required_action;
      }
      if (updatePayload.hint === "") {
        delete updatePayload.hint;
      }
      if (updatePayload.description === "") {
        delete updatePayload.description;
      }

      // Remove fields that should not be sent if they are 'none' or undefined
      if (updatePayload.remote_id === "none") {
        delete updatePayload.remote_id;
      }
      if (updatePayload.tv_interface_id === "none") {
        delete updatePayload.tv_interface_id;
      }
      if (updatePayload.highlight_remote_button === "none") {
        delete updatePayload.highlight_remote_button;
      }
      if (updatePayload.highlight_tv_area === "none") {
        delete updatePayload.highlight_tv_area;
      }

      console.log("📤 Sending update payload:", updatePayload);

      const response = await stepsApi.updateStep(id, updatePayload);
      const updatedStep = response.data;
      setSteps((prev) =>
        prev.map((step) =>
          step.id === id ? { ...step, ...updatedStep } : step,
        ),
      );
      return updatedStep;
    } catch (error) {
      console.error("Error updating step:", error);
      toast({
        title: "Ошибка обновления шага",
        description:
          error instanceof Error ? error.message : "Не удалось обновить шаг.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteStep = async (id: string) => {
    try {
      await stepsApi.deleteStep(id);
      setSteps((prev) => prev.filter((step) => step.id !== id));
    } catch (error) {
      console.error("Error deleting step:", error);
      throw error;
    }
  };

  const reorderSteps = async (problemId: string, stepIds: string[]) => {
    try {
      const response = await stepsApi.reorderSteps(problemId, stepIds);
      // Reload steps to get updated order
      await loadInitialData();
    } catch (error) {
      console.error("Error reordering steps:", error);
      throw error;
    }
  };
  const getActiveDevices = () => devices.filter((d: any) => d.is_active);

  const getActiveRemotes = () => {
    console.log("🔍 getActiveRemotes called:", {
      totalRemotes: remotes.length,
      remotesArray: remotes,
      activeRemotes: remotes.filter((r: any) => r.is_active),
    });
    return remotes.filter((r: any) => r.is_active);
  };

  const getRemoteById = (id: string) => remotes.find((r: any) => r.id === id);

  const getProblemsForDevice = (deviceId: string) =>
    problems.filter((p: any) => p.device_id === deviceId);

  const getRemotesForDevice = (deviceId: string) => {
    console.log("🔍 getRemotesForDevice called:", {
      deviceId,
      totalRemotes: remotes.length,
      remotesForDevice: remotes.filter((r: any) => r.device_id === deviceId),
    });
    return remotes.filter((r: any) => r.device_id === deviceId);
  };
  const getDefaultRemoteForDevice = (deviceId: string) =>
    remotes.find((r: any) => r.device_id === deviceId && r.is_default);

  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const { toast } = useToast();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDevice, setFilterDevice] = useState<string>("all");
  const [filterProblem, setFilterProblem] = useState<string>("all");
  const [filterRemote, setFilterRemote] = useState<string>("all");
  const [selectedStep, setSelectedStep] = useState<DiagnosticStep | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoteEditorOpen, setIsRemoteEditorOpen] = useState(false);
  const [isTVInterfaceEditorOpen, setIsTVInterfaceEditorOpen] = useState(false);
  const [isCreatingStep, setIsCreatingStep] = useState(false);

  // TV Interfaces state
  const [tvInterfaces, setTVInterfaces] = useState<TVInterface[]>([]);
  const [selectedTVInterface, setSelectedTVInterface] =
    useState<TVInterface | null>(null);
  const [loadingTVInterfaces, setLoadingTVInterfaces] = useState(false);

  // Form data state - ALL useState hooks must be before conditional returns
  const [formData, setFormData] = useState({
    deviceId: "",
    problemId: "",
    title: "",
    description: "",
    instruction: "",
    highlightRemoteButton: "none",
    highlightTVArea: "none",
    tvInterface: "home" as DiagnosticStep["tvInterface"],
    tvInterfaceId: "none", // Добавлено для выбора ��озданного интерфейса
    requiredAction: "",
    hint: "",
    remoteId: "none",
    buttonPosition: { x: 0, y: 0 },
  });

  // Remote editor state
  const [selectedRemote, setSelectedRemote] = useState<any>(null);
  const [isPickingButton, setIsPickingButton] = useState(false);
  const [customRemoteImage, setCustomRemoteImage] = useState<string | null>(
    null,
  );

  // ALL useEffect and useCallback hooks must be before conditional returns
  useEffect(() => {
    if (formData.deviceId && formData.deviceId !== "all") {
      loadTVInterfacesForDevice(formData.deviceId);
    }
  }, [formData.deviceId]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDeviceChange = useCallback(
    (value: string) => {
      const defaultRemote = getDefaultRemoteForDevice(value);
      setFormData((prev) => ({
        ...prev,
        deviceId: value,
        problemId: "",
        remoteId: defaultRemote?.id || "none",
      }));
    },
    [getDefaultRemoteForDevice],
  );

  // Show loading state while data is being fetched - AFTER ALL HOOKS
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3" />
        <span className="text-lg">Загрузка данных...</span>
      </div>
    );
  }

  const loadTVInterfacesForDevice = async (deviceId: string) => {
    setLoadingTVInterfaces(true);
    try {
      console.log(`🔄 Loading TV interfaces for device: ${deviceId}`);
      const response = await tvInterfacesAPI.getByDeviceId(deviceId);

      if (response.success && response.data) {
        // Нормализуем данные с бэкенда
        const normalizedInterfaces = response.data.map((tvInterface) => ({
          ...tvInterface,
          screenshotData:
            tvInterface.screenshotData || tvInterface.screenshot_data,
          clickableAreas:
            tvInterface.clickableAreas || tvInterface.clickable_areas || [],
          highlightAreas:
            tvInterface.highlightAreas || tvInterface.highlight_areas || [],
          deviceId: tvInterface.deviceId || tvInterface.device_id,
          isActive:
            tvInterface.isActive !== undefined
              ? tvInterface.isActive
              : tvInterface.is_active,
        }));

        setTVInterfaces(normalizedInterfaces);
        console.log(
          `✅ Loaded ${normalizedInterfaces.length} TV interfaces:`,
          normalizedInterfaces,
        );
      } else {
        console.warn(
          `⚠️ No TV interfaces found for device ${deviceId}:`,
          response.error,
        );
        setTVInterfaces([]);
      }
    } catch (error) {
      console.error(
        `❌ Error loading TV interfaces for device ${deviceId}:`,
        error,
      );
      setTVInterfaces([]);

      // Показываем пользователю информацию об ошибке
      if (error instanceof Error && error.message.includes("Сетевая ошибка")) {
        // Можно добавить toast уведомление
        console.error("П��облемы с подклю��ением к с��рверу");
      }
    } finally {
      setLoadingTVInterfaces(false);
    }
  };

  const handleTVInterfaceAreaSave = async (
    clickableAreas: any[],
    highlightAreas: any[],
  ) => {
    if (!selectedTVInterface) return;

    try {
      await tvInterfacesAPI.update(selectedTVInterface.id, {
        clickableAreas,
        highlightAreas,
      });

      // Refresh TV interfaces
      if (formData.deviceId) {
        await loadTVInterfacesForDevice(formData.deviceId);
      }

      setIsTVInterfaceEditorOpen(false);
      setSelectedTVInterface(null);
    } catch (error) {
      console.error("Error saving TV interface areas:", error);
    }
  };

  const openTVInterfaceEditor = async (tvInterface: TVInterface) => {
    console.log("Opening TV Interface Editor with:", {
      id: tvInterface.id,
      name: tvInterface.name,
      screenshotData: tvInterface.screenshotData ? "present" : "missing",
      screenshot_data: tvInterface.screenshot_data ? "present" : "missing",
    });

    // Check if this interface still exists in our current list
    const interfaceExists = tvInterfaces.find((ti) => ti.id === tvInterface.id);
    if (!interfaceExists) {
      console.warn(
        `⚠️ TV interface ${tvInterface.id} not found in current list, reloading...`,
      );
      if (formData.deviceId) {
        await loadTVInterfacesForDevice(formData.deviceId);
      }
      toast({
        title: "Интерфейс не найден",
        description: `TV интерфей�� "${tvInterface.name}" больше не доступен. Список обн��влён.`,
        variant: "destructive",
      });
      return;
    }

    // Validate interface ID and fetch full interface data
    if (!tvInterface.id) {
      console.warn("⚠️ TV interface has no ID, using cached data");
      setSelectedTVInterface(tvInterface);
      setIsTVInterfaceEditorOpen(true);
      return;
    }

    try {
      console.log(`🔄 Fetching full TV interface data for: ${tvInterface.id}`);
      const response = await tvInterfacesAPI.getById(tvInterface.id);

      if (response.success && response.data) {
        const fullInterface = tvInterfaceUtils.normalizeFromBackend(
          response.data,
        );
        console.log("✅ Loaded full TV interface with screenshot:", {
          id: fullInterface.id,
          name: fullInterface.name,
          screenshotData: fullInterface.screenshotData ? "present" : "missing",
          screenshot_data: fullInterface.screenshot_data
            ? "present"
            : "missing",
        });
        setSelectedTVInterface(fullInterface);
      } else {
        console.warn(
          `⚠️ Failed to load full interface data for ${tvInterface.id}: ${response.error}. Checking if interface still exists.`,
        );

        // If interface not found, try reloading the TV interfaces list
        if (
          response.error?.includes("404") ||
          response.error?.includes("не найден")
        ) {
          console.log(
            "🔄 Interface not found, reloading TV interfaces list...",
          );
          if (formData.deviceId) {
            await loadTVInterfacesForDevice(formData.deviceId);
          }
          toast({
            title: "Интерфейс не найден",
            description: `TV интерфе��с "${tvInterface.name}" больш�� не существует. Спис��к интерфейсов обновлён.`,
            variant: "destructive",
          });
          return; // Don't open editor for non-existent interface
        }

        setSelectedTVInterface(tvInterface);
      }
    } catch (error) {
      console.error(
        `❌ Error loading full interface data for ${tvInterface.id}:`,
        error,
      );
      toast({
        title: "Предупрежд��ние",
        description: `Не удалось загрузить по��ные данные интерфейса ${tvInterface.name}. Используются кэшированные данные.`,
        variant: "destructive",
      });
      setSelectedTVInterface(tvInterface);
    }

    setIsTVInterfaceEditorOpen(true);
  };

  const filteredSteps = steps.filter((step) => {
    const matchesSearch =
      step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDevice =
      filterDevice === "all" || step.deviceId === filterDevice;
    const matchesProblem =
      filterProblem === "all" || step.problemId === filterProblem;
    const matchesRemote =
      filterRemote === "all" ||
      step.remoteId === filterRemote ||
      (!step.remoteId && filterRemote === "none");
    return matchesSearch && matchesDevice && matchesProblem && matchesRemote;
  });

  const getAvailableProblems = () => {
    if (formData.deviceId) {
      return getProblemsForDevice(formData.deviceId);
    }
    return problems.filter((p) => p.status === "published");
  };

  const getAvailableRemotes = () => {
    const result = formData.deviceId
      ? getRemotesForDevice(formData.deviceId)
      : getActiveRemotes();

    console.log("🔍 getAvailableRemotes called:", {
      selectedDeviceId: formData.deviceId,
      returnedRemotes: result,
      resultLength: result.length,
    });

    return result;
  };

  const getFilteredRemotes = () => {
    if (filterDevice === "all") {
      return getActiveRemotes();
    }
    return getRemotesForDevice(filterDevice);
  };

  // Remove calculateNextStepNumber function - let backend handle auto-numbering

  const handleCreate = async () => {
    // Prevent multiple simultaneous creation attempts
    if (isCreatingStep) {
      console.log(
        "⏸️ Step creation already in progress, ignoring duplicate request",
      );
      return;
    }

    // Validate required fields before creating step
    if (
      !formData.deviceId ||
      !formData.problemId ||
      !formData.title ||
      !formData.instruction
    ) {
      toast({
        title: "Ошибка валидации",
        description:
          "Заполните все обязательные поля: устройство, проблема, на��вание и инструкция.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingStep(true);
    try {
      // Let backend handle step numbering automatically - don't send stepNumber
      const newStep: DiagnosticStep = {
        id: `step-${formData.deviceId}-${formData.problemId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        highlightRemoteButton:
          formData.highlightRemoteButton === "none"
            ? undefined
            : formData.highlightRemoteButton,
        highlightTVArea:
          formData.highlightTVArea === "none"
            ? undefined
            : formData.highlightTVArea,
        remoteId: formData.remoteId === "none" ? undefined : formData.remoteId,
        tvInterfaceId:
          formData.tvInterfaceId === "none"
            ? undefined
            : formData.tvInterfaceId,
        buttonPosition:
          formData.buttonPosition.x === 0 && formData.buttonPosition.y === 0
            ? undefined
            : formData.buttonPosition,
        // stepNumber: removed - let backend auto-assign
        isActive: true,
        // Don't set timestamps - let backend handle them
      };

      console.log(
        "📝 Creating step with data (backend will auto-assign step number):",
        {
          id: newStep.id,
          deviceId: newStep.deviceId,
          problemId: newStep.problemId,
          title: newStep.title,
        },
      );

      const createdStep = await createStep(newStep);
      setIsCreateDialogOpen(false);
      resetForm();

      toast({
        title: "Шаг создан",
        description: `Шаг "${createdStep.title}" успешно создан с номером ${createdStep.step_number || createdStep.stepNumber}.`,
      });
    } catch (error) {
      console.error("Error creating step:", error);
      toast({
        title: "Ошибка создания шага",
        description:
          error instanceof Error ? error.message : "Не удалось создать шаг.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingStep(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedStep) return;

    const updatedFormData = {
      ...formData,
      highlightRemoteButton:
        formData.highlightRemoteButton === "none"
          ? undefined
          : formData.highlightRemoteButton,
      highlightTVArea:
        formData.highlightTVArea === "none"
          ? undefined
          : formData.highlightTVArea,
      remoteId: formData.remoteId === "none" ? undefined : formData.remoteId,
      tvInterfaceId:
        formData.tvInterfaceId === "none" ? undefined : formData.tvInterfaceId,
      buttonPosition:
        formData.buttonPosition.x === 0 && formData.buttonPosition.y === 0
          ? undefined
          : formData.buttonPosition,
    };

    try {
      await updateStep(selectedStep.id, updatedFormData);
      setIsEditDialogOpen(false);
      setSelectedStep(null);
      resetForm();
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  const handleDelete = async (stepId: string) => {
    const stepToDelete = steps.find((s) => s.id === stepId);
    if (!stepToDelete) return;

    // Remove the step
    const remainingSteps = steps.filter((step) => step.id !== stepId);

    // Reorder step numbers for the same problem
    const reorderedSteps = remainingSteps.map((step) => {
      if (
        step.problemId === stepToDelete.problemId &&
        (step.stepNumber || 0) > (stepToDelete.stepNumber || 0)
      ) {
        return { ...step, stepNumber: (step.stepNumber || 0) - 1 };
      }
      return step;
    });

    try {
      await deleteStep(stepId);
      // Step reordering handled automatically
    } catch (error) {
      console.error("Error deleting step:", error);
    }
  };

  const handleToggleStatus = async (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;

    try {
      await updateStep(stepId, {
        isActive: !step.isActive,
      });
    } catch (error) {
      console.error("Error toggling step status:", error);
    }
  };

  const handleMoveStep = async (stepId: string, direction: "up" | "down") => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const step = steps[stepIndex];
    if (!step) return;

    const problemSteps = steps
      .filter((s) => s.problemId === step.problemId)
      .sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));

    const currentIndex = problemSteps.findIndex((s) => s.id === stepId);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= problemSteps.length) return;

    const updatedSteps = steps.map((s) => {
      if (s.id === stepId) {
        return { ...s, stepNumber: problemSteps[newIndex].stepNumber || 0 };
      }
      if (s.id === problemSteps[newIndex].id) {
        return { ...s, stepNumber: step.stepNumber || 0 };
      }
      return s;
    });

    try {
      // Use the reorderSteps function
      const problemStepIds = problemSteps.map((s) => {
        if (s.id === stepId) return problemSteps[newIndex].id;
        if (s.id === problemSteps[newIndex].id) return stepId;
        return s.id;
      });
      await reorderSteps(step.problemId, problemStepIds);
    } catch (error) {
      console.error("Error moving step:", error);
    }
  };

  const openEditDialog = (step: DiagnosticStep) => {
    setSelectedStep(step);
    setFormData({
      deviceId: step.deviceId || "",
      problemId: step.problemId || "",
      title: step.title || "",
      description: step.description || "",
      instruction: step.instruction || "",
      highlightRemoteButton: step.highlightRemoteButton || "none",
      highlightTVArea: step.highlightTVArea || "none",
      tvInterface: step.tvInterface || "home",
      tvInterfaceId: step.tvInterfaceId || "none",
      requiredAction: step.requiredAction || "",
      hint: step.hint || "",
      remoteId: step.remoteId || "none",
      buttonPosition: step.buttonPosition || { x: 0, y: 0 },
    });
    setIsEditDialogOpen(true);
  };

  const openRemoteEditor = async () => {
    if (!formData.remoteId || formData.remoteId === "none") {
      toast({
        title: "Пульт не выбран",
        description: "Выберите пульт из списка перед редактированием позиции.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Try to get remote from local data first
      let remote = remotes.find((r) => r.id === formData.remoteId);

      if (!remote) {
        // If not found in local data, try to fetch from API
        console.log(`🔄 Fetching remote ${formData.remoteId} from API...`);
        const response = await remotesApi.getById(formData.remoteId);
        remote = response?.data || response;
      }

      if (remote) {
        console.log("🎮 Opening remote editor with remote:", {
          id: remote.id,
          name: remote.name,
          hasImageData: !!(remote.imageData || remote.image_data),
          dimensions: remote.dimensions,
          buttons: remote.buttons?.length || 0,
        });

        setSelectedRemote(remote);
        setIsRemoteEditorOpen(true);
      } else {
        toast({
          title: "Пульт не найден",
          description: `Не удалось загрузить данны�� пульт�� ${formData.remoteId}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading remote:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные о пульте.",
        variant: "destructive",
      });
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPickingButton || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setFormData({
      ...formData,
      buttonPosition: { x, y },
    });

    setIsPickingButton(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomRemoteImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createTestRemoteImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Заливаем фон пульта
    const gradient = ctx.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0, "#2d3748");
    gradient.addColorStop(1, "#1a202c");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(20, 20, 360, 760, 30);
    ctx.fill();

    // Рамка пульта
    ctx.strokeStyle = "#4a5568";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Кнопка питания (красная, сверху)
    ctx.fillStyle = "#e53e3e";
    ctx.beginPath();
    ctx.arc(200, 80, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#c53030";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Цифровые кнопки 1-9
    const numberButtons = [
      { x: 120, y: 150, num: "1" },
      { x: 200, y: 150, num: "2" },
      { x: 280, y: 150, num: "3" },
      { x: 120, y: 210, num: "4" },
      { x: 200, y: 210, num: "5" },
      { x: 280, y: 210, num: "6" },
      { x: 120, y: 270, num: "7" },
      { x: 200, y: 270, num: "8" },
      { x: 280, y: 270, num: "9" },
      { x: 200, y: 330, num: "0" },
    ];

    numberButtons.forEach((btn) => {
      ctx.fillStyle = "#4a5568";
      ctx.beginPath();
      ctx.roundRect(btn.x - 25, btn.y - 20, 50, 40, 8);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(btn.num, btn.x, btn.y + 7);
    });

    // Навигационные кнопки (D-pad)
    const dpadCenter = { x: 200, y: 450 };

    // Центральная кнопка OK
    ctx.fillStyle = "#3182ce";
    ctx.beginPath();
    ctx.arc(dpadCenter.x, dpadCenter.y, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("OK", dpadCenter.x, dpadCenter.y + 5);

    // Стрелки навигации
    const navButtons = [
      { x: dpadCenter.x, y: dpadCenter.y - 60, text: "▲" },
      { x: dpadCenter.x, y: dpadCenter.y + 60, text: "▼" },
      { x: dpadCenter.x - 60, y: dpadCenter.y, text: "◀" },
      { x: dpadCenter.x + 60, y: dpadCenter.y, text: "▶" },
    ];

    navButtons.forEach((btn) => {
      ctx.fillStyle = "#4a5568";
      ctx.beginPath();
      ctx.roundRect(btn.x - 20, btn.y - 15, 40, 30, 6);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(btn.text, btn.x, btn.y + 7);
    });

    // Функциональные кнопки внизу
    const funcButtons = [
      { x: 120, y: 580, text: "HOME", color: "#38a169" },
      { x: 200, y: 580, text: "MENU", color: "#d69e2e" },
      { x: 280, y: 580, text: "BACK", color: "#718096" },
      { x: 120, y: 640, text: "V-", color: "#4a5568" },
      { x: 200, y: 640, text: "MUTE", color: "#e53e3e" },
      { x: 280, y: 640, text: "V+", color: "#4a5568" },
    ];

    funcButtons.forEach((btn) => {
      ctx.fillStyle = btn.color;
      ctx.beginPath();
      ctx.roundRect(btn.x - 30, btn.y - 15, 60, 30, 6);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(btn.text, btn.x, btn.y + 3);
    });

    // Брендинг внизу
    ctx.fillStyle = "#a0aec0";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(selectedRemote?.name || "Universal Remote", 200, 750);

    return canvas.toDataURL("image/png");
  };

  const resetForm = () => {
    setFormData({
      deviceId: "",
      problemId: "",
      title: "",
      description: "",
      instruction: "",
      highlightRemoteButton: "none",
      highlightTVArea: "none",
      tvInterface: "home",
      tvInterfaceId: "none",
      requiredAction: "",
      hint: "",
      remoteId: "none",
      buttonPosition: { x: 0, y: 0 },
    });
    setCustomRemoteImage(null);
  };

  const getDeviceName = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    return device?.name || "Неизв��стная приставка";
  };

  const getProblemTitle = (problemId: string) => {
    const problem = problems.find((p) => p.id === problemId);
    return problem?.title || "Неизвестная проб��ема";
  };

  const getGroupedSteps = () => {
    return filteredSteps.reduce(
      (acc, step) => {
        const key = `${step.deviceId}-${step.problemId}`;
        if (!acc[key]) {
          acc[key] = {
            deviceId: step.deviceId,
            problemId: step.problemId,
            steps: [],
          };
        }
        acc[key].steps.push(step);
        return acc;
      },
      {} as Record<
        string,
        { deviceId: string; problemId: string; steps: DiagnosticStep[] }
      >,
    );
  };

  const renderRemoteEditor = () => {
    const remoteImage =
      customRemoteImage ||
      selectedRemote?.imageData ||
      selectedRemote?.image_data;

    console.log("🎮 Remote Editor Debug:", {
      selectedRemote: selectedRemote
        ? {
            id: selectedRemote.id,
            name: selectedRemote.name,
            hasImageData: !!selectedRemote.imageData,
            hasImage_data: !!selectedRemote.image_data,
            imageDataLength:
              selectedRemote.imageData?.length ||
              selectedRemote.image_data?.length ||
              0,
          }
        : null,
      customRemoteImage: !!customRemoteImage,
      finalRemoteImage: !!remoteImage,
    });

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas Area */}
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 relative min-h-[600px]">
            {remoteImage ? (
              <canvas
                ref={canvasRef}
                width={400}
                height={600}
                className="border border-gray-300 dark:border-gray-600 rounded cursor-crosshair mx-auto"
                style={{
                  backgroundImage: `url(${remoteImage})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "transparent",
                }}
                onClick={handleCanvasClick}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-[400px] h-[600px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-gray-500 dark:text-gray-400 space-y-2">
                    <div className="text-4xl">📱</div>
                    <p className="text-lg font-medium">
                      Изображение пульта не найдено
                    </p>
                    <p className="text-sm">
                      Загрузите изображение пульта, чтобы выбрать позицию кнопки
                    </p>
                    {selectedRemote && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs">
                        <p>
                          <strong>Отладка:</strong> Пульт "{selectedRemote.name}
                          " (ID: {selectedRemote.id})
                        </p>
                        <p>imageData: {selectedRemote.imageData ? "✓" : "✗"}</p>
                        <p>
                          image_data: {selectedRemote.image_data ? "✓" : "✗"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={600}
                  className="border border-gray-300 dark:border-gray-600 rounded cursor-crosshair mx-auto opacity-0 absolute"
                  onClick={handleCanvasClick}
                />
              </div>
            )}

            {/* Show selected position */}
            {formData.buttonPosition.x > 0 && formData.buttonPosition.y > 0 && (
              <div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{
                  left: `${(formData.buttonPosition.x / 400) * 100}%`,
                  top: `${(formData.buttonPosition.y / 600) * 100}%`,
                }}
              />
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Выбор позиции</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={isPickingButton ? "default" : "outline"}
                  onClick={() => setIsPickingButton(!isPickingButton)}
                  className="w-full"
                  disabled={!remoteImage}
                >
                  <Target className="h-4 w-4 mr-2" />
                  {isPickingButton ? "Отменить выбор" : "Выбрать п��зицию"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  За��руз��ть изображение
                </Button>
                {!remoteImage && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const testImage = createTestRemoteImage();
                      if (testImage) {
                        setCustomRemoteImage(testImage);
                      }
                    }}
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Создать тестовый пульт
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {!remoteImage && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                    ⚠️ Изображение пульта отсутствует
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-3">
                    Загрузите изображение или создайте тестовый пульт для выбора
                    позиции кнопки.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Открываем редактор пультов в новой вкладке
                      window.open(
                        `/admin/remote-builder?edit=${selectedRemote?.id}`,
                        "_blank",
                      );
                    }}
                    className="w-full text-xs"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Редакти��овать в Remote Builder
                  </Button>
                </div>
              )}

              {isPickingButton && remoteImage && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Кликнит�� на изображение пульта, чтобы указать позици��
                    кнопки
                  </p>
                </div>
              )}

              {formData.buttonPosition.x > 0 &&
                formData.buttonPosition.y > 0 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Позиция выбрана: ({Math.round(formData.buttonPosition.x)},{" "}
                      {Math.round(formData.buttonPosition.y)})
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление шагами
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Создан��е шагов диагностики с привязкой к приставкам и проблемам
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Создать шаг
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Создать новый шаг</DialogTitle>
            </DialogHeader>
            <StepFormFieldsComponent
              isEdit={false}
              formData={formData}
              handleFieldChange={handleFieldChange}
              handleDeviceChange={handleDeviceChange}
              getActiveDevices={getActiveDevices}
              getAvailableProblems={getAvailableProblems}
              getAvailableRemotes={getAvailableRemotes}
              devices={devices}
              tvInterfaces={tvInterfaces}
              loadingTVInterfaces={loadingTVInterfaces}
              openTVInterfaceEditor={openTVInterfaceEditor}
              openRemoteEditor={openRemoteEditor}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  !formData.deviceId ||
                  !formData.problemId ||
                  !formData.title ||
                  isCreatingStep
                }
              >
                {isCreatingStep ? "Создание..." : "Создать"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск шагов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={filterDevice}
                onValueChange={(value) => {
                  setFilterDevice(value);
                  setFilterRemote("all"); // Reset remote filter when device changes
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Приставка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все пристав���и</SelectItem>
                  {getActiveDevices().map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`}
                        />
                        {device.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterProblem} onValueChange={setFilterProblem}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Проблема" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все проблемы</SelectItem>
                  {problems
                    .filter((p) => p.status === "published")
                    .map((problem) => (
                      <SelectItem key={problem.id} value={problem.id}>
                        {problem.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={filterRemote} onValueChange={setFilterRemote}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Пульт" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все пульты</SelectItem>
                  <SelectItem value="none">Без пульта</SelectItem>
                  {getFilteredRemotes().map((remote) => {
                    const device = devices.find(
                      (d) => d.id === remote.deviceId,
                    );
                    return (
                      <SelectItem key={remote.id} value={remote.id}>
                        <div className="flex items-center">
                          {device && (
                            <div
                              className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`}
                            />
                          )}
                          {remote.name}
                          {remote.isDefault && (
                            <span className="ml-2 text-xs text-blue-600">
                              (по умолчанию)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps List - Grouped by Device and Problem */}
      <div className="space-y-6">
        {Object.entries(getGroupedSteps()).map(([key, group]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                <Tv className="h-4 w-4 mr-2" />
                {getDeviceName(group.deviceId)} -{" "}
                {getProblemTitle(group.problemId)}
                <Badge variant="secondary" className="ml-2">
                  {group.steps.length} шагов
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.steps
                  .sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0))
                  .map((step) => (
                    <div
                      key={step.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {step.stepNumber || 0}
                              </span>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMoveStep(step.id, "up")}
                                disabled={(step.stepNumber || 0) === 1}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMoveStep(step.id, "down")}
                                disabled={
                                  (step.stepNumber || 0) === group.steps.length
                                }
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {step.title}
                              </h4>
                              <Badge
                                variant={
                                  step.isActive ? "default" : "secondary"
                                }
                              >
                                {step.isActive ? "Активный" : "Неактивный"}
                              </Badge>
                              {step.requiredAction && (
                                <Badge variant="outline">
                                  <PlayCircle className="h-3 w-3 mr-1" />
                                  Автопереход
                                </Badge>
                              )}
                              {step.remoteId && (
                                <Badge variant="outline">
                                  <MousePointer className="h-3 w-3 mr-1" />
                                  Пульт
                                </Badge>
                              )}
                              {step.buttonPosition && (
                                <Badge variant="outline">
                                  <Target className="h-3 w-3 mr-1" />
                                  Позиция
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                              {step.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              {step.remoteId && (
                                <span>
                                  Пульт:{" "}
                                  {getRemoteById(step.remoteId)?.name ||
                                    "Неизвестный"}
                                </span>
                              )}
                              {step.buttonPosition && (
                                <span>
                                  Пози���ия: (
                                  {Math.round(step.buttonPosition.x)},{" "}
                                  {Math.round(step.buttonPosition.y)})
                                </span>
                              )}
                              {step.highlightTVArea && (
                                <span>ТВ: {step.highlightTVArea}</span>
                              )}
                              {step.tvInterface && (
                                <span>Интерфейс: {step.tvInterface}</span>
                              )}
                              <span>Обновлено: {step.updatedAt}</span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(step)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Реда��тировать
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(step.id)}
                            >
                              {step.isActive ? (
                                <EyeOff className="h-4 w-4 mr-2" />
                              ) : (
                                <Eye className="h-4 w-4 mr-2" />
                              )}
                              {step.isActive
                                ? "Деактивировать"
                                : "Активировать"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(step.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Remote Editor Dialog */}
      <Dialog open={isRemoteEditorOpen} onOpenChange={setIsRemoteEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Выбор позиции на пульте: {selectedRemote?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">{renderRemoteEditor()}</div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRemoteEditorOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={() => setIsRemoteEditorOpen(false)}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить позицию
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактироват�� шаг</DialogTitle>
          </DialogHeader>
          <StepFormFieldsComponent
            isEdit={true}
            formData={formData}
            handleFieldChange={handleFieldChange}
            handleDeviceChange={handleDeviceChange}
            getActiveDevices={getActiveDevices}
            getAvailableProblems={getAvailableProblems}
            getAvailableRemotes={getAvailableRemotes}
            devices={devices}
            tvInterfaces={tvInterfaces}
            loadingTVInterfaces={loadingTVInterfaces}
            openTVInterfaceEditor={openTVInterfaceEditor}
            openRemoteEditor={openRemoteEditor}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleEdit}
              disabled={
                !formData.deviceId || !formData.problemId || !formData.title
              }
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {Object.keys(getGroupedSteps()).length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Шаги не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Попробуйте измени��ь филь��ры поиска или создайте новый шаг.
            </p>
          </CardContent>
        </Card>
      )}

      {/* TV Interface Area Editor Dialog */}
      <Dialog
        open={isTVInterfaceEditorOpen}
        onOpenChange={setIsTVInterfaceEditorOpen}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Редактор областей инте��фейса: {selectedTVInterface?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedTVInterface && (
            <TVInterfaceAreaEditor
              tvInterface={selectedTVInterface}
              onSave={handleTVInterfaceAreaSave}
            />
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsTVInterfaceEditorOpen(false)}
            >
              Отмена
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Created TV Interfaces Section */}
      {formData.deviceId &&
        formData.deviceId !== "all" &&
        tvInterfaces.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Созданные интерфейсы для устройства
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tvInterfaces.map((tvInterface) => (
                  <Card key={tvInterface.id} className="relative">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Interface Preview */}
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          {tvInterface.screenshotData ? (
                            <img
                              src={tvInterface.screenshotData}
                              alt={tvInterface.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Tv className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Interface Info */}
                        <div>
                          <h4 className="font-medium text-sm">
                            {tvInterface.name}
                          </h4>
                          <p className="text-xs text-gray-500 capitalize">
                            {tvInterface.type}
                          </p>
                          {tvInterface.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {tvInterface.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              tvInterface.isActive ? "default" : "secondary"
                            }
                          >
                            {tvInterface.isActive ? "Активен" : "Неактивен"}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openTVInterfaceEditor(tvInterface)}
                            >
                              <Target className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  tvInterfaceId: tvInterface.id,
                                })
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default StepsManager;
