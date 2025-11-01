import { PartialType } from '@nestjs/swagger';
import { CreateCurrencyDto } from './create-currency.dto';

/**
 * DTO for updating an existing currency
 * All fields are optional (extends CreateCurrencyDto as partial)
 */
export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {}
