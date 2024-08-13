import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { hash } from 'argon2'
import { UserDto } from './dto/user.dto'
import { startOfDay, subDays } from 'date-fns'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	// получаем юзера и его задачи
	getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true
			}
		})
	}

	private async getTasks({
		id,
		isCompleted,
		createdAt
	}: {
		id: string
		isCompleted?: boolean | null
		createdAt?: string
	}) {
		const whereBody: {
			userId: string
			isCompleted?: boolean
			createdAt?: {
				gte: string
			}
		} = { userId: id }

		if (typeof isCompleted === 'boolean') {
			whereBody.isCompleted = isCompleted
		}

		if (createdAt) {
			whereBody.createdAt = {
				gte: createdAt
			}
		}

		const tasks = await this.prisma.task.count({
			where: whereBody
		})

		return tasks
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async getProfile(id: string) {
		// Находим юзера
		const profile = await this.getById(id)

		// Считаем данные для статистики
		const totalTasks = profile.tasks.length
		const compleatedTasks = await this.getTasks({ id: id, isCompleted: true })

		const todayStart = startOfDay(new Date())
		const weekStart = startOfDay(subDays(new Date(), 7))

		const todayTasks = await this.getTasks({
			id,
			createdAt: todayStart.toISOString()
		})

		const weekTasks = await this.getTasks({
			id,
			createdAt: weekStart.toISOString()
		})

		const { password, ...user } = profile

		return {
			user,
			statistics: [
				{
					label: 'Total',
					value: totalTasks
				},
				{
					label: 'Completed',
					value: compleatedTasks
				},
				{
					label: 'Today',
					value: todayTasks
				},
				{
					label: 'Week',
					value: weekTasks
				}
			]
		}
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password)
		}

		return this.prisma.user.create({
			data: user
		})
	}

	async update(id: string, dto: UserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data,
			// Выбираем какие поля вернуть
			select: {
				id: true,
				name: true,
				email: true
			}
		})
	}
}
