import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateBusinessPartnerDto } from './create-business-partner.dto';

export class UpdateBusinessPartnerDto extends PartialType(
  OmitType(CreateBusinessPartnerDto, ['companyId'] as const),
) {}
