export class UpdateTokenDto{
	id: string
	accessToken: string
	refreshToken?: string
	oldRefreshToken?: string
	user_id?: string
}
