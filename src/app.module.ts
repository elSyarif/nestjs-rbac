import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './features/auth/auth.module';
import { RolesModule } from './features/roles/roles.module';
import { UsersModule } from './features/users/users.module';

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
	RolesModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
