import { query, transaction } from "./database.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Seed default remotes for devices that don't have any default remotes
 * Fixed import issue
 */
export const seedDefaultRemotes = async () => {
  try {
    console.log("🌱 Starting default remotes seeding process...");

    // Get all devices
    const devicesResult = await query("SELECT id, name FROM devices WHERE is_active = true");
    const devices = devicesResult.rows;
    console.log(`📱 Found ${devices.length} active devices`);

    for (const device of devices) {
      console.log(`\n🔍 Checking device: ${device.name} (${device.id})`);

      // Check if device has any default remote
      const defaultRemoteResult = await query(
        "SELECT id FROM remotes WHERE device_id = $1 AND is_default = true AND is_active = true",
        [device.id]
      );

      if (defaultRemoteResult.rows.length === 0) {
        console.log(`❌ No default remote found for ${device.name}. Creating one...`);

        // Check if device has any remotes at all
        const anyRemoteResult = await query(
          "SELECT id FROM remotes WHERE device_id = $1 AND is_active = true",
          [device.id]
        );

        if (anyRemoteResult.rows.length > 0) {
          // Set the first remote as default
          const firstRemoteId = anyRemoteResult.rows[0].id;
          await query(
            "UPDATE remotes SET is_default = true, updated_at = NOW() WHERE id = $1",
            [firstRemoteId]
          );
          console.log(`✅ Set existing remote ${firstRemoteId} as default for ${device.name}`);
        } else {
          // Create a new default remote for this device using transaction
          await transaction(async (client) => {
            const newRemoteId = uuidv4();
            const remoteData = {
              id: newRemoteId,
              name: `${device.name} Стандартный Пульт`,
              manufacturer: "Universal",
              model: "Standard",
              device_id: device.id,
              description: `Стандартный пульт дистанционного управления для ${device.name}`,
              layout: "standard",
              color_scheme: "default",
              dimensions: JSON.stringify({ width: 200, height: 400 }),
              buttons: JSON.stringify([
                { id: "power", name: "Power", x: 85, y: 30, width: 30, height: 20, type: "button", action: "power" },
                { id: "menu", name: "Menu", x: 85, y: 70, width: 30, height: 20, type: "button", action: "menu" },
                { id: "up", name: "Up", x: 85, y: 110, width: 30, height: 20, type: "button", action: "up" },
                { id: "down", name: "Down", x: 85, y: 150, width: 30, height: 20, type: "button", action: "down" },
                { id: "left", name: "Left", x: 50, y: 130, width: 30, height: 20, type: "button", action: "left" },
                { id: "right", name: "Right", x: 120, y: 130, width: 30, height: 20, type: "button", action: "right" },
                { id: "ok", name: "OK", x: 85, y: 130, width: 30, height: 20, type: "button", action: "ok" },
                { id: "back", name: "Back", x: 85, y: 190, width: 30, height: 20, type: "button", action: "back" },
                { id: "exit", name: "Exit", x: 85, y: 230, width: 30, height: 20, type: "button", action: "exit" }
              ]),
              zones: JSON.stringify([
                { id: "main", name: "Main Controls", x: 40, y: 20, width: 120, height: 160, color: "#e0e0e0", description: "Main control area" },
                { id: "navigation", name: "Navigation", x: 40, y: 100, width: 120, height: 80, color: "#d0d0d0", description: "Navigation controls" }
              ]),
              is_default: true,
              is_active: true,
              usage_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            await client.query(`
              INSERT INTO remotes (
                id, name, manufacturer, model, device_id, description, layout,
                color_scheme, dimensions, buttons, zones, is_default, is_active,
                usage_count, created_at, updated_at
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
              )
            `, [
              remoteData.id, remoteData.name, remoteData.manufacturer, remoteData.model,
              remoteData.device_id, remoteData.description, remoteData.layout,
              remoteData.color_scheme, remoteData.dimensions, remoteData.buttons,
              remoteData.zones, remoteData.is_default, remoteData.is_active,
              remoteData.usage_count, remoteData.created_at, remoteData.updated_at
            ]);

            console.log(`✅ Created new default remote for ${device.name}: ${newRemoteId}`);
          });
        }
      } else {
        console.log(`✅ Device ${device.name} already has a default remote`);
      }
    }

    console.log("\n🎉 Default remotes seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding default remotes:", error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDefaultRemotes()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
