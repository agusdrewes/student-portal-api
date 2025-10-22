import { IsNotEmpty, IsString, IsNumber, IsObject } from 'class-validator';

export class CreatePurchaseDto {
  @IsObject()
  @IsNotEmpty()
  product: {
    name: string;
    description: string;
    productCode: string;
    subtotal: string;
    quantity: number;
  };

  @IsNotEmpty()
  @IsString()
  total: string;
}
