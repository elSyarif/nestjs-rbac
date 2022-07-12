import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Menus{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    parent_id: number

    @Column()
    title: string
    
    @Column()
    icon: string

    @Column()
    link: string

    @Column({
        type: "bool"
    })
    is_active: boolean

    @Column({
        type: "int",
    })
    sort: number
}