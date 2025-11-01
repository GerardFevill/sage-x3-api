import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTaxCodeDto } from './create-tax-code.dto';

export class UpdateTaxCodeDto extends PartialType(
  OmitType(CreateTaxCodeDto, ['companyId'] as const),
) {}
