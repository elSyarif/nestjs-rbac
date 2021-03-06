import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
	constructor(){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		})
	}

	// asign request.user
	async validate(paylod: any){
		return {
			_id: paylod._id,
			username: paylod.username,
			role: paylod.role,
			permissions: paylod.permission
		}
	}
}
