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
	    type: "int",
	})
	sort: number

	@Column({
	    type: "bool"
	})
	is_active: boolean
}
