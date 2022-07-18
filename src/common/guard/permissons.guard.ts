import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Permissions } from "src/features/permissions/permissions.entity";
import { PERMISSIONS_KEY } from '../decorators/index';

export class PermissionsGuard implements CanActivate{
	constructor(
		private reflector: Reflector
	){}

	canActivate(context: ExecutionContext): boolean {
	    const { user }  = context.switchToHttp().getRequest()

	    const requiredPermissions = this.reflector.getAllAndOverride<Permissions[]>(
		PERMISSIONS_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if(!requiredPermissions){
			return true
		}

	    return requiredPermissions.some((permissions) => user.permissions?.includes(permissions))
	}
}
