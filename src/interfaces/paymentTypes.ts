import { EntityBase } from './base';

export class PaymentTypeF extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

export enum PaymentType {
  BankTransfer = 2,
  Cash = 1,
}
