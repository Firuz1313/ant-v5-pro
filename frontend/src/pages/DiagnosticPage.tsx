import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TVDisplay from "@/components/TVDisplay";
import TVInterfaceDisplay from "@/components/TVInterfaceDisplay";
import RemoteControl from "@/components/RemoteControl";
import { useDevices } from "@/hooks/useDevices";
import { useProblems } from "@/hooks/useProblems";
import { remotesApi, stepsApi } from "@/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Tv,
  Loader2,
} from "lucide-react";

const DiagnosticPage = () => {
  const navigate = useNavigate();
  const { deviceId, problemId } = useParams<{
    deviceId: string;
    problemId: string;
  }>();

  // API hooks
  const { devices, loading: devicesLoading } = useDevices();
  const { problems, loading: problemsLoading } = useProblems({ deviceId });

  // Local state
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [manualProgress, setManualProgress] = useState(false);
  const [steps, setSteps] = useState([]);
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derived state
  const device = devices?.find((d) => d.id === deviceId);
  const problem = problems?.find((p) => p.id === problemId);
  const currentStepData = steps.find(
    (step) => step.stepNumber === currentStepNumber,
  );
  const progress =
    steps.length > 0 ? (currentStepNumber / steps.length) * 100 : 0;

  // Load steps and remote when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!problemId || !deviceId) return;

      try {
        setLoading(true);

        // Load steps for the problem
        const stepsResponse = await stepsApi.getStepsByProblem(problemId);
        setSteps(stepsResponse?.data || []);

        // Load remote for device (try default first, then any remote, then seed defaults)
        try {
          console.log(`Loading default remote for device: ${deviceId}`);
          const defaultRemote = await remotesApi.getDefaultForDevice(deviceId);
          console.log("Default remote found:", defaultRemote);
          setRemote(defaultRemote);
        } catch (error) {
          console.log(
            "No default remote found, trying to get any remote for device:",
            error,
          );
          // If no default remote, try to get any remote for the device
          try {
            const deviceRemotes = await remotesApi.getByDevice(deviceId);
            console.log("Device remotes found:", deviceRemotes);
            if (deviceRemotes && deviceRemotes.length > 0) {
              console.log("Using first available remote:", deviceRemotes[0]);
              setRemote(deviceRemotes[0]);
            } else {
              console.log(
                "No remotes available for this device, trying to seed defaults...",
              );
              // If no remotes exist for this device, try to seed default remotes
              try {
                await remotesApi.seedDefaultRemotes();
                console.log(
                  "Default remotes seeded, trying to load default remote again...",
                );

                // Try to load default remote again after seeding
                const newDefaultRemote =
                  await remotesApi.getDefaultForDevice(deviceId);
                console.log(
                  "New default remote found after seeding:",
                  newDefaultRemote,
                );
                setRemote(newDefaultRemote);
              } catch (seedError) {
                console.error("Failed to seed default remotes:", seedError);
                setRemote(null);
              }
            }
          } catch (err) {
            console.error("Error loading device remotes:", err);
            setRemote(null);
          }
        }
      } catch (error) {
        console.error("Error loading diagnostic data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [problemId, deviceId]);

  const handlePrevStep = () => {
    if (currentStepNumber > 1) {
      setCurrentStepNumber(currentStepNumber - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepNumber < steps.length) {
      setCurrentStepNumber(currentStepNumber + 1);
    } else {
      navigate(`/success/${deviceId}/${problemId}`);
    }
  };

  const handleBack = () => {
    navigate(`/problems/${deviceId}`);
  };

  const handleManualProgress = () => {
    setManualProgress(true);
    setTimeout(() => setManualProgress(false), 2000);
  };

  if (devicesLoading || problemsLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка диагностики...</p>
        </div>
      </div>
    );
  }

  if (!device || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600">
        <div className="text-center text-white">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p>Устройство или проблема не найдены</p>
          <Button onClick={handleBack} className="mt-4" variant="outline">
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600">
        <div className="text-center text-white">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p>Шаги диагностики не найдены</p>
          <Button onClick={handleBack} className="mt-4" variant="outline">
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div className="text-center text-white">
            <h1 className="text-xl font-semibold">{device.name}</h1>
            <p className="text-blue-200 text-sm">{problem.title}</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="text-white text-sm mb-2 text-center">
            Шаг {currentStepNumber} из {steps.length}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left side - TV Display and Instructions */}
          <div className="space-y-6">
            {/* TV Display */}
            <Card className="bg-black/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Tv className="h-5 w-5 text-blue-400 mr-2" />
                  <h3 className="font-semibold text-white">Экран ТВ</h3>
                </div>

                {currentStepData?.tvInterfaceId ? (
                  <TVInterfaceDisplay
                    tvInterfaceId={currentStepData.tvInterfaceId}
                    highlightAreas={
                      currentStepData.highlightTVArea
                        ? [currentStepData.highlightTVArea]
                        : []
                    }
                  />
                ) : (
                  <TVDisplay />
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-white/10 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="font-semibold text-white">Инструкция</h3>
                </div>

                {currentStepData ? (
                  <div className="text-white space-y-3">
                    <h4 className="font-medium text-lg">
                      {currentStepData.title}
                    </h4>
                    <p className="text-blue-100 leading-relaxed">
                      {currentStepData.instruction}
                    </p>

                    {currentStepData.hint && (
                      <div className="bg-blue-500/20 p-3 rounded-lg">
                        <p className="text-blue-200 text-sm">
                          💡 {currentStepData.hint}
                        </p>
                      </div>
                    )}

                    {currentStepData.warningText && (
                      <div className="bg-yellow-500/20 p-3 rounded-lg">
                        <p className="text-yellow-200 text-sm">
                          ⚠️ {currentStepData.warningText}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-white">Инструкция не найдена</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Remote Control */}
          <div>
            <Card className="bg-black/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-5 w-5 bg-red-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-white">Пульт управления</h3>
                </div>

                {remote ? (
                  <RemoteControl
                    remote={remote}
                    highlightButton={currentStepData?.highlightRemoteButton}
                    onButtonClick={handleManualProgress}
                  />
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>Пульт не найден</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handlePrevStep}
            disabled={currentStepNumber <= 1}
            variant="outline"
            className="bg-white/10 border-gray-600 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Предыдущий шаг
          </Button>

          <Button
            onClick={handleNextStep}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {currentStepNumber < steps.length ? "Следующий шаг" : "Завершить"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Manual Progress Indicator */}
        {manualProgress && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Действие выполнено!
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticPage;
