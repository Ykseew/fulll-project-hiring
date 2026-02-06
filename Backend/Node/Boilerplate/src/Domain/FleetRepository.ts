import { Fleet } from './Fleet';

export abstract class FleetRepository {
  abstract save(fleet: Fleet): void;
  abstract findById(id: string): Fleet;
}
