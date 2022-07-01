import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
	imports: [UsersModule, PassportModule ],
	providers: [UsersService, AuthService, LocalStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
