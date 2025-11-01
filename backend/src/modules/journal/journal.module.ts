import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from './journal.entity';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { JournalRepository } from './journal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Journal])],
  controllers: [JournalController],
  providers: [JournalService, JournalRepository],
  exports: [JournalService, JournalRepository],
})
export class JournalModule {}
