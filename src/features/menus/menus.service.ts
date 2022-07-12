import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMenusDto } from "./dto/create-menus.dto";
import { UpdateMenusDto } from "./dto/update-menus.dto";
import { Menus } from "./menus.entity";

@Injectable()
export class MenusService{

    constructor(
        @InjectRepository(Menus)
        private repository: Repository<Menus>
    ){}

    async create(menuDto: CreateMenusDto){
        const menu = new Menus()
        menu.parent_id = menuDto.parent_id
        menu.title = menuDto.title
        menu.icon = menuDto.icon
        menu.link = menuDto.link
        menu.is_active = menuDto.is_active
        menu.sort = menuDto.sort

        return await this.repository.save(menu)
    }

    async findAll(limit?: number, skip?: number){
        const menus = await this.repository.find({
            order: {
                id: "ASC",
                sort: "ASC"
            }
        })

        return menus
    }

    async findOne(id: number){
        const menu = await this.repository.findOneBy({
            id: id
        })

        if(!menu){
            throw new NotFoundException()
        }

        return menu
    }

    async update(menuDto: UpdateMenusDto){
        const menu = await this.findOne(menuDto.id)

        menu.title = menuDto.title
        menu.icon = menuDto.icon
        menu.link = menuDto.link
        menu.is_active = menuDto.is_active
        menu.sort = menuDto.sort

        return await this.repository.save(menu)
    }

    async remove(id: number){
        const menu = await this.findOne(id)

        return await this.repository.remove(menu)
    }

    async lastSort(id: number){
        const menus = await this.repository.createQueryBuilder("menu")
            .select("max(menu.sort)", "max")
            .where("menu.parent_id = :id", {id: id})
            .getRawOne()

        return menus
    }
}
