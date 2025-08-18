import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import {
  PlayCircle,
  Tv,
  Settings,
  BarChart3,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Zap,
  Monitor,
  MousePointer,
  Eye,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { devices, problems, getEntityStats } = useData();

  const deviceStats = getEntityStats("devices");
  const problemStats = getEntityStats("problems");

  const handleStartDiagnostic = () => {
    navigate("/devices");
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Быстрая диагностика
              <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                ТВ-приставок
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Профессиональные решения для любых проблем. Простой интерфейс,
              быстрые результаты.
            </p>

            <Button
              size="lg"
              onClick={handleStartDiagnostic}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-10 py-4 text-lg font-medium rounded-xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              <PlayCircle className="h-6 w-6 mr-3" />
              Начать диагностику
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Tv className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {deviceStats.active}
                </div>
                <div className="text-sm text-gray-300">
                  Поддерживаемых моделей
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {problemStats.total}
                </div>
                <div className="text-sm text-gray-300">Готовых решений</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">5 мин</div>
                <div className="text-sm text-gray-300">
                  Среднее время решения
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-gray-300">Доступность</div>
              </CardContent>
            </Card>
          </div>

          {/* Supported Devices */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Поддерживаемые устройства
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {devices
                .filter((d) => d.isActive)
                .map((device) => (
                  <Card
                    key={device.id}
                    className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <CardContent className="p-5 text-center">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${device.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                      >
                        <Tv className="h-6 w-6 text-white" />
                      </div>
                      <div className="font-semibold text-white mb-1">
                        {device.name}
                      </div>
                      <div className="text-sm text-gray-300">
                        {device.model}
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-xs bg-green-500/20 text-green-300 border-green-500/30"
                      >
                        Доступно
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl p-10">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Почему выбирают нас
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Надежность
                </h4>
                <p className="text-gray-300">
                  Проверенные решения от профессиональных техников с многолетним
                  опытом работы
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Быстрота
                </h4>
                <p className="text-gray-300">
                  Среднее время решения проблемы составляет всего 5 минут
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Эффективность
                </h4>
                <p className="text-gray-300">
                  Комплексный подход к решению проб��ем без вызова техника
                </p>
              </div>
            </div>
          </div>

          {/* TV Interface Builder Highlight */}
          <div className="mt-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-2xl p-10">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Конструктор интерфейсов ТВ
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Создавайте и управляйте интерфейсами ТВ-приставок для точной диагностики.
                Загружайте скриншоты, отмечайте интерактивные области и интегрируйте с процессом диагностики.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Создание интерфейсов
                </h4>
                <p className="text-gray-300 text-sm">
                  Загружайте скриншоты интерфейсов ваших ТВ-приставок и создавайте детальные представления
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MousePointer className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Интерактивные области
                </h4>
                <p className="text-gray-300 text-sm">
                  Отмечайте кликабельные области и зоны подсветки для эффективной диагностики
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Интеграция в диагностику
                </h4>
                <p className="text-gray-300 text-sm">
                  Созданные и��терфейсы автоматически отображаются в процессе диагностики
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/admin/tv-interfaces")}
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                <Settings className="h-5 w-5 mr-3" />
                Открыть конструктор
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Tv className="h-5 w-5 text-white" />
              </div>
              <div>
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
  );
};

export default Index;
