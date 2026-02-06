import { VehicleRepository } from '../../../Domain/VehicleRepository';
import { Location } from '../../../Domain/Location';
import { ParkVehicleCommand } from './ParkVehicleCommand';

export class ParkVehicleCommandHandler {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  handle(command: ParkVehicleCommand): void {
    const vehicle = this.vehicleRepository.findByPlateNumber(command.vehiclePlateNumber);
    const location = new Location(command.lat, command.lng, command.alt);
    vehicle.parkAt(location);
    this.vehicleRepository.save(vehicle);
  }
}
