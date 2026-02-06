import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Fleet } from './Fleet';

describe('Fleet', () => {
  it('should register a vehicle', () => {
    const fleet = new Fleet('fleet-1', 'user-1');
    fleet.registerVehicle('AB-123-CD');
    assert.strictEqual(fleet.hasVehicle('AB-123-CD'), true);
  });

  it('should not have an unregistered vehicle', () => {
    const fleet = new Fleet('fleet-1', 'user-1');
    assert.strictEqual(fleet.hasVehicle('AB-123-CD'), false);
  });

  it('should throw when registering the same vehicle twice', () => {
    const fleet = new Fleet('fleet-1', 'user-1');
    fleet.registerVehicle('AB-123-CD');
    assert.throws(() => fleet.registerVehicle('AB-123-CD'), {
      message: 'Vehicle has already been registered into this fleet',
    });
  });

  it('should return registered vehicles via getVehicles()', () => {
    const fleet = new Fleet('fleet-1', 'user-1');
    fleet.registerVehicle('AB-123-CD');
    fleet.registerVehicle('XY-456-ZZ');
    const vehicles = fleet.getVehicles();
    assert.deepStrictEqual(vehicles.sort(), ['AB-123-CD', 'XY-456-ZZ']);
  });

  it('should reconstitute a fleet with existing vehicles', () => {
    const fleet = Fleet.reconstitute('fleet-1', 'user-1', ['AB-123-CD', 'XY-456-ZZ']);
    assert.strictEqual(fleet.hasVehicle('AB-123-CD'), true);
    assert.strictEqual(fleet.hasVehicle('XY-456-ZZ'), true);
    assert.strictEqual(fleet.id, 'fleet-1');
    assert.strictEqual(fleet.userId, 'user-1');
  });
});
