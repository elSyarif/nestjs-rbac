
export interface UserInterface{
	id?: string
	username?: string
	name?: string
	role?: any
	permissions?: any
}

export interface LoginUserInterface{
	id: string
	username: string
	name: string
	access_token: string,
	role?: any
}
