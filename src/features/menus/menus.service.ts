import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Menus } from "./menus.entity";

@Injectable()
export class MenusService{
    
    constructor(
        @InjectRepository(Menus)
        private repository: Repository<Menus>
    ){}

    async create(){}

    async findAll(){}

    async findOne(){}

    async update(){}
    
    async remove(){}
}