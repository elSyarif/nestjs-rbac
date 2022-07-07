import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "./roles.entity";
import { RolesService } from "./roles.service";

@Module({
    imports:[TypeOrmModule.forFeature([Roles])],
    exports: [TypeOrmModule],
    providers: [RolesService],
    controllers: []
})
export class RolesModule{}