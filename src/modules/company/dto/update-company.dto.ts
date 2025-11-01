import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

/**
 * Update Company DTO
 * All fields are optional for partial updates
 */
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
