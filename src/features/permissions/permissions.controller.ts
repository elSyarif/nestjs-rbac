import { JwtAuthGuard } from "@common/guard/jwt-auth.guard";
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionsService } from "./permissions.service";

@Controller('permissions')
@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PermissionsController{

    constructor(
        private permissionsService: PermissionsService
    ){}

	@Version('1')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Permissions create success'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Permissions create failed'})
    async create(
        @Body() permissionDto: CreatePermissionDto,
        @Req() request: Request,
        @Res() response: Response
    ){
        const permission = await this.permissionsService.create(permissionDto)

        if(!permission){
            throw new BadRequestException()
        }

        response.json({
            statusCode: HttpStatus.CREATED,
            message: 'Permission create successfuly',
            date: permission
        })
    }

	@Version('1')
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, description: 'Permissions List'})
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ){
        const permission = await this.permissionsService.findAll()

        response.json({
            statusCode: HttpStatus.OK,
            message: 'Permission list successfuly',
            date: permission
        })
    }

	@Version('1')
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
        @Res() response: Response
    ){
        const permission = await this.permissionsService.findOne(id)

        response.json({
            statusCode: HttpStatus.OK,
            message: 'Permission list by id successfuly',
            date: permission
        })
    }

	@Version('1')
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() permissionDto: UpdatePermissionDto,
        @Req() request: Request,
        @Res() response: Response
    ){
        const {...data} =permissionDto
        data.id = id
        const permission = await this.permissionsService.update(data)

        response.json({
            statusCode: HttpStatus.OK,
            message: 'Permission update successfuly',
            date: permission
        })
    }

	@Version('1')
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
        @Res() response: Response
    ){
        const permission = await this.permissionsService.remove(id)

        response.json({
            statusCode: HttpStatus.OK,
            message: 'Permission delete successfuly',
            date: permission
        })
    }
}
