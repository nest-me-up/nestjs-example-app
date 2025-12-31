import { CommonMiddlewareModule, ConfigModule, LoggerModule, loadConfig } from '@nest-me-up/common'
import { Module, OnApplicationShutdown } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from 'nestjs-pino'
import { join } from 'path'
import { SimpleModule } from './simple-module/simple.module'
@Module({
  imports: getDynamicImports(),
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationShutdown {
  constructor(private readonly logger: Logger) {}

  onApplicationShutdown(signal?: string) {
    this.logger.log(`Received signal to shutdown: ${signal}`)
  }
}

function getDynamicImports() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = loadConfig() as any
  const imports = [
    LoggerModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(config.db as any),
        name: undefined,
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: false,
      }),
    }),
    CommonMiddlewareModule,
    SimpleModule,
  ]

  return imports
}
