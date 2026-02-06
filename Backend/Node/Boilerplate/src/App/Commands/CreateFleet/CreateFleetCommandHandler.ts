import crypto from 'crypto';
import { Fleet } from '../../../Domain/Fleet';
import { FleetRepository } from '../../../Domain/FleetRepository';
import { CreateFleetCommand } from './CreateFleetCommand';

export class CreateFleetCommandHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: CreateFleetCommand): Promise<string> {
    const fleetId = crypto.randomUUID();
    const fleet = new Fleet(fleetId, command.userId);
    await this.fleetRepository.save(fleet);
    return fleetId;
  }
}
