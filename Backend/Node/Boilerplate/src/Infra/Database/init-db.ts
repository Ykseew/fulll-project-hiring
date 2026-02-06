import { getPool } from './connection';

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS fleets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fleet_vehicles (
  fleet_id TEXT REFERENCES fleets(id),
  vehicle_plate_number TEXT,
  PRIMARY KEY(fleet_id, vehicle_plate_number)
);

CREATE TABLE IF NOT EXISTS vehicles (
  plate_number TEXT PRIMARY KEY,
  lat REAL,
  lng REAL,
  alt REAL
);
`;

export async function initDb(): Promise<void> {
  const pool = getPool();
  await pool.query(SCHEMA_SQL);
}
