import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Signal,
  Power,
  Monitor,
  Volume2,
  Wifi,
  PlayCircle,
  Settings,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  Tv,
} from "lucide-react";
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
  Users,
  Clock,
};

const ProblemsPage = () => {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();
  const { getDeviceById, getProblemsForDevice } = useData();

  const device = deviceId ? getDeviceById(deviceId) : null;
  const problems = deviceId ? getProblemsForDevice(deviceId) : [];

  const handleProblemSelect = (problemId: string) => {
    navigate(`/diagnostic/${deviceId}/${problemId}`);
  };

  const handleBack = () => {
    navigate("/devices");
  };

  const getIcon = (iconName: string) => {
    const IconComponent =
      iconMap[iconName as keyof typeof iconMap] || AlertTriangle;
    return <IconComponent className="h-6 w-6" />;
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "critical":
        return {
          label: "Критическая",
          color: "bg-red-500",
          textColor: "text-red-100",
        };
      case "moderate":
        return {
          label: "Умеренная",
          color: "bg-yellow-500",
          textColor: "text-yellow-100",
        };
      case "minor":
        return {
          label: "Незначительная",
          color: "bg-green-500",
          textColor: "text-green-100",
        };
      case "other":
        return {
          label: "Другое",
          color: "bg-gray-500",
          textColor: "text-gray-100",
        };
      default:
        return {
          label: "Неизвестно",
          color: "bg-gray-500",
          textColor: "text-gray-100",
        };
    }
  };

  if (!device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-4">Приставка не найдена</h2>
          <Button onClick={() => navigate("/devices")}>
            Выбрать приставку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div
                className={`w-10 h-10 bg-gradient-to-br ${device.color} rounded-lg flex items-center justify-center shadow-lg`}
              >
                <Tv className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">
                  {device.name}
                </span>
                <div className="text-xs text-gray-400 -mt-1">
                  Шаг 2 из 3: Выберите проблему
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-8">
        {/* Page Title */}
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Какая проблема с {device.name}?
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Выберите проблему, которая лучше всего описывает вашу ситуацию
            </p>
          </div>
        </div>

        {/* Device Info Card */}
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${device.color} rounded-2xl flex items-center justify-center text-white`}
                  >
                    <Tv className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {device.name}
                    </h3>
                    <p className="text-gray-300">{device.model}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {device.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {problems.length}
                    </div>
                    <div className="text-gray-400 text-sm">
                      типов проблем
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {problems.length === 0 ? (
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Нет доступных проблем
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Для данной модели приставки пока нет настроенных решений проблем
                  </p>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Связаться с поддержкой
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem) => {
                  const categoryInfo = getCategoryInfo(problem.category);

                  return (
                    <Card
                      key={problem.id}
                      className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:scale-105"
                      onClick={() => handleProblemSelect(problem.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${problem.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                          >
                            {getIcon(problem.icon)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${categoryInfo.color} ${categoryInfo.textColor} text-xs`}
                            >
                              {categoryInfo.label}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-colors">
                          {problem.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm">
                          {problem.description}
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
                          <div className="text-center">
                            <div className="text-white font-semibold text-sm">
                              {problem.stepsCount}
                            </div>
                            <div className="text-gray-400 text-xs">шагов</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-400 font-semibold text-sm">
                              {problem.successRate}%
                            </div>
                            <div className="text-gray-400 text-xs">успеха</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 font-semibold text-sm">
                              {problem.completions}
                            </div>
                            <div className="text-gray-400 text-xs">решений</div>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex items-center justify-between pt-3">
                          <span className="text-blue-400 text-sm font-medium">
                            Начать диагностику
                          </span>
                          <ChevronRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        {problems.length > 0 && (
          <div className="container mx-auto px-4 mt-16">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-white/20 backdrop-blur-md">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Не нашли свою проблему?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Свяжитесь с нашей службой поддержки для получения персональной помощи
                  </p>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Связаться с поддержкой
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;
