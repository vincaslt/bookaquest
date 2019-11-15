import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDetailsDTO {
  @IsNotEmpty()
  @IsString()
  paymentClientKey: string;

  @IsNotEmpty()
  @IsString()
  paymentSecretKey: string;
}
