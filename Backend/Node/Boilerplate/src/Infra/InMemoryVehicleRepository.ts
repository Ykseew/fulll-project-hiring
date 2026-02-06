import { Vehicle } from '../Domain/Vehicle';
import { VehicleRepository } from '../Domain/VehicleRepository';

export class InMemoryVehicleRepository extends VehicleRepository {
  private vehicles: Map<string, Vehicle> = new Map();

  save(vehicle: Vehicle): void {
    this.vehicles.set(vehicle.plateNumber, vehicle);
  }

  findByPlateNumber(plateNumber: string): Vehicle {
    const vehicle = this.vehicles.get(plateNumber);
    if (!vehicle) {
      throw new Error(`Vehicle not found: ${plateNumber}`);
    }
    return vehicle;
  }
}
