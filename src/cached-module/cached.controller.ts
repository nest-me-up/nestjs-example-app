import { ControllerCache } from '@nest-me-up/redis-modules'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from '../db-module/dto/user.dto'
import { IUser } from '../domain-data-types/user.interface'
import { CachedService } from './cached.service'

@Controller('cached')
export class CachedController {
  constructor(private readonly service: CachedService) {}

  /*
   * @description Cached GET request to get the hello text on the controller level
   * @returns The hello text
   */
  @Get()
  @ControllerCache({
    key: 'getHello',
    ttlInSeconds: 60,
  })
  async getHello(): Promise<string> {
    return this.service.getHello()
  }

  @Get('/users/:id')
  getUser(@Param('id') id: string): Promise<IUser> {
    return this.service.getUser({ id })
  }

  @Get('/users')
  getUsers(): Promise<IUser[]> {
    return this.service.getUsers()
  }

  @Post('/users')
  createUser(@Body() user: CreateUserDto): Promise<IUser> {
    return this.service.createUser(user)
  }

  @Put('/users')
  updateUser(@Body() user: UpdateUserDto): Promise<IUser> {
    return this.service.updateUser(user)
  }
}
