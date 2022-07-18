import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
	imports: [],
	providers: [CaslAbilityFactory],
})
export class CaslModule {}
