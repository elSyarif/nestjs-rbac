import { Controller, Get, Req, Res, UseGuards, HttpStatus, Logger, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Users } from './user.entity';
import { UsersService } from './users.service';
import { AsignUserPermissions } from './dto/asign-user-permission.dto';
import { AsignUserMenus } from './dto/asign-user-menus.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	private readonly logger = new Logger(UsersController.name)

	constructor(
		private userService: UsersService
	){}

	@Get('/profile')
	async profile(@Req() request: Request, @Res() response: Response){
		const userId: any = request.user

		const user = await this.userService.findById(userId._id)

		response.json({
			statusCode: HttpStatus.OK,
			message: 'User profile successfuly',
			data: user
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
}
