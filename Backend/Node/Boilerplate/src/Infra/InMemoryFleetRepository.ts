import { Fleet } from '../Domain/Fleet';
import { FleetRepository } from '../Domain/FleetRepository';

export class InMemoryFleetRepository extends FleetRepository {
  private fleets: Map<string, Fleet> = new Map();

  save(fleet: Fleet): void {
    this.fleets.set(fleet.id, fleet);
  }

  findById(id: string): Fleet {
    const fleet = this.fleets.get(id);
    if (!fleet) {
      throw new Error(`Fleet not found: ${id}`);
    }
    return fleet;
  }
}
