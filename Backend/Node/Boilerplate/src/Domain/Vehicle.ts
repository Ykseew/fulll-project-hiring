import { Location } from './Location';

export class Vehicle {
  private location?: Location;

  constructor(public readonly plateNumber: string) {}

  static reconstitute(plateNumber: string, location?: Location): Vehicle {
    const vehicle = new Vehicle(plateNumber);
    vehicle.location = location;
    return vehicle;
  }

  parkAt(location: Location): void {
    if (this.location && this.location.equals(location)) {
      throw new Error('Vehicle is already parked at this location');
    }
    this.location = location;
  }

  getLocation(): Location | undefined {
    return this.location;
  }
}
