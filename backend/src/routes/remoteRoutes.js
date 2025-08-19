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
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Схемы валидации
const createRemoteSchema = Joi.object({
  name: Joi.string().max(255).required(),
  manufacturer: Joi.string().max(255).required(),
  model: Joi.string().max(255).required(),
  device_id: Joi.string().max(255).allow(null).optional(),
  description: Joi.string().allow('', null).optional(),
  layout: Joi.string().valid('standard', 'compact', 'smart', 'custom').default('standard'),
  color_scheme: Joi.string().max(50).default('dark'),
  image_url: Joi.string().max(500).allow('', null).optional(),
  image_data: Joi.string().allow('', null).optional(),
  svg_data: Joi.string().allow('', null).optional(),
  dimensions: Joi.object({
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required()
  }).default({ width: 200, height: 500 }),
  buttons: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    x: Joi.number().required(),
    y: Joi.number().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    type: Joi.string().optional(),
    action: Joi.string().optional(),
    svg_path: Joi.string().allow('', null).optional(),
    key_code: Joi.string().allow('', null).optional()
  })).default([]),
  zones: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    x: Joi.number().required(),
    y: Joi.number().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    color: Joi.string().optional(),
    description: Joi.string().allow('', null).optional()
  })).default([]),
  is_default: Joi.boolean().default(false),
  is_active: Joi.boolean().default(true),
  metadata: Joi.object().default({})
});

const updateRemoteSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  manufacturer: Joi.string().max(255).optional(),
  model: Joi.string().max(255).optional(),
  device_id: Joi.string().max(255).allow(null).optional(),
  description: Joi.string().allow('', null).optional(),
  layout: Joi.string().valid('standard', 'compact', 'smart', 'custom').optional(),
  color_scheme: Joi.string().max(50).optional(),
  image_url: Joi.string().max(500).allow('', null).optional(),
  image_data: Joi.string().allow('', null).optional(),
  svg_data: Joi.string().allow('', null).optional(),
  dimensions: Joi.object({
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required()
  }).optional(),
  buttons: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    x: Joi.number().required(),
    y: Joi.number().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    type: Joi.string().optional(),
    action: Joi.string().optional(),
    svg_path: Joi.string().allow('', null).optional(),
    key_code: Joi.string().allow('', null).optional()
  })).optional(),
  zones: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    x: Joi.number().required(),
    y: Joi.number().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    color: Joi.string().optional(),
    description: Joi.string().allow('', null).optional()
  })).optional(),
  is_default: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  metadata: Joi.object().optional()
});

const duplicateRemoteSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  device_id: Joi.string().max(255).allow(null).optional(),
  description: Joi.string().allow('', null).optional()
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().max(255).allow('').optional(),
  device_id: Joi.string().max(255).optional(),
  layout: Joi.string().valid('standard', 'compact', 'smart', 'custom').optional(),
  manufacturer: Joi.string().max(255).optional(),
  sort: Joi.string().valid(
    'name_asc', 'name_desc',
    'usage_count_asc', 'usage_count_desc',
    'created_at_asc', 'created_at_desc',
    'manufacturer_asc', 'manufacturer_desc'
  ).default('usage_count_desc')
});

// Валидация параметров
const idParamSchema = Joi.object({
  id: Joi.string().required()
});

const deviceIdParamSchema = Joi.object({
  deviceId: Joi.string().required()
});

const setDefaultParamSchema = Joi.object({
  id: Joi.string().required(),
  deviceId: Joi.string().required()
});

/**
 * @route GET /api/v1/remotes
 * @desc Получение списка пультов с пагинацией и фильтрами
 * @access Public
 */
router.get('/', validateRequest({ query: querySchema }), getRemotes);

/**
 * @route GET /api/v1/remotes/stats
 * @desc Получение статистики использования пультов
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
