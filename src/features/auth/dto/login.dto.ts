import { ApiProperty } from "@nestjs/swagger"

export class LoginDto{
	id?: string

	@ApiProperty({
		type: String
	})
	username: string
	
	@ApiProperty()
	password: string
}
