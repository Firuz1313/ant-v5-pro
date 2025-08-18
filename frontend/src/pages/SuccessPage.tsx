import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Home,
  ArrowRight,
  Tv,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const {
    deviceId,
    sessionId,
    problemId: paramProblemId,
  } = useParams<{
    deviceId?: string;
    sessionId?: string;
    problemId?: string;
  }>();
  const [searchParams] = useSearchParams();
  const problemId =
    paramProblemId || searchParams.get("problemId") || undefined;
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getProblemTitle = (id: string) => {
    const titles: Record<string, string> = {
      "no-signal": "Проблема с сигналом решена!",
      "no-power": "Проблема с питанием решена!",
      "no-image": "Проблема с изображением решена!",
      "no-sound": "Проблема со звуком решена!",
      "wifi-issues": "Проблема с Wi-Fi решена!",
      "channels-missing": "Проблема с каналами решена!",
      "remote-not-working": "Проблема с пультом решена!",
    };
    return titles[id || ""] || "Проблема решена!";
  };

  const getSolutionMessage = (id: string) => {
    const messages: Record<string, string> = {
      "no-signal":
        "Ваша ТВ-приставка успешно подключена и настроена. Сигнал восстановлен!",
      "no-power":
        "Питание приставки восстановлено. Устройство работает нормально!",
      "no-image": "Изображение появилось. Настройки дисплея оптимизированы!",
      "no-sound": "Звук восстановлен. Все аудио настройки работают корректно!",
      "wifi-issues":
        "Подключение к Wi-Fi установлено. Интернет работает стабильно!",
      "channels-missing":
        "Список каналов обновлен. Все каналы доступны для просмотра!",
      "remote-not-working": "Пульт управления настроен и работает корректно!",
    };
    return messages[id || ""] || "Ваша проблема успешно решена!";
  };

  const handleTryAgain = () => {
    if (deviceId && problemId) {
      navigate(`/diagnostic/${deviceId}/${problemId}`);
    } else if (deviceId) {
      navigate(`/problems/${deviceId}`);
    }
  };

  const handleNewProblem = () => {
    if (deviceId) {
      navigate(`/problems/${deviceId}`);
    } else {
      navigate("/devices");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">
                  Диагностика завершена
                </span>
                <div className="text-xs text-gray-400 -mt-1">
                  Проблема успешно решена
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-8 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Animation */}
            <div className="mb-8">
              <div
                className={`w-32 h-32 mx-auto mb-6 transition-all duration-1000 ${
                  showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-40" />
                  <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle className="h-16 w-16 text-white animate-bounce" />
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div
              className={`transition-all duration-1000 delay-500 ${
                showAnimation
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {problemId && getProblemTitle(problemId)}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {problemId && getSolutionMessage(problemId)}
              </p>
            </div>

            {/* Rating Section */}
            <div
              className={`transition-all duration-1000 delay-700 ${
                showAnimation
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <Card className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl mb-8 max-w-md mx-auto">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Оцените качество помощи
                  </h3>
                  <div className="flex justify-center space-x-2 mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        className="w-8 h-8 text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Ваша оценка поможет нам улучшить сервис
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div
              className={`transition-all duration-1000 delay-1000 ${
                showAnimation
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleGoHome}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-1 group"
                >
                  <Home className="mr-2 h-5 w-5" />
                  На главную
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  onClick={handleNewProblem}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Другая проблема
                </Button>

                <Button
                  onClick={handleTryAgain}
                  variant="ghost"
                  size="lg"
                  className="text-lg px-8 py-4 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Повторить
                </Button>
              </div>
            </div>

            {/* Additional Help */}
            <div
              className={`mt-12 transition-all duration-1000 delay-1200 ${
                showAnimation
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <Tv className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Нужна дополнительная помощь?
                </h3>
                <p className="text-gray-300 mb-4">
                  Если проблема повторится или у вас возникнут другие вопросы,
                  мы всегда готовы помочь.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Связаться с поддержкой
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    Часто задаваемые вопросы
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
