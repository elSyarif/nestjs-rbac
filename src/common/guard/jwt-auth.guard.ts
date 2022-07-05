import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "@common/decorators";
import { JwtService } from '@nestjs/jwt';
import { Decrypt } from "@helper/crypto.helper";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
	constructor(
		private reflector: Reflector
	){
		super()
	}

	canActivate(context: ExecutionContext){
	    const request = context.switchToHttp().getRequest()
	    const response = context.switchToHttp().getResponse()

	    let token = request.headers.authorization.split(' ')[1]

	    const decrypt = Decrypt(token)

	    request.headers.authorization = `Bearer ${decrypt}`

	    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
	    ]);

	    if(isPublic){
			return true
	    }

	    return super.canActivate(context)
	}

	handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
	    if(err || !user){
		throw err || new UnauthorizedException()
	    }

	    return user
	}
}
