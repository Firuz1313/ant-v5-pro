import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDevices } from "@/hooks/useDevices";
import { useProblems } from "@/hooks/useProblems";
import {
  Shield,
  Clock,
  CheckCircle,
  Users,
  ArrowRight,
  Zap,
  BarChart3,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: devicesResponse, isLoading: devicesLoading } = useDevices(1, 50, { status: "active" });
  const { data: problemsResponse, isLoading: problemsLoading } = useProblems(1, 50, { status: "published" });

  const deviceCount = devicesResponse?.data?.length || 0;
  const problemCount = problemsResponse?.data?.length || 0;
  const devices = devicesResponse?.data || [];

  const handleStartDiagnostic = () => {
    navigate("/devices");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Быстрая диагностика проблем
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Пошаговое ин��трукции для решения проблем с цифровыми ТВ-приставками.
            <br />
            Простой интерфейс, профессиональные решения.
          </p>
          
          <Button
            size="lg"
            onClick={handleStartDiagnostic}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-xl"
          >
            Начать диагностику
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-6 bg-blue-600 rounded-sm"></div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">4</div>
                <div className="text-gray-600 font-medium">Поддерживаемых моделей</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">1</div>
                <div className="text-gray-600 font-medium">Готовых решений</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-gray-600 font-medium">Успешных решений</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Доступность</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Devices Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Поддерживаемые устройства
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* OpenBox */}
            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-16 h-10 bg-black rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">OPENBOX</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">OpenBox</h3>
                <p className="text-gray-600 text-sm">
                  Стандартные приставки OpenBox для цифрового телевидения
                </p>
              </CardContent>
            </Card>

            {/* UCLAN */}
            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-16 h-10 bg-gray-800 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">UCLAN</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">UCLAN</h3>
                <p className="text-gray-600 text-sm">
                  Высококачественные HD приставки UCLAN
                </p>
              </CardContent>
            </Card>

            {/* HDBox */}
            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-16 h-10 bg-black rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">HDBOX</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">HDBox</h3>
                <p className="text-gray-600 text-sm">
                  Профессиональные приставки HDBox
                </p>
              </CardContent>
            </Card>

            {/* OpenBox Gold */}
            <Card className="text-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-16 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">GOLD</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">OpenBox Gold</h3>
                <p className="text-gray-600 text-sm">
                  Премиум приставки OpenBox Gold с расширенными возможностями
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Почему выбирают нас
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Reliability */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Надежность</h3>
              <p className="text-gray-600 leading-relaxed">
                Проверенные решения от профессиональных техников с многолетним опытом
              </p>
            </div>

            {/* Speed */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Быстрота</h3>
              <p className="text-gray-600 leading-relaxed">
                Среднее время решения проблемы составляет всего 5 - 10 минут
              </p>
            </div>

            {/* Efficiency */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Эффективность</h3>
              <p className="text-gray-600 leading-relaxed">
                95% проблем решаются с первого раза без вызова техника
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Готовы решить проблему с вашей приставкой?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Начните диагностику прямо сейчас и получите решение за несколько минут
          </p>
          <Button
            size="lg"
            onClick={handleStartDiagnostic}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-xl"
          >
            Начать диагностику
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-4 bg-white rounded-sm"></div>
              </div>
              <div>
                <div className="font-bold text-lg">ANT Support</div>
                <div className="text-gray-400 text-sm">Служба поддержки ТВ-приставок</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 ANT Support. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
