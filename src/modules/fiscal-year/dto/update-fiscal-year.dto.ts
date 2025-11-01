import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateFiscalYearDto } from './create-fiscal-year.dto';

/**
 * DTO for updating an existing fiscal year
 * All fields are optional except companyId which cannot be changed
 */
export class UpdateFiscalYearDto extends PartialType(
  OmitType(CreateFiscalYearDto, ['companyId'] as const),
) {}
