import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class UpdateRoleDto{
    id?: number

    @ApiProperty()
    @IsNotEmpty()
    name: string
    
    @ApiProperty()
    @IsNotEmpty()
    description: string
}
