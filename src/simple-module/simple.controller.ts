import { DomainCustomException } from '@nest-me-up/common'
import { Controller, Get } from '@nestjs/common'
import { SimpleService } from './simple.service'

@Controller('simple')
export class SimpleController {
  constructor(private readonly simpleService: SimpleService) {}

  @Get()
  getHello(): string {
    return this.simpleService.getHello()
  }

  @Get('uncaught-exception')
  getUncaughtException(): string {
    throw new Error('Uncaught exception')
  }

  @Get('domain-exception')
  getDomainException(): string {
    throw new DomainCustomException('Domain exception', 10, { metadata: { key: 'value' } })
  }
}
