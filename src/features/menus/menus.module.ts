import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menus } from "./menus.entity";
import { MenusService } from "./menus.service";

@Module({
    imports: [TypeOrmModule.forFeature([Menus])],
    exports: [TypeOrmModule],
    providers: [MenusService],
    controllers: []
})
export class MenusModule{}