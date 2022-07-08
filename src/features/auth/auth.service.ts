import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from './user.interface';
import { UpdateTokenDto } from './dto/update-token.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { UserTokenService } from '../users/user-token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Decrypt } from '@helper/crypto.helper';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)

	constructor(
		private usersService: UsersService,
		private userTokenService: UserTokenService,
		private jwtService: JwtService
	){}

	async validateUser(username: string, password: string): Promise<any>{
		const user = await this.usersService.findOne(username)

		if(user && await user.checkPassword(password)){
			const { password, ...result } = user

			return result
		}

		throw new BadRequestException('username/password invalid')
	}

	async register(registerUserDto:RegisterUserDto){
		const user = await this.usersService.registerUser(registerUserDto)

		return user
	}

	async login(user: UserInterface){
		const payload = {
			username: user.username,
			_id: user.id
		}

		return {
			access_token : this.jwtService.sign(payload),
			refresh_token: this.jwtService.sign(payload, {
				secret: process.env.JWT_SECRET_REFRESH_TOKEN,
				expiresIn: process.env.JWT_EXPIRE_TIME_REFRESH_TOKEN
			})
		}
	}

	// TODO: Logout
	// remove refreshtoken from database
	async logout(refreshToken: string){
		const deleteToken = await this.userTokenService.deleteToken(refreshToken)

		return deleteToken
	}

	async findToken(userId: string){
		return await this.userTokenService.findUserToken(userId)
	}
	// TODO: save refreshtoken to database
	async saveToken(user: CreateTokenDto){
		return await this.userTokenService.storeToken(user)
	}

	async updateToken(updateToken: UpdateTokenDto){
		return await this.userTokenService.updateToken(updateToken)
	}

	// TODO: insert refesh token to databse
	// create new cookies refreshtoken and accestoken to headers auth
	async refreshToken(userToken: RefreshTokenDto){
		// cek refreshtoken
		const token = await this.userTokenService.findRefreshToken(userToken.refresh_token)

		if(!token){
			throw new BadRequestException()
		}

		const decode = this.jwtService.verify(Decrypt(token.refresh_token), {
			secret: process.env.JWT_SECRET_REFRESH_TOKEN,
		})
		
		const isExp = decode.exp * 1000 <= Date.parse(Date())
		if(isExp){
			throw new BadRequestException('Refresh Token expire')
		}

		const newAccessToken = this.jwtService.sign({
			_id: userToken.id,
			username: userToken.username
		})

		// return access_token 
		return newAccessToken
	}

	async findRefreshToken(refreshToken: string){
		return await this.userTokenService.findRefreshToken(refreshToken)
	}
}
