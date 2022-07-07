import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Users } from './user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateTokenDto } from '../auth/dto/update-token.dto';
import { UserToken } from './token.entity';
import { CreateTokenDto } from '../auth/dto/create-token.dto';

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(Users)
		private userRepository: Repository<Users>,
		private dataSource: DataSource
	){}

	/**
	 * find users by username
	 * @param username
	 * @returns User
	 */
	async findOne(username: string): Promise<any>{
	 const user = await this.userRepository.findOne({
		where: {
			username: username
		}
	 })

		if(!user){
			throw new NotFoundException(`${username} not found`)
		}

		return user
	}

	/**
	 *
	 * @param registerUserDto
	 * register new user
	 */
	async registerUser(registerUserDto: RegisterUserDto): Promise<any>{
		const ds = this.dataSource.createQueryRunner()

		await ds.connect()
		await ds.startTransaction()
		// username exist

		const exist = await await this.userRepository.findOne({
			where: {
				username: registerUserDto.username
			}
		 })

		if(exist){
			throw new ConflictException(`username ${exist.username} already taken`)
		}

		try {
			const user = new Users()
			user.name = registerUserDto.name
			user.username = registerUserDto.username
			user.password = registerUserDto.password
			user.hashPassword()
			user.is_active = true
			user.role_id = 1

			await ds.manager.save(user)

			await ds.commitTransaction()

			const { password, ...result } = user

			return result
		} catch (error) {
			await ds.rollbackTransaction()

			throw new BadRequestException()
		} finally{
			await ds.release()
		}
	}

	// TODO: update user 
	async updateUser(){}

	
}
