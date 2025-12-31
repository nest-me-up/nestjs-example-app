import { ConfigModule, ContextModule, LoggerModule } from '@nest-me-up/common'
import { Module } from '@nestjs/common'
import { SimpleController } from './simple.controller'
import { SimpleService } from './simple.service'

@Module({
  imports: [LoggerModule, ConfigModule, ContextModule],
  controllers: [SimpleController],
  providers: [SimpleService],
  exports: [SimpleService],
})
export class SimpleModule {}
