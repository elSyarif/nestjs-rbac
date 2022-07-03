import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

	@Get('/profile')
	async profile(){
		return 'user profile'
	}
}
