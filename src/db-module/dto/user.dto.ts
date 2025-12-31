import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { ICreateUser, IUpdateUser } from '../../domain-data-types/user.interface'

export class CreateUserDto implements ICreateUser {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class UpdateUserDto implements IUpdateUser {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}
