import { VehicleRepository } from '../../../Domain/VehicleRepository';
import { Location } from '../../../Domain/Location';
import { ParkVehicleCommand } from './ParkVehicleCommand';

export class ParkVehicleCommandHandler {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async handle(command: ParkVehicleCommand): Promise<void> {
    const vehicle = await this.vehicleRepository.findByPlateNumber(command.vehiclePlateNumber);
    const location = new Location(command.lat, command.lng, command.alt);
    vehicle.parkAt(location);
    await this.vehicleRepository.save(vehicle);
  }
}
