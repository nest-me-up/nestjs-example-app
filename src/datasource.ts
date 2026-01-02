import { loadConfig } from '@nest-me-up/common'
import { join } from 'path'
import { DataSource } from 'typeorm'

const config = loadConfig()
/*
 * This is the datasource for the application.
 * It is used to connect to the database and run migrations.
 * To run migrations:
 * make migrate
 * To generate a new migration based on the changes in the entities:
 * make migration_generate
 * To create a new migration file:
 * make migration_create
 * To revert a migration:
 * make migration_revert
 */
export const AppDataSource = new DataSource({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(config.db as any),
  type: 'postgres', // Explicitly set type to satisfy Typescript if config.db is loosely typed
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
})
