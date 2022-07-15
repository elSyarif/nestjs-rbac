import { ApiProperty } from "@nestjs/swagger";

export class AsignUserMenus {
	@ApiProperty()
	user_id: string;

	@ApiProperty()
	menu_id: number;
	is_read?: boolean;
	is_create?: boolean;
	is_update?: boolean;
	is_delete?: boolean;
}
