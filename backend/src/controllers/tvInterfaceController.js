import TVInterface from '../models/TVInterface.js';
import { v4 as uuidv4 } from 'uuid';

const tvInterfaceModel = new TVInterface();

// Получить все TV интерфейсы
export const getAllTVInterfaces = async (req, res) => {
  try {
    const filters = {
      device_id: req.query.device_id,
      type: req.query.type,
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset
    };

    // Убираем undefined значения
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    const tvInterfaces = await tvInterfaceModel.getAll(filters);

    res.json({
      success: true,
      data: tvInterfaces,
      message: 'TV интерфейсы успешно получены',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getAllTVInterfaces:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении TV интерфейсов',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Получить TV интерфейс по ID
export const getTVInterfaceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID TV интерфейса обязателен',
        timestamp: new Date().toISOString()
      });
    }

    const tvInterface = await tvInterfaceModel.getById(id);

    if (!tvInterface) {
      return res.status(404).json({
        success: false,
        error: 'TV интерфейс не найден',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: tvInterface,
      message: 'TV интерфейс успешно получен',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getTVInterfaceById:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении TV интерфейса',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Получить TV интерфейсы по device_id
export const getTVInterfacesByDeviceId = async (req, res) => {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'ID устройства обязателен',
        timestamp: new Date().toISOString()
      });
    }

    const tvInterfaces = await tvInterfaceModel.getByDeviceId(deviceId);

    res.json({
      success: true,
      data: tvInterfaces,
      message: 'TV интерфейсы для устройства успешно получены',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getTVInterfacesByDeviceId:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении TV интерфейсов для устройства',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Создать новый TV интерфейс
export const createTVInterface = async (req, res) => {
  try {
    const { name, description, type, device_id, screenshot_url, screenshot_data, clickable_areas, highlight_areas } = req.body;

    // Валидация
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Название интерфейса обязательно',
        timestamp: new Date().toISOString()
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Тип интерфейса обязателен',
        timestamp: new Date().toISOString()
      });
    }

    if (!device_id) {
      return res.status(400).json({
        success: false,
        error: 'Устройство обязательно для выбора',
        timestamp: new Date().toISOString()
      });
    }

    const tvInterfaceData = {
      id: uuidv4(),
      name: name.trim(),
      description: description?.trim() || '',
      type,
      device_id,
      screenshot_url: screenshot_url || null,
      screenshot_data: screenshot_data || null,
      clickable_areas: clickable_areas || [],
      highlight_areas: highlight_areas || []
    };

    const tvInterface = await tvInterfaceModel.create(tvInterfaceData);

    res.status(201).json({
      success: true,
      data: tvInterface,
      message: 'TV интерфейс успешно создан',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in createTVInterface:', error);
    
    if (error.message.includes('не найдено') || error.message.includes('обязательно')) {
      return res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Ошибка при создании TV интерфейса',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Обновить TV интерфейс
export const updateTVInterface = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID TV интерфейса обязателен',
        timestamp: new Date().toISOString()
      });
    }

    const tvInterface = await tvInterfaceModel.update(id, updateData);

    res.json({
      success: true,
      data: tvInterface,
      message: 'TV интерфейс успешно обновлен',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in updateTVInterface:', error);
    
    if (error.message.includes('не найден')) {
      return res.status(404).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    if (error.message.includes('не найдено') || error.message.includes('обязательно')) {
      return res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Ошибка при обновлении TV интерфейса',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Удалить TV интерфейс
export const deleteTVInterface = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID TV интерфейса обязателен',
        timestamp: new Date().toISOString()
      });
    }

    // Проверяем существование
    const existing = await tvInterfaceModel.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'TV интерфейс не найден',
        timestamp: new Date().toISOString()
      });
    }

    await tvInterfaceModel.delete(id);

    res.json({
      success: true,
      message: 'TV интерфейс успешно удален',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in deleteTVInterface:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при удалении TV интерфейса',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Переключить статус активности
export const toggleTVInterfaceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID TV интерфейса обязателен',
        timestamp: new Date().toISOString()
      });
    }

    const tvInterface = await tvInterfaceModel.toggleStatus(id);

    res.json({
      success: true,
      data: tvInterface,
      message: `TV интерфейс ${tvInterface.is_active ? 'активирова��' : 'деактивирован'}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in toggleTVInterfaceStatus:', error);
    
    if (error.message.includes('не найден')) {
      return res.status(404).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Ошибка при изменении статуса TV интерфейса',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Дублировать TV интерфейс
export const duplicateTVInterface = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID TV интерфейса обязателен',
        timestamp: new Date().toISOString()
      });
    }

    const tvInterface = await tvInterfaceModel.duplicate(id, name);

    res.status(201).json({
      success: true,
      data: tvInterface,
      message: 'TV интерфейс успешно дублирован',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in duplicateTVInterface:', error);
    
    if (error.message.includes('не найден')) {
      return res.status(404).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Ошибка при дублировании TV интерфейса',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Получить статистику TV интерфейсов
export const getTVInterfaceStats = async (req, res) => {
  try {
    const stats = await tvInterfaceModel.getStats();

    res.json({
      success: true,
      data: stats,
      message: 'Статистика TV интерфейсов успешно получена',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getTVInterfaceStats:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении статистики TV интерфейсов',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Экспортировать TV интерфейс в JSON
export const exportTVInterface = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID TV интерфейса обязателен',
        timestamp: new Date().toISOString()
      });
    }

    const tvInterface = await tvInterfaceModel.getById(id);

    if (!tvInterface) {
      return res.status(404).json({
        success: false,
        error: 'TV интерфейс не найден',
        timestamp: new Date().toISOString()
      });
    }

    // Подготавливаем данные для экспорта
    const exportData = {
      name: tvInterface.name,
      description: tvInterface.description,
      type: tvInterface.type,
      device_info: {
        name: tvInterface.device_name,
        brand: tvInterface.device_brand,
        model: tvInterface.device_model
      },
      screenshot_data: tvInterface.screenshot_data,
      clickable_areas: tvInterface.clickable_areas,
      highlight_areas: tvInterface.highlight_areas,
      exported_at: new Date().toISOString(),
      version: '1.0'
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="tv-interface-${tvInterface.name.replace(/[^a-zA-Z0-9]/g, '-')}.json"`);
    
    res.json({
      success: true,
      data: exportData,
      message: 'TV интерфейс успешно экспортирован',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in exportTVInterface:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при экспорте TV интерфейса',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

export default {
  getAllTVInterfaces,
  getTVInterfaceById,
  getTVInterfacesByDeviceId,
  createTVInterface,
  updateTVInterface,
  deleteTVInterface,
  toggleTVInterfaceStatus,
  duplicateTVInterface,
  getTVInterfaceStats,
  exportTVInterface
};
