import { ApiProperty } from "@nestjs/swagger"

export class RegisterUserDto{
	@ApiProperty()
	name: string
	
	@ApiProperty()
	username: string
	
	@ApiProperty()
	password: string
}
