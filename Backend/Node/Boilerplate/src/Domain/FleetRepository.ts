import { Fleet } from './Fleet';

export abstract class FleetRepository {
  abstract save(fleet: Fleet): Promise<void>;
  abstract findById(id: string): Promise<Fleet>;
}
