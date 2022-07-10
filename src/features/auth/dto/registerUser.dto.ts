import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, minLength, MinLength, NotContains } from "class-validator"

export class RegisterUserDto{
	@ApiProperty()
	@IsNotEmpty()
	@MinLength(3)
	name: string

	@ApiProperty()
	@IsNotEmpty()
	@NotContains('test')
	username: string

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(5)
	password: string
}
