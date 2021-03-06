import { Controller, Get, HttpCode, Post, UseGuards, HttpStatus, Patch, Delete, Body, Req, Res, UsePipes, ValidationPipe, BadRequestException, Param, ParseIntPipe, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CreateMenusDto } from './dto/create-menus.dto';
import { MenusService } from './menus.service';
import { UpdateMenusDto } from './dto/update-menus.dto';

@Controller('menus')
@ApiTags('Menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MenusController {
	constructor(
		private menuService: MenusService
	){}

	@Version('1')
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe({ transform: true }))
	async create(
		@Body() menuDto: CreateMenusDto,
        	@Req() request: Request,
        	@Res() response: Response
	){
		const menu = await this.menuService.create(menuDto)

		if(!menu){
			throw new BadRequestException()
		}

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'Menu create successfuly',
			date: menu,
		});
	}

	@Version('1')
	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(
		@Req() request: Request,
		@Res() response: Response
	){
		const menu  = await this.menuService.findAll()

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'Menu list successfuly',
			date: menu,
		});
	}

	@Version('1')
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findOne(
		@Param('id', ParseIntPipe) id: number,
		@Req() request: Request,
		@Res() response: Response
	){
		const menu = await this.menuService.findOne(id)

		response.json({
			statusCode: HttpStatus.CREATED,
			message: 'Menu find by id successfuly',
			date: menu,
		});
	}

	@Version('1')
	@Patch(':id')
	@UsePipes(new ValidationPipe({ transform: true }))
	@HttpCode(HttpStatus.OK)
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() menuDto: UpdateMenusDto,
		@Req() request: Request,
		@Res() response: Response
	){
		const {...data} = menuDto
		data.id = id

		const menu = await this.menuService.update(data)

		response.json({
			statusCode: HttpStatus.OK,
			message: 'Menu Update successfuly',
			date: menu,
		});
	}

	@Version('1')
	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async remove(
		@Param('id', ParseIntPipe) id: number,
		@Req() request: Request,
		@Res() response: Response
	){
		const menu = await this.menuService.remove(id)

		response.json({
			statusCode: HttpStatus.OK,
			message: 'Menu delete successfuly',
			date: menu,
		});
	}
}
