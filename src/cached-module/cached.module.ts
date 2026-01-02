import { ContextModule } from '@nest-me-up/common'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../db-module/entity/user.entity'
import { CachedController } from './cached.controller'
import { CachedService } from './cached.service'

@Module({
  imports: [ContextModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [CachedController],
  providers: [CachedService],
  exports: [CachedService],
})
export class CachedModule {}
