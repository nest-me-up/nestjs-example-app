import { getErrorGlobalFilters, getSecretlessConfigString, loadConfig } from '@nest-me-up/common'
import { BadRequestException, INestApplication, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from 'app.module'
import { useContainer } from 'class-validator'
import cors from 'cors'
import express from 'express'
import { middleware } from 'express-http-context'
import helmet from 'helmet'
import { Logger, LoggerErrorInterceptor, PinoLogger } from 'nestjs-pino'
import { DataSource } from 'typeorm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function bootstrap(): Promise<{ app: INestApplication; config: Record<string, any> }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: Record<string, any> = loadConfig() as Record<string, any>

  const app = await NestFactory.create(AppModule)
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use(express.raw({ limit: '50mb' }))

  const logger: Logger = app.get(Logger)
  const pinoLogger: PinoLogger = await app.resolve(PinoLogger)
  app.useLogger(logger)

  // Database Migrations
  if (process.env.NODE_ENV !== 'local') {
    try {
      logger.log('Starting database migrations...')
      const dataSource = app.get(DataSource)
      await dataSource.runMigrations()
      logger.log('Database migrations completed successfully')
    } catch (error) {
      logger.error('Error running database migrations', error)
      process.exit(1)
    }
  } else {
    logger.log('Skipping database migrations in local environment')
  }

  //Redirect console.log to the logger
  // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
  console.log = (message: any, params?: any) => {
    logger.debug(message, params)
  }

  // app.use(cookieParser())
  app.use(middleware)
  app.enableShutdownHooks() //this is important for graceful shutdown of the service

  app.useGlobalFilters(...getErrorGlobalFilters(pinoLogger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  //Global pipes are used to validate the request body, params, query, etc.
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        pinoLogger.error('Class validation error %o', validationErrors)
        return new BadRequestException(validationErrors)
      },
    }),
  )

  app.use(helmet(), cors())
  const safeConf = getSecretlessConfigString(config)
  logger.log(`Server running on port ${config.http.port as number}`)
  logger.log('Server configuration: %s, mem: %o', safeConf, process.memoryUsage())

  return { app, config }
}
