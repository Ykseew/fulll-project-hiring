import { Given, When, Then, Before } from '@cucumber/cucumber';
import assert from 'assert';
import { Fleet } from '../../src/Domain/Fleet';
import { Location } from '../../src/Domain/Location';
import { InMemoryFleetRepository } from '../../src/Infra/InMemoryFleetRepository';
import { InMemoryVehicleRepository } from '../../src/Infra/InMemoryVehicleRepository';
import { RegisterVehicleCommand } from '../../src/App/Commands/RegisterVehicle/RegisterVehicleCommand';
import { RegisterVehicleCommandHandler } from '../../src/App/Commands/RegisterVehicle/RegisterVehicleCommandHandler';
import { ParkVehicleCommand } from '../../src/App/Commands/ParkVehicle/ParkVehicleCommand';
import { ParkVehicleCommandHandler } from '../../src/App/Commands/ParkVehicle/ParkVehicleCommandHandler';

interface World {
  fleetRepository: InMemoryFleetRepository;
  vehicleRepository: InMemoryVehicleRepository;
  registerHandler: RegisterVehicleCommandHandler;
  parkHandler: ParkVehicleCommandHandler;
  myFleet: Fleet;
  otherFleet: Fleet;
  vehiclePlateNumber: string;
  location: Location;
  error?: Error;
}

Before(function (this: World) {
  this.fleetRepository = new InMemoryFleetRepository();
  this.vehicleRepository = new InMemoryVehicleRepository();
  this.registerHandler = new RegisterVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  this.parkHandler = new ParkVehicleCommandHandler(this.vehicleRepository);
});

Given('my fleet', function (this: World) {
  this.myFleet = new Fleet('fleet-1', 'user-1');
  this.fleetRepository.save(this.myFleet);
});

Given('a vehicle', function (this: World) {
  this.vehiclePlateNumber = 'AB-123-CD';
});

Given('the fleet of another user', function (this: World) {
  this.otherFleet = new Fleet('fleet-2', 'user-2');
  this.fleetRepository.save(this.otherFleet);
});

Given('I have registered this vehicle into my fleet', function (this: World) {
  this.registerHandler.handle(new RegisterVehicleCommand(this.myFleet.id, this.vehiclePlateNumber));
});

Given('this vehicle has been registered into the other user\'s fleet', function (this: World) {
  this.registerHandler.handle(new RegisterVehicleCommand(this.otherFleet.id, this.vehiclePlateNumber));
});

Given('a location', function (this: World) {
  this.location = new Location(48.8566, 2.3522);
});

Given('my vehicle has been parked into this location', function (this: World) {
  this.parkHandler.handle(new ParkVehicleCommand(
    this.myFleet.id,
    this.vehiclePlateNumber,
    this.location.lat,
    this.location.lng,
    this.location.alt,
  ));
});

When('I register this vehicle into my fleet', function (this: World) {
  this.registerHandler.handle(new RegisterVehicleCommand(this.myFleet.id, this.vehiclePlateNumber));
});

When('I try to register this vehicle into my fleet', function (this: World) {
  try {
    this.registerHandler.handle(new RegisterVehicleCommand(this.myFleet.id, this.vehiclePlateNumber));
  } catch (e) {
    this.error = e as Error;
  }
});

When('I park my vehicle at this location', function (this: World) {
  this.parkHandler.handle(new ParkVehicleCommand(
    this.myFleet.id,
    this.vehiclePlateNumber,
    this.location.lat,
    this.location.lng,
    this.location.alt,
  ));
});

When('I try to park my vehicle at this location', function (this: World) {
  try {
    this.parkHandler.handle(new ParkVehicleCommand(
      this.myFleet.id,
      this.vehiclePlateNumber,
      this.location.lat,
      this.location.lng,
      this.location.alt,
    ));
  } catch (e) {
    this.error = e as Error;
  }
});

Then('this vehicle should be part of my vehicle fleet', function (this: World) {
  assert.strictEqual(this.myFleet.hasVehicle(this.vehiclePlateNumber), true);
});

Then('I should be informed this this vehicle has already been registered into my fleet', function (this: World) {
  assert.ok(this.error);
  assert.ok(this.error.message.includes('already been registered'));
});

Then('the known location of my vehicle should verify this location', function (this: World) {
  const vehicle = this.vehicleRepository.findByPlateNumber(this.vehiclePlateNumber);
  const vehicleLocation = vehicle.getLocation();
  assert.ok(vehicleLocation);
  assert.ok(vehicleLocation.equals(this.location));
});

Then('I should be informed that my vehicle is already parked at this location', function (this: World) {
  assert.ok(this.error);
  assert.ok(this.error.message.includes('already parked'));
});
