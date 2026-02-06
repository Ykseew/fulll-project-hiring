import { Pool } from 'pg';
import { Fleet } from '../Domain/Fleet';
import { FleetRepository } from '../Domain/FleetRepository';

export class PostgresFleetRepository extends FleetRepository {
  constructor(private readonly pool: Pool) {
    super();
  }

  async save(fleet: Fleet): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO fleets (id, user_id) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id`,
        [fleet.id, fleet.userId],
      );

      await client.query('DELETE FROM fleet_vehicles WHERE fleet_id = $1', [fleet.id]);

      const vehicles = fleet.getVehicles();
      for (const plateNumber of vehicles) {
        await client.query(
          'INSERT INTO fleet_vehicles (fleet_id, vehicle_plate_number) VALUES ($1, $2)',
          [fleet.id, plateNumber],
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Fleet> {
    const fleetResult = await this.pool.query('SELECT id, user_id FROM fleets WHERE id = $1', [id]);

    if (fleetResult.rows.length === 0) {
      throw new Error(`Fleet not found: ${id}`);
    }

    const row = fleetResult.rows[0];

    const vehiclesResult = await this.pool.query(
      'SELECT vehicle_plate_number FROM fleet_vehicles WHERE fleet_id = $1',
      [id],
    );

    const vehicles = vehiclesResult.rows.map(
      (r: { vehicle_plate_number: string }) => r.vehicle_plate_number,
    );

    return Fleet.reconstitute(row.id, row.user_id, vehicles);
  }
}
