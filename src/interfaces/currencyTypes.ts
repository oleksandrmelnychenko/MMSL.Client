import { EntityBase } from './base';

export class CurrencyF extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

export enum Currency {
  USD = 2,
  EUR = 1,
}
