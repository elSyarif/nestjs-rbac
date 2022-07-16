import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Users } from './user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AsignUserPermissions } from './dto/asign-user-permission.dto';
import { UserPermissions } from './user-permission.entity';
import { UserMenus } from './user-menus.entity';
import { AsignUserMenus } from './dto/asign-user-menus.dto';
import { Menus } from '../menus/menus.entity';

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
		@InjectRepository(Menus)
		private menuRepository: Repository<Menus>,

		private dataSource: DataSource
	){}

	/**
	 * find users by username
	 * @param username
	 * @returns User
	 */
	async findOne(username: string): Promise<any>{
	 const user = await this.userRepository.findOne({
		relations: {
			role: true
		},
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

	//TODO: get all user access menu
	async userMenus(userId: string){
		try {
			// ambil dari table user menu
			const userMenu = await this.userMenuRepository
				.query(`SELECT m.id, m.parent_id , m.title, m.icon, m.link, m.sort
							FROM user_menus um
						left Join menus m ON um.menu_id = m.id
						WHERE m.is_active = TRUE
						  AND um.user_id = ?
						ORDER BY m.sort `, [userId])

			// Mengurutkan array berdasarkan id
			const mainMenu = [];
			for (let i = 0; i < userMenu.length; i++) {
				mainMenu[userMenu[i].id] = {
					id: userMenu[i].id,
					parent_id: userMenu[i].parent_id,
					title: userMenu[i].title,
					icon: userMenu[i].icon,
					link: userMenu[i].link,
					sort: userMenu[i].sort,
				}
			}

			return this.menuNode(mainMenu, 0)

		} catch (error) {
			this.logger.verbose('userMenu Error')
		}
	}

	//TODO: Maping menu berdasarkan parent id dan menjadikan object
	menuNode(menu: any[], parent: number){
		const mainMenu = []

		for (let i = 1; i < menu.length; i++) {
			// console.log(`id : ${i} : ${menu[i] != undefined ? menu[i].parent_id : null} == ${parent}`)
			if(menu[i] == undefined) {i++}

			if(menu[i] != undefined && menu[i].parent_id === parent){
				mainMenu.push({
					id: menu[i].id,
					parent_id: menu[i].parent_id,
					title: menu[i].title,
					icon: menu[i].icon,
					link: menu[i].link,
					sort: menu[i].sort,
					sub_menu: this.menuNode(menu, i)
				})
			}
		}

		return mainMenu
	}

	async userPermission(userId: string){
		const permission = await this.userPermissionRepository
			.query(`SELECT p.id, p.name
					FROM user_permissions up
				LEFT JOIN permissions p ON up.permission_id = p.id
				WHERE up.user_id = ?`, [userId])

		return permission
}
}
