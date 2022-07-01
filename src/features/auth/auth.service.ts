import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/registerUser.dto';

@Injectable()
export class AuthService {

	constructor(private usersService: UsersService){}

	async validateUser(username: string, password: string): Promise<any>{
		const user = await this.usersService.findOne(username)

		if(user && await user.checkPassword(password)){
			const { password, ...result } = user

			return result
		}

		return null
	}

	async register(registerUserDto:RegisterUserDto){
		const user = await this.usersService.registerUser(registerUserDto)

		return user
	}
}
