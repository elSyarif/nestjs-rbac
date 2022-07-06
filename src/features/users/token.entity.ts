import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserToken{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    user_id: string

    @Column()
    access_token: string
    
    @Column()
    refresh_token: string

    @Column()
    ip: string
}