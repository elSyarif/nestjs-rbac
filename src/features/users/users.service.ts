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
		private tokenRepository: Repository<UserToken>,
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

	async findUserToken(userId: string){
		const token = await this.tokenRepository.findOneBy({
			user_id: userId
		})

		if(!token){
			return false
		}

		return true
	}
	// TODO: insert new token
	async storeToken(createTokenDto:CreateTokenDto): Promise<any>{
		const ds = this.dataSource.createQueryRunner()
		
		await ds.connect()
		await ds.startTransaction()
		
		const users = await ds.manager.getRepository(Users)
		const userTokenRepository = await ds.manager.getRepository(UserToken)
		

		const user = await users.findOne({
			where: {
				id: createTokenDto.id
			}
		})

		try {
			const userToken = new UserToken()
			userToken.user_id = user.id
			userToken.access_token = createTokenDto.accessToken
			userToken.refresh_token = createTokenDto.refreshToken
			userToken.id = "0.0"

			await userTokenRepository.save(userToken)
			// commit to table
			await ds.commitTransaction()
		} catch (error) {
			// rollback 
			await ds.rollbackTransaction()
		} finally{
			// release datasource connection
			await ds.release()
		}
	}

	// TODO: update user login refreshtoken 
	async updateToken(updateToken: UpdateTokenDto): Promise<any>{
		const ds = this.dataSource.createQueryRunner()
		
		ds.connect()
		ds.startTransaction()
		
		const userToken = await ds.manager.getRepository(UserToken)
		
		try {
			const updateUserToken = await userToken.findOne({
				where: {
					refresh_token: updateToken.refreshToken
				}
			});
	
			updateUserToken.refresh_token = updateToken.refreshToken
			updateUserToken.access_token = updateToken.accessToken
	
			await userToken.save(updateUserToken)
			
			ds.commitTransaction()

			return updateUserToken
		} catch (error) {
			ds.rollbackTransaction()
		} finally{
			ds.release()
		}
	}

	// TODO: delete user refresh token
	async deleteToken(refreshToken: string): Promise<any>{
		const userToken = await this.tokenRepository.findOne({
			where: {
				refresh_token: refreshToken
			}
		})

		if(!userToken){
			throw new NotFoundException()
		}

		return await this.tokenRepository.remove(userToken)
	}
}
