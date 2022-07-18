import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './features/auth/auth.module';
import { PermissionsModule } from './features/permissions/permissions.module';
import { RolesModule } from './features/roles/roles.module';
import { UsersModule } from './features/users/users.module';
import { MenusModule } from './features/menus/menus.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './features/auth/strategies/jwt.strategy';
import { RolesGuard } from './common/guard/role.guard';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
	ConfigModule.forRoot({
		load: [configuration],
		envFilePath: '.env',
		isGlobal: true,
	}),
	TypeOrmModule.forRoot(DatabaseConfig),
	AuthModule,
	UsersModule,
	RolesModule,
	PermissionsModule,
	MenusModule,
	CaslModule
  ],
  providers: [
	{
		provide: APP_GUARD,
		useClass: JwtStrategy,
	}
  ],
  controllers: [],
})
export class AppModule {}
