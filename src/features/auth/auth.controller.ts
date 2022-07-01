import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@utils/guard/local-auth.guard';
import { Request, Response } from 'express';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService){}

	@Post('/login')
	async login(@Body() loginDto: LoginDto, @Req() request: Request, @Res() response: Response){
		const {username, password} = loginDto

		const user = await this.authService.validateUser(username, password)

		return response.status(200).json({
			statusCode: 200,
			message: 'success',
			data: user
		})
	}

	@Post('/register')
	async register(@Body() registerUserDto:RegisterUserDto, @Req() request: Request, @Res() response: Response){
		const user = 	await this.authService.register(registerUserDto)

		return response.status(200).json({
			statusCode: 201,
			message: 'User create successfuly',
			data: user
		})
	}

	@UseGuards(LocalAuthGuard)
	@Get('/test')
	async profile(@Req() req){
		return req.user
	}
}
