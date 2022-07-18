import { Controller, Get, Req, Res, UseGuards, HttpStatus, Logger, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Users } from './user.entity';
import { UsersService } from './users.service';
import { AsignUserPermissions } from './dto/asign-user-permission.dto';
import { AsignUserMenus } from './dto/asign-user-menus.dto';
import { RolesGuard } from '@common/guard/role.guard';
import { Check_Ability, Roles } from '@common/decorators';
import { Action, CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { PermissionsGuard } from '../../common/guard/permissons.guard';
import { AbilitiesGuard } from '../../common/guard/abilities.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	private readonly logger = new Logger(UsersController.name)

	constructor(
		private userService: UsersService,
		private caslAbilityFactory: CaslAbilityFactory
		){}

	@Get('/profile')
	@UseGuards(AbilitiesGuard)
	@Check_Ability({action: Action.Read, subject: Users})
	async profile(@Req() request: Request, @Res() response: Response){
		const user: any = request.user
		const result = await this.userService.findById(user._id)

		response.json({
			statusCode: HttpStatus.OK,
			message: 'User profile successfuly',
			data: result
		})
	}

	@Post('/asign-permission')
	async userPermission(
		@Body() asignPermision: AsignUserPermissions,
		@Req() request: Request,
		@Res() response: Response
	){
		const userPermission = await this.userService.asignUserPermissions(asignPermision)
		this.logger.debug('user permission', userPermission)

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'Asign user permission successfuly',
			data: userPermission
		})
	}

	@Post('/asign-menus')
	async userMenus(
		@Body() asignMenu: AsignUserMenus,
		@Req() request: Request,
		@Res() response: Response
	){
		const userMenu = await this.userService.asignUserMenus(asignMenu)

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'Asign user menu successfuly',
			data: userMenu
		})
	}

	@Get('/menus')
	async userByMenus(
		@Req() request: Request,
		@Res() response: Response
	){
		this.logger.verbose('userByMenus')

		const user: any = request.user

		const userMenus = await this.userService.userMenus(user._id)
		this.logger.verbose(userMenus)

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'user Menus successfuly',
			data: userMenus
		})
	}
}
