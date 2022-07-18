import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from '../../casl/casl-ability.factory';

export interface Required{
	action: Action
	subject: Subjects
}

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';
export const ABILITY_KEY = 'ability'

export const Public  = () => SetMetadata(IS_PUBLIC_KEY, true)
export const Roles = (...roles: any[]) => SetMetadata(ROLES_KEY, roles)
export const Permissions = (...permissions: any[]) => SetMetadata(PERMISSIONS_KEY, permissions)
export const Check_Ability = (...requiremen: Required[]) => SetMetadata(ABILITY_KEY, requiremen)
