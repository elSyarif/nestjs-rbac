import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Users } from './user.entity';
import { Menus } from '../menus/menus.entity';

@Entity()
@Unique(['user_id', 'menu_id'])
export class UserMenus{
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Users)
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id'
	})
	user_id: string

	@ManyToOne(() => Menus)
	@JoinColumn({
		name: 'menu_id',
		referencedColumnName: 'id'
	})
	menu_id: number

	@Column({
		type: "boolean"
	})
	is_read: boolean

	@Column({
		type: "boolean"
	})
	is_create: boolean

	@Column({
		type: "boolean"
	})
	is_update: boolean

	@Column({
		type: "boolean"
	})
	is_delete: boolean
}
