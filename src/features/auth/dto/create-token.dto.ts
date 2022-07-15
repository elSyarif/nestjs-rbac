export class CreateTokenDto{
    id: string
    accessToken: string
    refreshToken: string
    username?: string
    ip?: string
}
