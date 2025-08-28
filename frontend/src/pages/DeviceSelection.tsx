import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
} from "lucide-react";
import { useDevices } from "@/hooks/useDevices";

const DeviceSelection = () => {
  const navigate = useNavigate();
  const { data: devicesResponse } = useDevices();

  // Извлекаем массивы данных из ответа API
  const devices = devicesResponse?.data || [];

  const handleDeviceSelect = (deviceId: string) => {
    navigate(`/problems/${deviceId}`);
  };

  const handleBack = () => {
    navigate("/");
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
          </div>

          {/* Devices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* OpenBox */}
            <Card 
              className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleDeviceSelect("openbox")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-32 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-24 h-16 bg-black rounded-sm flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">OPENBOX</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">OpenBox</h3>
                <p className="text-gray-600">
                  Стандартные приставки OpenBox для цифрового телевидения
                </p>
              </CardContent>
            </Card>

            {/* UCLAN */}
            <Card 
              className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleDeviceSelect("uclan")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-32 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-24 h-16 bg-gray-800 rounded-sm flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">UCLAN</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">UCLAN</h3>
                <p className="text-gray-600">
                  Высококачественные HD приставки UCLAN
                </p>
              </CardContent>
            </Card>

            {/* HDBox */}
            <Card 
              className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleDeviceSelect("hdbox")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-32 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-24 h-16 bg-black rounded-sm flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">HDBOX</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">HDBox</h3>
                <p className="text-gray-600">
                  Профессиональные приставки HDBox
                </p>
              </CardContent>
            </Card>

            {/* OpenBox Gold */}
            <Card 
              className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleDeviceSelect("openbox_gold")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-32 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-24 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-sm flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">GOLD</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">OpenBox Gold</h3>
                <p className="text-gray-600">
                  Премиум приставки OpenBox Gold с расширенными возможностями
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeviceSelection;
