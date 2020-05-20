import React, { useState } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';

import * as customerActions from '../../../redux/actions/customer.actions';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/reducers/dealer.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import { ImenuItem } from '../../../interfaces';

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

  const [menu, setMenu] = useState(menuItem);
  // const changeSelectedMenuItem = (componentType: number) => {
  //   const updateMenu = menu.map((item) => {
  //     item.isSelected = false;
  //     if (item.componentType === componentType) {
  //       item.isSelected = true;
  //     }
  //     return item;
  //   });

  //   setMenu(updateMenu);
  // };

  return (
    <div className="management">
      {menu.map((item, index) => (
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
              dispatch(customerActions.toggleCustomerForm(true));
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
