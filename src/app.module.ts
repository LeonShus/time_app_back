import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { TaskModule } from './task/task.module'
import { TimeBlockModule } from './time-block/time-block.module'
import { TimerModule } from './timer/timer.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		AuthModule,
		UserModule,
		TaskModule,
		TimeBlockModule,
		TimerModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
