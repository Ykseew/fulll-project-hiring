import { Pool } from 'pg';
import { Vehicle } from '../Domain/Vehicle';
import { Location } from '../Domain/Location';
import { VehicleRepository } from '../Domain/VehicleRepository';

export class PostgresVehicleRepository extends VehicleRepository {
  constructor(private readonly pool: Pool) {
    super();
  }

  async save(vehicle: Vehicle): Promise<void> {
    const location = vehicle.getLocation();
    const lat = location ? location.lat : null;
    const lng = location ? location.lng : null;
    const alt = location ? (location.alt ?? null) : null;

    await this.pool.query(
      `INSERT INTO vehicles (plate_number, lat, lng, alt) VALUES ($1, $2, $3, $4)
       ON CONFLICT (plate_number) DO UPDATE SET lat = EXCLUDED.lat, lng = EXCLUDED.lng, alt = EXCLUDED.alt`,
      [vehicle.plateNumber, lat, lng, alt],
    );
  }

  async findByPlateNumber(plateNumber: string): Promise<Vehicle> {
    const vehicle = await this.findByPlateNumberOrNull(plateNumber);
    if (!vehicle) {
      throw new Error(`Vehicle not found: ${plateNumber}`);
    }
    return vehicle;
  }

  async findByPlateNumberOrNull(plateNumber: string): Promise<Vehicle | null> {
    const result = await this.pool.query(
      'SELECT plate_number, lat, lng, alt FROM vehicles WHERE plate_number = $1',
      [plateNumber],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const location =
      row.lat !== null && row.lng !== null
        ? new Location(row.lat, row.lng, row.alt ?? undefined)
        : undefined;

    return Vehicle.reconstitute(row.plate_number, location);
  }
}
