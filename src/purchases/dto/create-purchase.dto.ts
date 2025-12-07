import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class CreatePurchaseDto {
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  product: ProductDto[];

  @IsNotEmpty()
  @IsString()
  total: string;
}
