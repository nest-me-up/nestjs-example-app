import { KafkaMessagingModule } from '@nest-me-up/kafka-modules'
import { Module } from '@nestjs/common'
import { MessageListener } from './message.listener'
import { MessagingController } from './messaging.controller'
import { MessagingService } from './messaging.service'

@Module({
  imports: [KafkaMessagingModule],
  controllers: [MessagingController],
  providers: [MessagingService, MessageListener],
})
export class MessagingModule {}
