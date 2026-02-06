import { Vehicle } from './Vehicle';

export abstract class VehicleRepository {
  abstract save(vehicle: Vehicle): Promise<void>;
  abstract findByPlateNumber(plateNumber: string): Promise<Vehicle>;
  abstract findByPlateNumberOrNull(plateNumber: string): Promise<Vehicle | null>;
}
