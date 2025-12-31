import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { IUser } from '../domain-data-types/user.interface'
import { DbService } from './db.service'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'

@Controller('users')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Get()
  getUsers(): Promise<IUser[]> {
    return this.dbService.getUsers()
  }

  @Post()
  createUser(@Body() user: CreateUserDto): Promise<IUser> {
    return this.dbService.createUser(user)
  }

  @Put()
  updateUser(@Body() user: UpdateUserDto): Promise<IUser> {
    return this.dbService.updateUser(user)
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.dbService.deleteUser(id)
  }
}
