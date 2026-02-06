import { Vehicle } from './Vehicle';

export abstract class VehicleRepository {
  abstract save(vehicle: Vehicle): void;
  abstract findByPlateNumber(plateNumber: string): Vehicle;
}
