import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm"
import * as bcrypt from 'bcrypt';

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

	@Column()
	role_id: number

	hashPassword(){
		this.password = bcrypt.hashSync(this.password, 10)
	}

	async checkPassword(password: string){
		return bcrypt.compareSync(password, this.password)
	}
}
