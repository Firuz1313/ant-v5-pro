const { Database } = require('./config/database.js');

(async () => {
  try {
    const db = new Database();
    await db.connect();
    
    console.log('=== Checking remotes table ===');
    const remotes = await db.query('SELECT id, name, device_id, is_default, is_active FROM remotes ORDER BY device_id, is_default DESC');
    console.log('Remotes found:', remotes.rows.length);
    
    if (remotes.rows.length > 0) {
      console.log('\nRemotes by device:');
      const groupedByDevice = {};
      remotes.rows.forEach(remote => {
        if (!groupedByDevice[remote.device_id]) {
          groupedByDevice[remote.device_id] = [];
        }
        groupedByDevice[remote.device_id].push(remote);
      });
      
      Object.entries(groupedByDevice).forEach(([deviceId, deviceRemotes]) => {
        console.log(`\nDevice: ${deviceId}`);
        deviceRemotes.forEach(remote => {
          console.log(`  - ${remote.name} (id: ${remote.id}) - Default: ${remote.is_default}, Active: ${remote.is_active}`);
        });
      });
    } else {
      console.log('No remotes found in database');
    }
    
    console.log('\n=== Checking devices table ===');
    const devices = await db.query('SELECT id, name FROM devices');
    console.log('Devices found:', devices.rows.length);
    devices.rows.forEach(device => {
      console.log(`  - ${device.name} (id: ${device.id})`);
    });
    
    await db.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
