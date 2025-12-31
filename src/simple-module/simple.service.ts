import { ContextService } from '@nest-me-up/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@Injectable()
export class SimpleService {
  private readonly config: SimpleConfig
  constructor(
    @InjectPinoLogger(SimpleService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    private readonly contextService: ContextService,
  ) {
    this.config = this.configService.get('simple') as SimpleConfig
  }

  getHello(): string {
    this.logger.info('getHello, context: %o', this.contextService.getContext())
    return this.config.get
  }
}

interface SimpleConfig {
  get: string
}
