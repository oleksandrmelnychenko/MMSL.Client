import { StoreCustomer, Address, IStore } from '../../../interfaces';

export class CreateStoreCustomerFormInitValues {
  constructor() {
    this.userName = '';
    this.customerName = '';
    this.email = '';
    this.phoneNumber = '';
    this.birthDate = '1989-05-11T21:00:00.000Z';
    this.store = null;
    //   TODO
    //   storeId: number | null;
    //   store: IStore | null;
  }

  userName: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  store: IStore | null;
  //   TODO
  //   storeId: number | null;
  //   store: IStore | null;
}

export const buildNewStoreCustomerAccount = (
  values: any,
  sourceEntity?: StoreCustomer
) => {
  let newAccount: StoreCustomer;

  if (sourceEntity) {
    newAccount = { ...sourceEntity };
  } else {
    newAccount = new StoreCustomer();
    newAccount.billingAddress = new Address();
    newAccount.billingAddressId = newAccount.billingAddress.id;
    newAccount.deliveryAddress = new Address();
    newAccount.deliveryAddressId = newAccount.deliveryAddress.id;
  }

  newAccount.userName = values.userName;
  newAccount.customerName = values.customerName;
  newAccount.email = values.email;
  newAccount.phoneNumber = values.phoneNumber;
  newAccount.birthDate = values.birthDate;
  newAccount.store = values.store;
  newAccount.storeId = newAccount.store?.id;

  debugger;
  //   TODO
  //   storeId: number | null;
  //   store: IStore | null;

  return newAccount;
};

export const initDefaultValuesForNewStoreCustomerForm = (
  sourceEntity?: StoreCustomer | null
) => {
  const initValues = new CreateStoreCustomerFormInitValues();

  if (sourceEntity) {
    initValues.userName = sourceEntity.userName;
    initValues.customerName = sourceEntity.customerName;
    initValues.email = sourceEntity.email;
    initValues.phoneNumber = sourceEntity.phoneNumber;
    initValues.birthDate = sourceEntity.birthDate;
    initValues.store = sourceEntity.store;

    //   TODO
    //   storeId: number | null;
    //   store: IStore | null;
  }

  return initValues;
};
