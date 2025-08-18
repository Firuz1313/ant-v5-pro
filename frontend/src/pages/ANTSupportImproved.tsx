import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Star,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Tv,
    title: "3D модели устройств",
    description:
      "Интерактивные 3D модели всех поддерживаемых приставок с детальной визуализацией",
    color: "from-blue-500 via-blue-600 to-indigo-600",
    shadowColor: "shadow-blue-500/30",
  },
  {
    icon: Settings,
    title: "Помощь с настройкой",
    description: "Пошаговые инструкции по конфигурации с видео-гайдами",
    color: "from-purple-500 via-purple-600 to-pink-600",
    shadowColor: "shadow-purple-500/30",
  },
  {
    icon: Smartphone,
    title: "Пульт управления",
    description:
      "Виртуальная симуляция пульта управления с полным функционалом",
    color: "from-green-500 via-green-600 to-emerald-600",
    shadowColor: "shadow-green-500/30",
  },
  {
    icon: Wifi,
    title: "Настройка сети",
    description: "Простая настройка сети и подключения к интернету",
    color: "from-orange-500 via-orange-600 to-amber-600",
    shadowColor: "shadow-orange-500/30",
  },
  {
    icon: PlayCircle,
    title: "Управление каналами",
    description: "Организация и управление ТВ каналами с умной сортировкой",
    color: "from-red-500 via-red-600 to-rose-600",
    shadowColor: "shadow-red-500/30",
  },
  {
    icon: Shield,
    title: "Поддержка 24/7",
    description: "Круглосуточная техническая поддержка от экспертов",
    color: "from-indigo-500 via-indigo-600 to-blue-600",
    shadowColor: "shadow-indigo-500/30",
  },
];

const devices = [
  { name: "OpenBox", users: "2.3M+", status: "активен", rating: 4.8 },
  { name: "OpenBox Gold", users: "1.8M+", status: "активен", rating: 4.9 },
  { name: "Uclan", users: "1.2M+", status: "активен", rating: 4.7 },
  { name: "HDBox", users: "950K+", status: "активен", rating: 4.6 },
];

const ANTSupport = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/select-device");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Улучшенный анимированный фон */}
      <div className="fixed inset-0 -z-10">
        {/* Основные световые эффекты */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Дополнительные световые акценты */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-2xl" />
        </div>

        {/* Сетка фона */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Улучшенная навигационная панель */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform hover:scale-110">
                  <Tv className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className="font-black text-2xl text-white"
                    style={{
                      textShadow: "0 2px 10px rgba(59, 130, 246, 0.5)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ANT{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      Support
                    </span>
                  </span>
                </div>
                <div className="text-sm text-blue-300/80 font-medium -mt-1">
                  Решения для цифрового ТВ
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24">
        {/* Улучшенный главный раздел */}
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="max-w-6xl mx-auto">
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8"
              style={{
                textShadow:
                  "0 4px 30px rgba(0, 0, 0, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)",
                letterSpacing: "-0.03em",
                lineHeight: "0.9",
              }}
            >
              <span className="text-white drop-shadow-2xl">ANT</span>{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 relative"
                style={{ textShadow: "none" }}
              >
                Support
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60" />
              </span>
            </h1>

            <p
              className="text-xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
              style={{ textShadow: "0 2px 20px rgba(0, 0, 0, 0.8)" }}
            >
              Ваша комплексная платформа для поддержки цифровых ТВ-приставок.{" "}
              <span className="text-blue-300">Получите экспертные советы</span>,
              интерактивные 3D модели и{" "}
              <span className="text-cyan-300">круглосуточную помощь</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="relative group bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-10 py-6 text-xl font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-2 rounded-2xl border border-blue-400/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
                <span className="relative flex items-center">
                  Начать работу
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-xl px-10 py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 rounded-2xl backdrop-blur-sm font-semibold"
                style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}
              >
                Связаться с поддержкой
              </Button>
            </div>

            {/* Статистика достижений */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-400 mb-1">
                  6.2M+
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Пользователей
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-cyan-400 mb-1">
                  99.9%
                </div>
                <div className="text-white/70 text-sm font-medium">Uptime</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-green-400 mb-1">
                  4.8★
                </div>
                <div className="text-white/70 text-sm font-medium">Рейтинг</div>
              </div>
            </div>
          </div>
        </section>

        {/* Улучшенная статистика устройств */}
        <section className="container mx-auto px-6 mb-24">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
              style={{ textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)" }}
            >
              Поддерживаемые <span className="text-blue-400">устройства</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {devices.map((device, index) => (
                <div
                  key={device.name}
                  className="group relative backdrop-blur-xl bg-white/[0.08] border border-white/20 rounded-3xl p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Градиентный бордер эффект */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <h3
                      className="text-2xl font-bold text-white mb-3"
                      style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}
                    >
                      {device.name}
                    </h3>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                      {device.users}
                    </p>

                    {/* Рейтинг */}
                    <div className="flex items-center justify-center mb-4 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(device.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="text-white/80 text-sm ml-2 font-semibold">
                        {device.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse shadow-lg shadow-green-500/50" />
                      <span className="text-white/90 text-sm font-semibold">
                        {device.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Улучшенный раздел функций */}
        <section className="container mx-auto px-6 mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                style={{ textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)" }}
              >
                Всё что вам{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  нужно
                </span>
              </h2>
              <p
                className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium"
                style={{ textShadow: "0 2px 15px rgba(0, 0, 0, 0.5)" }}
              >
                Комплексные инструменты и ресурсы, чтобы помочь вам получить
                максимум от вашего цифрового ТВ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="group">
                  <Card
                    className={`relative backdrop-blur-xl bg-white/[0.06] border border-white/20 rounded-3xl p-8 h-full cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${feature.shadowColor} group-hover:bg-white/[0.1] overflow-hidden`}
                  >
                    {/* Эффект свечения при ховере */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                    />

                    <CardContent className="p-0 relative z-10">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl ${feature.shadowColor}`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3
                        className="text-2xl font-bold text-white mb-4"
                        style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-white/80 leading-relaxed text-lg font-medium"
                        style={{ textShadow: "0 1px 8px rgba(0, 0, 0, 0.3)" }}
                      >
                        {feature.description}
                      </p>

                      {/* Иконка проверки */}
                      <div className="flex items-center mt-6 text-green-400">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-semibold">
                          Доступно сейчас
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Улучшенный призыв к действию */}
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="relative backdrop-blur-xl bg-white/[0.08] border border-white/20 rounded-[2.5rem] p-16 shadow-2xl overflow-hidden">
              {/* Декоративные элементы */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-20 blur-2xl" />
              </div>

              <div className="relative z-10">
                <Zap className="h-20 w-20 text-blue-400 mx-auto mb-8 animate-pulse" />
                <h2
                  className="text-4xl md:text-6xl font-bold text-white mb-6"
                  style={{ textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)" }}
                >
                  Готовы{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    начать
                  </span>
                  ?
                </h2>
                <p
                  className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                  style={{ textShadow: "0 2px 15px rgba(0, 0, 0, 0.5)" }}
                >
                  Присоединяйтесь к{" "}
                  <span className="text-blue-300 font-bold">
                    миллионам пользователей
                  </span>
                  , которые доверяют ANT Support для своих потребностей в
                  цифровом ТВ. Получите мгновенный доступ к нашей комплексной
                  платформе поддержки.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-12 py-6 text-xl font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-2 rounded-2xl border border-blue-400/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
                    <span className="relative flex items-center">
                      <Users className="mr-3 h-6 w-6" />
                      Выберите устройство
                      <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ANTSupport;
