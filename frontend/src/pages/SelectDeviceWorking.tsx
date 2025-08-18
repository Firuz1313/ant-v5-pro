import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Triangle } from "lucide-react";

const devices = [
  {
    id: "openbox",
    name: "OpenBox",
    description: "Спутниковый цифровой приемник стандарта DVB-S/S2",
  },
  {
    id: "openbox-gold",
    name: "OpenBox Gold",
    description: "Премиум модель с расширенным функционалом",
  },
  {
    id: "uclan",
    name: "Uclan",
    description: "Надежный цифровой ресивер для всех ТВ каналов",
  },
  {
    id: "hdbox",
    name: "HDBox",
    description: "HD тюнер с функцией записи и воспроизведения",
  },
];

const SelectDeviceWorking = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleDeviceSelect = (deviceId: string) => {
    alert(`Выбрано устройство: ${deviceId}`);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)",
      }}
    >
      {/* Декоративные эффекты фона */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Сетка фона */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Логотип АНТ точно как на изображении */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Triangle className="h-6 w-6 text-white fill-white rotate-90" />
              </div>
              <span
                className="text-2xl font-bold text-white tracking-wider"
                style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
              >
                АНТ
              </span>
            </div>
          </div>

          {/* Заголовок точно как на изображении */}
          <h1
            className="text-xl md:text-2xl font-normal text-white"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
          >
            Выберите модель вашей ТВ приставки
          </h1>
        </div>

        {/* Сетка устройств 2x2 точно как на изображении */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {devices.map((device, index) => (
            <div key={device.id} className="group relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Изображение приставки точно как на фото */}
                <div className="bg-gray-100 rounded-xl p-6 mb-4 flex items-center justify-center h-24">
                  <div className="relative">
                    {/* Основной корпус приставки - черный прямоугольник */}
                    <div className="w-20 h-8 bg-black rounded-lg shadow-lg relative">
                      {/* Передняя панель с градиентом */}
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded-lg"></div>

                      {/* LED индикатор красный */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full opacity-90"></div>

                      {/* USB порт или разъем */}
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-gray-600 rounded-sm"></div>

                      {/* Дополнительные детали */}
                      <div className="absolute center-2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-1/2">
                        <div className="w-1 h-1 bg-gray-500 rounded-full opacity-60"></div>
                      </div>
                    </div>

                    {/* Тень под приставкой */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full blur-sm mt-1"></div>
                  </div>
                </div>

                {/* Название устройства синим цветом */}
                <h3 className="text-lg font-semibold text-blue-600 text-center mb-2">
                  {device.name}
                </h3>

                {/* Описание серым текстом */}
                <p className="text-gray-600 text-center text-xs mb-6 leading-relaxed px-2 h-8 flex items-center justify-center">
                  {device.description}
                </p>

                {/* Кнопка "Выбрать" точно как на изображении */}
                <Button
                  onClick={() => handleDeviceSelect(device.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  Выбрать
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка "← Назад" точно как на изображении */}
        <div className="text-center">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white/90 hover:text-white hover:bg-white/10 font-normal transition-all duration-300 rounded-lg px-4 py-2 text-sm"
            style={{ textShadow: "0 1px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectDeviceWorking;
