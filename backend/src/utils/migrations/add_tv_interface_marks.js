/**
 * Migration: Create tv_interface_marks table
 * Adds support for marking points and zones on TV interface images
 */

import { query } from '../database.js';

export const up = async () => {
  console.log('🔄 Creating tv_interface_marks table...');

  // Create tv_interface_marks table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tv_interface_marks (
      id VARCHAR(255) PRIMARY KEY,
      tv_interface_id VARCHAR(255) NOT NULL REFERENCES tv_interfaces(id) ON DELETE CASCADE,
      step_id VARCHAR(255) REFERENCES diagnostic_steps(id) ON DELETE SET NULL,
      
      -- Mark details
      name VARCHAR(255) NOT NULL,
      description TEXT,
      
      -- Mark type and shape
      mark_type VARCHAR(50) NOT NULL CHECK (mark_type IN ('point', 'zone', 'area')),
      shape VARCHAR(50) NOT NULL DEFAULT 'circle' CHECK (shape IN ('circle', 'rectangle', 'polygon', 'ellipse')),
      
      -- Position and size
      position JSONB NOT NULL, -- {x: number, y: number}
      size JSONB DEFAULT '{"width": 20, "height": 20}'::jsonb, -- {width: number, height: number}
      coordinates JSONB, -- For polygon shapes: [{x: number, y: number}, ...]
      
      -- Visual properties
      color VARCHAR(50) NOT NULL DEFAULT '#3b82f6',
      background_color VARCHAR(50) DEFAULT 'rgba(59, 130, 246, 0.2)',
      border_color VARCHAR(50) DEFAULT '#3b82f6',
      border_width INTEGER DEFAULT 2,
      opacity DECIMAL(3,2) DEFAULT 0.8 CHECK (opacity >= 0 AND opacity <= 1),
      
      -- Interactive properties
      is_clickable BOOLEAN NOT NULL DEFAULT true,
      is_highlightable BOOLEAN NOT NULL DEFAULT true,
      click_action VARCHAR(100), -- 'press', 'hold', 'double_click', etc.
      hover_action VARCHAR(100), -- 'highlight', 'tooltip', 'zoom', etc.
      
      -- User action data
      action_value VARCHAR(500), -- Value/data associated with the action
      action_description TEXT, -- Human readable description of the action
      expected_result TEXT, -- What should happen when user performs this action
      
      -- Hints and help
      hint_text TEXT,
      tooltip_text TEXT,
      warning_text TEXT,
      
      -- Animation and effects
      animation VARCHAR(50) CHECK (animation IN ('pulse', 'glow', 'bounce', 'shake', 'fade', 'blink', 'none')),
      animation_duration INTEGER DEFAULT 1000, -- milliseconds
      animation_delay INTEGER DEFAULT 0, -- milliseconds
      
      -- Priority and ordering
      display_order INTEGER DEFAULT 0,
      priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
      
      -- State management
      is_active BOOLEAN NOT NULL DEFAULT true,
      is_visible BOOLEAN NOT NULL DEFAULT true,
      
      -- Extended properties
      metadata JSONB DEFAULT '{}'::jsonb,
      tags JSONB DEFAULT '[]'::jsonb,
      
      -- Timestamps
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `;

  await query(createTableQuery);
  console.log('✅ tv_interface_marks table created successfully');

  // Add indexes for performance
  const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_interface_id ON tv_interface_marks(tv_interface_id);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_step_id ON tv_interface_marks(step_id);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_type ON tv_interface_marks(mark_type);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_active ON tv_interface_marks(is_active);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_order ON tv_interface_marks(display_order);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_priority ON tv_interface_marks(priority);',
    
    // Composite indexes
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_interface_active ON tv_interface_marks(tv_interface_id, is_active);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_step_active ON tv_interface_marks(step_id, is_active);',
    
    // JSONB indexes for performance
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_position ON tv_interface_marks USING gin(position);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_metadata ON tv_interface_marks USING gin(metadata);',
    'CREATE INDEX IF NOT EXISTS idx_tv_interface_marks_tags ON tv_interface_marks USING gin(tags);'
  ];

  for (const indexQuery of createIndexes) {
    await query(indexQuery);
  }
  console.log('✅ tv_interface_marks indexes created successfully');

  // Add trigger for updated_at
  const createTrigger = `
    CREATE OR REPLACE FUNCTION update_tv_interface_marks_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_tv_interface_marks_updated_at_trigger ON tv_interface_marks;
    CREATE TRIGGER update_tv_interface_marks_updated_at_trigger
        BEFORE UPDATE ON tv_interface_marks
        FOR EACH ROW EXECUTE FUNCTION update_tv_interface_marks_updated_at();
  `;

  await query(createTrigger);
  console.log('✅ tv_interface_marks trigger created successfully');

  console.log('🎉 tv_interface_marks migration completed successfully!');
};

export const down = async () => {
  console.log('🔄 Dropping tv_interface_marks table...');
  
  // Drop trigger and function
  await query('DROP TRIGGER IF EXISTS update_tv_interface_marks_updated_at_trigger ON tv_interface_marks;');
  await query('DROP FUNCTION IF EXISTS update_tv_interface_marks_updated_at();');
  
  // Drop table (indexes will be dropped automatically)
  await query('DROP TABLE IF EXISTS tv_interface_marks;');
  
  console.log('✅ tv_interface_marks table dropped successfully');
};

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await up();
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}
