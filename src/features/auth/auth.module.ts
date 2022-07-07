import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import configuration from '@config/configuration';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { UserTokenService } from '../users/user-token.service';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		ConfigModule.forRoot({
			load: [configuration],
			envFilePath: '.env',
			isGlobal: true,
		}),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME}
		})
	],
	providers: [
		UsersService,
		AuthService,
		UserTokenService,
		LocalStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtStrategy
		}
	],
	controllers: [AuthController],
})
export class AuthModule {}
