import BaseModel from "./BaseModel.js";

class TVInterface extends BaseModel {
  constructor() {
    super("tv_interfaces");
  }

  // Определение схемы для валидации
  getSchema() {
    return {
      name: { type: "string", required: true, minLength: 1, maxLength: 255 },
      description: { type: "string", required: false, maxLength: 1000 },
      type: {
        type: "string",
        required: true,
        enum: [
          "home",
          "settings",
          "channels",
          "apps",
          "guide",
          "no-signal",
          "error",
          "custom",
        ],
      },
      device_id: { type: "string", required: true },
      screenshot_url: { type: "string", required: false },
      screenshot_data: { type: "string", required: false }, // base64 data
      clickable_areas: { type: "array", required: false, default: [] },
      highlight_areas: { type: "array", required: false, default: [] },
      is_active: { type: "boolean", required: false, default: true },
      created_at: { type: "datetime", required: false },
      updated_at: { type: "datetime", required: false },
    };
  }

  // Получить все интерфейсы с возможностью фильтрации
  async getAll(filters = {}) {
    try {
      let query = `
        SELECT 
          ti.*,
          d.name as device_name,
          d.brand as device_brand,
          d.model as device_model
        FROM ${this.tableName} ti
        LEFT JOIN devices d ON ti.device_id = d.id
        WHERE ti.deleted_at IS NULL
      `;

      const params = [];

      // Фильтр по device_id
      if (filters.device_id) {
        query += ` AND ti.device_id = $${params.length + 1}`;
        params.push(filters.device_id);
      }

      // Фильтр по активности
      if (filters.is_active !== undefined) {
        query += ` AND ti.is_active = $${params.length + 1}`;
        params.push(filters.is_active);
      }

      // Фильтр по типу
      if (filters.type) {
        query += ` AND ti.type = $${params.length + 1}`;
        params.push(filters.type);
      }

      // Поиск по названию или описанию
      if (filters.search) {
        query += ` AND (ti.name ILIKE $${params.length + 1} OR ti.description ILIKE $${params.length + 1})`;
        params.push(`%${filters.search}%`);
      }

      query += ` ORDER BY ti.created_at DESC`;

      // Лимит и смещение для пагинации
      if (filters.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(parseInt(filters.limit));

        if (filters.offset) {
          query += ` OFFSET $${params.length + 1}`;
          params.push(parseInt(filters.offset));
        }
      }

      const result = await this.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Error getting TV interfaces:", error);
      throw error;
    }
  }

  // Получить интерфейсы по device_id
  async getByDeviceId(deviceId) {
    try {
      const query = `
        SELECT 
          ti.*,
          d.name as device_name,
          d.brand as device_brand,
          d.model as device_model
        FROM ${this.tableName} ti
        LEFT JOIN devices d ON ti.device_id = d.id
        WHERE ti.device_id = $1 AND ti.deleted_at IS NULL AND ti.is_active = true
        ORDER BY ti.created_at DESC
      `;

      const result = await this.query(query, [deviceId]);
      return result.rows;
    } catch (error) {
      console.error("Error getting TV interfaces by device ID:", error);
      throw error;
    }
  }

  // Создать новый интерфейс
  async create(data) {
    try {
      // Валидаци�� обязательных полей
      if (!data.name || !data.name.trim()) {
        throw new Error("Название интерфейса обязательно");
      }

      if (!data.type) {
        throw new Error("Тип интерфейса обязателен");
      }

      if (!data.device_id) {
        throw new Error("Устройство обязательно для выбора");
      }

      // Проверяем существование устройства
      const deviceExists = await this.query(
        "SELECT id FROM devices WHERE id = $1",
        [data.device_id],
      );
      if (deviceExists.rows.length === 0) {
        throw new Error("Выбранное устройство не найдено");
      }

      const now = new Date().toISOString();
      const tvInterfaceData = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
        type: data.type,
        device_id: data.device_id,
        screenshot_url: data.screenshot_url || null,
        screenshot_data: data.screenshot_data || null,
        clickable_areas: JSON.stringify(data.clickable_areas || []),
        highlight_areas: JSON.stringify(data.highlight_areas || []),
        is_active: data.is_active !== undefined ? data.is_active : true,
        created_at: now,
        updated_at: now,
      };

      const result = await super.create(tvInterfaceData);

      // Получаем созданный интерфейс с данными устройства
      const created = await this.getById(result.id);
      return created;
    } catch (error) {
      console.error("Error creating TV interface:", error);
      throw error;
    }
  }

  // Обновить интерфейс
  async update(id, data) {
    try {
      // Проверяем существование интерфейса
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error("TV интерфейс не найден");
      }

      // Валидация device_id если он изменяется
      if (data.device_id && data.device_id !== existing.device_id) {
        const deviceExists = await this.query(
          "SELECT id FROM devices WHERE id = $1",
          [data.device_id],
        );
        if (deviceExists.rows.length === 0) {
          throw new Error("Выбранное устройство не найдено");
        }
      }

      const updateData = {
        updated_at: new Date().toISOString(),
      };

      // Обновляем только переданные поля
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.description !== undefined)
        updateData.description = data.description?.trim() || "";
      if (data.type !== undefined) updateData.type = data.type;
      if (data.device_id !== undefined) updateData.device_id = data.device_id;
      if (data.screenshot_url !== undefined)
        updateData.screenshot_url = data.screenshot_url;
      if (data.screenshot_data !== undefined)
        updateData.screenshot_data = data.screenshot_data;
      if (data.clickable_areas !== undefined)
        updateData.clickable_areas = JSON.stringify(data.clickable_areas);
      if (data.highlight_areas !== undefined)
        updateData.highlight_areas = JSON.stringify(data.highlight_areas);
      if (data.is_active !== undefined) updateData.is_active = data.is_active;

      await super.updateById(id, updateData);

      // Возвращаем обновленный интерфейс с данными устройства
      const updated = await this.getById(id);
      return updated;
    } catch (error) {
      console.error("Error updating TV interface:", error);
      throw error;
    }
  }

  // Получить интерфейс по ID с данными устройства
  async getById(id) {
    try {
      const query = `
        SELECT 
          ti.*,
          d.name as device_name,
          d.brand as device_brand,
          d.model as device_model
        FROM ${this.tableName} ti
        LEFT JOIN devices d ON ti.device_id = d.id
        WHERE ti.id = $1 AND ti.deleted_at IS NULL
      `;

      const result = await this.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const tvInterface = result.rows[0];

      // Парсим JSON поля
      if (tvInterface.clickable_areas) {
        try {
          tvInterface.clickable_areas = JSON.parse(tvInterface.clickable_areas);
        } catch (e) {
          tvInterface.clickable_areas = [];
        }
      } else {
        tvInterface.clickable_areas = [];
      }

      if (tvInterface.highlight_areas) {
        try {
          tvInterface.highlight_areas = JSON.parse(tvInterface.highlight_areas);
        } catch (e) {
          tvInterface.highlight_areas = [];
        }
      } else {
        tvInterface.highlight_areas = [];
      }

      return tvInterface;
    } catch (error) {
      console.error("Error getting TV interface by ID:", error);
      throw error;
    }
  }

  // Переключить статус активности
  async toggleStatus(id) {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error("TV интерфейс не найден");
      }

      const newStatus = !existing.is_active;
      await this.update(id, { is_active: newStatus });

      return await this.getById(id);
    } catch (error) {
      console.error("Error toggling TV interface status:", error);
      throw error;
    }
  }

  // Дублировать интерфейс
  async duplicate(id, newName) {
    try {
      const original = await this.getById(id);
      if (!original) {
        throw new Error("TV интерфейс не найден");
      }

      const duplicateData = {
        name: newName || `${original.name} (копия)`,
        description: original.description,
        type: original.type,
        device_id: original.device_id,
        screenshot_url: original.screenshot_url,
        screenshot_data: original.screenshot_data,
        clickable_areas: original.clickable_areas,
        highlight_areas: original.highlight_areas,
        is_active: false, // Копия создается неактивной
      };

      return await this.create(duplicateData);
    } catch (error) {
      console.error("Error duplicating TV interface:", error);
      throw error;
    }
  }

  // Получить статистику
  async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active,
          COUNT(CASE WHEN is_active = false THEN 1 END) as inactive,
          COUNT(DISTINCT device_id) as devices_with_interfaces
        FROM ${this.tableName} 
        WHERE deleted_at IS NULL
      `;

      const result = await this.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting TV interface stats:", error);
      throw error;
    }
  }
}

export default TVInterface;
