import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserToken{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
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
