import { ApiProperty } from "@nestjs/swagger"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Roles{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @ApiProperty()
    name: string

    @Column()
    @ApiProperty()
    description: string
}
