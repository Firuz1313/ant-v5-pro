import React from "react";
import { useDevices } from "@/hooks/useDevices";

const RemoteBuilderDebug = () => {
  const { data: devicesResponse, isLoading, error } = useDevices();

  console.log("DEBUG: devicesResponse =", devicesResponse);
  console.log("DEBUG: devices array =", devicesResponse?.data);
  console.log("DEBUG: isLoading =", isLoading);
  console.log("DEBUG: error =", error);

  const devices = devicesResponse?.data || [];
  const activeDevices = devices.filter((d: any) => d.isActive === true);

  console.log("DEBUG: total devices =", devices.length);
  console.log("DEBUG: active devices =", activeDevices.length);
  console.log("DEBUG: all devices =", devices);
  console.log("DEBUG: active devices =", activeDevices);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold">Device Debug Info</h3>
      <div className="text-sm space-y-2">
        <div>Loading: {isLoading ? "Yes" : "No"}</div>
        <div>Error: {error ? "Yes" : "No"}</div>
        <div>Total devices: {devices.length}</div>
        <div>Active devices: {activeDevices.length}</div>
        <div>
          Device IDs: {devices.map((d: any) => d.id).join(", ")}
        </div>
        <div>
          Active device IDs: {activeDevices.map((d: any) => d.id).join(", ")}
        </div>
      </div>
    </div>
  );
};

export default RemoteBuilderDebug;
