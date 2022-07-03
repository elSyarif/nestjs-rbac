import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { Users } from './features/users/user.entity';

@Module({
  imports: [
	ConfigModule.forRoot({
		load: [configuration],
		envFilePath: '.development.env',
		isGlobal: true,
	}),
	TypeOrmModule.forRoot({
		type: 'mysql',
		host: process.env.DB_HOST,
		port: parseInt(process.env.PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		entities: [ Users],
		synchronize: true,
	}),
	AuthModule,
	UsersModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
