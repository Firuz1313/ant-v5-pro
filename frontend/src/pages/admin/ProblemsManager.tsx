import { useState } from "react";
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
  Search,
  MoreVertical,
  Signal,
  Power,
  Monitor,
  Volume2,
  Wifi,
  PlayCircle,
  Settings,
  AlertTriangle,
  TrendingUp,
  Eye,
  EyeOff,
  Upload,
  Download,
  Tv,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";

const iconMap = {
  Signal,
  Power,
  Monitor,
  Volume2,
  Wifi,
  PlayCircle,
  Settings,
  AlertTriangle,
  TrendingUp,
};

interface Problem {
  id: string;
  title: string;
  description: string;
  category: "critical" | "moderate" | "minor" | "other";
  icon: string;
  color: string;
  stepsCount: number;
  completions: number;
  successRate: number;
  status: "active" | "inactive";
  deviceId: string;
  createdAt: string;
  updatedAt: string;
}

const ProblemsManager = () => {
  const {
    problems,
    createProblem,
    updateProblem,
    deleteProblem,
    devices,
    getActiveDevices,
    getStepsForProblem,
  } = useData();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDevice, setFilterDevice] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "moderate" as Problem["category"],
    icon: "AlertTriangle",
    color: "from-yellow-500 to-yellow-600",
    deviceId: "",
  });

  const categories = [
    {
      value: "critical",
      label: "Критическая",
      color: "from-red-500 to-red-600",
    },
    {
      value: "moderate",
      label: "Умеренная",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      value: "minor",
      label: "Незначительная",
      color: "from-green-500 to-green-600",
    },
    { value: "other", label: "Другое", color: "from-gray-500 to-gray-600" },
  ];

  const iconOptions = [
    "Signal",
    "Power",
    "Monitor",
    "Volume2",
    "Wifi",
    "PlayCircle",
    "Settings",
    "AlertTriangle",
    "TrendingUp",
  ];

  const colorOptions = [
    {
      value: "from-red-500 to-red-600",
      label: "Красный",
      preview: "bg-red-500",
    },
    {
      value: "from-yellow-500 to-yellow-600",
      label: "Желтый",
      preview: "bg-yellow-500",
    },
    {
      value: "from-green-500 to-green-600",
      label: "Зеленый",
      preview: "bg-green-500",
    },
    {
      value: "from-blue-500 to-blue-600",
      label: "Синий",
      preview: "bg-blue-500",
    },
    {
      value: "from-purple-500 to-purple-600",
      label: "Фиолетовый",
      preview: "bg-purple-500",
    },
    {
      value: "from-indigo-500 to-indigo-600",
      label: "Индиго",
      preview: "bg-indigo-500",
    },
    {
      value: "from-pink-500 to-pink-600",
      label: "Розовый",
      preview: "bg-pink-500",
    },
    {
      value: "from-gray-500 to-gray-600",
      label: "Серый",
      preview: "bg-gray-500",
    },
  ];

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDevice =
      filterDevice === "all" || problem.deviceId === filterDevice;
    const matchesCategory =
      filterCategory === "all" || problem.category === filterCategory;
    return matchesSearch && matchesDevice && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    const IconComponent =
      iconMap[iconName as keyof typeof iconMap] || AlertTriangle;
    return <IconComponent className="h-5 w-5" />;
  };

  const getDeviceName = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    return device?.name || "Неизвестная приставка";
  };

  const getCategoryInfo = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return (
      cat || {
        value: "other",
        label: "Другое",
        color: "from-gray-500 to-gray-600",
      }
    );
  };

  const handleCreate = async () => {
    try {
      await createProblem({
        ...formData,
        completedCount: 0,
        successRate: 100,
        priority: 1,
        estimatedTime: 5,
        difficulty: "beginner",
        tags: [],
        status: "published",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating problem:", error);
    }
  };

  const handleEdit = async () => {
    if (!selectedProblem) return;

    try {
      await updateProblem(selectedProblem.id, formData);
      setIsEditDialogOpen(false);
      setSelectedProblem(null);
      resetForm();
    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  const handleDelete = async (problemId: string) => {
    const stepsCount = getStepsForProblem(problemId).length;
    if (stepsCount > 0) {
      alert(
        `Нельзя удалить проблему с ${stepsCount} активными шагами. Сначала удалите шаги.`,
      );
      return;
    }

    try {
      await deleteProblem(problemId);
    } catch (error) {
      console.error("Error deleting problem:", error);
      alert("Ошибка при удалении проблемы");
    }
  };

  const handleToggleStatus = async (problemId: string) => {
    const problem = problems.find((p) => p.id === problemId);
    if (!problem) return;

    try {
      await updateProblem(problemId, {
        status: problem.status === "published" ? "draft" : "published",
      });
    } catch (error) {
      console.error("Error toggling problem status:", error);
    }
  };

  const handleDuplicate = async (problem: Problem) => {
    try {
      await createProblem({
        ...problem,
        title: `${problem.title} (копия)`,
        completedCount: 0,
        status: "draft",
      });
    } catch (error) {
      console.error("Error duplicating problem:", error);
    }
  };

  const openEditDialog = (problem: Problem) => {
    setSelectedProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      category: problem.category,
      icon: problem.icon,
      color: problem.color,
      deviceId: problem.deviceId,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "moderate",
      icon: "AlertTriangle",
      color: "from-yellow-500 to-yellow-600",
      deviceId: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление проблемами
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Создание и настройка проблем для различных моделей приставок
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
                Создать проблему
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новую проблему</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deviceId">Приставка</Label>
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
                      {getActiveDevices().map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`}
                            />
                            {device.name} ({device.model})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Название проблемы</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Нет сигнала"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Подробное описание проблемы"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          category: value as Problem["category"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icon">Иконка</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) =>
                        setFormData({ ...formData, icon: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center">
                              {getIcon(icon)}
                              <span className="ml-2">{icon}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="color">Цветовая схема</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) =>
                      setFormData({ ...formData, color: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded ${option.preview} mr-2`}
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!formData.title || !formData.deviceId}
                  >
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск проблем..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterDevice} onValueChange={setFilterDevice}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Приставка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все приставки</SelectItem>
                  {getActiveDevices().map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => {
          const categoryInfo = getCategoryInfo(problem.category);
          const stepsCount = getStepsForProblem(problem.id).length;

          return (
            <Card
              key={problem.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${problem.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {getIcon(problem.icon)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        problem.status === "active" ? "default" : "secondary"
                      }
                    >
                      {problem.status === "active" ? "Активна" : "Неактивна"}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{problem.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Tv className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getDeviceName(problem.deviceId)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {problem.description}
                </p>

                <div className="flex items-center space-x-2">
                  <Badge
                    className={`bg-gradient-to-r ${categoryInfo.color} text-white text-xs`}
                  >
                    {categoryInfo.label}
                  </Badge>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stepsCount}
                    </div>
                    <div className="text-xs text-gray-500">шагов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {problem.successRate}%
                    </div>
                    <div className="text-xs text-gray-500">успеха</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {problem.completions}
                    </div>
                    <div className="text-xs text-gray-500">решений</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(problem.id)}
                      title={
                        problem.status === "active"
                          ? "Деактивировать"
                          : "Активировать"
                      }
                    >
                      {problem.status === "active" ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(problem)}
                      title="Редактировать"
                    >
                      <Edit className="h-3 w-3" />
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
                        onClick={() => handleDuplicate(problem)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Дублировать
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Экспортировать
                      </DropdownMenuItem>
                      {stepsCount === 0 && (
                        <DropdownMenuItem
                          onClick={() => handleDelete(problem.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать проблему</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-deviceId">Приставка</Label>
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
                  {getActiveDevices().map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded bg-gradient-to-br ${device.color} mr-2`}
                        />
                        {device.name} ({device.model})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-title">Название проблемы</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Нет сигнала"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Подробное описание проблемы"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Категория</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as Problem["category"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-icon">Иконка</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) =>
                    setFormData({ ...formData, icon: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center">
                          {getIcon(icon)}
                          <span className="ml-2">{icon}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-color">Цветовая схема</Label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData({ ...formData, color: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded ${option.preview} mr-2`}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!formData.title || !formData.deviceId}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredProblems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Проблемы не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Попробуйте изменить фильтры поиска или создайте новую проблему.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProblemsManager;
