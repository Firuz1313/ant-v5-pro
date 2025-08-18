import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TVDisplay from "@/components/TVDisplay";
import TVInterfaceDisplay from "@/components/TVInterfaceDisplay";
import RemoteControl from "@/components/RemoteControl";
import { useData } from "@/contexts/DataContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Tv,
} from "lucide-react";

const DiagnosticPage = () => {
  const navigate = useNavigate();
  const { deviceId, problemId } = useParams<{
    deviceId: string;
    problemId: string;
  }>();
  const {
    getDeviceById,
    getStepsForProblem,
    getRemoteById,
    getDefaultRemoteForDevice,
    problems,
  } = useData();
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [manualProgress, setManualProgress] = useState(false);

  const device = deviceId ? getDeviceById(deviceId) : null;
  const steps = problemId ? getStepsForProblem(problemId) : [];
  const currentStepData = steps.find(
    (step) => step.stepNumber === currentStepNumber,
  );
  const progress =
    steps.length > 0 ? (currentStepNumber / steps.length) * 100 : 0;

  // Get the remote for this step, or fallback to device default remote
  const stepRemote = currentStepData?.remoteId
    ? getRemoteById(currentStepData.remoteId)
    : null;
  const deviceDefaultRemote = deviceId
    ? getDefaultRemoteForDevice(deviceId)
    : null;
  const remote = stepRemote || deviceDefaultRemote;

  const problem = problemId ? problems.find((p) => p.id === problemId) : null;

  useEffect(() => {
    if (!deviceId || !problemId || steps.length === 0) {
      navigate("/devices");
    }
  }, [deviceId, problemId, steps.length, navigate]);

  const handleNextStep = () => {
    if (currentStepNumber < steps.length) {
      setCurrentStepNumber(currentStepNumber + 1);
      setManualProgress(true);
    } else {
      // All steps completed, go to success page
      const sessionId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      navigate(`/success/${deviceId}/${sessionId}?problemId=${problemId}`);
    }
  };

  const handlePrevStep = () => {
    if (currentStepNumber > 1) {
      setCurrentStepNumber(currentStepNumber - 1);
    }
  };

  const handleBack = () => {
    navigate(`/problems/${deviceId}`);
  };

  const getProblemTitle = () => {
    return problem?.title || "Диагностика проблемы";
  };

  if (!device || !currentStepData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-4">Данные не найдены</h2>
          <Button onClick={() => navigate("/devices")}>
            Вернуться к выбору приставки
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="w-full px-4 pt-6 pb-2 flex flex-col items-center">
        <div className="max-w-7xl w-full flex flex-col items-center">
          <span className="text-2xl font-bold text-white mb-1 text-center">
            {device.name} - {getProblemTitle()}
          </span>
          <div className="text-xs text-gray-400 -mt-1 mb-2">
            Шаг {currentStepNumber} из {steps.length}
          </div>
        </div>
      </header>

      {/* Main Content: TV + Remote */}
      <div className="flex-1 flex flex-row items-start justify-center w-full max-w-7xl mx-auto px-4 gap-8 mt-2" style={{minHeight:0}}>
        {/* TV */}
        <div className="flex-1 flex items-center justify-end max-w-4xl min-w-0">
          {currentStepData?.tvInterfaceId ? (
            <TVInterfaceDisplay
              tvInterfaceId={currentStepData.tvInterfaceId}
              stepId={currentStepData.id}
              currentStepNumber={currentStepNumber}
              tvAreaPosition={currentStepData?.tvAreaPosition}
              tvAreaRect={currentStepData?.tvAreaRect}
              showAllMarks={true}
              highlightActiveMarks={true}
              showHints={true}
              enableAnimations={true}
              className="w-full h-full"
            />
          ) : (
            <TVDisplay
              deviceId={device?.id}
              interfaceScreen={currentStepData?.highlightTVArea || 'home'}
              tvInterfaceId={currentStepData?.tvInterfaceId}
              className="w-full"
              isConnected={true}
              isLoading={false}
            />
          )}
        </div>
        {/* Remote */}
        <div className="flex items-center justify-start" style={{width:'200px', minWidth:'160px', maxWidth:'220px'}}>
          {remote ? (
            remote.imageData ? (
              <div className="relative bg-gray-800 rounded-xl p-2 shadow-2xl w-full">
                <img
                  src={remote.imageData}
                  alt={remote.name}
                  className="w-full h-auto object-contain rounded-lg"
                  style={{maxHeight:'420px'}}
                />
                {/* Button Position Indicator */}
                {currentStepData?.buttonPosition && (
                  <div
                    className="absolute w-6 h-6 bg-red-500 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-lg"
                    style={{
                      left: `${(currentStepData.buttonPosition.x / remote.dimensions.width) * 100}%`,
                      top: `${(currentStepData.buttonPosition.y / remote.dimensions.height) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
                {/* Remote Name Badge */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
                    {remote.name}
                  </span>
                </div>
              </div>
            ) : (
              <RemoteControl
                highlightButton={currentStepData?.highlightRemoteButton}
                remoteId={remote.id}
                showButtonPosition={currentStepData?.buttonPosition}
                className="pointer-events-none"
              />
            )
          ) : (
            <div className="bg-gray-800/50 rounded-xl p-6 text-center w-full">
              <div className="text-gray-400 mb-2">
                <Tv className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Пульт не требуется</p>
                <p className="text-xs">д��я этого шага</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Нижняя панель: кнопки и подсказка */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-slate-900/95 to-slate-900/60 border-t border-white/10 z-50 flex items-center justify-between px-4 py-3" style={{maxHeight:'64px'}}>
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStepNumber === 1}
          className="border-white/20 text-white hover:bg-white/10 min-w-[100px]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        {/* Подсказка */}
        <div className="flex-1 flex justify-center">
          {currentStepData?.hint && (
            <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 max-w-xl text-sm text-yellow-100">
              <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="truncate"><strong>Подсказка:</strong> {currentStepData.hint}</span>
            </div>
          )}
        </div>
        <Button
          onClick={handleNextStep}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 min-w-[100px]"
        >
          {currentStepNumber === steps.length ? "Завершить" : "Далее"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticPage;
