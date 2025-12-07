import { IsString, IsNumber } from "class-validator";

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  productCode: string;

  @IsString()
  subtotal: string;

  @IsNumber()
  quantity: number;
}
