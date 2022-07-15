import { ApiProperty } from "@nestjs/swagger"

export class AsignUserPermissions{
	@ApiProperty()
	user_id: string

	@ApiProperty()
	permission_id: number
}
