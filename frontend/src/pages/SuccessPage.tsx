import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Home,
  ArrowRight,
  Sparkles,
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
    return "Проблема решена!";
  };

  const getSolutionMessage = (id: string) => {
    return "Ваша проблема успешно решена!";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-green-400/20 rounded-full animate-float" />
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-blue-400/30 rounded-full animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-3 h-3 bg-violet-400/15 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">
                  Диагностика завершена
                </span>
                <div className="text-xs text-gray-600 -mt-1">
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
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-30" />
                  <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle className="h-16 w-16 text-white animate-bounce" />
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-2 -left-2">
                    <Sparkles
                      className="h-4 w-4 text-green-400 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
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
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {problemId && getProblemTitle(problemId)}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {problemId && getSolutionMessage(problemId)}
              </p>
            </div>

            {/* Action Buttons */}
            <div
              className={`transition-all duration-1000 delay-700 ${
                showAnimation
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleGoHome}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-1 group rounded-xl"
                >
                  <Home className="mr-2 h-5 w-5" />
                  На главную
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  onClick={handleNewProblem}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 rounded-xl"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Другая проблема
                </Button>

                <Button
                  onClick={handleTryAgain}
                  variant="ghost"
                  size="lg"
                  className="text-lg px-8 py-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-xl"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Повторить
                </Button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-12 flex justify-center space-x-8 opacity-20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-3 h-3 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.6s" }}
              />
              <div
                className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.8s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
