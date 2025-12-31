import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email: string

  @Column({ name: 'tenant_id', type: 'uuid', nullable: false })
  tenantId: string

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ name: 'deleted', type: 'boolean', default: false })
  deleted: boolean
}
