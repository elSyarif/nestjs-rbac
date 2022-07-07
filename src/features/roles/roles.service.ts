import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Roles } from "./roles.entity";

@Injectable()
export class RolesService{
    constructor(
        @InjectRepository(Roles)
        private roleRepository: Repository<Roles>
    ){}

    // TODO: find all roles
    async findAll(){
        return await this.roleRepository.find()
    }

    // TODO: find role by id
    async findOne(roleId: number){
        const role =  await this.roleRepository.findOneBy({
            id: roleId
        })

        if(!role){
            throw new NotFoundException()
        }

        return role
    }
    
    // TODO: create new role 
    async save(roleDto: CreateRoleDto){
        const role = new Roles()
        role.name = roleDto.name
        role.description = roleDto.description

        return await this.roleRepository.save(role)
    }
    
    // TODO: update role 
    async update(roldDto: UpdateRoleDto){
        const role = await this.findOne(roldDto.id)
        role.name = roldDto.name
        role.description = roldDto.description

        await this.roleRepository.save(role)
    }
    
    // TODO: delete role
    async delete(roleId: number){
        const token = await this.findOne(roleId)

        return await this.roleRepository.remove(token)
    }
}