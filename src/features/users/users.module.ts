import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UsersController } from './users.controller';
import { UserToken } from './token.entity';
import { UserTokenService } from './user-token.service';
import { UserPermissions } from './user-permission.entity';
import { UserMenus } from './user-menus.entity';
import { Menus } from '../menus/menus.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Users, UserToken, UserPermissions, UserMenus, Menus])],
	providers: [UsersService, UserTokenService],
	exports: [TypeOrmModule],
	controllers: [UsersController],
})
export class UsersModule {}
