import { EntityBaseNamed } from './base';

export class CurrencyType extends EntityBaseNamed {
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
