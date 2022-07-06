import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from './user.interface';
import { UpdateTokenDto } from './dto/update-token.dto';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class AuthService {

	constructor(
		private usersService: UsersService,
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
	async logout(user: UserInterface){
		const deleteToken = await this.usersService.deleteToken(user.id)

		return deleteToken
	}

	async findToken(userId: string){
		return await this.usersService.findUserToken(userId)
	}
	// TODO: save refreshtoken to database
	async saveToken(user: CreateTokenDto){
		return await this.usersService.storeToken(user)
	}

	async updateToken(updateToken: UpdateTokenDto){
		return await this.usersService.updateToken(updateToken)
	}

	// TODO: insert refesh token to databse
	// create new cookies refreshtoken and accestoken to headers auth
	async refresh(user: UserInterface){}
}
