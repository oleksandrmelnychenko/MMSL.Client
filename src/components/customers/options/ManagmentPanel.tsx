import React from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import { customerActions } from '../../../redux/slices/customer.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import { StoreCustomer } from '../../../interfaces/storeCustomer';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import ManageCustomerForm from '../../customers/customerManaging/ManageCustomerForm';

const ManagementPanel: React.FC = () => {
  const dispatch = useDispatch();

  const targetCustomer = useSelector<
    IApplicationState,
    StoreCustomer | null | undefined
  >((state) => state.customer.customerState.selectedCustomer);

  const menuItem: IInfoPanelMenuItem[] = [
    {
      title: 'Details',
      className: 'management__btn-detail',
      isDisabled: targetCustomer ? false : true,
      tooltip: '',
      onClickFunc: () => {
        if (targetCustomer) {
          dispatch(
            controlActions.openRightPanel({
              title: `Customer: ${targetCustomer!.userName}`,
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
                dispatch(customerActions.selectedCustomer(null));
              },
              component: ManageCustomerForm,
            })
          );
        }
      },
    },
  ];

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={false ? 'selected' : ''}
        >
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => item.onClickFunc()}
            allowDisabledFocus
          />
          {item.title}
        </Label>
      ))}
    </div>
  );
};

export default ManagementPanel;
