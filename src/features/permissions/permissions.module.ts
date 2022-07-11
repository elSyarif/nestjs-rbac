import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionsController } from "./permissions.controller";
import { Permissions } from "./permissions.entity";
import { PermissionsService } from "./permissions.service";

@Module({
    imports:[TypeOrmModule.forFeature([Permissions])],
    exports: [TypeOrmModule],
    providers: [PermissionsService],
    controllers: [PermissionsController]
})
export class PermissionsModule{}