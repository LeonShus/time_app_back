import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
  HttpCode,
  Put
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './dto/user.dto'

@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// @Get()
	// @Auth()
	// async profile(@CurrentUser('id') id: string) {
	// 	return this.userService.getProfile(id)
	// }

	@Get()
	@Auth()
	async profile(id: string) {
		return this.userService.getProfile('clzpra7t60000l02dietupvh7')
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	// @Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.update(id, dto)
	}
}
