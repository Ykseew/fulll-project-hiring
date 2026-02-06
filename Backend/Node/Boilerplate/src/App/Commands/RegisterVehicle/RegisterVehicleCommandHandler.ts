import { FleetRepository } from '../../../Domain/FleetRepository';
import { VehicleRepository } from '../../../Domain/VehicleRepository';
import { Vehicle } from '../../../Domain/Vehicle';
import { RegisterVehicleCommand } from './RegisterVehicleCommand';

export class RegisterVehicleCommandHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async handle(command: RegisterVehicleCommand): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    fleet.registerVehicle(command.vehiclePlateNumber);

    const existing = await this.vehicleRepository.findByPlateNumberOrNull(
      command.vehiclePlateNumber,
    );
    if (!existing) {
      await this.vehicleRepository.save(new Vehicle(command.vehiclePlateNumber));
    }

    await this.fleetRepository.save(fleet);
  }
}
