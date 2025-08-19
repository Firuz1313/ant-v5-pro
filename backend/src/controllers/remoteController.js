import Remote from '../models/Remote.js';
import { v4 as uuidv4 } from 'uuid';

const remoteModel = new Remote();

/**
 * Получение списка пультов
 * GET /api/v1/remotes
 */
export const getRemotes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      device_id,
      layout,
      manufacturer,
      sort = 'usage_count_desc'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Если есть параметры поиска, используем search метод
    if (search || device_id || layout || manufacturer) {
      const filters = { 
        deviceId: device_id,
        layout,
        manufacturer,
        limit: parseInt(limit)
      };
      
      const remotes = await remoteModel.search(search, filters);
      
      return res.json({
        success: true,
        data: remotes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: remotes.length,
          hasMore: remotes.length === parseInt(limit)
        },
        timestamp: new Date().toISOString()
      });
    }

    // Обычный список с пагинацией
    const result = await remoteModel.findAll({}, {
      offset,
      limit: parseInt(limit),
      sortBy: sort.split('_')[0],
      sortOrder: sort.includes('desc') ? 'DESC' : 'ASC'
    });

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasMore: (page * limit) < result.total
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in getRemotes:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении пультов',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Получение пульта по ID
 * GET /api/v1/remotes/:id
 */
export const getRemoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const remote = await remoteModel.findById(id);

    if (!remote) {
      return res.status(404).json({
        success: false,
        error: 'Пульт не найден',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: remote,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in getRemoteById:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении пульта',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Создание нового пульта
 * POST /api/v1/remotes
 */
export const createRemote = async (req, res) => {
  try {
    const remoteData = {
      id: uuidv4(),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Валидация данных
    const validationErrors = remoteModel.validateData(remoteData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ошибки валидации',
        details: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    const newRemote = await remoteModel.create(remoteData);

    res.status(201).json({
      success: true,
      data: newRemote,
      message: 'Пульт создан успешно',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in createRemote:', error);
    
    // Проверка на дублирование
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Пульт с таким ID уже существует',
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Ошибка при создании пульта',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Обновление пульта
 * PUT /api/v1/remotes/:id
 */
export const updateRemote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    // Валидация данных для обновления
    const validationErrors = remoteModel.validateData(updateData, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ошибки валидации',
        details: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    const updatedRemote = await remoteModel.update(id, updateData);

    if (!updatedRemote) {
      return res.status(404).json({
        success: false,
        error: 'Пульт не найден',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: updatedRemote,
      message: 'Пульт обновлен успешно',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in updateRemote:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при обновлении пульта',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Удаление пульта (мягкое удаление)
 * DELETE /api/v1/remotes/:id
 */
export const deleteRemote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRemote = await remoteModel.delete(id);

    if (!deletedRemote) {
      return res.status(404).json({
        success: false,
        error: 'Пульт не найден',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: deletedRemote,
      message: 'Пульт удален успешно',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in deleteRemote:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при удалении пульта',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Получение пультов для конкретного устройства
 * GET /api/v1/remotes/device/:deviceId
 */
export const getRemotesByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const remotes = await remoteModel.getByDevice(deviceId);

    res.json({
      success: true,
      data: remotes,
      total: remotes.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in getRemotesByDevice:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении пультов устройства',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Получение пульта по умолчанию для устройства
 * GET /api/v1/remotes/device/:deviceId/default
 */
export const getDefaultRemoteForDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const remote = await remoteModel.getDefaultForDevice(deviceId);

    if (!remote) {
      return res.status(404).json({
        success: false,
        error: 'Пульт по умолчанию не найден для этого устройства',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: remote,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in getDefaultRemoteForDevice:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении пульта по умолчанию',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Установка пульта как default для устройства
 * POST /api/v1/remotes/:id/set-default/:deviceId
 */
export const setRemoteAsDefault = async (req, res) => {
  try {
    const { id, deviceId } = req.params;
    const result = await remoteModel.setAsDefault(id, deviceId);

    res.json({
      success: true,
      message: result.message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in setRemoteAsDefault:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при установке пульта по умолчанию',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Дублирование пульта
 * POST /api/v1/remotes/:id/duplicate
 */
export const duplicateRemote = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const duplicatedRemote = await remoteModel.duplicate(id, newData);

    res.status(201).json({
      success: true,
      data: duplicatedRemote,
      message: 'Пульт дублирован успешно',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in duplicateRemote:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при дублировании пульта',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Инкремент счетчика использования
 * POST /api/v1/remotes/:id/use
 */
export const incrementRemoteUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await remoteModel.incrementUsage(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Пульт не найден',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: { usage_count: result.usage_count },
      message: 'Счетчик использования обновлен',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in incrementRemoteUsage:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при обновлении счетчика использования',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Получение статистики использования пультов
 * GET /api/v1/remotes/stats
 * GET /api/v1/remotes/stats?device_id=xxx
 */
export const getRemoteStats = async (req, res) => {
  try {
    const { device_id } = req.query;
    const stats = await remoteModel.getUsageStats(device_id);

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in getRemoteStats:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении статистики пультов',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

export default {
  getRemotes,
  getRemoteById,
  createRemote,
  updateRemote,
  deleteRemote,
  getRemotesByDevice,
  getDefaultRemoteForDevice,
  setRemoteAsDefault,
  duplicateRemote,
  incrementRemoteUsage,
  getRemoteStats
};
