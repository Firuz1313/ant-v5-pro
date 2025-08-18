import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import {
  Tv,
  Settings,
  Smartphone,
  Wifi,
  PlayCircle,
  Shield,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Tv,
    title: "3D модели устройств",
    description: "Интерактивные 3D модели всех поддерживаемых приставок",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Settings,
    title: "Помощь с настройкой",
    description: "Пошаговые инструкции по конфигурации",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Smartphone,
    title: "Пульт управления",
    description: "Виртуальная симуляция пульта управления",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Wifi,
    title: "Настройка сети",
    description: "Простая настройка сети и подключения",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: PlayCircle,
    title: "Управление каналами",
    description: "Организация и управление ТВ каналами",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Поддержка 24/7",
    description: "Круглосуточная техническая поддержка",
    color: "from-indigo-500 to-indigo-600",
  },
];

const devices = [
  { name: "OpenBox", users: "2.3M+", status: "активен" },
  { name: "OpenBox Gold", users: "1.8M+", status: "активен" },
  { name: "Uclan", users: "1.2M+", status: "активен" },
  { name: "HDBox", users: "950K+", status: "активен" },
];

const ANTSupport = () => {
  const navigate = useNavigate();
  const { siteSettings } = useData();

  const handleGetStarted = () => {
    navigate("/problems");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Навигационная панель */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Tv className="h-5 w-5 text-white" />
              </div>
              <div>
                <span
                  className="font-bold text-xl text-white"
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
                >
                  {siteSettings.siteName}
                </span>
                <div className="text-xs text-gray-400 -mt-1">
                  Решения для цифрового ТВ
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                className="text-white hover:bg-white/10 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20">
        {/* Главный раздел */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in"
            style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              {siteSettings.siteName}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {siteSettings.siteDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              size="xl"
              variant="premium"
              className="group"
            >
              Начать работу
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 transition-all duration-300"
            >
              Связаться с поддержкой
            </Button>
          </div>
        </section>

        {/* Статистика устройств */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {devices.map((device, index) => (
              <div
                key={device.name}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {device.name}
                </h3>
                <p className="text-2xl font-bold text-blue-400 mb-1">
                  {device.users}
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-sm text-gray-400">{device.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Функции */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              Всё что вам нужно
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Комплексные инструменты и ресурсы, чтобы помочь вам получить
              максимум от вашего цифрового ТВ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="group">
                <Card className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 group-hover:bg-white/10">
                  <CardContent className="p-0">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Призыв к действию */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 max-w-4xl mx-auto shadow-2xl">
            <Zap className="h-16 w-16 text-blue-400 mx-auto mb-6 animate-pulse" />
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              Готовы начать?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Присоединяйтесь к миллионам пользователей, которые доверяют ANT
              Support для своих потребностей в цифровом ТВ. Получите мгновенный
              доступ к нашей комплексной платформе поддержки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                variant="glow"
                className="group"
              >
                <Users className="mr-2 h-5 w-5" />
                Выберите устройство
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Admin Quick Access */}
        <section className="container mx-auto px-4 pb-8">
          <div className="text-center">
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              size="sm"
              className="group"
            >
              <Settings className="mr-2 h-3 w-3" />
              Панель администратора
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ANTSupport;
