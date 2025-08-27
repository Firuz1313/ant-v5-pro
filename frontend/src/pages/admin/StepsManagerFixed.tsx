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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useDevices } from "@/hooks/useDevices";
import { useProblems } from "@/hooks/useProblems";
import { tvInterfacesAPI } from "@/api/tvInterfaces";
import { TVInterface, tvInterfaceUtils } from "@/types/tvInterface";
import { stepsApi, remotesApi } from "@/api";

interface DiagnosticStep {
  id: string;
  problemId: string;
  deviceId: string;
  stepNumber: number;
  title: string;
  description: string;
  instruction: string;
  highlightRemoteButton?: string;
  highlightTVArea?: string;
  tvInterface?: "home" | "settings" | "channels" | "no-signal";
  tvInterfaceId?: string;
  requiredAction?: string;
  hint?: string;
  remoteId?: string;
  buttonPosition?: { x: number; y: number };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Move StepFormFields outside to prevent recreation on every render
const StepFormFields = ({ isEdit = false }: { isEdit?: boolean }) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isEdit ? "edit-deviceId" : "deviceId"}>Приставка *</Label>
          <Select value={formData.deviceId} onValueChange={handleDeviceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите приставку" />
            </SelectTrigger>
            <SelectContent>
              {getActiveDevices().map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`} />
                    {device.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={isEdit ? "edit-problemId" : "problemId"}>Проблема *</Label>
          <Select
            value={formData.problemId}
            onValueChange={(value) => handleFieldChange("problemId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите проблему" />
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
        <Label htmlFor={isEdit ? "edit-title" : "title"}>Название шага *</Label>
        <Input
          key={isEdit ? "edit-title" : "title"}
          id={isEdit ? "edit-title" : "title"}
          value={formData.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="Введите название шага"
        />
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-description" : "description"}>Описание</Label>
        <Textarea
          key={isEdit ? "edit-description" : "description"}
          id={isEdit ? "edit-description" : "description"}
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Краткое описание шага"
        />
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-instruction" : "instruction"}>Инструкция *</Label>
        <Textarea
          key={isEdit ? "edit-instruction" : "instruction"}
          id={isEdit ? "edit-instruction" : "instruction"}
          value={formData.instruction}
          onChange={(e) => handleFieldChange("instruction", e.target.value)}
          placeholder="Подробная инструкция для пользователя"
        />
      </div>

      <div>
        <Label htmlFor={isEdit ? "edit-tvInterfaceId" : "tvInterfaceId"}>Интерфейс ТВ</Label>
        <div className="flex space-x-2">
          <Select
            value={formData.tvInterfaceId}
            onValueChange={(value) => handleFieldChange("tvInterfaceId", value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Выберите интерфейс" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без интерфейса</SelectItem>
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
                      <span className="ml-2 text-xs text-gray-500">({tvInterface.type})</span>
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
                const tvInterface = tvInterfaces.find((ti) => ti.id === formData.tvInterfaceId);
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
              <SelectValue placeholder="Выберите пульт" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без пульта</SelectItem>
              {getAvailableRemotes().map((remote) => {
                const device = devices.find((d) => d.id === remote.deviceId);
                return (
                  <SelectItem key={remote.id} value={remote.id}>
                    <div className="flex items-center">
                      {device && (
                        <div className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`} />
                      )}
                      {remote.name}
                      {remote.isDefault && (
                        <span className="ml-2 text-xs text-blue-600">(по умолчанию)</span>
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
          key={isEdit ? "edit-hint" : "hint"}
          id={isEdit ? "edit-hint" : "hint"}
          value={formData.hint}
          onChange={(e) => handleFieldChange("hint", e.target.value)}
          placeholder="Дополнительная подсказка для пользователя"
        />
      </div>

      {formData.buttonPosition.x > 0 && formData.buttonPosition.y > 0 && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <Target className="h-4 w-4" />
          <AlertDescription>
            <p className="text-sm text-green-700 dark:text-green-300">
              Позиция кнопки: ({Math.round(formData.buttonPosition.x)}, {Math.round(formData.buttonPosition.y)})
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

StepFormFields.displayName = 'StepFormFields';

const StepsManagerFixed = () => {
  const { data: devicesResponse, isLoading: devicesLoading, error: devicesError } = useDevices();
  const { data: problemsResponse, isLoading: problemsLoading, error: problemsError } = useProblems();
  const { toast } = useToast();

  // Extract data arrays from API responses
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
      const stepsResponse = await stepsApi.getSteps(1, 1000);
      console.log("🔍 Steps response:", stepsResponse);

      const stepsData = stepsResponse?.data || [];
      setSteps(Array.isArray(stepsData) ? stepsData : []);

      // Load remotes
      const remotesResponse = await remotesApi.getAll();
      console.log("🔍 Remotes response:", remotesResponse);

      const remotesData = remotesResponse?.data || remotesResponse || [];
      setRemotes(Array.isArray(remotesData) ? remotesData : []);

      console.log("✅ Loaded data:", {
        steps: Array.isArray(stepsData) ? stepsData.length : 0,
        remotes: Array.isArray(remotesData) ? remotesData.length : 0,
      });
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные шагов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // TV Interfaces state
  const [tvInterfaces, setTVInterfaces] = useState<TVInterface[]>([]);
  const [selectedTVInterface, setSelectedTVInterface] = useState<TVInterface | null>(null);
  const [loadingTVInterfaces, setLoadingTVInterfaces] = useState(false);

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

  // Remote editor state
  const [selectedRemote, setSelectedRemote] = useState<any>(null);
  const [isPickingButton, setIsPickingButton] = useState(false);
  const [customRemoteImage, setCustomRemoteImage] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    deviceId: "",
    problemId: "",
    title: "",
    description: "",
    instruction: "",
    highlightRemoteButton: "none",
    highlightTVArea: "none",
    tvInterface: "home" as DiagnosticStep["tvInterface"],
    tvInterfaceId: "none",
    requiredAction: "",
    hint: "",
    remoteId: "none",
    buttonPosition: { x: 0, y: 0 },
  });

  // Load TV interfaces when device changes
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
      const defaultRemote = remotes.find((r: any) => r.deviceId === value && r.isDefault);
      setFormData((prev) => ({
        ...prev,
        deviceId: value,
        problemId: "",
        remoteId: defaultRemote?.id || "none",
      }));
    },
    [remotes],
  );

  // Show loading state while data is being fetched
  if (loading || devicesLoading || problemsLoading) {
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
        const normalizedInterfaces = response.data.map((tvInterface) => ({
          ...tvInterface,
          screenshotData: tvInterface.screenshotData || tvInterface.screenshot_data,
          clickableAreas: tvInterface.clickableAreas || tvInterface.clickable_areas || [],
          highlightAreas: tvInterface.highlightAreas || tvInterface.highlight_areas || [],
          deviceId: tvInterface.deviceId || tvInterface.device_id,
          isActive: tvInterface.isActive !== undefined ? tvInterface.isActive : tvInterface.is_active,
        }));

        setTVInterfaces(normalizedInterfaces);
        console.log(`✅ Loaded ${normalizedInterfaces.length} TV interfaces:`, normalizedInterfaces);
      } else {
        console.warn(`⚠️ No TV interfaces found for device ${deviceId}:`, response.error);
        setTVInterfaces([]);
      }
    } catch (error) {
      console.error(`❌ Error loading TV interfaces for device ${deviceId}:`, error);
      setTVInterfaces([]);
    } finally {
      setLoadingTVInterfaces(false);
    }
  };

  const getActiveDevices = () => {
    const activeDevices = devices.filter((d: any) => d.isActive !== false);
    console.log("🔍 getActiveDevices called:", { totalDevices: devices.length, activeDevices: activeDevices.length });
    return activeDevices;
  };

  const getActiveRemotes = () => {
    const activeRemotes = remotes.filter((r: any) => r.isActive !== false);
    console.log("🔍 getActiveRemotes called:", { totalRemotes: remotes.length, activeRemotes: activeRemotes.length });
    return activeRemotes;
  };

  const getRemoteById = (id: string) => remotes.find((r: any) => r.id === id);

  const getProblemsForDevice = (deviceId: string) => {
    const deviceProblems = problems.filter((p: any) => p.deviceId === deviceId);
    console.log("🔍 getProblemsForDevice called:", {
      deviceId,
      totalProblems: problems.length,
      deviceProblems: deviceProblems.length,
    });
    return deviceProblems;
  };

  const getRemotesForDevice = (deviceId: string) => {
    const deviceRemotes = remotes.filter((r: any) => r.deviceId === deviceId);
    console.log("🔍 getRemotesForDevice called:", {
      deviceId,
      totalRemotes: remotes.length,
      deviceRemotes: deviceRemotes.length,
    });
    return deviceRemotes;
  };

  const getDefaultRemoteForDevice = (deviceId: string) => {
    const defaultRemote = remotes.find((r: any) => r.deviceId === deviceId && r.isDefault);
    console.log("🔍 getDefaultRemoteForDevice called:", {
      deviceId,
      defaultRemote: defaultRemote ? { id: defaultRemote.id, name: defaultRemote.name } : null,
    });
    return defaultRemote;
  };

  const getAvailableProblems = () => {
    let availableProblems;
    if (formData.deviceId) {
      availableProblems = getProblemsForDevice(formData.deviceId);
    } else {
      availableProblems = problems.filter((p) => p.status === "published");
    }

    console.log("🔍 getAvailableProblems called:", {
      selectedDeviceId: formData.deviceId,
      totalProblems: problems.length,
      availableProblems: availableProblems.length,
    });

    return availableProblems;
  };

  const getAvailableRemotes = () => {
    const result = formData.deviceId ? getRemotesForDevice(formData.deviceId) : getActiveRemotes();

    console.log("🔍 getAvailableRemotes called:", {
      selectedDeviceId: formData.deviceId,
      returnedRemotes: result.length,
    });

    return result;
  };

  const getFilteredRemotes = () => {
    if (filterDevice === "all") {
      return getActiveRemotes();
    }
    return getRemotesForDevice(filterDevice);
  };

  const handleCreate = async () => {
    console.log("🔄 Creating step with form data:", formData);

    // Validate required fields
    if (!formData.deviceId || !formData.problemId || !formData.title || !formData.instruction) {
      toast({
        title: "Ошибка валидации",
        description: "Заполните все обязательные п��ля: устройство, проблема, название и инструкция",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate next step number
      const deviceSteps = steps.filter(
        (s) => s.deviceId === formData.deviceId && s.problemId === formData.problemId
      );
      const maxStepNumber = deviceSteps.length > 0 ? Math.max(...deviceSteps.map((s) => s.stepNumber)) : 0;

      const stepData = {
        problemId: formData.problemId,
        deviceId: formData.deviceId,
        stepNumber: maxStepNumber + 1,
        title: formData.title,
        description: formData.description || "",
        instruction: formData.instruction,
        highlightRemoteButton: formData.highlightRemoteButton === "none" ? undefined : formData.highlightRemoteButton,
        highlightTVArea: formData.highlightTVArea === "none" ? undefined : formData.highlightTVArea,
        remoteId: formData.remoteId === "none" ? undefined : formData.remoteId,
        tvInterfaceId: formData.tvInterfaceId === "none" ? undefined : formData.tvInterfaceId,
        buttonPosition: 
          formData.buttonPosition.x === 0 && formData.buttonPosition.y === 0 
            ? undefined 
            : formData.buttonPosition,
        requiredAction: formData.requiredAction || undefined,
        hint: formData.hint || undefined,
      };

      console.log("🔄 Sending step data to API:", stepData);

      const response = await stepsApi.createStep(stepData);
      console.log("✅ Step created successfully:", response);

      // Update local state
      if (response.data) {
        setSteps((prev) => [...prev, response.data]);
      }

      // Reload data to ensure consistency
      await loadInitialData();

      setIsCreateDialogOpen(false);
      resetForm();

      toast({
        title: "Успех",
        description: "Шаг успешно создан",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error creating step:", error);
      toast({
        title: "Ошибка созда��ия",
        description: `Не удалось создать шаг: ${error?.message || 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedStep) return;

    console.log("🔄 Updating step with form data:", formData);

    // Validate required fields
    if (!formData.deviceId || !formData.problemId || !formData.title || !formData.instruction) {
      toast({
        title: "Ошибка ��алидации",
        description: "Заполните все обязательные поля: устройство, проблема, название и инструкция",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedFormData = {
        problemId: formData.problemId,
        deviceId: formData.deviceId,
        title: formData.title,
        description: formData.description || "",
        instruction: formData.instruction,
        highlightRemoteButton: formData.highlightRemoteButton === "none" ? undefined : formData.highlightRemoteButton,
        highlightTVArea: formData.highlightTVArea === "none" ? undefined : formData.highlightTVArea,
        remoteId: formData.remoteId === "none" ? undefined : formData.remoteId,
        tvInterfaceId: formData.tvInterfaceId === "none" ? undefined : formData.tvInterfaceId,
        buttonPosition:
          formData.buttonPosition.x === 0 && formData.buttonPosition.y === 0
            ? undefined
            : formData.buttonPosition,
        requiredAction: formData.requiredAction || undefined,
        hint: formData.hint || undefined,
      };

      console.log("🔄 Sending update data to API:", updatedFormData);

      const response = await stepsApi.updateStep(selectedStep.id, updatedFormData);
      console.log("✅ Step updated successfully:", response);

      // Update local state
      if (response.data) {
        setSteps((prev) =>
          prev.map((step) => (step.id === selectedStep.id ? { ...step, ...response.data } : step))
        );
      }

      // Reload data to ensure consistency
      await loadInitialData();

      setIsEditDialogOpen(false);
      setSelectedStep(null);
      resetForm();

      toast({
        title: "Успех",
        description: "Шаг успешно обновлен",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error updating step:", error);
      toast({
        title: "Ошибка обновления",
        description: `Не удалось обновить шаг: ${error?.message || 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (stepId: string) => {
    try {
      await stepsApi.deleteStep(stepId);
      
      // Update local state
      setSteps((prev) => prev.filter((step) => step.id !== stepId));

      // Reload data to ensure consistency
      await loadInitialData();

      toast({
        title: "Успех",
        description: "Шаг успешно удален",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error deleting step:", error);
      toast({
        title: "Ошибка удаления",
        description: `Не удалось удалить шаг: ${error?.message || 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;

    try {
      const response = await stepsApi.updateStep(stepId, {
        isActive: !step.isActive,
      });

      // Update local state
      if (response.data) {
        setSteps((prev) =>
          prev.map((s) => (s.id === stepId ? { ...s, isActive: !step.isActive } : s))
        );
      }

      toast({
        title: "Успех",
        description: `Шаг ${!step.isActive ? 'активирован' : 'деактивирован'}`,
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error toggling step status:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус шага",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (step: DiagnosticStep) => {
    console.log("🔄 Opening edit dialog for step:", step);
    
    setSelectedStep(step);
    setFormData({
      deviceId: step.deviceId,
      problemId: step.problemId,
      title: step.title,
      description: step.description,
      instruction: step.instruction,
      highlightRemoteButton: step.highlightRemoteButton || "none",
      highlightTVArea: step.highlightTVArea || "none",
      tvInterface: step.tvInterface || "home",
      tvInterfaceId: step.tvInterfaceId || "none",
      requiredAction: step.requiredAction || "",
      hint: step.hint || "",
      remoteId: step.remoteId || "none",
      buttonPosition: step.buttonPosition || { x: 0, y: 0 },
    });

    // Load TV interfaces for the device
    if (step.deviceId) {
      loadTVInterfacesForDevice(step.deviceId);
    }

    setIsEditDialogOpen(true);
  };

  const openRemoteEditor = () => {
    const remote = getRemoteById(formData.remoteId);
    if (remote) {
      setSelectedRemote(remote);
      setIsRemoteEditorOpen(true);
    }
  };

  const openTVInterfaceEditor = async (tvInterface: TVInterface) => {
    console.log("Opening TV Interface Editor with:", tvInterface);
    setSelectedTVInterface(tvInterface);
    setIsTVInterfaceEditorOpen(true);
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
    return device?.name || "Неизвестная приставка";
  };

  const getProblemTitle = (problemId: string) => {
    const problem = problems.find((p) => p.id === problemId);
    return problem?.title || "Неизвестная проблема";
  };

  const filteredSteps = steps.filter((step) => {
    const matchesSearch =
      step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDevice = filterDevice === "all" || step.deviceId === filterDevice;
    const matchesProblem = filterProblem === "all" || step.problemId === filterProblem;
    const matchesRemote =
      filterRemote === "all" ||
      step.remoteId === filterRemote ||
      (!step.remoteId && filterRemote === "none");
    return matchesSearch && matchesDevice && matchesProblem && matchesRemote;
  });

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
      {} as Record<string, { deviceId: string; problemId: string; steps: DiagnosticStep[] }>
    );
  };


  const renderRemoteEditor = () => {
    const remoteImage = customRemoteImage || selectedRemote?.imageData;

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={600}
              className="border border-gray-300 dark:border-gray-600 rounded cursor-crosshair mx-auto"
              style={{
                backgroundImage: remoteImage ? `url(${remoteImage})` : "none",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: remoteImage ? "transparent" : "#f3f4f6",
              }}
              onClick={handleCanvasClick}
            />

            {formData.buttonPosition.x > 0 && formData.buttonPosition.y > 0 && (
              <div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${(formData.buttonPosition.x / 400) * 100}%`,
                  top: `${(formData.buttonPosition.y / 600) * 100}%`,
                }}
              />
            )}
          </div>
        </div>

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
                >
                  <Target className="h-4 w-4 mr-2" />
                  {isPickingButton ? "Отменить выбор" : "Выбрать позицию"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Загрузить изображение
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {isPickingButton && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Кликните на изображение пульта, чтобы указать позицию кнопки
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {formData.buttonPosition.x > 0 && formData.buttonPosition.y > 0 && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Позиция выбрана: ({Math.round(formData.buttonPosition.x)}, {Math.round(formData.buttonPosition.y)})
                    </p>
                  </AlertDescription>
                </Alert>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление шагами (Исправлено)</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Создание шагов диагностики с привязкой к приставкам и проблемам
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Создать новый шаг
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Создать новый шаг</DialogTitle>
            </DialogHeader>
            <StepFormFields
              isEdit={false}
              formData={formData}
              handleFieldChange={handleFieldChange}
              handleDeviceChange={handleDeviceChange}
              devices={devices}
              problems={problems}
              remotes={remotes}
              tvInterfaces={tvInterfaces}
              loadingTVInterfaces={loadingTVInterfaces}
              getActiveDevices={getActiveDevices}
              getAvailableProblems={getAvailableProblems}
              getAvailableRemotes={getAvailableRemotes}
              openTVInterfaceEditor={openTVInterfaceEditor}
              openRemoteEditor={openRemoteEditor}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.deviceId || !formData.problemId || !formData.title || !formData.instruction}
              >
                Создать
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
                  setFilterRemote("all");
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Приставка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Вс�� приставки</SelectItem>
                  {getActiveDevices().map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`} />
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
                    const device = devices.find((d) => d.id === remote.deviceId);
                    return (
                      <SelectItem key={remote.id} value={remote.id}>
                        <div className="flex items-center">
                          {device && (
                            <div className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`} />
                          )}
                          {remote.name}
                          {remote.isDefault && (
                            <span className="ml-2 text-xs text-blue-600">(по умолчанию)</span>
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
                {getDeviceName(group.deviceId)} - {getProblemTitle(group.problemId)}
                <Badge variant="secondary" className="ml-2">
                  {group.steps.length} шагов
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.steps
                  .sort((a, b) => a.stepNumber - b.stepNumber)
                  .map((step) => (
                    <div key={step.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {step.stepNumber}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                              <Badge variant={step.isActive ? "default" : "secondary"}>
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
                              {step.tvInterfaceId && (
                                <Badge variant="outline">
                                  <Monitor className="h-3 w-3 mr-1" />
                                  ТВ интерфейс
                                </Badge>
                              )}
                              {step.buttonPosition && (
                                <Badge variant="outline">
                                  <Target className="h-3 w-3 mr-1" />
                                  Позиция
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{step.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              {step.remoteId && (
                                <span>Пульт: {getRemoteById(step.remoteId)?.name || "Неизвестный"}</span>
                              )}
                              {step.buttonPosition && (
                                <span>
                                  Позиция: ({Math.round(step.buttonPosition.x)}, {Math.round(step.buttonPosition.y)})
                                </span>
                              )}
                              {step.tvInterfaceId && <span>ТВ интерфейс: {step.tvInterfaceId}</span>}
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
                            <DropdownMenuItem onClick={() => openEditDialog(step)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(step.id)}>
                              {step.isActive ? (
                                <EyeOff className="h-4 w-4 mr-2" />
                              ) : (
                                <Eye className="h-4 w-4 mr-2" />
                              )}
                              {step.isActive ? "Деактивировать" : "Активировать"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(step.id)} className="text-red-600">
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
            <DialogTitle>Выбор позиции на пульте: {selectedRemote?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">{renderRemoteEditor()}</div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsRemoteEditorOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setIsRemoteEditorOpen(false)}>
              <Save className="h-4 w-4 mr-2" />
              С��хранить позицию
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать ш��г</DialogTitle>
          </DialogHeader>
          <StepFormFields
            isEdit={true}
            formData={formData}
            handleFieldChange={handleFieldChange}
            handleDeviceChange={handleDeviceChange}
            devices={devices}
            problems={problems}
            remotes={remotes}
            tvInterfaces={tvInterfaces}
            loadingTVInterfaces={loadingTVInterfaces}
            getActiveDevices={getActiveDevices}
            getAvailableProblems={getAvailableProblems}
            getAvailableRemotes={getAvailableRemotes}
            openTVInterfaceEditor={openTVInterfaceEditor}
            openRemoteEditor={openRemoteEditor}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!formData.deviceId || !formData.problemId || !formData.title || !formData.instruction}
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Шаги не найдены</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Создайте первый шаг диагностики или измените параметры фильтрации
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepsManagerFixed;
