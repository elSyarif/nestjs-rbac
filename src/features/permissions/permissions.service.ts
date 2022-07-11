import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { Permissions } from "./permissions.entity";

@Injectable()
export class PermissionsService{
    
    constructor(
        @InjectRepository(Permissions)
        private repository: Repository<Permissions>
    ){}

    async findAll(){
        return await this.repository.find()
    }

    async findOne(id: number){
        const permission = await this.repository.findOneBy({
            id: id
        })

        if(!permission){
            throw new NotFoundException()
        }

        return permission
    }

    async create(permissionDto: CreatePermissionDto){
        const permission = new Permissions()
        permission.name = permissionDto.name
        permission.description = permissionDto.description

        return await this.repository.save(permission)
    }

    async update(permissionDto: UpdatePermissionDto){
        const permission = await this.findOne(permissionDto.id)

        permission.name = permissionDto.name
        permission.description = permissionDto.description

        return await this.repository.save(permission)
    }

    async remove(id: number){
        const permission = await this.findOne(id)

        return await this.repository.remove(permission)
    }
}