# Vehicle Fleet Parking Management

Gestion de flotte de vehicules avec localisation GPS.
Construit en TypeScript avec une architecture DDD/CQRS et des tests BDD (Cucumber).

## Prerequis

- Node.js >= 20
- Docker (pour PostgreSQL)

## Installation

```bash
npm install
```

## Lancer PostgreSQL

```bash
docker compose up -d
```

Cela demarre un PostgreSQL 16 sur le port 5432 avec la base `fleet_management`.

## Tests

```bash
# Tests unitaires (domain)
npm run test:unit

# Tests BDD in-memory (5 scenarios)
npm test

# Tests BDD contre PostgreSQL (2 scenarios @critical)
npm run test:postgres
```

## CLI

```bash
# Creer une flotte (retourne un UUID)
npx ts-node src/Cli/fleet-cli.ts create <userId>

# Enregistrer un vehicule dans une flotte
npx ts-node src/Cli/fleet-cli.ts register-vehicle <fleetId> <vehiclePlateNumber>

# Localiser un vehicule
npx ts-node src/Cli/fleet-cli.ts localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]
```

## Qualite du code

```bash
# Linter (ESLint)
npm run lint

# Verification du formatage (Prettier)
npm run format:check

# Auto-formatage
npm run format
```

## Architecture

```
src/
  Domain/     # Entites (Fleet, Vehicle), Value Objects (Location), interfaces des repositories
  App/        # Commands et Handlers (CreateFleet, RegisterVehicle, ParkVehicle)
  Infra/      # Implementations : InMemory (tests) et PostgreSQL (production)
  Cli/        # Interface en ligne de commande (commander)

features/     # Scenarios BDD Gherkin + step definitions
```

### Choix techniques

- **DDD/CQRS** : separation domaine / application / infrastructure. Les handlers manipulent le domaine via des interfaces abstraites de repositories.
- **Async everywhere** : les repositories retournent des `Promise<T>`, ce qui permet de brancher indifferemment InMemory ou PostgreSQL.
- **Reconstitution** : methodes statiques `reconstitute()` sur Fleet et Vehicle pour hydrater les entites depuis la base de donnees sans declencher la validation metier.
- **Profils Cucumber** : le profil `default` utilise les repos in-memory, le profil `postgres` cible les scenarios `@critical` contre une vraie base.
- **CI/CD** : GitHub Actions avec lint, tests unitaires, tests BDD in-memory, et tests PostgreSQL (service container).

### Outils de qualite

- **ESLint** : analyse statique du code TypeScript, detection des erreurs et des variables inutilisees.
- **Prettier** : formatage automatique pour un style de code uniforme.

### CI/CD

Le pipeline GitHub Actions execute sur chaque push/PR :
1. Lint (ESLint) + Format check (Prettier)
2. Tests unitaires (`node:test`)
3. Tests BDD in-memory (Cucumber)
4. Tests BDD PostgreSQL (Cucumber + service container Postgres 16)
