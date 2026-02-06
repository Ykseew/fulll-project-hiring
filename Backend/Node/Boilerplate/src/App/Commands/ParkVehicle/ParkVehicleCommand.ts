export class ParkVehicleCommand {
  constructor(
    public readonly fleetId: string,
    public readonly vehiclePlateNumber: string,
    public readonly lat: number,
    public readonly lng: number,
    public readonly alt?: number,
  ) {}
}
