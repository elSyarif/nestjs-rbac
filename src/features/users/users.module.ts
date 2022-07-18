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
import { CaslModule } from '../../casl/casl.module';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Module({
	imports: [
		TypeOrmModule.forFeature(
			[Users, UserToken, UserPermissions, UserMenus, Menus]),
		CaslModule
		],
	providers: [
		UsersService,
		UserTokenService,
		CaslAbilityFactory
	],
	exports: [TypeOrmModule, CaslModule],
	controllers: [UsersController],
})
export class UsersModule {}
