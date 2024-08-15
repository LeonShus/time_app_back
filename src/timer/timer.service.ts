import { Injectable, NotAcceptableException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TimerRoundDto, TimerSessionDto } from './dto/timer.dto'

@Injectable()
export class TimerService {
	constructor(private prisma: PrismaService) {}

	private async getUser(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				interalsCount: true
			}
		})
	}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0]

		return this.prisma.timerSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today)
				},
				userId
			},
			include: {
				rounds: {
					orderBy: {
						id: 'asc'
					}
				}
			}
		})
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId)

		if (todaySession) return todaySession

		const user = await this.getUser(userId)

		if (!user) throw new NotAcceptableException('User not found')

		return this.prisma.timerSession.create({
			data: {
				rounds: {
					// Создаем круги с помощью пустого массива от количества элементов у нашего юзера
					// добавляем на каждой итерации круг с пустыми полями
					createMany: {
						data: Array.from({ length: user.interalsCount }, () => {
							return { totalSeconds: 0 }
						})
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				rounds: true
			}
		})
	}

	async update(dto: Partial<TimerSessionDto>, timerId: string, userId: string) {
		return this.prisma.timerSession.update({
			where: {
				userId,
				id: timerId
			},
			//@ts-ignore
			data: dto
		})
	}

	async updateRound(dto: Partial<TimerRoundDto>, roundId: string) {
		return this.prisma.timerRound.update({
			where: {
				id: roundId
			},
			data: dto
		})
	}

	async deleteSession(sessionId: string, userId: string) {
		return this.prisma.timerSession.delete({
			where: {
				id: sessionId,
				userId
			},
		})
	}

}
