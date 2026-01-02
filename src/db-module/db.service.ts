import { ContextService, DomainCustomException } from '@nest-me-up/common'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Repository } from 'typeorm'
import { ErrorCodes } from '../domain-data-types/error-codes'
import { ICreateUser, IUpdateUser, IUser } from '../domain-data-types/user.interface'
import { UserEntity } from './entity/user.entity'

@Injectable()
export class DbService {
  constructor(
    @InjectPinoLogger(DbService.name)
    private readonly logger: PinoLogger,
    private readonly contextService: ContextService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        tenantId: this.contextService.getContext().tenantId,
        deleted: false,
      },
    })
    if (!user) {
      throw new DomainCustomException('User not found', ErrorCodes.NOT_FOUND)
    }
    return this.userToDto(user)
  }

  async getUsers(): Promise<IUser[]> {
    const users = await this.userRepository.find({
      where: {
        tenantId: this.contextService.getContext().tenantId,
        deleted: false,
      },
      order: {
        name: 'ASC',
      },
    })
    this.logger.info('getUsers, users: %o', users)
    return users.map((user) => this.userToDto(user))
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: user.email,
        tenantId: this.contextService.getContext().tenantId,
        deleted: false,
      },
    })
    if (existingUser) {
      throw new DomainCustomException('User with this email already exists', ErrorCodes.ALREADY_EXISTS)
    }

    const newUser = await this.userRepository.create({
      name: user.name,
      email: user.email,
      tenantId: this.contextService.getContext().tenantId,
    })
    const savedUser = await this.userRepository.save(newUser)
    return this.userToDto(savedUser)
  }

  async updateUser(user: IUpdateUser): Promise<IUser> {
    const existingUser = await this.userRepository.findOne({
      where: {
        id: user.id,
        tenantId: this.contextService.getContext().tenantId,
        deleted: false,
      },
    })
    if (!existingUser) {
      throw new DomainCustomException('User not found', ErrorCodes.NOT_FOUND)
    }

    const existingUserWithSameEmail = await this.userRepository.findOne({
      where: {
        email: user.email,
        tenantId: this.contextService.getContext().tenantId,
        deleted: false,
      },
    })
    if (existingUserWithSameEmail) {
      throw new DomainCustomException('User with this email already exists', ErrorCodes.ALREADY_EXISTS)
    }
    existingUser.name = user.name
    existingUser.email = user.email
    const updatedUser = await this.userRepository.save(existingUser)
    return this.userToDto(updatedUser)
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: {
        id: id,
        tenantId: this.contextService.getContext().tenantId,
        deleted: false,
      },
    })
    if (!existingUser) {
      throw new DomainCustomException('User not found', ErrorCodes.NOT_FOUND)
    }
    existingUser.deleted = true
    await this.userRepository.save(existingUser)
  }

  private userToDto(user: UserEntity): IUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }
  }
}
