import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, MinLength, NotContains } from "class-validator"

export class LoginDto{
	id?: string

	@ApiProperty({
		type: String
	})
	@IsNotEmpty()
	@MinLength(3)
	@NotContains('test')
	username: string

	@ApiProperty({
		type: String
	})
	@IsNotEmpty()
	password: string
}
