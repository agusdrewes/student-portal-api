import { IsString, IsNumberString, Matches } from 'class-validator';

export class DepositDto {
  @IsNumberString()
  amount: string;

  @Matches(/^\d{16}$/, { message: 'Card number must have 16 digits' })
  cardNumber: string;

  @Matches(/^(0[1-9]|1[0-2])\/(\d{2})$/, { message: 'Expiration must be MM/YY' })
  expiration: string;

  @Matches(/^\d{3,4}$/, { message: 'CVV must be 3 or 4 digits' })
  cvv: string;
}
