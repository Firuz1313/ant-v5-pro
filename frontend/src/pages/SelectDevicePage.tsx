import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Triangle, Loader2 } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";

const SelectDevicePage = () => {
  const navigate = useNavigate();
  const { devices, loading, error } = useDevices();

  const handleBack = () => {
    navigate("/");
  };

  const handleDeviceSelect = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка устройств...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600">
        <div className="text-center text-white">
          <p className="mb-4">Ошибка загрузки устройств: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)",
      }}
    >
      {/* Декоративные эффекты */}
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

        {/* Сетка */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Логотип АНТ как на изображении */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <Triangle className="h-8 w-8 text-white fill-white rotate-90" />
              <span
                className="text-3xl font-black text-white"
                style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
              >
                АНТ
              </span>
            </div>
          </div>

          {/* Заголовок как на изображении */}
          <h1
            className="text-2xl md:text-3xl font-semibold text-white mb-12"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
          >
            Выберите модель вашей ТВ приставки
          </h1>
        </div>

        {/* Сетка устройств как на изображении */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {devices?.map((device) => (
            <div key={device.id} className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Изображение приставки */}
                <div className="bg-gray-100 rounded-xl p-6 mb-6 flex items-center justify-center h-32">
                  {device.imageUrl ? (
                    <img 
                      src={device.imageUrl} 
                      alt={device.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-24 h-12 bg-black rounded-lg shadow-md relative">
                      {/* Имитация приставки */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-red-500 rounded-full opacity-80"></div>
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Название */}
                <h3 className="text-xl font-bold text-blue-600 text-center mb-2">
                  {device.name}
                </h3>

                {/* Описание */}
                <p className="text-gray-600 text-center text-sm mb-6 leading-relaxed">
                  {device.description}
                </p>

                {/* Кнопка выбора как на изображении */}
                <Button
                  onClick={() => handleDeviceSelect(device.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Выбрать
                </Button>
              </div>
            </div>
          ))}
        </div>

        {devices?.length === 0 && (
          <div className="text-center text-white">
            <p>Устройства не найдены</p>
          </div>
        )}

        {/* Кнопка "Назад" как на изображении */}
        <div className="text-center">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:bg-white/10 font-medium transition-all duration-300 rounded-lg px-6 py-2"
            style={{ textShadow: "0 1px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectDevicePage;
