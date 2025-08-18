#!/usr/bin/env node

import dotenv from 'dotenv';
import { 
  createDatabase, 
  testConnection, 
  runMigrations, 
  getDatabaseStats,
  closePool 
} from './database.js';

// Загрузка переменных окружения
dotenv.config();

async function initializeDatabase() {
  console.log('🚀 Инициализация базы данных ANT Support...\n');
  
  try {
    // 1. Создание базы данных (если не существует)
    console.log('📊 Шаг 1: Создание базы данных');
    await createDatabase();
    console.log('✅ База данных готова\n');
    
    // 2. Проверка подключения
    console.log('📊 Шаг 2: Проверка подключения');
    const connectionResult = await testConnection();
    if (!connectionResult.success) {
      throw new Error(`Ошибка подключения: ${connectionResult.error}`);
    }
    console.log('✅ Подключение установлено\n');
    
    // 3. Выполнение миграций
    console.log('📊 Шаг 3: Выполнение миграций');
    await runMigrations();
    console.log('✅ Миграции выполнены\n');
    
    // 4. Получение статистики
    console.log('📊 Шаг 4: Статистика базы данных');
    const stats = await getDatabaseStats();
    console.log(`📦 Размер базы данных: ${stats.databaseSize}`);
    console.log(`📋 Количество таблиц: ${stats.tables.length}`);
    
    if (stats.tables.length > 0) {
      console.log('\n📊 Основные таблицы:');
      stats.tables.slice(0, 5).forEach(table => {
        console.log(`  • ${table.tablename}: ${table.live_rows} записей`);
      });
    }
    
    console.log('\n🎉 Инициализация базы данных завершена успешно!');
    console.log('📝 Теперь вы можете запустить сервер: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Ошибка инициализации базы данных:');
    console.error(error.message);
    console.error('\n🔧 Проверьте:');
    console.error('  • Запущен ли PostgreSQL сервер');
    console.error('  • Правильность настроек в файле .env');
    console.error('  • Права доступа пользователя к базе данных');
    
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Запуск инициализации
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export default initializeDatabase;
