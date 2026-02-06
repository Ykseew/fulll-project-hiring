import { Command } from 'commander';
import { getPool, closePool } from '../Infra/Database/connection';
import { initDb } from '../Infra/Database/init-db';
import { PostgresFleetRepository } from '../Infra/PostgresFleetRepository';
import { PostgresVehicleRepository } from '../Infra/PostgresVehicleRepository';
import { CreateFleetCommand } from '../App/Commands/CreateFleet/CreateFleetCommand';
import { CreateFleetCommandHandler } from '../App/Commands/CreateFleet/CreateFleetCommandHandler';
import { RegisterVehicleCommand } from '../App/Commands/RegisterVehicle/RegisterVehicleCommand';
import { RegisterVehicleCommandHandler } from '../App/Commands/RegisterVehicle/RegisterVehicleCommandHandler';
import { ParkVehicleCommand } from '../App/Commands/ParkVehicle/ParkVehicleCommand';
import { ParkVehicleCommandHandler } from '../App/Commands/ParkVehicle/ParkVehicleCommandHandler';

async function withDb<T>(fn: (pool: ReturnType<typeof getPool>) => Promise<T>): Promise<T> {
  await initDb();
  const pool = getPool();
  try {
    return await fn(pool);
  } finally {
    await closePool();
  }
}

const program = new Command();

program.name('fleet').description('Fleet management CLI');

program
  .command('create')
  .argument('<userId>', 'User ID')
  .action(async (userId: string) => {
    await withDb(async (pool) => {
      const handler = new CreateFleetCommandHandler(new PostgresFleetRepository(pool));
      const fleetId = await handler.handle(new CreateFleetCommand(userId));
      console.log(fleetId);
    });
  });

program
  .command('register-vehicle')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .action(async (fleetId: string, vehiclePlateNumber: string) => {
    await withDb(async (pool) => {
      const handler = new RegisterVehicleCommandHandler(
        new PostgresFleetRepository(pool),
        new PostgresVehicleRepository(pool),
      );
      await handler.handle(new RegisterVehicleCommand(fleetId, vehiclePlateNumber));
    });
  });

program
  .command('localize-vehicle')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .argument('<lat>', 'Latitude')
  .argument('<lng>', 'Longitude')
  .argument('[alt]', 'Altitude')
  .action(
    async (fleetId: string, vehiclePlateNumber: string, lat: string, lng: string, alt?: string) => {
      await withDb(async (pool) => {
        const handler = new ParkVehicleCommandHandler(new PostgresVehicleRepository(pool));
        await handler.handle(
          new ParkVehicleCommand(
            fleetId,
            vehiclePlateNumber,
            parseFloat(lat),
            parseFloat(lng),
            alt ? parseFloat(alt) : undefined,
          ),
        );
      });
    },
  );

program.parseAsync(process.argv).catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
