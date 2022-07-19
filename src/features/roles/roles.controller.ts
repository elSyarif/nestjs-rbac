import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards, BadRequestException, HttpStatus, HttpCode, UsePipes, ValidationPipe, Patch, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Request, Response } from 'express';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RolesController {

	constructor(
		private roleService: RolesService
	){}

	@Version('1')
	@Get()
	@HttpCode(HttpStatus.OK)
	async getRoles(@Req() request: Request, @Res() response: Response){
		const roles = await this.roleService.findAll()

		response.json({
			statusCode: HttpStatus.OK,
			message: 'Role list',
			data: roles
		})
	}

	@Version('1')
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getRoleById(@Param('id', ParseIntPipe) id: number, @Req() request: Request, @Res() response: Response){
		const role = await this.roleService.findOne(id)

		response.json({
			statusCode: HttpStatus.OK,
			message: 'Role by Id',
			data: role
		})
	}

	@Version('1')
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe({ transform: true}))
	async store(@Body() createRoleDto: CreateRoleDto, @Req() request: Request, @Res() response: Response){
		const role = await this.roleService.create(createRoleDto)

		if(!role){
			throw new BadRequestException()
		}

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'Role Create successfuly',
			data: role
		})
	}

	@Version('1')
	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateRoleDto: UpdateRoleDto,
		@Req() request: Request,
		@Res() response: Response
	){
		const {...data} = updateRoleDto
		data.id = id
		const role = await this.roleService.update(data)

		response.json({
			statusCode: HttpStatus.OK,
			message: 'Role update successfuly',
			data: role
		})
	}

	@Version('1')
	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request, @Res() response: Response){
		const role = await this.roleService.delete(id)

		response.json({
			statusCode: HttpStatus.OK,
			message: 'Role delete successfuly',
			data: role
		})
	}
}
