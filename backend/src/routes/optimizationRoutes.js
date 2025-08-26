import express from 'express';
import {
  optimizeTVInterfacesDatabase,
  getOptimizationStatus,
  analyzeSlowQueries,
  cleanupLargeScreenshots
} from '../controllers/optimizationController.js';
import requestLogger from '../middleware/requestLogger.js';

const router = express.Router();

// Применяем middleware для логирования всех запросов
router.use(requestLogger);

/**
 * @route POST /api/v1/optimization/tv-interfaces/optimize
 * @desc Optimize TV interfaces database (add indexes, update statistics)
 * @access Admin
 */
router.post('/tv-interfaces/optimize', optimizeTVInterfacesDatabase);

/**
 * @route GET /api/v1/optimization/tv-interfaces/status
 * @desc Get TV interfaces optimization status
 * @access Admin
 */
router.get('/tv-interfaces/status', getOptimizationStatus);

/**
 * @route GET /api/v1/optimization/tv-interfaces/analyze-queries
 * @desc Analyze slow TV interface queries
 * @access Admin
 */
router.get('/tv-interfaces/analyze-queries', analyzeSlowQueries);

/**
 * @route GET /api/v1/optimization/tv-interfaces/cleanup-screenshots
 * @desc Analyze large screenshots for cleanup
 * @access Admin
 * @query {number} maxSizeMB - Maximum screenshot size in MB (default: 5)
 */
router.get('/tv-interfaces/cleanup-screenshots', cleanupLargeScreenshots);

// Middleware для обработки ошибок маршрутов
router.use((error, req, res, next) => {
  console.error('Optimization Route Error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера в модуле оптимизации',
    details: error.message,
    timestamp: new Date().toISOString()
  });
});

export default router;
