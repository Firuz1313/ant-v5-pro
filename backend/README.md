# ANT Support Backend API

## Описание

Backend API для системы диагностики ТВ-приставок ANT Support. Предоставляет REST API для управления устройствами, проблемами, диагностическими шагами и сессиями диагностики.

## Технологии

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - База данных
- **pg** - PostgreSQL client для Node.js
- **Joi** - Валидация данных
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Безопасность
- **Morgan** - HTTP логирование
- **Compression** - Сжатие HTTP ответов
- **Rate Limiting** - Ограничение частоты запросов

## Структура проекта

```
backend/
├── src/
│   ├── controllers/          # Контроллеры API
│   │   ├── deviceController.js
│   │   ├── problemController.js
│   │   ├── stepController.js
│   │   └── sessionController.js
│   ├── models/              # Модели данных
│   │   ├── BaseModel.js
│   │   ├── Device.js
│   │   ├── Problem.js
│   │   ├── DiagnosticStep.js
│   │   └── DiagnosticSession.js
│   ├── routes/              # Роуты API
│   │   ├── index.js         # Главный роутер
│   │   ├── deviceRoutes.js
│   │   ├── problemRoutes.js
│   │   ├── stepRoutes.js
│   │   └── sessionRoutes.js
│   ├── middleware/          # Middleware функции
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── validateRequest.js
│   ├── utils/               # Утилиты
│   │   ├── database.js      # Подключение к БД
│   │   ├── initDb.js        # Инициализация БД
│   │   └── seedData.js      # Тестовые данные
│   └── server.js            # Главный файл сервера
├── migrations/              # SQL миграции
│   ├── 001_init_tables.sql
│   └── 002_add_indexes.sql
├── .env.example            # Пример переменных окружения
├── package.json
└── README.md
```

## Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка базы данных

Создайте PostgreSQL базу данных и настройте переменные окружения:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ant_support
DB_USER=postgres
DB_PASSWORD=postgres

# Сервер
NODE_ENV=development
PORT=3000

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

### 3. Инициализация базы данных

```bash
# Создание таблиц и индексов
npm run db:init

# Заполнение тестовыми данными
npm run db:seed
```

### 4. Запуск сервера

```bash
# Режим разработки (с hot reload)
npm run dev

# Режим продакшена
npm start
```

Сервер будет доступен по адресу: `http://localhost:3000`

## API Документация

### Базовые эндпоинты

- `GET /api/health` - Проверка состояния API
- `GET /api/info` - Информация об API
- `GET /api/docs` - Документация API

### Устройства

- `GET /api/v1/devices` - Получение списка устройств
- `GET /api/v1/devices/:id` - Получение устройства по ID
- `POST /api/v1/devices` - Создание устройства
- `PUT /api/v1/devices/:id` - Обновление устройства
- `DELETE /api/v1/devices/:id` - Удаление устройства
- `GET /api/v1/devices/search` - Поиск устройств
- `GET /api/v1/devices/popular` - Популярные устройства
- `GET /api/v1/devices/stats` - Статистика устройств

### Проблемы

- `GET /api/v1/problems` - Получение списка проблем
- `GET /api/v1/problems/:id` - Получение проблемы по ID
- `POST /api/v1/problems` - Создание проблемы
- `PUT /api/v1/problems/:id` - Обновление проблемы
- `DELETE /api/v1/problems/:id` - Удаление проблемы
- `GET /api/v1/problems/device/:deviceId` - Проблемы по устройству
- `GET /api/v1/problems/category/:category` - Проблемы по категории
- `POST /api/v1/problems/:id/publish` - Публикация проблемы

### Диагностические шаги

- `GET /api/v1/steps` - Получение списка шагов
- `GET /api/v1/steps/:id` - Получение шага по ID
- `POST /api/v1/steps` - Создание шага
- `PUT /api/v1/steps/:id` - Обновление шага
- `DELETE /api/v1/steps/:id` - Удаление шага
- `GET /api/v1/steps/problem/:problemId` - Шаги по проблеме
- `PUT /api/v1/steps/reorder` - Переупорядочивание шагов

### Диагностические сессии

- `GET /api/v1/sessions` - Получение списка сессий
- `GET /api/v1/sessions/:id` - Получение сессии по ID
- `POST /api/v1/sessions` - Создание сессии
- `PUT /api/v1/sessions/:id` - Обновление сессии
- `POST /api/v1/sessions/:id/complete` - Завершение сессии
- `POST /api/v1/sessions/:id/progress` - Обновление прогресса
- `GET /api/v1/sessions/active` - Активные сессии
- `GET /api/v1/sessions/stats` - Статист��ка сессий

## Схема базы данных

### Основные таблицы

1. **devices** - Устройства (ТВ-приставки)
2. **problems** - Проблемы диагностики
3. **diagnostic_steps** - Шаги диагностики
4. **diagnostic_sessions** - Сессии диагностики
5. **session_steps** - Выполненные шаги в сессии
6. **users** - Пользователи системы

### Связи

- Device → Problems (1:N)
- Problem → DiagnosticSteps (1:N)
- Device + Problem → DiagnosticSession (N:1)
- DiagnosticSession → SessionSteps (1:N)
- DiagnosticStep → SessionSteps (1:N)

## Валидация данных

API использует библиотеку Joi для валидации входящих данных. Все эндпоинты проверяют:

- Типы данных
- Обязательные поля
- Ограничения длины
- Формат значений (email, URL, etc.)
- Бизнес-правила

## Обработка ошибок

Все ошибки возвращаются в едином формате:

```json
{
  "success": false,
  "error": "Описание ошибки",
  "errorType": "VALIDATION_ERROR",
  "details": [...],
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Типы ошибок

- `VALIDATION_ERROR` - Ошибка валидации данных
- `NOT_FOUND` - Ресурс не найден
- `DUPLICATE_ERROR` - Дублирование данных
- `CONSTRAINT_ERROR` - Нарушение ограничений БД

## Безопасность

- **Helmet** - Установка security headers
- **CORS** - Настройка cross-origin requests
- **Rate Limiting** - Ограничение частоты запросов
- **Input Validation** - Валидация всех входящих данных
- **SQL Injection Protection** - Использование параметризованных запросов

## Логирование

- **Morgan** - HTTP запросы в development/production режимах
- **Custom Logger** - Логирование ошибок и важных событий
- **Request/Response** - Детальное логирование API вызовов

## Развертывание

### Development

```bash
npm install
npm run db:init
npm run db:seed
npm run dev
```

### Production

```bash
npm install --production
npm run db:init
NODE_ENV=production npm start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Обязательные переменные для продакшена:

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=ant_support
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=your-super-secret-key
```

## Мониторинг и здоровье

### Health Check

```bash
curl http://localhost:3000/api/health
```

Ответ:

```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {...}
}
```

### Метрики

- Время ответа API
- Использование памяти
- Активные соединения к БД
- Количество запросов в секунду
- Статистика ошибок

## Тестирование

```bash
# Запуск тестов
npm test

# Запуск с покрытием
npm run test:coverage

# Линтинг кода
npm run lint

# Форматирование кода
npm run format
```

## API Клиент

Для frontend ин��еграции создан TypeScript клиент с:

- Автоматическая типизация
- React Query интеграция
- Обработка ошибок
- Кеширование данных
- Оптимистичные обновления

## Поддержка

- **Документация**: `/api/docs`
- **Проблемы**: GitHub Issues
- **Email**: support@ant-support.com

## Лицензия

MIT License - see LICENSE file for details.
