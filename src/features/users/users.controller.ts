import { Controller, Get, Req, Res, UseGuards, HttpStatus, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Users } from './user.entity';
import { UsersService } from './users.service';

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
}
