import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permissions } from "../permissions/permissions.entity";
import { Users } from "./user.entity";

@Entity()
export class UserPermissions{
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Users)
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id'
	})
	user_id: string

	@OneToOne(() => Permissions)
	@JoinColumn({
		name: 'permission_id',
		referencedColumnName: 'id'
	})
	permission_id: number
}
