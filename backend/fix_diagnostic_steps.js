import { query } from './src/utils/database.js';

async function fixDiagnosticStepsTable() {
  try {
    console.log('🔧 Checking diagnostic_steps table structure...');
    
    // Check if device_id column exists
    const checkResult = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'diagnostic_steps' AND column_name = 'device_id'
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('⚠️  device_id column missing, adding it...');
      
      // Add the missing device_id column
      await query(`
        ALTER TABLE diagnostic_steps 
        ADD COLUMN device_id VARCHAR(255) NOT NULL REFERENCES devices(id) ON DELETE CASCADE
      `);
      
      console.log('✅ Added device_id column to diagnostic_steps table');
    } else {
      console.log('✅ device_id column already exists');
    }
    
    // Show current table structure
    const columnsResult = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'diagnostic_steps'
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Current diagnostic_steps table structure:');
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})${row.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
    });
    
    console.log('🎉 Table structure fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
  
  process.exit(0);
}

fixDiagnosticStepsTable();
