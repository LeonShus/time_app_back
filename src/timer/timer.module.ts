import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { PrismaService } from 'src/prisma.service';



@Module({
  controllers: [TimerController],
  providers: [TimerService, PrismaService],
  exports: [TimerService]
})
export class TimerModule {}
