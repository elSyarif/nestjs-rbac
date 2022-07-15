import {  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import * as bcrypt from 'bcrypt';
import { Roles } from '../roles/roles.entity';

@Entity()
export class Users{
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@Column({
		unique: true
	})
	username: string

	@Column()
	password: string

	@Column()
	is_active: boolean

	@ManyToOne(() => Roles)
	@JoinColumn({
		name: 'role_id'
	})
	role: number

	hashPassword(){
		this.password = bcrypt.hashSync(this.password, 10)
	}

	async checkPassword(password: string){
		return bcrypt.compareSync(password, this.password)
	}
}
