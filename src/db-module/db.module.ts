import { ConfigModule, ContextModule, LoggerModule } from '@nest-me-up/common'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DbController } from './db.controller'
import { DbService } from './db.service'
import { UserEntity } from './entity/user.entity'

@Module({
  imports: [LoggerModule, ConfigModule, ContextModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [DbController],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
