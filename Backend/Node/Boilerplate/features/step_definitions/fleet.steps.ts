import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'assert';
import { Fleet } from '../../src/Domain/Fleet';
import { FleetRepository } from '../../src/Domain/FleetRepository';
import { VehicleRepository } from '../../src/Domain/VehicleRepository';
import { Location } from '../../src/Domain/Location';
import { InMemoryFleetRepository } from '../../src/Infra/InMemoryFleetRepository';
import { InMemoryVehicleRepository } from '../../src/Infra/InMemoryVehicleRepository';
import { PostgresFleetRepository } from '../../src/Infra/PostgresFleetRepository';
import { PostgresVehicleRepository } from '../../src/Infra/PostgresVehicleRepository';
import { getPool, closePool } from '../../src/Infra/Database/connection';
import { initDb } from '../../src/Infra/Database/init-db';
import { RegisterVehicleCommand } from '../../src/App/Commands/RegisterVehicle/RegisterVehicleCommand';
import { RegisterVehicleCommandHandler } from '../../src/App/Commands/RegisterVehicle/RegisterVehicleCommandHandler';
import { ParkVehicleCommand } from '../../src/App/Commands/ParkVehicle/ParkVehicleCommand';
import { ParkVehicleCommandHandler } from '../../src/App/Commands/ParkVehicle/ParkVehicleCommandHandler';

interface World {
  parameters: { persistence?: string };
  fleetRepository: FleetRepository;
  vehicleRepository: VehicleRepository;
  registerHandler: RegisterVehicleCommandHandler;
  parkHandler: ParkVehicleCommandHandler;
  myFleet: Fleet;
  otherFleet: Fleet;
  vehiclePlateNumber: string;
  location: Location;
  error?: Error;
}

Before(async function (this: World) {
  if (this.parameters.persistence === 'postgres') {
    await initDb();
    const pool = getPool();
    await pool.query('DELETE FROM fleet_vehicles');
    await pool.query('DELETE FROM vehicles');
    await pool.query('DELETE FROM fleets');
    this.fleetRepository = new PostgresFleetRepository(pool);
    this.vehicleRepository = new PostgresVehicleRepository(pool);
  } else {
    this.fleetRepository = new InMemoryFleetRepository();
    this.vehicleRepository = new InMemoryVehicleRepository();
  }
  this.registerHandler = new RegisterVehicleCommandHandler(
    this.fleetRepository,
    this.vehicleRepository,
  );
  this.parkHandler = new ParkVehicleCommandHandler(this.vehicleRepository);
});

After(async function (this: World) {
  if (this.parameters.persistence === 'postgres') {
    await closePool();
  }
});

Given('my fleet', async function (this: World) {
  this.myFleet = new Fleet('fleet-1', 'user-1');
  await this.fleetRepository.save(this.myFleet);
});

Given('a vehicle', function (this: World) {
  this.vehiclePlateNumber = 'AB-123-CD';
});

Given('the fleet of another user', async function (this: World) {
  this.otherFleet = new Fleet('fleet-2', 'user-2');
  await this.fleetRepository.save(this.otherFleet);
});

Given('I have registered this vehicle into my fleet', async function (this: World) {
  await this.registerHandler.handle(
    new RegisterVehicleCommand(this.myFleet.id, this.vehiclePlateNumber),
  );
});

Given("this vehicle has been registered into the other user's fleet", async function (this: World) {
  await this.registerHandler.handle(
    new RegisterVehicleCommand(this.otherFleet.id, this.vehiclePlateNumber),
  );
});

Given('a location', function (this: World) {
  this.location = new Location(48.8566, 2.3522);
});

Given('my vehicle has been parked into this location', async function (this: World) {
  await this.parkHandler.handle(
    new ParkVehicleCommand(
      this.myFleet.id,
      this.vehiclePlateNumber,
      this.location.lat,
      this.location.lng,
      this.location.alt,
    ),
  );
});

When('I register this vehicle into my fleet', async function (this: World) {
  await this.registerHandler.handle(
    new RegisterVehicleCommand(this.myFleet.id, this.vehiclePlateNumber),
  );
});

When('I try to register this vehicle into my fleet', async function (this: World) {
  try {
    await this.registerHandler.handle(
      new RegisterVehicleCommand(this.myFleet.id, this.vehiclePlateNumber),
    );
  } catch (e) {
    this.error = e as Error;
  }
});

When('I park my vehicle at this location', async function (this: World) {
  await this.parkHandler.handle(
    new ParkVehicleCommand(
      this.myFleet.id,
      this.vehiclePlateNumber,
      this.location.lat,
      this.location.lng,
      this.location.alt,
    ),
  );
});

When('I try to park my vehicle at this location', async function (this: World) {
  try {
    await this.parkHandler.handle(
      new ParkVehicleCommand(
        this.myFleet.id,
        this.vehiclePlateNumber,
        this.location.lat,
        this.location.lng,
        this.location.alt,
      ),
    );
  } catch (e) {
    this.error = e as Error;
  }
});

Then('this vehicle should be part of my vehicle fleet', async function (this: World) {
  const fleet = await this.fleetRepository.findById(this.myFleet.id);
  assert.strictEqual(fleet.hasVehicle(this.vehiclePlateNumber), true);
});

Then(
  'I should be informed this this vehicle has already been registered into my fleet',
  function (this: World) {
    assert.ok(this.error);
    assert.ok(this.error.message.includes('already been registered'));
  },
);

Then('the known location of my vehicle should verify this location', async function (this: World) {
  const vehicle = await this.vehicleRepository.findByPlateNumber(this.vehiclePlateNumber);
  const vehicleLocation = vehicle.getLocation();
  assert.ok(vehicleLocation);
  assert.ok(vehicleLocation.equals(this.location));
});

Then(
  'I should be informed that my vehicle is already parked at this location',
  function (this: World) {
    assert.ok(this.error);
    assert.ok(this.error.message.includes('already parked'));
  },
);
