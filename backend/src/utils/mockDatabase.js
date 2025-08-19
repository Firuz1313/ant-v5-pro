// Mock database implementation for development environments where PostgreSQL is not available
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data storage
let mockData = {
  devices: [
    {
      id: "openbox",
      name: "OpenBox",
      brand: "OpenBox",
      model: "Standard",
      type: "set_top_box",
      description: "Стандартные приставки OpenBox для цифрового телевидения",
      color: "from-blue-500 to-blue-600",
      image_url: "/images/devices/openbox-standard.jpg",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "uclan",
      name: "UCLAN",
      brand: "UCLAN",
      model: "HD Series",
      type: "set_top_box",
      description: "Высококачественные HD приставки UCLAN",
      color: "from-green-500 to-green-600",
      image_url: "/images/devices/uclan-hd.jpg",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "hdbox",
      name: "HDBox",
      brand: "HDBox",
      model: "Pro",
      type: "set_top_box",
      description: "Профессиональные приставки HDBox",
      color: "from-purple-500 to-purple-600",
      image_url: "/images/devices/hdbox-pro.jpg",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "openbox_gold",
      name: "OpenBox Gold",
      brand: "OpenBox",
      model: "Gold Edition",
      type: "set_top_box",
      description:
        "Премиум приставки OpenBox Gold с расширенными возможностями",
      color: "from-yellow-500 to-yellow-600",
      image_url: "/images/devices/openbox-gold.jpg",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "skyway",
      name: "SkyWay Light",
      brand: "SkyWay",
      model: "Light",
      type: "set_top_box",
      description: "Компактные приставки SkyWay Light",
      color: "from-orange-500 to-orange-600",
      image_url: "/images/devices/skyway-light.jpg",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  problems: [
    {
      id: 1,
      title: "Нет сигнала на э��ране",
      description: "Экран остается черным, нет изображения",
      severity: "high",
      category: "display",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Проблемы со звуком",
      description: "Звук не воспроизводится или искажен",
      severity: "medium",
      category: "audio",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  diagnostic_steps: [
    {
      id: 1,
      problem_id: 1,
      step_number: 1,
      title: "Проверка подключения кабелей",
      description: "Убедитесь, что все кабели подключены правильно",
      instruction: "Проверьте HDMI кабе��ь, кабель питания",
      expected_result: "Кабели подключены надежно",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  diagnostic_sessions: [
    {
      id: 1,
      device_id: 1,
      problem_id: 1,
      user_name: "Тестовый пользователь",
      status: "in_progress",
      start_time: new Date().toISOString(),
      end_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  tv_interfaces: [
    {
      id: "tv_int_825",
      name: "OpenBox Main Menu",
      description: "Main menu interface for OpenBox devices",
      type: "home",
      device_id: "openbox",
      screenshot_url: null,
      screenshot_data: null,
      clickable_areas: JSON.stringify([]),
      highlight_areas: JSON.stringify([]),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
    {
      id: "tv_int_826",
      name: "UCLAN Settings",
      description: "Settings interface for UCLAN devices",
      type: "settings",
      device_id: "uclan",
      screenshot_url: null,
      screenshot_data: null,
      clickable_areas: JSON.stringify([]),
      highlight_areas: JSON.stringify([]),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
    {
      id: "tv_int_827",
      name: "HDBox Channel Guide",
      description: "Channel guide interface for HDBox devices",
      type: "guide",
      device_id: "hdbox",
      screenshot_url: null,
      screenshot_data: null,
      clickable_areas: JSON.stringify([]),
      highlight_areas: JSON.stringify([]),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
    {
      id: "tv_int_828",
      name: "OpenBox Главное меню",
      description: "Main menu interface showing when OpenBox is working",
      type: "home",
      device_id: "openbox",
      screenshot_url: null,
      screenshot_data: null,
      clickable_areas: JSON.stringify([]),
      highlight_areas: JSON.stringify([]),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
    {
      id: "tv_int_829",
      name: "OpenBox Настройки",
      description: "Settings interface for OpenBox devices",
      type: "settings",
      device_id: "openbox",
      screenshot_url: null,
      screenshot_data: null,
      clickable_areas: JSON.stringify([]),
      highlight_areas: JSON.stringify([]),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
  ],
  tv_interface_marks: [
    {
      id: "mark_sample_1",
      tv_interface_id: "tv_int_825",
      step_id: null,
      name: "Main Menu Button",
      description: "Click here to access the main menu",
      mark_type: "point",
      shape: "circle",
      position: JSON.stringify({ x: 200, y: 150 }),
      size: JSON.stringify({ width: 30, height: 30 }),
      color: "#3b82f6",
      border_color: "#1e40af",
      border_width: 2,
      opacity: 0.8,
      is_clickable: true,
      is_highlightable: true,
      is_active: true,
      is_visible: true,
      display_order: 0,
      priority: "normal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "mark_sample_2",
      tv_interface_id: "tv_int_825",
      step_id: "step-openbox-sample-1",
      name: "Settings Area",
      description: "Navigate to settings section",
      mark_type: "area",
      shape: "rectangle",
      position: JSON.stringify({ x: 300, y: 200 }),
      size: JSON.stringify({ width: 100, height: 50 }),
      color: "#10b981",
      border_color: "#059669",
      border_width: 2,
      opacity: 0.6,
      is_clickable: true,
      is_highlightable: true,
      is_active: true,
      is_visible: true,
      display_order: 1,
      priority: "high",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

// Mock query function that simulates PostgreSQL query interface
export async function query(text, params = []) {
  // Simulate database latency
  await new Promise((resolve) => setTimeout(resolve, 10));

  const lowercaseText = text.toLowerCase().trim();

  // Handle SELECT queries
  if (lowercaseText.startsWith("select")) {
    if (lowercaseText.includes("from devices")) {
      if (lowercaseText.includes("where id =")) {
        const id = params[0];
        const device = mockData.devices.find((d) => d.id === id);
        return { rows: device ? [device] : [], rowCount: device ? 1 : 0 };
      }
      return { rows: mockData.devices, rowCount: mockData.devices.length };
    }

    if (lowercaseText.includes("from tv_interfaces")) {
      if (lowercaseText.includes("where id =")) {
        const id = params[0];
        console.log(`🔍 Mock DB: Looking for TV interface with ID: ${id}`);
        console.log(
          `📊 Mock DB: Available interfaces:`,
          mockData.tv_interfaces.map((t) => t.id),
        );
        const tvInterface = mockData.tv_interfaces.find(
          (t) => t.id === id && !t.deleted_at,
        );
        if (tvInterface) {
          console.log(`✅ Mock DB: Found TV interface:`, tvInterface.name);
          // Join with device data
          const device = mockData.devices.find(
            (d) => d.id === tvInterface.device_id,
          );
          const result = {
            ...tvInterface,
            device_name: device?.name,
            device_brand: device?.brand,
            device_model: device?.model,
          };
          return { rows: [result], rowCount: 1 };
        } else {
          console.log(`❌ Mock DB: TV interface not found with ID: ${id}`);
        }
        return { rows: [], rowCount: 0 };
      }
      if (lowercaseText.includes("where device_id =")) {
        const deviceId = params[0];
        const interfaces = mockData.tv_interfaces.filter(
          (t) => t.device_id === deviceId && !t.deleted_at,
        );
        const result = interfaces.map((tvInterface) => {
          const device = mockData.devices.find(
            (d) => d.id === tvInterface.device_id,
          );
          return {
            ...tvInterface,
            device_name: device?.name,
            device_brand: device?.brand,
            device_model: device?.model,
          };
        });
        return { rows: result, rowCount: result.length };
      }
      // Get all TV interfaces with device data
      const interfaces = mockData.tv_interfaces.filter((t) => !t.deleted_at);
      const result = interfaces.map((tvInterface) => {
        const device = mockData.devices.find(
          (d) => d.id === tvInterface.device_id,
        );
        return {
          ...tvInterface,
          device_name: device?.name,
          device_brand: device?.brand,
          device_model: device?.model,
        };
      });
      return { rows: result, rowCount: result.length };
    }

    if (lowercaseText.includes("from tv_interface_marks")) {
      if (lowercaseText.includes("where tv_interface_id =")) {
        const tvInterfaceId = params[0];
        const marks = mockData.tv_interface_marks.filter(
          (m) => m.tv_interface_id === tvInterfaceId && m.is_active !== false
        );
        return { rows: marks, rowCount: marks.length };
      }
      if (lowercaseText.includes("where step_id =")) {
        const stepId = params[0];
        const marks = mockData.tv_interface_marks.filter(
          (m) => m.step_id === stepId && m.is_active !== false
        );
        return { rows: marks, rowCount: marks.length };
      }
      if (lowercaseText.includes("where id =")) {
        const id = params[0];
        const mark = mockData.tv_interface_marks.find((m) => m.id === id);
        return { rows: mark ? [mark] : [], rowCount: mark ? 1 : 0 };
      }
      // Get all marks
      const marks = mockData.tv_interface_marks.filter((m) => m.is_active !== false);
      return { rows: marks, rowCount: marks.length };
    }

    if (lowercaseText.includes("from problems")) {
      if (lowercaseText.includes("where id =")) {
        const id = parseInt(params[0]);
        const problem = mockData.problems.find((p) => p.id === id);
        return { rows: problem ? [problem] : [], rowCount: problem ? 1 : 0 };
      }
      return { rows: mockData.problems, rowCount: mockData.problems.length };
    }

    if (lowercaseText.includes("from diagnostic_steps")) {
      if (lowercaseText.includes("where problem_id =")) {
        const problemId = parseInt(params[0]);
        const steps = mockData.diagnostic_steps.filter(
          (s) => s.problem_id === problemId,
        );
        return { rows: steps, rowCount: steps.length };
      }
      return {
        rows: mockData.diagnostic_steps,
        rowCount: mockData.diagnostic_steps.length,
      };
    }

    if (lowercaseText.includes("from diagnostic_sessions")) {
      return {
        rows: mockData.diagnostic_sessions,
        rowCount: mockData.diagnostic_sessions.length,
      };
    }

    // Health check query
    if (
      lowercaseText.includes("select now()") ||
      lowercaseText.includes("select 1")
    ) {
      return {
        rows: [
          {
            current_time: new Date().toISOString(),
            postgres_version: "Mock Database v1.0.0",
          },
        ],
        rowCount: 1,
      };
    }
  }

  // Handle INSERT queries
  if (lowercaseText.startsWith("insert")) {
    if (lowercaseText.includes("into tv_interfaces")) {
      // Extract VALUES from the query and simulate proper insertion
      const newId =
        "tv_int_" +
        (mockData.tv_interfaces.length + 1 + Math.floor(Math.random() * 1000));
      const now = new Date().toISOString();

      // Create a new TV interface record based on the parameters
      const newTVInterface = {
        id: newId,
        name: params[0] || "New Interface",
        description: params[1] || "",
        type: params[2] || "home",
        device_id: params[3] || "openbox",
        screenshot_url: params[4] || null,
        screenshot_data: params[5] || null,
        clickable_areas: params[6] || "[]",
        highlight_areas: params[7] || "[]",
        is_active: params[8] !== undefined ? params[8] : true,
        created_at: params[9] || now,
        updated_at: params[10] || now,
        deleted_at: null,
      };

      // Add to mock data
      mockData.tv_interfaces.push(newTVInterface);

      return {
        rows: [newTVInterface],
        rowCount: 1,
      };
    }

    if (lowercaseText.includes("into tv_interface_marks")) {
      const newId = "mark_" + (mockData.tv_interface_marks.length + 1 + Math.floor(Math.random() * 1000));
      const now = new Date().toISOString();

      const newMark = {
        id: newId,
        tv_interface_id: params[0] || "openbox",
        step_id: params[1] || null,
        name: params[2] || "New Mark",
        description: params[3] || "",
        mark_type: params[4] || "point",
        shape: params[5] || "circle",
        position: params[6] || JSON.stringify({ x: 100, y: 100 }),
        size: params[7] || JSON.stringify({ width: 20, height: 20 }),
        color: params[8] || "#3b82f6",
        is_clickable: params[9] !== false,
        is_active: params[10] !== false,
        is_visible: params[11] !== false,
        created_at: now,
        updated_at: now,
      };

      mockData.tv_interface_marks.push(newMark);

      return {
        rows: [newMark],
        rowCount: 1,
      };
    }

    return { rows: [], rowCount: 1 };
  }

  // Handle UPDATE queries
  if (lowercaseText.startsWith("update")) {
    return { rows: [], rowCount: 1 };
  }

  // Handle DELETE queries
  if (lowercaseText.startsWith("delete")) {
    if (lowercaseText.includes("from tv_interfaces")) {
      if (lowercaseText.includes("where id =")) {
        // Delete specific TV interface by ID
        const id = params[0];
        const interfaceIndex = mockData.tv_interfaces.findIndex(
          (t) => t.id === id,
        );

        if (interfaceIndex >= 0) {
          // Remove the interface from the array
          const deleted = mockData.tv_interfaces.splice(interfaceIndex, 1)[0];
          return { rows: [deleted], rowCount: 1 };
        } else {
          return { rows: [], rowCount: 0 };
        }
      } else {
        // Delete all TV interfaces (for cleanup)
        const deletedCount = mockData.tv_interfaces.length;
        mockData.tv_interfaces = [];
        return { rows: [], rowCount: deletedCount };
      }
    }

    if (lowercaseText.includes("from tv_interface_marks")) {
      if (lowercaseText.includes("where id =")) {
        const id = params[0];
        const markIndex = mockData.tv_interface_marks.findIndex((m) => m.id === id);
        if (markIndex !== -1) {
          const deleted = mockData.tv_interface_marks.splice(markIndex, 1)[0];
          return { rows: [deleted], rowCount: 1 };
        }
      } else if (lowercaseText.includes("where tv_interface_id =")) {
        const tvInterfaceId = params[0];
        const deletedMarks = mockData.tv_interface_marks.filter((m) => m.tv_interface_id === tvInterfaceId);
        mockData.tv_interface_marks = mockData.tv_interface_marks.filter((m) => m.tv_interface_id !== tvInterfaceId);
        return { rows: deletedMarks, rowCount: deletedMarks.length };
      } else if (lowercaseText.includes("where step_id =")) {
        const stepId = params[0];
        const deletedMarks = mockData.tv_interface_marks.filter((m) => m.step_id === stepId);
        mockData.tv_interface_marks = mockData.tv_interface_marks.filter((m) => m.step_id !== stepId);
        return { rows: deletedMarks, rowCount: deletedMarks.length };
      }
    }
    return { rows: [], rowCount: 1 };
  }

  // Default response
  return { rows: [], rowCount: 0 };
}

// Mock transaction function
export async function transaction(callback) {
  // For mock implementation, just execute the callback
  const mockClient = {
    query: query,
  };
  return await callback(mockClient);
}

// Mock test connection function
export async function testConnection() {
  console.log("✅ Mock database connection successful");
  return {
    success: true,
    serverTime: new Date().toISOString(),
    version: "Mock Database v1.0.0",
  };
}

// Mock database creation
export async function createDatabase() {
  console.log("📊 Mock database created (no-op)");
}

// Mock migrations
export async function runMigrations() {
  console.log("🔄 Mock migrations completed (no-op)");
}

// Mock database stats
export async function getDatabaseStats() {
  return {
    tables: [
      { tablename: "devices", live_rows: mockData.devices.length },
      { tablename: "problems", live_rows: mockData.problems.length },
      {
        tablename: "diagnostic_steps",
        live_rows: mockData.diagnostic_steps.length,
      },
      {
        tablename: "diagnostic_sessions",
        live_rows: mockData.diagnostic_sessions.length,
      },
      { tablename: "tv_interfaces", live_rows: mockData.tv_interfaces.length },
      { tablename: "tv_interface_marks", live_rows: mockData.tv_interface_marks.length },
    ],
    databaseSize: "1.2 MB (mock)",
    timestamp: new Date().toISOString(),
  };
}

// Mock close pool
export async function closePool() {
  console.log("✅ Mock database pool closed");
}

// Create a mock pool object
export const pool = {
  connect: async () => ({
    query: query,
    release: () => {},
  }),
  on: () => {},
  end: async () => {},
};

export default {
  query,
  transaction,
  testConnection,
  createDatabase,
  runMigrations,
  getDatabaseStats,
  closePool,
  pool,
};
