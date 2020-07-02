import './customers.scss';
import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import CustomerList from './CustomerList';
import CustomersHeader from './CustomersHeader';

export const Customers: React.FC = (props: any) => {
  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <CustomersHeader />
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <CustomerList />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default Customers;
