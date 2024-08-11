import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { Response, Request } from 'express'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// Pipes  нужны что бы отрабатывала валидация из dto
	@UsePipes(new ValidationPipe())
	// указываем точный код при успешном запросе, а то бывает улетает что-то другое
	@HttpCode(200)
	// указываем запрос
	@Post('login')
	// passthrough важная настройка для работы с респонсом, без нее кука не запишется
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	// указываем запрос
	@Post('login/access-token')
	// passthrough важная настройка для работы с респонсом, без нее кука не запишется
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFronCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFronCookies) {
			this.authService.removeRefreshTokenToResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFronCookies
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	// Pipes  нужны что бы отрабатывала валидация из dto
	@UsePipes(new ValidationPipe())
	// указываем точный код при успешном запросе, а то бывает улетает что-то другое
	@HttpCode(200)
	// указываем запрос
	@Post('register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.register(dto)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	// указываем запрос
	@Post('logout')
	// passthrough важная настройка для работы с респонсом, без нее кука не запишется
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenToResponse(res)

		return true
	}
}
