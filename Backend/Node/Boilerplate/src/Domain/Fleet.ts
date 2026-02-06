export class Fleet {
  private vehicles: Set<string> = new Set();

  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}

  static reconstitute(id: string, userId: string, vehicles: string[]): Fleet {
    const fleet = new Fleet(id, userId);
    for (const v of vehicles) {
      fleet.vehicles.add(v);
    }
    return fleet;
  }

  registerVehicle(plateNumber: string): void {
    if (this.vehicles.has(plateNumber)) {
      throw new Error('Vehicle has already been registered into this fleet');
    }
    this.vehicles.add(plateNumber);
  }

  hasVehicle(plateNumber: string): boolean {
    return this.vehicles.has(plateNumber);
  }

  getVehicles(): string[] {
    return Array.from(this.vehicles);
  }
}
