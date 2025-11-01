import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const codeExists = await this.productRepository.codeExistsForCompany(
      createProductDto.companyId,
      createProductDto.productCode,
    );
    if (codeExists) {
      throw new ConflictException(
        `Product with code ${createProductDto.productCode} already exists for this company`,
      );
    }
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ order: { companyId: 'ASC', productCode: 'ASC' } });
  }

  async findByCompany(companyId: number): Promise<Product[]> {
    return this.productRepository.findByCompany(companyId);
  }

  async findActiveByCompany(companyId: number): Promise<Product[]> {
    return this.productRepository.findActiveByCompany(companyId);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByCompanyAndCode(companyId: number, productCode: string): Promise<Product> {
    const product = await this.productRepository.findByCompanyAndCode(companyId, productCode);
    if (!product) {
      throw new NotFoundException(
        `Product with code ${productCode} not found for company ${companyId}`,
      );
    }
    return product;
  }

  async findByType(companyId: number, productType: string): Promise<Product[]> {
    return this.productRepository.findByType(companyId, productType);
  }

  async findByCategory(companyId: number, productCategory: string): Promise<Product[]> {
    return this.productRepository.findByCategory(companyId, productCategory);
  }

  async search(companyId: number, query: string): Promise<Product[]> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }
    return this.productRepository.search(companyId, query.trim());
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.productCode) {
      const codeExists = await this.productRepository.codeExistsForCompany(
        product.companyId,
        updateProductDto.productCode,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Product with code ${updateProductDto.productCode} already exists for this company`,
        );
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productRepository.customSoftDelete(id);
  }
}
