import BaseModel from './BaseModel.js';
import { query, transaction } from '../utils/database.js';

/**
 * Модель для работы с сессиями диагностики
 */
class DiagnosticSession extends BaseModel {
  constructor() {
    super('diagnostic_sessions');
  }

  /**
   * Создание новой сессии диагностики
   */
  async createSession(sessionData) {
    try {
      return await transaction(async (client) => {
        // Получаем количество шагов в проблеме
        const stepsResult = await client.query(
          'SELECT COUNT(*) as total FROM diagnostic_steps WHERE problem_id = $1 AND is_active = true',
          [sessionData.problem_id]
        );

        const totalSteps = parseInt(stepsResult.rows[0].total || 0);

        // Создаем сессию
        const session = {
          ...sessionData,
          total_steps: totalSteps,
          completed_steps: 0,
          success: null,
          duration: null
        };

        const prepared = this.prepareForInsert(session);
        const { sql, values } = this.buildInsertQuery(prepared);
        const result = await client.query(sql, values);

        return result.rows[0];
      });
    } catch (error) {
      console.error('Ошибка создания сессии диагностики:', error.message);
      throw error;
    }
  }

  /**
   * Завершение сессии
   */
  async completeSession(sessionId, completionData = {}) {
    try {
      const endTime = this.createTimestamp();
      
      // Получаем текущую сессию для вычисления продолжительности
      const currentSession = await this.findById(sessionId);
      if (!currentSession) {
        throw new Error('Сессия не найдена');
      }

      const startTime = new Date(currentSession.start_time);
      const duration = Math.round((new Date(endTime) - startTime) / 1000); // в секундах

      const updateData = {
        end_time: endTime,
        duration,
        success: completionData.success || false,
        feedback: completionData.feedback || null,
        ...completionData
      };

      const result = await this.updateById(sessionId, updateData);
      
      // Обновляем статистику проблемы если сессия была успешной
      if (completionData.success) {
        await query(`
          UPDATE problems 
          SET completed_count = completed_count + 1
          WHERE id = $1
        `, [currentSession.problem_id]);
      }

      return result;
    } catch (error) {
      console.error('Ошибка завершения сессии:', error.message);
      throw error;
    }
  }

  /**
   * Обновление прогресса сессии
   */
  async updateProgress(sessionId, stepId, stepResult) {
    try {
      return await transaction(async (client) => {
        // Создаем или обновляем запись о выполнении шага
        const stepData = {
          session_id: sessionId,
          step_id: stepId,
          step_number: stepResult.step_number,
          completed: stepResult.completed || false,
          result: stepResult.result || 'success',
          time_spent: stepResult.time_spent || null,
          user_input: stepResult.user_input || null,
          errors: stepResult.errors || [],
          metadata: stepResult.metadata || null
        };

        // Проверяем, существует ли уже запись о выполнении этого шага
        const existingResult = await client.query(
          'SELECT id FROM session_steps WHERE session_id = $1 AND step_id = $2',
          [sessionId, stepId]
        );

        if (existingResult.rows.length > 0) {
          // Обновляем существующую запись
          const updateColumns = Object.keys(stepData).filter(key => key !== 'session_id' && key !== 'step_id');
          const updateValues = updateColumns.map(col => stepData[col]);
          const setClause = updateColumns.map((col, index) => `${col} = $${index + 3}`);

          await client.query(`
            UPDATE session_steps 
            SET ${setClause.join(', ')}, completed_at = $1, updated_at = $2
            WHERE session_id = $${updateColumns.length + 3} AND step_id = $${updateColumns.length + 4}
          `, [
            stepData.completed ? this.createTimestamp() : null,
            this.createTimestamp(),
            ...updateValues,
            sessionId,
            stepId
          ]);
        } else {
          // Создаем новую запись
          const prepared = {
            ...stepData,
            id: this.generateId(),
            started_at: this.createTimestamp(),
            completed_at: stepData.completed ? this.createTimestamp() : null,
            created_at: this.createTimestamp(),
            updated_at: this.createTimestamp()
          };

          const columns = Object.keys(prepared);
          const values = Object.values(prepared);
          const placeholders = columns.map((_, index) => `$${index + 1}`);

          await client.query(
            `INSERT INTO session_steps (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`,
            values
          );
        }

        // Обновляем прогресс сессии
        const completedStepsResult = await client.query(
          'SELECT COUNT(*) as completed FROM session_steps WHERE session_id = $1 AND completed = true',
          [sessionId]
        );

        const completedSteps = parseInt(completedStepsResult.rows[0].completed || 0);

        const sessionUpdateResult = await client.query(`
          UPDATE diagnostic_sessions 
          SET completed_steps = $1, updated_at = $2
          WHERE id = $3
          RETURNING *
        `, [completedSteps, this.createTimestamp(), sessionId]);

        return sessionUpdateResult.rows[0];
      });
    } catch (error) {
      console.error('Ошибка обновления прогресса сессии:', error.message);
      throw error;
    }
  }

  /**
   * Получение активных сессий
   */
  async getActiveSessions(options = {}) {
    try {
      const sql = `
        SELECT 
          ds.*,
          d.name as device_name,
          d.brand as device_brand,
          p.title as problem_title,
          p.category as problem_category,
          EXTRACT(EPOCH FROM (NOW() - ds.start_time))::integer as elapsed_seconds
        FROM diagnostic_sessions ds
        LEFT JOIN devices d ON ds.device_id = d.id
        LEFT JOIN problems p ON ds.problem_id = p.id
        WHERE ds.is_active = true AND ds.end_time IS NULL
        ORDER BY ds.start_time DESC
        LIMIT $1 OFFSET $2
      `;

      const limit = options.limit || 50;
      const offset = options.offset || 0;

      const result = await query(sql, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Ошибка получения активных сессий:', error.message);
      throw error;
    }
  }

  /**
   * Получение сессии с детальным прогрессом
   */
  async findByIdWithProgress(sessionId) {
    try {
      const sql = `
        SELECT 
          ds.*,
          d.name as device_name,
          d.brand as device_brand,
          d.model as device_model,
          p.title as problem_title,
          p.category as problem_category,
          p.estimated_time as problem_estimated_time,
          CASE 
            WHEN ds.end_time IS NOT NULL THEN ds.duration
            ELSE EXTRACT(EPOCH FROM (NOW() - ds.start_time))::integer
          END as current_duration
        FROM diagnostic_sessions ds
        LEFT JOIN devices d ON ds.device_id = d.id
        LEFT JOIN problems p ON ds.problem_id = p.id
        WHERE ds.id = $1
      `;

      const sessionResult = await query(sql, [sessionId]);
      if (sessionResult.rows.length === 0) {
        return null;
      }

      const session = sessionResult.rows[0];

      // Получаем прогресс по шагам
      const stepsProgressSql = `
        SELECT 
          ss.*,
          step.title as step_title,
          step.description as step_description,
          step.step_number,
          step.estimated_time as step_estimated_time
        FROM session_steps ss
        LEFT JOIN diagnostic_steps step ON ss.step_id = step.id
        WHERE ss.session_id = $1
        ORDER BY ss.step_number ASC
      `;

      const stepsResult = await query(stepsProgressSql, [sessionId]);
      
      return {
        ...session,
        steps_progress: stepsResult.rows,
        completion_percentage: session.total_steps > 0 
          ? Math.round((session.completed_steps / session.total_steps) * 100) 
          : 0
      };
    } catch (error) {
      console.error('Ошибка получения сессии с прогрессом:', error.message);
      throw error;
    }
  }

  /**
   * Получение статистики сессий
   */
  async getSessionStats(filters = {}) {
    try {
      let whereConditions = ['ds.is_active = true'];
      const values = [];
      let paramIndex = 1;

      if (filters.device_id) {
        whereConditions.push(`ds.device_id = $${paramIndex}`);
        values.push(filters.device_id);
        paramIndex++;
      }

      if (filters.problem_id) {
        whereConditions.push(`ds.problem_id = $${paramIndex}`);
        values.push(filters.problem_id);
        paramIndex++;
      }

      if (filters.date_from) {
        whereConditions.push(`ds.start_time >= $${paramIndex}`);
        values.push(filters.date_from);
        paramIndex++;
      }

      if (filters.date_to) {
        whereConditions.push(`ds.start_time <= $${paramIndex}`);
        values.push(filters.date_to);
        paramIndex++;
      }

      const sql = `
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN ds.success = true THEN 1 END) as successful_sessions,
          COUNT(CASE WHEN ds.success = false THEN 1 END) as failed_sessions,
          COUNT(CASE WHEN ds.end_time IS NULL THEN 1 END) as active_sessions,
          AVG(CASE WHEN ds.duration IS NOT NULL THEN ds.duration END) as avg_duration,
          MIN(CASE WHEN ds.duration IS NOT NULL THEN ds.duration END) as min_duration,
          MAX(CASE WHEN ds.duration IS NOT NULL THEN ds.duration END) as max_duration,
          AVG(ds.completed_steps::float / NULLIF(ds.total_steps, 0) * 100) as avg_completion_rate
        FROM diagnostic_sessions ds
        WHERE ${whereConditions.join(' AND ')}
      `;

      const result = await query(sql, values);
      const stats = result.rows[0];

      return {
        total_sessions: parseInt(stats.total_sessions || 0),
        successful_sessions: parseInt(stats.successful_sessions || 0),
        failed_sessions: parseInt(stats.failed_sessions || 0),
        active_sessions: parseInt(stats.active_sessions || 0),
        success_rate: stats.total_sessions > 0 
          ? Math.round((parseInt(stats.successful_sessions || 0) / parseInt(stats.total_sessions)) * 100)
          : 0,
        avg_duration: stats.avg_duration ? Math.round(parseFloat(stats.avg_duration)) : null,
        min_duration: stats.min_duration ? parseInt(stats.min_duration) : null,
        max_duration: stats.max_duration ? parseInt(stats.max_duration) : null,
        avg_completion_rate: stats.avg_completion_rate ? Math.round(parseFloat(stats.avg_completion_rate)) : 0
      };
    } catch (error) {
      console.error('Ошибка получения статистики сессий:', error.message);
      throw error;
    }
  }

  /**
   * Получение популярных проблем по сессиям
   */
  async getPopularProblems(limit = 10, timeframe = '30 days') {
    try {
      const sql = `
        SELECT 
          p.id,
          p.title,
          p.category,
          d.name as device_name,
          COUNT(ds.id) as session_count,
          COUNT(CASE WHEN ds.success = true THEN 1 END) as successful_count,
          AVG(CASE WHEN ds.duration IS NOT NULL THEN ds.duration END) as avg_duration,
          AVG(ds.completed_steps::float / NULLIF(ds.total_steps, 0) * 100) as avg_completion_rate
        FROM diagnostic_sessions ds
        JOIN problems p ON ds.problem_id = p.id
        JOIN devices d ON ds.device_id = d.id
        WHERE ds.is_active = true 
          AND ds.start_time >= NOW() - INTERVAL '${timeframe}'
        GROUP BY p.id, p.title, p.category, d.name
        ORDER BY session_count DESC, successful_count DESC
        LIMIT $1
      `;

      const result = await query(sql, [limit]);
      return result.rows.map(row => ({
        ...row,
        session_count: parseInt(row.session_count || 0),
        successful_count: parseInt(row.successful_count || 0),
        success_rate: row.session_count > 0 
          ? Math.round((parseInt(row.successful_count || 0) / parseInt(row.session_count)) * 100)
          : 0,
        avg_duration: row.avg_duration ? Math.round(parseFloat(row.avg_duration)) : null,
        avg_completion_rate: row.avg_completion_rate ? Math.round(parseFloat(row.avg_completion_rate)) : 0
      }));
    } catch (error) {
      console.error('Ошибка получения популярных проблем:', error.message);
      throw error;
    }
  }

  /**
   * Очистка старых сессий
   */
  async cleanupOldSessions(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      return await transaction(async (client) => {
        // Удаляем старые завершенные сессии
        const sessionsResult = await client.query(`
          DELETE FROM diagnostic_sessions 
          WHERE start_time < $1 
            AND end_time IS NOT NULL 
            AND is_active = true
          RETURNING id
        `, [cutoffDate]);

        // Архивируем очень старые активные сессии (возможно, брошенные)
        const abandonedCutoff = new Date();
        abandonedCutoff.setHours(abandonedCutoff.getHours() - 24); // старше 24 часов

        const abandonedResult = await client.query(`
          UPDATE diagnostic_sessions 
          SET is_active = false, 
              end_time = NOW(),
              updated_at = NOW()
          WHERE start_time < $1 
            AND end_time IS NULL 
            AND is_active = true
          RETURNING id
        `, [abandonedCutoff]);

        return {
          deleted_sessions: sessionsResult.rows.length,
          archived_sessions: abandonedResult.rows.length
        };
      });
    } catch (error) {
      console.error('Ошибка очистки старых сессий:', error.message);
      throw error;
    }
  }

  /**
   * Получение аналитики по временным интервалам
   */
  async getTimeAnalytics(period = 'day', limit = 30) {
    try {
      let dateFormat;
      let groupBy;

      switch (period) {
        case 'hour':
          dateFormat = 'YYYY-MM-DD HH24:00:00';
          groupBy = "date_trunc('hour', start_time)";
          break;
        case 'day':
          dateFormat = 'YYYY-MM-DD';
          groupBy = "date_trunc('day', start_time)";
          break;
        case 'week':
          dateFormat = 'YYYY-WW';
          groupBy = "date_trunc('week', start_time)";
          break;
        case 'month':
          dateFormat = 'YYYY-MM';
          groupBy = "date_trunc('month', start_time)";
          break;
        default:
          dateFormat = 'YYYY-MM-DD';
          groupBy = "date_trunc('day', start_time)";
      }

      const sql = `
        SELECT 
          to_char(${groupBy}, '${dateFormat}') as period,
          ${groupBy} as period_start,
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN success = true THEN 1 END) as successful_sessions,
          AVG(CASE WHEN duration IS NOT NULL THEN duration END) as avg_duration,
          AVG(completed_steps::float / NULLIF(total_steps, 0) * 100) as avg_completion_rate
        FROM diagnostic_sessions
        WHERE is_active = true 
          AND start_time >= NOW() - INTERVAL '${limit} ${period}s'
        GROUP BY ${groupBy}
        ORDER BY period_start DESC
        LIMIT $1
      `;

      const result = await query(sql, [limit]);
      return result.rows.map(row => ({
        period: row.period,
        period_start: row.period_start,
        total_sessions: parseInt(row.total_sessions || 0),
        successful_sessions: parseInt(row.successful_sessions || 0),
        success_rate: row.total_sessions > 0 
          ? Math.round((parseInt(row.successful_sessions || 0) / parseInt(row.total_sessions)) * 100)
          : 0,
        avg_duration: row.avg_duration ? Math.round(parseFloat(row.avg_duration)) : null,
        avg_completion_rate: row.avg_completion_rate ? Math.round(parseFloat(row.avg_completion_rate)) : 0
      }));
    } catch (error) {
      console.error('Ошибка получения временной аналитики:', error.message);
      throw error;
    }
  }
}

export default DiagnosticSession;
