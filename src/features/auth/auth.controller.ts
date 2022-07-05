import { Public } from '@common/decorators';
import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';

import { Encrypt, Decrypt } from '@helper/crypto.helper';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService){}

	@Public()
	@Post('/login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto, @Req() request: Request, @Res() response: Response){
		const {username, password} = loginDto

		const user = await this.authService.validateUser(username, password)

		const jwt = await this.authService.login(user)
		user.access_token = Encrypt(jwt.access_token)
		// user.refresh_token = Encrypt(jwt.refresh_token)

		// setup cookies token
		response.cookie('x-refresh-token', Encrypt(jwt.refresh_token), {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			secure: false
		})

		return response.json({
			statusCode: HttpStatus.OK,
			message: 'success',
			data: user
		})
	}

	@Post('/register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() registerUserDto:RegisterUserDto, @Req() request: Request, @Res() response: Response){
		const user = 	await this.authService.register(registerUserDto)

		return response.json({
			statusCode: HttpStatus.CREATED,
			message: 'User create successfuly',
			data: user
		})
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async logout(@Req() request: Request, @Res() response: Response){
		response.json('logout')
	}

	@Public()
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Req() request: Request, @Res() response: Response){

	}
}
