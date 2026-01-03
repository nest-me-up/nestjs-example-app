import { Body, Controller, Post } from '@nestjs/common'
import { MessagingService } from './messaging.service'

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  sendMessage(@Body() message: object) {
    return this.messagingService.sendMessage(message)
  }
}
