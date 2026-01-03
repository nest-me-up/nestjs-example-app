import { KafkaMessagingService } from '@nest-me-up/kafka-modules'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { MessageDto, MESSAGING_TOPIC, MessagingService } from './messaging.service'

@Injectable()
export class MessageListener implements OnModuleInit {
  constructor(
    private readonly kafkaMessagingService: KafkaMessagingService,
    @InjectPinoLogger(MessageListener.name)
    private readonly logger: PinoLogger,
    private readonly messagingService: MessagingService,
  ) {}

  async onModuleInit() {
    const emitter = await this.kafkaMessagingService.createTopicEmitter<MessageDto>({
      topic: MESSAGING_TOPIC,
      emitterName: MessageListener.name,
    })
    emitter.on(this.onMessage.bind(this))
  }

  async onMessage({ message }: { message: MessageDto }) {
    return this.messagingService.onMessage(message.message)
  }
}
