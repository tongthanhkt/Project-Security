import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'partner' })
export class Partner {
  @PrimaryColumn()
  increment_id: number

  @Column()
  partner_id: string

  @Column()
  partner_secret: string

  @Column({ nullable: true, type: 'json' })
  ip_address: any

  @Column()
  created_at: string
  @Column()
  updated_at: string
}
