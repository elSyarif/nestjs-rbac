import { Public } from '@common/decorators';
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';

import { Encrypt, Decrypt } from '@helper/crypto.helper';
import { LoginUserInterface } from './user.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService){}

	@Public()
	@Post('/login')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe({ transform: true}))
	@ApiResponse({ status: HttpStatus.OK, description: "User login has been successfully."})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request"})
	async login(@Body() loginDto: LoginDto, @Req() request: Request, @Res() response: Response){
		const {username, password} = loginDto

		const user: LoginUserInterface = await this.authService.validateUser(username, password)

		const jwt = await this.authService.login(user)
		user.access_token = Encrypt(jwt.access_token)

		const payload = {
			id: user.id,
			accessToken: Encrypt(jwt.access_token),
			refreshToken: Encrypt(jwt.refresh_token),
			oldRefreshToken: request.cookies['x-refresh-token'] || '',
			username: user.username,
			ip: request.ip
		}
		// TODO: IF user has login in another page
		// delete first / update token
		const userToken = await this.authService.findRefreshToken(payload.oldRefreshToken)

		if(userToken){
			// TODO: Update token to database
			await this.authService.updateToken(payload)
		}else{
			// TODO: insert token to database
			await this.authService.saveToken(payload)
		}

		const {role, ...result} = user
		// setup cookies token
		response.cookie('x-refresh-token', Encrypt(jwt.refresh_token), {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			secure: false
		})

		response.json({
			statusCode: HttpStatus.OK,
			message: 'success',
			data: result
		})
	}

	@Post('/register')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe({ transform: true}))
	@ApiResponse({ status: HttpStatus.CREATED, description: "The record has been successfully register."})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request"})
	async register(@Body() registerUserDto:RegisterUserDto, @Req() request: Request, @Res() response: Response){
		const user = 	await this.authService.register(registerUserDto)

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'User create successfuly',
			data: user
		})
	}


	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async logout(@Req() request: Request, @Res() response: Response){
		const token = request.cookies['x-refresh-token']

		if(!token){
			throw new BadRequestException('Token invalid')
		}

		request.user = null

		await this.authService.logout(token)

		response.clearCookie('x-refresh-token')

		response.json({
			statusCode: HttpStatus.OK,
			message: "logout berhasil"
		})
	}

	@Post('refresh')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Req() request: Request, @Res() response: Response){
		const token = request.cookies['x-refresh-token']

		if(!token){
			throw new BadRequestException('Token invalid')
		}

		// cek refreshtoken to database
		const refresh = await this.authService.refreshToken(token)

		response.json({
			access_token: Encrypt(refresh)
		})

		// create new access token
	}
}
