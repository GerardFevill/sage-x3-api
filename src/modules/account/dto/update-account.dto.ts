import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

/**
 * DTO for updating an existing account
 * All fields are optional except companyId which cannot be changed
 */
export class UpdateAccountDto extends PartialType(
  OmitType(CreateAccountDto, ['companyId'] as const),
) {}
