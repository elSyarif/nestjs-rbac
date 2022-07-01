import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const DatabaseConfig: TypeOrmModuleOptions = {
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'root',
	database: 'db_pos',
	entities: [ __dirname + '/../**/**/*.entity.{js,ts}'],
	synchronize: true,
}

