import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Vehicle } from './Vehicle';
import { Location } from './Location';

describe('Vehicle', () => {
  it('should park at a location', () => {
    const vehicle = new Vehicle('AB-123-CD');
    const location = new Location(48.8566, 2.3522);
    vehicle.parkAt(location);
    assert.ok(vehicle.getLocation());
    assert.ok(vehicle.getLocation()!.equals(location));
  });

  it('should have no location initially', () => {
    const vehicle = new Vehicle('AB-123-CD');
    assert.strictEqual(vehicle.getLocation(), undefined);
  });

  it('should throw when parking at the same location twice', () => {
    const vehicle = new Vehicle('AB-123-CD');
    const location = new Location(48.8566, 2.3522);
    vehicle.parkAt(location);
    assert.throws(() => vehicle.parkAt(location), {
      message: 'Vehicle is already parked at this location',
    });
  });

  it('should allow parking at a different location', () => {
    const vehicle = new Vehicle('AB-123-CD');
    vehicle.parkAt(new Location(48.8566, 2.3522));
    vehicle.parkAt(new Location(45.764, 4.8357));
    assert.ok(vehicle.getLocation()!.equals(new Location(45.764, 4.8357)));
  });

  it('should reconstitute a vehicle with a location', () => {
    const location = new Location(48.8566, 2.3522, 35);
    const vehicle = Vehicle.reconstitute('AB-123-CD', location);
    assert.strictEqual(vehicle.plateNumber, 'AB-123-CD');
    assert.ok(vehicle.getLocation()!.equals(location));
  });

  it('should reconstitute a vehicle without a location', () => {
    const vehicle = Vehicle.reconstitute('AB-123-CD');
    assert.strictEqual(vehicle.getLocation(), undefined);
  });
});
