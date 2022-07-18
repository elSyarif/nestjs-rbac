import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABILITY_KEY, Required } from '../decorators/index';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';


@Injectable()
export class AbilitiesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private caslAbilityFactory: CaslAbilityFactory
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const rules = this.reflector.get<Required[]>(ABILITY_KEY, context.getHandler()) || []

		const { user } = context.switchToHttp().getRequest();
		const ability = this.caslAbilityFactory.manageForUser(user)

		try {
			rules.forEach((rule) => {
				ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
			})

			return true
		} catch (error) {
			if(error instanceof ForbiddenError){
				throw new ForbiddenException(error.message)
			}
		}
	}


}
