import { KafkaMessagingService } from '@nest-me-up/kafka-modules'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

export const MESSAGING_TOPIC = 'my-topic'
@Injectable()
export class MessagingService {
  constructor(
    private readonly kafkaMessagingService: KafkaMessagingService,
    @InjectPinoLogger(MessagingService.name)
    private readonly logger: PinoLogger,
  ) {}

  async sendMessage(message: object) {
    const messageDto = {
      message,
      date: new Date(),
    }
    await this.kafkaMessagingService.sendMessage({ topic: MESSAGING_TOPIC, message: messageDto })
  }

  async onMessage(message: string) {
    this.logger.info('Received message: %o', message)
  }
}

export class MessageDto {
  message: string
  date: Date
}
