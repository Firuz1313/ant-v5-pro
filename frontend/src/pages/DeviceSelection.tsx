import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ChevronRight,
  Tv,
  Zap,
  Settings,
  Star,
  Sparkles,
  Heart,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useState, useEffect } from "react";

const DeviceSelection = () => {
  const navigate = useNavigate();
  const { getActiveDevices, getProblemsForDevice } = useData();
  const devices = getActiveDevices();
  const [animatedIcons, setAnimatedIcons] = useState<boolean[]>([]);

  useEffect(() => {
    // Создаем анимацию для floating icons
    const timer = setInterval(() => {
      setAnimatedIcons((prev) => prev.map(() => Math.random() > 0.7));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleDeviceSelect = (deviceId: string) => {
    navigate(`/problems/${deviceId}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  const getDeviceIcon = (deviceId: string) => {
    switch (deviceId) {
      case "openbox":
        return <Tv className="h-8 w-8" />;
      case "uclan":
        return <Zap className="h-8 w-8" />;
      case "hdbox":
        return <Settings className="h-8 w-8" />;
      case "openbox_gold":
        return <Star className="h-8 w-8" />;
      default:
        return <Tv className="h-8 w-8" />;
    }
  };

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Tv className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">
                  Выбор приставки
                </span>
                <div className="text-xs text-gray-400 -mt-1">
                  Шаг 1 из 3: Выберите вашу модель приставки
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
              Какая у вас приставка?
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Выберите модель вашей ТВ-приставки для получения
              персонализированной помощи
            </p>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {devices.map((device) => {
                const problemsCount = getProblemsForDevice(device.id).length;

                return (
                  <Card
                    key={device.id}
                    className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:scale-105"
                    onClick={() => handleDeviceSelect(device.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${device.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        {getDeviceIcon(device.id)}
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">
                        {device.name}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">{device.model}</p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <p className="text-gray-300 text-center leading-relaxed">
                        {device.description}
                      </p>

                      {/* Problems count */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-300 font-medium">
                            {problemsCount} решений доступно
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Animation Section */}
        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-emerald-500/10 border-white/20 backdrop-blur-md hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 relative overflow-hidden">
              <CardContent className="p-10 text-center relative z-10">
                {/* Floating Animation Icons */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute transition-all duration-1000 ${
                        animatedIcons[i]
                          ? "opacity-100 scale-110"
                          : "opacity-30 scale-100"
                      }`}
                      style={{
                        left: `${10 + i * 12}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 200}ms`,
                      }}
                    >
                      {i % 4 === 0 && (
                        <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                      )}
                      {i % 4 === 1 && (
                        <Heart className="h-4 w-4 text-pink-400 animate-bounce" />
                      )}
                      {i % 4 === 2 && (
                        <Star className="h-4 w-4 text-yellow-400 animate-spin" />
                      )}
                      {i % 4 === 3 && (
                        <Zap className="h-4 w-4 text-blue-400 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-blue-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-gentle">
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Профессиональная поддержка 24/7
                </h3>

                <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
                  Наша команда экспертов всегда готова помочь вам решить любые
                  проблемы с вашей ТВ-приставкой. Быстро, качественно,
                  эффективно.
                </p>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      99.9%
                    </div>
                    <div className="text-sm text-gray-400">
                      Успешных решений
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      5 мин
                    </div>
                    <div className="text-sm text-gray-400">Среднее время</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      24/7
                    </div>
                    <div className="text-sm text-gray-400">Поддержка</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Heart className="h-5 w-5 mr-2 text-pink-400" />
                  Начать диагностику
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Tv className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">ANT Support</div>
                  <div className="text-sm text-gray-400">v1.0.0</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                © 2025 ANT Support. Все права защищены.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DeviceSelection;
