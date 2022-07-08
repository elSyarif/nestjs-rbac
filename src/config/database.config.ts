import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

export const DatabaseConfig: TypeOrmModuleOptions = {
	type: 'mysql',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD,
	database: 'db_pos',
	entities: [ __dirname + '/../**/**/*.entity.{js,ts}'],
	synchronize: true,
	logging: false,
}

