import { Public } from '@common/decorators';
import { BadRequestException, Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';

import { Encrypt, Decrypt } from '@helper/crypto.helper';
import { LoginUserInterface, UserInterface } from './user.interface';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService){}

	@Public()
	@Post('/login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto, @Req() request: Request, @Res() response: Response){
		const {username, password} = loginDto

		const user: LoginUserInterface = await this.authService.validateUser(username, password)

		const jwt = await this.authService.login(user)
		user.access_token = Encrypt(jwt.access_token)
		
		const payload = {
			id: user.id, 
			accessToken: Encrypt(jwt.access_token),
			refreshToken: Encrypt(jwt.refresh_token),
			username: user.username
		}
		// TODO: IF user has login in another page 
		// delete first / update token
		const userToken = await this.authService.findToken(user.id)
		if(userToken){
			// TODO: Update token to database
			await this.authService.updateToken(payload)
		}else{
			// TODO: insert token to database
			await this.authService.saveToken(payload)
		}

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
		const user = request.user
		await this.authService.logout(user)

		response.clearCookie('x-refresh-token')
		
		response.json({
			statusCode: HttpStatus.OK,
			message: "logout berhasil"
		})
	}

	@Public()
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Req() request: Request, @Res() response: Response){
		const refreshToken = Decrypt(response.clearCookie('x-refresh-token'))

		if(!refreshToken){
			throw new BadRequestException()
		}

		// cek refreshtoken to database

		// create new access token 
	}
}
