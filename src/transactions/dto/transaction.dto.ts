export class CoreTransactionDto {
    uuid: string;
    from_wallet_uuid: string;
    to_wallet_uuid: string;
    amount: string;
    currency: string;
    type: string;
    description: string;
    processed_at: string;
  }
  