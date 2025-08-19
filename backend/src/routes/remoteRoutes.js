import express from 'express';
import {
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
} from '../controllers/remoteController.js';
const router = express.Router();

/**
 * @route GET /api/v1/remotes
 * @desc Получение списка пультов с пагинацией и фильтрами
 * @access Public
 */
router.get('/', validateRequest({ query: querySchema }), getRemotes);

/**
 * @route GET /api/v1/remotes/stats
 * @desc Получен��е статистики использования пультов
 * @access Public
 */
router.get('/stats', getRemoteStats);

/**
 * @route GET /api/v1/remotes/device/:deviceId
 * @desc Получение всех пультов для конкретного устройства
 * @access Public
 */
router.get('/device/:deviceId', validateRequest({ params: deviceIdParamSchema }), getRemotesByDevice);

/**
 * @route GET /api/v1/remotes/device/:deviceId/default
 * @desc Получение пульта по умолчанию для устройства
 * @access Public
 */
router.get('/device/:deviceId/default', validateRequest({ params: deviceIdParamSchema }), getDefaultRemoteForDevice);

/**
 * @route GET /api/v1/remotes/:id
 * @desc Получение пульта по ID
 * @access Public
 */
router.get('/:id', validateRequest({ params: idParamSchema }), getRemoteById);

/**
 * @route POST /api/v1/remotes
 * @desc Создание нового пульта
 * @access Public
 */
router.post('/', validateRequest({ body: createRemoteSchema }), createRemote);

/**
 * @route POST /api/v1/remotes/:id/duplicate
 * @desc Дублирование пульта
 * @access Public
 */
router.post('/:id/duplicate', 
  validateRequest({ 
    params: idParamSchema, 
    body: duplicateRemoteSchema 
  }), 
  duplicateRemote
);

/**
 * @route POST /api/v1/remotes/:id/set-default/:deviceId
 * @desc Установка пульта как default для устройства
 * @access Public
 */
router.post('/:id/set-default/:deviceId', 
  validateRequest({ params: setDefaultParamSchema }), 
  setRemoteAsDefault
);

/**
 * @route POST /api/v1/remotes/:id/use
 * @desc Инкремент счетчика использования пульта
 * @access Public
 */
router.post('/:id/use', validateRequest({ params: idParamSchema }), incrementRemoteUsage);

/**
 * @route PUT /api/v1/remotes/:id
 * @desc Обновление пульта
 * @access Public
 */
router.put('/:id', 
  validateRequest({ 
    params: idParamSchema, 
    body: updateRemoteSchema 
  }), 
  updateRemote
);

/**
 * @route DELETE /api/v1/remotes/:id
 * @desc Удаление пульта (мягкое удаление)
 * @access Public
 */
router.delete('/:id', validateRequest({ params: idParamSchema }), deleteRemote);

export default router;
