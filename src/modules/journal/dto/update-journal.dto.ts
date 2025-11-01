import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateJournalDto } from './create-journal.dto';

export class UpdateJournalDto extends PartialType(
  OmitType(CreateJournalDto, ['companyId'] as const),
) {}
