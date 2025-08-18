import { useState, useRef } from "react";
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
  Upload,
  Download,
  Copy,
  Eye,
  MoreVertical,
  Smartphone as RemoteIcon,
  Palette,
  Settings,
  ImageIcon,
  Target,
  Save,
  MousePointer,
  Monitor,
  Crosshair,
  AlertTriangle,
  Filter,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RemoteControl from "@/components/RemoteControl";
import { useData } from "@/contexts/DataContext";

interface RemoteButton {
  id: string;
  label: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  shape: "rectangle" | "circle" | "rounded" | "custom";
  color: string;
  textColor: string;
  fontSize: number;
  action: string;
  isVisible: boolean;
}

interface RemoteTemplate {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  description: string;
  layout: "standard" | "compact" | "smart" | "custom";
  colorScheme: string;
  imageUrl?: string;
  imageData?: string;
  dimensions: { width: number; height: number };
  buttons: RemoteButton[];
  deviceId?: string;
  isDefault: boolean;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

const RemoteBuilder = () => {
  const {
    remotes,
    createRemote,
    updateRemote,
    deleteRemote,
    getActiveDevices,
    getDeviceById,
    getRemotesForDevice,
    canDeleteRemote,
    getRemoteUsageCount,
  } = useData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedRemote, setSelectedRemote] = useState<RemoteTemplate | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isEditorDialogOpen, setIsEditorDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLayout, setFilterLayout] = useState<string>("all");
  const [filterDevice, setFilterDevice] = useState<string>("all");

  // Editor state
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedButton, setSelectedButton] = useState<RemoteButton | null>(
    null,
  );
  const [isCreatingButton, setIsCreatingButton] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isPickingMode, setIsPickingMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    model: "",
    description: "",
    layout: "standard" as RemoteTemplate["layout"],
    colorScheme: "dark",
    deviceId: "universal",
  });

  const [buttonFormData, setButtonFormData] = useState({
    label: "",
    action: "",
    shape: "rectangle" as RemoteButton["shape"],
    color: "#4B5563",
    textColor: "#FFFFFF",
    fontSize: 12,
  });

  const devices = getActiveDevices();

  const layouts = [
    { value: "standard", label: "Стандартный" },
    { value: "compact", label: "Компактный" },
    { value: "smart", label: "Умный ТВ" },
    { value: "custom", label: "Пользовательский" },
  ];

  const colorSchemes = [
    { value: "dark", label: "Темная", preview: "bg-gray-800" },
    { value: "light", label: "Светлая", preview: "bg-gray-200" },
    { value: "blue", label: "Синяя", preview: "bg-blue-600" },
    { value: "red", label: "Красная", preview: "bg-red-600" },
    { value: "green", label: "Зеленая", preview: "bg-green-600" },
  ];

  const actionTypes = [
    "power",
    "home",
    "back",
    "settings",
    "ok",
    "up",
    "down",
    "left",
    "right",
    "vol-up",
    "vol-down",
    "mute",
    "number-1",
    "number-2",
    "number-3",
    "number-4",
    "number-5",
    "number-6",
    "number-7",
    "number-8",
    "number-9",
    "number-0",
    "menu",
    "guide",
    "info",
    "exit",
    "red",
    "green",
    "yellow",
    "blue",
  ];

  const filteredRemotes = remotes.filter((remote) => {
    const matchesSearch =
      remote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remote.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remote.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLayout =
      filterLayout === "all" || remote.layout === filterLayout;
    const matchesDevice =
      filterDevice === "all" ||
      remote.deviceId === filterDevice ||
      (filterDevice === "universal" &&
        (!remote.deviceId || remote.deviceId === ""));
    return matchesSearch && matchesLayout && matchesDevice;
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    try {
      await createRemote({
        ...formData,
        deviceId: formData.deviceId === "universal" ? "" : formData.deviceId,
        dimensions: { width: 400, height: 600 },
        buttons: [],
        imageData: previewImageUrl || undefined,
        isDefault: false,
        isActive: true,
        usageCount: 0,
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating remote:", error);
    }
  };

  const handleEdit = async () => {
    if (!selectedRemote) return;

    try {
      await updateRemote(selectedRemote.id, {
        ...formData,
        deviceId: formData.deviceId === "universal" ? "" : formData.deviceId,
        imageData: previewImageUrl || selectedRemote.imageData,
      });
      setIsEditDialogOpen(false);
      setSelectedRemote(null);
      resetForm();
    } catch (error) {
      console.error("Error updating remote:", error);
    }
  };

  const handleDelete = async (remoteId: string) => {
    const deleteCheck = canDeleteRemote(remoteId);
    if (!deleteCheck.canDelete) {
      alert(deleteCheck.reason);
      return;
    }

    try {
      await deleteRemote(remoteId);
    } catch (error) {
      console.error("Error deleting remote:", error);
      alert("Ошибка при удалении пульта");
    }
  };

  const handleToggleStatus = async (remoteId: string) => {
    const remote = remotes.find((r) => r.id === remoteId);
    if (!remote) return;

    try {
      await updateRemote(remoteId, {
        isActive: !remote.isActive,
      });
    } catch (error) {
      console.error("Error toggling remote status:", error);
    }
  };

  const handleSetDefault = async (remoteId: string) => {
    const remote = remotes.find((r) => r.id === remoteId);
    if (!remote?.deviceId) return;

    try {
      // First, unset all defaults for the device
      const deviceRemotes = remotes.filter(
        (r) => r.deviceId === remote.deviceId,
      );
      for (const deviceRemote of deviceRemotes) {
        if (deviceRemote.isDefault && deviceRemote.id !== remoteId) {
          await updateRemote(deviceRemote.id, { isDefault: false });
        }
      }

      // Then set the new default
      await updateRemote(remoteId, { isDefault: true });
    } catch (error) {
      console.error("Error setting default remote:", error);
    }
  };

  const handleDuplicate = async (remote: RemoteTemplate) => {
    try {
      await createRemote({
        ...remote,
        name: `${remote.name} (копия)`,
        isDefault: false,
        usageCount: 0,
      });
    } catch (error) {
      console.error("Error duplicating remote:", error);
    }
  };

  const openEditDialog = (remote: RemoteTemplate) => {
    setSelectedRemote(remote);
    setFormData({
      name: remote.name,
      manufacturer: remote.manufacturer,
      model: remote.model,
      description: remote.description,
      layout: remote.layout,
      colorScheme: remote.colorScheme,
      deviceId: remote.deviceId || "universal",
    });
    setPreviewImageUrl(remote.imageData || null);
    setIsEditDialogOpen(true);
  };

  const openEditorDialog = (remote: RemoteTemplate) => {
    setSelectedRemote(remote);
    setPreviewImageUrl(remote.imageData || null);
    setIsEditorDialogOpen(true);
    setIsEditingMode(false);
    setSelectedButton(null);
    setIsPickingMode(false);
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setCursorPosition({ x, y });
  };

  const handleCanvasClick = async (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    if (!isCreatingButton || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const newButton: RemoteButton = {
      id: Date.now().toString(),
      label: buttonFormData.label || "Кнопка",
      position: { x, y },
      size: { width: 40, height: 40 },
      shape: buttonFormData.shape,
      color: buttonFormData.color,
      textColor: buttonFormData.textColor,
      fontSize: buttonFormData.fontSize,
      action: buttonFormData.action,
      isVisible: true,
    };

    if (selectedRemote) {
      const updatedRemote = {
        ...selectedRemote,
        buttons: [...selectedRemote.buttons, newButton],
      };

      try {
        await updateRemote(selectedRemote.id, {
          buttons: updatedRemote.buttons,
        });
        setSelectedRemote(updatedRemote);
      } catch (error) {
        console.error("Error adding button:", error);
      }
    }

    setIsCreatingButton(false);
    resetButtonForm();
  };

  const handleButtonEdit = (button: RemoteButton) => {
    setSelectedButton(button);
    setButtonFormData({
      label: button.label,
      action: button.action,
      shape: button.shape,
      color: button.color,
      textColor: button.textColor,
      fontSize: button.fontSize,
    });
  };

  const handleButtonUpdate = async () => {
    if (!selectedButton || !selectedRemote) return;

    const updatedButton = {
      ...selectedButton,
      ...buttonFormData,
    };

    const updatedRemote = {
      ...selectedRemote,
      buttons: selectedRemote.buttons.map((b) =>
        b.id === selectedButton.id ? updatedButton : b,
      ),
      updatedAt: new Date().toISOString().split("T")[0],
    };

    try {
      await updateRemote(selectedRemote.id, {
        buttons: updatedRemote.buttons,
      });
      setSelectedRemote(updatedRemote);
      setSelectedButton(null);
      resetButtonForm();
    } catch (error) {
      console.error("Error updating button:", error);
    }
  };

  const handleButtonDelete = async (buttonId: string) => {
    if (!selectedRemote) return;

    const updatedRemote = {
      ...selectedRemote,
      buttons: selectedRemote.buttons.filter((b) => b.id !== buttonId),
      updatedAt: new Date().toISOString().split("T")[0],
    };

    try {
      await updateRemote(selectedRemote.id, {
        buttons: updatedRemote.buttons,
      });
      setSelectedRemote(updatedRemote);
    } catch (error) {
      console.error("Error deleting button:", error);
    }
  };

  const saveRemoteChanges = async () => {
    if (!selectedRemote) return;

    try {
      await updateRemote(selectedRemote.id, selectedRemote);
      setIsEditorDialogOpen(false);
    } catch (error) {
      console.error("Error saving remote changes:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      manufacturer: "",
      model: "",
      description: "",
      layout: "standard",
      colorScheme: "dark",
      deviceId: "universal",
    });
    setPreviewImageUrl(null);
    setCurrentImageFile(null);
  };

  const resetButtonForm = () => {
    setButtonFormData({
      label: "",
      action: "",
      shape: "rectangle",
      color: "#4B5563",
      textColor: "#FFFFFF",
      fontSize: 12,
    });
  };

  const renderRemoteEditor = () => {
    if (!selectedRemote) return null;

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas Area */}
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={600}
              className={`border border-gray-300 dark:border-gray-600 rounded mx-auto ${
                isCreatingButton ? "cursor-crosshair" : "cursor-default"
              }`}
              style={{
                backgroundImage: previewImageUrl
                  ? `url(${previewImageUrl})`
                  : "none",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: previewImageUrl ? "transparent" : "#f3f4f6",
              }}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
            />

            {/* Cursor position indicator */}
            {isCreatingButton && cursorPosition && (
              <div
                className="absolute bg-blue-500 text-white px-2 py-1 rounded text-xs pointer-events-none"
                style={{
                  left: `${(cursorPosition.x / 400) * 100}%`,
                  top: `${(cursorPosition.y / 600) * 100 + 10}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {Math.round(cursorPosition.x)}, {Math.round(cursorPosition.y)}
              </div>
            )}

            {/* Render buttons on canvas */}
            {selectedRemote.buttons.map((button) => (
              <div
                key={button.id}
                className="absolute border-2 border-blue-500 cursor-pointer hover:border-blue-700 transition-colors"
                style={{
                  left: `${(button.position.x / 400) * 100}%`,
                  top: `${(button.position.y / 600) * 100}%`,
                  width: `${(button.size.width / 400) * 100}%`,
                  height: `${(button.size.height / 600) * 100}%`,
                  backgroundColor: button.color + "80",
                  color: button.textColor,
                  fontSize: `${button.fontSize}px`,
                  borderRadius:
                    button.shape === "circle"
                      ? "50%"
                      : button.shape === "rounded"
                        ? "8px"
                        : "0",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonEdit(button);
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {button.label}
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Управление
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={isCreatingButton ? "default" : "outline"}
                  onClick={() => {
                    setIsCreatingButton(!isCreatingButton);
                    setSelectedButton(null);
                  }}
                  className="w-full"
                >
                  <Crosshair className="h-4 w-4 mr-2" />
                  {isCreatingButton ? "Отменить" : "Выбрать позицию"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Изображение
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {isCreatingButton && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Crosshair className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="text-sm">
                        Кликните на изображение пульта для добавления кнопки
                      </p>
                      <div>
                        <Label htmlFor="button-label">Название кнопки</Label>
                        <Input
                          id="button-label"
                          value={buttonFormData.label}
                          onChange={(e) =>
                            setButtonFormData({
                              ...buttonFormData,
                              label: e.target.value,
                            })
                          }
                          placeholder="Например: POWER"
                        />
                      </div>
                      <div>
                        <Label htmlFor="button-action">Действие</Label>
                        <Select
                          value={buttonFormData.action}
                          onValueChange={(value) =>
                            setButtonFormData({
                              ...buttonFormData,
                              action: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите действие" />
                          </SelectTrigger>
                          <SelectContent>
                            {actionTypes.map((action) => (
                              <SelectItem key={action} value={action}>
                                {action}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {selectedButton && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <Edit className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">
                        Редактирование: {selectedButton.label}
                      </p>
                      <div>
                        <Label htmlFor="edit-button-label">Название</Label>
                        <Input
                          id="edit-button-label"
                          value={buttonFormData.label}
                          onChange={(e) =>
                            setButtonFormData({
                              ...buttonFormData,
                              label: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-button-action">Действие</Label>
                        <Select
                          value={buttonFormData.action}
                          onValueChange={(value) =>
                            setButtonFormData({
                              ...buttonFormData,
                              action: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {actionTypes.map((action) => (
                              <SelectItem key={action} value={action}>
                                {action}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleButtonUpdate} size="sm">
                          <Save className="h-3 w-3 mr-1" />
                          Сохранить
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleButtonDelete(selectedButton.id)}
                          size="sm"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Buttons List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Кнопки ({selectedRemote.buttons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedRemote.buttons.map((button) => (
                  <div
                    key={button.id}
                    className={`flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedButton?.id === button.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => handleButtonEdit(button)}
                  >
                    <div>
                      <div className="font-medium text-sm">{button.label}</div>
                      <div className="text-xs text-gray-500">
                        {button.action}
                      </div>
                    </div>
                    <MousePointer className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
                {selectedRemote.buttons.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Нет кнопок</p>
                    <p className="text-xs">
                      Используйте указатель для добавления
                    </p>
                  </div>
                )}
              </div>
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
            Конструктор пультов
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Создание и настройка интерактивных пультов с привязкой к приставкам
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Импорт
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Создать пульт
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать новый пульт</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Введите название пульта"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">Производитель</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manufacturer: e.target.value,
                        })
                      }
                      placeholder="Производитель"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model">Модель</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      placeholder="Модель пульта"
                    />
                  </div>
                  <div>
                    <Label htmlFor="device">Приставка</Label>
                    <Select
                      value={formData.deviceId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, deviceId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите приставку" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="universal">Универсальный</SelectItem>
                        {devices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Введите описание пульта"
                  />
                </div>

                <div>
                  <Label htmlFor="image-upload">Изображение пульта</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {previewImageUrl
                        ? "Изменить изображение"
                        : "Загрузить изображение"}
                    </Button>
                  </div>
                  {previewImageUrl && (
                    <div className="mt-2">
                      <img
                        src={previewImageUrl}
                        alt="Предварительный просмотр"
                        className="w-full h-32 object-contain bg-gray-100 dark:bg-gray-800 rounded"
                      />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="layout">Макет</Label>
                    <Select
                      value={formData.layout}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          layout: value as RemoteTemplate["layout"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {layouts.map((layout) => (
                          <SelectItem key={layout.value} value={layout.value}>
                            {layout.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="colorScheme">Цветовая схема</Label>
                    <Select
                      value={formData.colorScheme}
                      onValueChange={(value) =>
                        setFormData({ ...formData, colorScheme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorSchemes.map((scheme) => (
                          <SelectItem key={scheme.value} value={scheme.value}>
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded ${scheme.preview} mr-2`}
                              />
                              {scheme.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button onClick={handleCreate} disabled={!formData.name}>
                    Создать
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <RemoteIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск пультов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterDevice} onValueChange={setFilterDevice}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Приставка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все приставки</SelectItem>
                  <SelectItem value="universal">Универсальные</SelectItem>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterLayout} onValueChange={setFilterLayout}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Макет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все макеты</SelectItem>
                  {layouts.map((layout) => (
                    <SelectItem key={layout.value} value={layout.value}>
                      {layout.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRemotes.map((remote) => {
          const device = remote.deviceId
            ? getDeviceById(remote.deviceId)
            : null;
          const usageCount = getRemoteUsageCount(remote.id);

          return (
            <Card key={remote.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{remote.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    {remote.isDefault && (
                      <Badge variant="default">По умолчанию</Badge>
                    )}
                    <Badge variant={remote.isActive ? "default" : "secondary"}>
                      {remote.isActive ? "Активный" : "Неактивный"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Device Badge */}
                  {device && (
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <Badge
                        variant="outline"
                        className={`bg-gradient-to-r ${device.color} text-white`}
                      >
                        {device.name}
                      </Badge>
                    </div>
                  )}

                  {/* Remote Preview */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-48 flex items-center justify-center relative">
                    {remote.imageData ? (
                      <img
                        src={remote.imageData}
                        alt={remote.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="scale-50 origin-center">
                        <RemoteControl />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2" variant="outline">
                      {remote.buttons.length} кнопок
                    </Badge>
                  </div>

                  {/* Remote Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Производитель:
                      </span>
                      <span className="font-medium">{remote.manufacturer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Модель:
                      </span>
                      <span className="font-medium">{remote.model}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Макет:
                      </span>
                      <span className="font-medium">
                        {layouts.find((l) => l.value === remote.layout)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Использований:
                      </span>
                      <span className="font-medium">{usageCount}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {remote.description}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditorDialog(remote)}
                      >
                        <Palette className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(remote)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(remote)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(remote.id)}
                        >
                          {remote.isActive ? "Деактивировать" : "Активировать"}
                        </DropdownMenuItem>
                        {!remote.isDefault && remote.deviceId && (
                          <DropdownMenuItem
                            onClick={() => handleSetDefault(remote.id)}
                          >
                            Сделать по умолчанию
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Экспортировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(remote.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Editor Dialog */}
      <Dialog open={isEditorDialogOpen} onOpenChange={setIsEditorDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5" />
              Интерактивный редактор: {selectedRemote?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">{renderRemoteEditor()}</div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditorDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={saveRemoteChanges}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактиров��ть пульт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Название</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Введите название пульта"
                />
              </div>
              <div>
                <Label htmlFor="edit-manufacturer">Производитель</Label>
                <Input
                  id="edit-manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  placeholder="Производитель"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-model">Модель</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="Модель пульта"
                />
              </div>
              <div>
                <Label htmlFor="edit-device">Приставка</Label>
                <Select
                  value={formData.deviceId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, deviceId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите приставку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="universal">Универсальный</SelectItem>
                    {devices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Введите описание пульта"
              />
            </div>

            <div>
              <Label htmlFor="edit-image-upload">Изображение пульта</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {previewImageUrl
                    ? "Изменить изображение"
                    : "Загрузить изображение"}
                </Button>
              </div>
              {previewImageUrl && (
                <div className="mt-2">
                  <img
                    src={previewImageUrl}
                    alt="Предварительный просмотр"
                    className="w-full h-32 object-contain bg-gray-100 dark:bg-gray-800 rounded"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-layout">Макет</Label>
                <Select
                  value={formData.layout}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      layout: value as RemoteTemplate["layout"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layouts.map((layout) => (
                      <SelectItem key={layout.value} value={layout.value}>
                        {layout.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-colorScheme">Цветовая схема</Label>
                <Select
                  value={formData.colorScheme}
                  onValueChange={(value) =>
                    setFormData({ ...formData, colorScheme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorSchemes.map((scheme) => (
                      <SelectItem key={scheme.value} value={scheme.value}>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded ${scheme.preview} mr-2`}
                          />
                          {scheme.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleEdit} disabled={!formData.name}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredRemotes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <RemoteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Пульты не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Попробуйте изменить фильтры поиска или создайте новый пульт.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RemoteBuilder;
