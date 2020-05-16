import { StoreCustomer, Address, IStore } from '../../../interfaces';

export class CreateStoreCustomerFormInitValues {
  constructor() {
    this.userName = '';
    this.customerName = '';
    this.email = '';
    this.phoneNumber = '';
    this.birthDate = '1989-05-11T21:00:00.000Z';
    this.storeId = '';
    //   TODO
    //   storeId: number | null;
    //   store: IStore | null;
  }

  userName: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  storeId: string;
  //   TODO
  //   storeId: number | null;
  //   store: IStore | null;
}

export const buildNewStoreCustomerAccount = (
  values: any,
  sourceEntity?: StoreCustomer
) => {
  debugger;

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
  newAccount.useBillingAsDeliveryAddress = values.useBillingAsDeliveryAddress;

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
    initValues.storeId = `${sourceEntity.storeId}`;

    //   TODO
    //   storeId: number | null;
    //   store: IStore | null;
  }

  return initValues;
};
