import { loadConfig } from '@nest-me-up/common'
import { join } from 'path'
import { DataSource } from 'typeorm'

const config = loadConfig()

export const AppDataSource = new DataSource({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(config.db as any),
  type: 'postgres', // Explicitly set type to satisfy Typescript if config.db is loosely typed
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
})
