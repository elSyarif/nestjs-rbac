import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Users } from './user.entity';

@Entity()
export class UserToken{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Users)
    @JoinColumn({
	name: 'user_id',
	referencedColumnName: 'id',
    })
    user_id: string

    @Column({
	length: 500
    })
    access_token: string

    @Column({
	length:500
    })
    refresh_token: string

    @Column()
    ip: string
}
