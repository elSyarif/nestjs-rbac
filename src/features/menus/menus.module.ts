import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menus } from "./menus.entity";
import { MenusService } from "./menus.service";
import { MenusController } from './menus.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Menus])],
    exports: [TypeOrmModule],
    providers: [MenusService],
    controllers: [MenusController]
})
export class MenusModule{}