import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Users } from './user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AsignUserPermissions } from './dto/asign-user-permission.dto';
import { UserPermissions } from './user-permission.entity';
import { UserMenus } from './user-menus.entity';
import { AsignUserMenus } from './dto/asign-user-menus.dto';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name)

	constructor(
		@InjectRepository(Users)
		private userRepository: Repository<Users>,
		@InjectRepository(UserPermissions)
		private userPermissionRepository: Repository<UserPermissions>,
		@InjectRepository(UserMenus)
		private userMenuRepository: Repository<UserMenus>,
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
			user.role = 1

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

	// TODO: Find user by user id
	async findById(userId: string){
		const user = await this.userRepository.findOneBy({
			id: userId
		})

		if(!user){
			throw new NotFoundException(`User not found`)
		}
		// exclude  password
		const { password, ...result } = user

		return result
	}

	// TODO: update user
	async updateUser(){}

	// TODO: asign access user permission
	async asignUserPermissions(asign: AsignUserPermissions){
		try {
			const userPermission = new UserPermissions()

			userPermission.user_id = asign.user_id
			userPermission.permission_id = asign.permission_id

			const result = await this.userPermissionRepository.save(userPermission)
			this.logger.verbose(result)

			return result
		} catch (error) {
			if(error.code === 'ER_DUP_ENTRY'){
				throw new ConflictException('user permission already asign')
			}
			throw new BadRequestException()
		}
	}

	// TODO: asign user menus
	async asignUserMenus(asign: AsignUserMenus){
		try {
			const userMenu = new UserMenus()

			userMenu.user_id = asign.user_id
			userMenu.menu_id = asign.menu_id
			userMenu.is_read = asign.is_read  || true
			userMenu.is_create = asign.is_create  || false
			userMenu.is_update = asign.is_update  || false
			userMenu.is_delete = asign.is_delete  || false

			const result = await this.userMenuRepository.save(userMenu)
			this.logger.verbose(result)

			return result
		} catch (error) {
			if(error.code === 'ER_DUP_ENTRY'){
				throw new ConflictException('user menu already asign')
			}
			throw new BadRequestException()
		}
	}

}
