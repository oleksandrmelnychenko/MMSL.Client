import React from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';

import { customerActions } from '../../../redux/slices/customer.slice';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/slices/dealer.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import { ImenuItem, StoreCustomer } from '../../../interfaces';
import {
  controlActions,
  RightPanelProps,
} from '../../../redux/slices/control.slice';
import ManageCustomerForm from '../../customers/customerManaging/ManageCustomerForm';

const ManagementPanel: React.FC = () => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails = useSelector<
    IApplicationState,
    ToggleDealerPanelWithDetails
  >((state) => state.dealer.isOpenPanelWithDealerDetails);

  const menuItem: ImenuItem[] = [
    {
      title: 'Details',
      className: 'management__btn-detail',
      componentType: DealerDetilsComponents.DealerDetails,
      isSelected: false,
    },
  ];

  const selectedCustomer = useSelector<IApplicationState, StoreCustomer | null>(
    (state) => state.customer.customerState.selectedCustomer
  );

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={`${
            item.isSelected && isOpenPanelWithDealerDetails ? 'selected' : ''
          }`}>
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              dispatch(
                controlActions.openRightPanel({
                  title: `Customer: ${selectedCustomer!.userName}`,
                  width: '400px',
                  closeFunctions: () => {
                    dispatch(controlActions.closeRightPanel());
                    dispatch(customerActions.selectedCustomer(null));
                  },
                  component: ManageCustomerForm,
                })
              );
            }}
            allowDisabledFocus
          />
          {item.title}
        </Label>
      ))}
    </div>
  );
};

export default ManagementPanel;
