import { createParamDecorator, ExecutionContext } from '@nestjs/common'
// import { User } from 'src/user/entities/user.entity'

export const CurrentUser = createParamDecorator(
	// Получаем данные и текущий контекст
	(data: any, ctx: ExecutionContext) => {
		// Из контекста забираем запрос
		const request = ctx.switchToHttp().getRequest()
		// из запроса самого юзера
		const user = request.user
		// Отдаем целого юзера или один из его ключей
		return data ? user[data] : user
	}
)