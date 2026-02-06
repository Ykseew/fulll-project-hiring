export class Location {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
    public readonly alt?: number,
  ) {}

  equals(other: Location): boolean {
    return this.lat === other.lat && this.lng === other.lng && this.alt === other.alt;
  }
}
