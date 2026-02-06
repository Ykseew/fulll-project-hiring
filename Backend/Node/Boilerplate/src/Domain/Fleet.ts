export class Fleet {
  private vehicles: Set<string> = new Set();

  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}

  registerVehicle(plateNumber: string): void {
    if (this.vehicles.has(plateNumber)) {
      throw new Error('Vehicle has already been registered into this fleet');
    }
    this.vehicles.add(plateNumber);
  }

  hasVehicle(plateNumber: string): boolean {
    return this.vehicles.has(plateNumber);
  }
}
