import { Fleet } from '../Domain/Fleet';
import { FleetRepository } from '../Domain/FleetRepository';

export class InMemoryFleetRepository extends FleetRepository {
  private fleets: Map<string, Fleet> = new Map();

  async save(fleet: Fleet): Promise<void> {
    this.fleets.set(fleet.id, fleet);
  }

  async findById(id: string): Promise<Fleet> {
    const fleet = this.fleets.get(id);
    if (!fleet) {
      throw new Error(`Fleet not found: ${id}`);
    }
    return fleet;
  }
}
