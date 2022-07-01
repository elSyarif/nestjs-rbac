import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
	TypeOrmModule.forRoot(DatabaseConfig),
	AuthModule,
	UsersModule],
  providers: [],
})
export class AppModule {}
