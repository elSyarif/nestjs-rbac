import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateTokenDto } from "../auth/dto/create-token.dto";
import { UpdateTokenDto } from "../auth/dto/update-token.dto";
import { UserToken } from "./token.entity";
import { Users } from "./user.entity";

@Injectable()
export class UserTokenService{
    constructor(
        @InjectRepository(UserToken)
        private tokenRepository: Repository<UserToken>,
        private dataSource: DataSource
    ){}

    async findUserToken(userId: string){
		const token = await this.tokenRepository.findOneBy({
			user_id: userId
		})

		if(!token){
			return false
		}

		return true
	}

	// TODO: insert new token
	async storeToken(createTokenDto:CreateTokenDto): Promise<any>{
		const ds = this.dataSource.createQueryRunner()

		await ds.connect()
		await ds.startTransaction()

		const users = await ds.manager.getRepository(Users)
		const userTokenRepository = await ds.manager.getRepository(UserToken)


		const user = await users.findOne({
			where: {
				id: createTokenDto.id
			}
		})

		try {
			const userToken = new UserToken()
			userToken.user_id = user.id
			userToken.access_token = createTokenDto.accessToken
			userToken.refresh_token = createTokenDto.refreshToken
			userToken.ip = "0.0"

			await userTokenRepository.save(userToken)
			// commit to table
			await ds.commitTransaction()
		} catch (error) {
			// rollback
			await ds.rollbackTransaction()
		} finally{
			// release datasource connection
			await ds.release()
		}
	}

	// TODO: update user login refreshtoken
	async updateToken(updateToken: UpdateTokenDto): Promise<any>{
		const ds = this.dataSource.createQueryRunner()

		console.log('first')
		ds.connect()
		ds.startTransaction()

		const userToken = await ds.manager.getRepository(UserToken)

		try {
			const updateUserToken = await userToken.findOne({
				where: {
					refresh_token: updateToken.refreshToken
				}
			});

			updateUserToken.refresh_token = updateToken.refreshToken
			updateUserToken.access_token = updateToken.accessToken

			await userToken.save(updateUserToken)

			ds.commitTransaction()

			return updateUserToken
		} catch (error) {
			ds.rollbackTransaction()
			ds.release()
		} finally{
			ds.release()
		}
	}

	// TODO: delete user refresh token
	async deleteToken(refreshToken: string): Promise<any>{
		const userToken = await this.tokenRepository.findOne({
			where: {
				refresh_token: refreshToken
			}
		})

		if(!userToken){
			throw new NotFoundException()
		}

		return await this.tokenRepository.remove(userToken)
	}

	// TODO: find refresh token
	async findRefreshToken(refresh_token: string): Promise<any>{
		const refreshToken = this.tokenRepository.findOneOrFail({
			where: {
				refresh_token: refresh_token
			}
		})

		return refreshToken
	}
}
