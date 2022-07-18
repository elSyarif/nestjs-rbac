import { Injectable } from "@nestjs/common";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { Users } from '../features/users/user.entity';

export enum Action {
	Manage = 'manage',
	Create = 'create',
	Read = 'read',
	Update = 'update',
	Delete = 'delete',
   }

interface User{
	_id: string
	username: string
	role: string
	permissions: []
}

export type Subjects = InferSubjects<typeof Users> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;


@Injectable()
export class CaslAbilityFactory {

	// TODO: Ability untuk menajemen user
	manageForUser(user: User){
		const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)

		// User admin dapat melakukan semua nya
		if(user.role.toLowerCase() === 'admin'){
			can(Action.Manage, 'all')
		}else{
			// jika bukan admin cek permisinya
			// Create
			if(user.permissions.some((per) => Action.Create.includes(per))){
				can(Action.Create, Users)
			}
			// Update
			// update hanya untuk user sama dengan login
			if(user.permissions.some((per) => Action.Update.includes(per))){
				can(Action.Update, Users, {id: user._id})
			}
			// Delete
			// delete hanya untuk yang memiliki permisi
			if(user.permissions.some((per) => Action.Delete.includes(per))){
				can(Action.Delete, Users, {id: {$ne: user._id}})
			}

			can(Action.Read, 'all')
		}

		return build({
			detectSubjectType: (item) =>
				item.constructor as ExtractSubjectType<Subjects>
		})
	}

}
