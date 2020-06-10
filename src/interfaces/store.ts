import { Address, IAddress } from './addresses';

export interface IStore {
  address: Address;
  addressId?: number;
  billingEmail: string;
  contactEmail: string;
  description?: string;
  id?: number;
  isDeleted?: boolean;
  name: string;
  storeCustomersCount?: number;
}

export interface INewStore {
  name: string;
  dealerAccountId: number | null;
  addressId?: number;
  address: IAddress;
  billingEmail: string;
  contactEmail: string;
}
