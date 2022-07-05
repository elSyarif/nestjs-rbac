import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from './user.interface';

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

	async logout(user: UserInterface){}

	async refresh(user: UserInterface){}
}
