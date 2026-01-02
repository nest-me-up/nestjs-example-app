import { ContextService, DomainCustomException } from '@nest-me-up/common'
import { ServiceCache, ServiceClearCache } from '@nest-me-up/redis-modules'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Not, Repository } from 'typeorm'
import { UserEntity } from '../db-module/entity/user.entity'
import { ErrorCodes } from '../domain-data-types/error-codes'
import type { ICreateUser, IUpdateUser, IUser } from '../domain-data-types/user.interface'

@Injectable()
export class CachedService {
  private readonly config: CachedConfig
  constructor(
    @InjectPinoLogger(CachedService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly contextService: ContextService,
  ) {
    this.config = this.configService.get<CachedConfig>('cached') ?? { helloText: 'Hello World' }
  }

  async getHello(): Promise<string> {
    this.logger.info('getHello')
    return this.config?.helloText ?? 'Hello World'
  }

  /*
   * @description Cached GET request to get a user by id on the service level
   *  useful when this method is called from another service or controller
   * @returns The user object
   */

  @ServiceCache({
    key: 'user',
    paramNames: ['id'],
    ttlInSeconds: 60,
  })
  async getUser({ id }: { id: string }): Promise<IUser> {
    this.logger.info('getUser, id: %s', id)
    const user = await this.userRepository.findOne({
      where: { id, tenantId: this.contextService.getContext().tenantId, deleted: false },
    })
    if (!user) {
      throw new DomainCustomException('User not found', ErrorCodes.NOT_FOUND)
    }
    return this.userToDto(user)
  }

  @ServiceCache({
    key: 'users',
    ttlInSeconds: 60,
  })
  async getUsers(): Promise<IUser[]> {
    this.logger.info('getUsers')
    const users = await this.userRepository.find({
      where: { tenantId: this.contextService.getContext().tenantId, deleted: false },
      order: {
        name: 'ASC',
      },
    })
    return users.map((user) => this.userToDto(user))
  }

  /*
   * @description POST request, clears the users cache
   * @returns The created user object
   */
  @ServiceClearCache({
    keys: ['users'],
    paramNames: [],
  })
  async createUser(user: ICreateUser): Promise<IUser> {
    this.logger.info('createUser, user: %o', user)
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email, tenantId: this.contextService.getContext().tenantId, deleted: false },
    })
    if (existingUser) {
      throw new DomainCustomException('User with this email already exists', ErrorCodes.ALREADY_EXISTS)
    }
    const newUser = await this.userRepository.create({ ...user, tenantId: this.contextService.getContext().tenantId })
    await this.userRepository.save(newUser)
    return this.userToDto(newUser)
  }

  /*
   * @description clears the users cache as well as the specific user cache
   * @returns The created user object
   */
  @ServiceClearCache({
    keys: ['user'],
    paramNames: ['id'],
  })
  @ServiceClearCache({
    keys: ['users'],
    paramNames: [],
  })
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
        id: Not(existingUser.id),
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

  /*
   * @description clears the users cache as well as the specific user cache
   * @returns The created user object
   */
  @ServiceClearCache({
    keys: ['user'],
    paramNames: ['id'],
  })
  @ServiceClearCache({
    keys: ['users'],
    paramNames: [],
  })
  async deleteUser({ id }: { id: string }): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { id, tenantId: this.contextService.getContext().tenantId, deleted: false },
    })
    if (!existingUser) {
      throw new DomainCustomException('User not found', ErrorCodes.NOT_FOUND)
    }
    await this.userRepository.delete(existingUser.id)
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

interface CachedConfig {
  helloText: string
}
