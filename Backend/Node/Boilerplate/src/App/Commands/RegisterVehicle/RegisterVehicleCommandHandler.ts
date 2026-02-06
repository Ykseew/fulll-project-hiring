import { FleetRepository } from '../../../Domain/FleetRepository';
import { VehicleRepository } from '../../../Domain/VehicleRepository';
import { Vehicle } from '../../../Domain/Vehicle';
import { RegisterVehicleCommand } from './RegisterVehicleCommand';

export class RegisterVehicleCommandHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  handle(command: RegisterVehicleCommand): void {
    const fleet = this.fleetRepository.findById(command.fleetId);
    fleet.registerVehicle(command.vehiclePlateNumber);

    try {
      this.vehicleRepository.findByPlateNumber(command.vehiclePlateNumber);
    } catch {
      this.vehicleRepository.save(new Vehicle(command.vehiclePlateNumber));
    }

    this.fleetRepository.save(fleet);
  }
}
