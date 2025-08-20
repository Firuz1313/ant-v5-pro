import database from './src/utils/database.js';

try {
  const result = await database.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    ORDER BY ordinal_position
  `);
  
  console.log('Колонки таблицы users:');
  result.rows.forEach(row => {
    console.log(`- ${row.column_name} (${row.data_type})`);
  });
  
  await database.closePool();
} catch (error) {
  console.error('Ошибка:', error.message);
  await database.closePool();
  process.exit(1);
}
