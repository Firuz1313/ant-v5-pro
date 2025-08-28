import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  AlertCircle,
  Tv,
} from "lucide-react";
import { useDevices } from "@/hooks/useDevices";

const DeviceSelection = () => {
  const navigate = useNavigate();
  const { data: devicesResponse, isLoading, error } = useDevices(1, 50, { status: "active" });

  // Извлекаем массивы данных из ответа API
  const devices = devicesResponse?.data || [];

  const handleDeviceSelect = (deviceId: string) => {
    navigate(`/problems/${deviceId}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  const getDeviceIcon = (brand: string) => {
    // Простой способ создать визуальное представление для каждого бренда
    const brandLower = brand.toLowerCase();

    if (brandLower.includes('openbox') && brandLower.includes('gold')) {
      return "bg-gradient-to-r from-orange-400 to-orange-600";
    } else if (brandLower.includes('openbox')) {
      return "bg-black";
    } else if (brandLower.includes('uclan')) {
      return "bg-gray-800";
    } else if (brandLower.includes('hdbox')) {
      return "bg-black";
    } else {
      return "bg-gray-700";
    }
  };

  const getDeviceDisplayName = (name: string, brand: string) => {
    // Использовать name в первую очередь, но при необходимости добавить brand
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      return name;
    }
    return `${brand} ${name}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-gray-600 hover:bg-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Выбор приставки
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Выбор приставки
            </h1>
            <p className="text-xl text-gray-600">
              Выберите модель вашей ТВ-приставки для получения персонализированной помощи
            </p>
            {devices.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {devices.length} поддерживаемых устройств
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Skeleton className="w-32 h-20 mx-auto mb-6 rounded-lg" />
                    <Skeleton className="h-8 w-32 mx-auto mb-3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Произошла ошибка при загрузке устройств. Пожалуйста, попробуйте позже.
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && devices.length === 0 && (
            <div className="text-center py-16">
              <Tv className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Устройства не найдены
              </h3>
              <p className="text-gray-600">
                В настоящее время нет доступных устройств для диагностики.
              </p>
            </div>
          )}

          {/* Devices Grid */}
          {!isLoading && !error && devices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {devices.map((device) => (
                <Card
                  key={device.id}
                  className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleDeviceSelect(device.id)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-32 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                      {device.imageUrl ? (
                        <img
                          src={device.imageUrl}
                          alt={device.name}
                          className="w-24 h-16 object-contain rounded-sm"
                        />
                      ) : (
                        <div className={`w-24 h-16 rounded-sm flex items-center justify-center shadow-sm ${getDeviceIcon(device.brand)}`}>
                          <span className="text-white text-sm font-bold">
                            {device.brand.toUpperCase().substring(0, 8)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {getDeviceDisplayName(device.name, device.brand)}
                    </h3>
                    <p className="text-gray-600">
                      {device.description || `${device.brand} ${device.model}`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeviceSelection;
