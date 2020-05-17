import React, { useState } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';

import * as dealerAction from '../../../redux/actions/dealer.actions';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/reducers/dealer.reducer';
import { useDispatch, useSelector } from 'react-redux';
import './management-options.scss';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';

interface ImenuItem {
  id: number;
  title: string;
  className: string;
  componentType: DealerDetilsComponents;
  isSelected: boolean;
}

const ManagementOptions: React.FC = () => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails = useSelector<IApplicationState, boolean>(
    (state) => state.dealer.isOpenPanelWithDealerDetails.isOpen
  );

  const menuItem: ImenuItem[] = [
    {
      id: 0,
      title: 'Stores',
      className: 'dealer__management__btn-add',
      componentType: DealerDetilsComponents.DealerStores,
      isSelected: false,
    },
    {
      id: 1,
      title: 'Details',
      className: 'dealer__management__btn-detail',
      componentType: DealerDetilsComponents.DealerDetails,
      isSelected: false,
    },
    {
      id: 2,
      title: 'Address',
      className: 'dealer__management__btn-address',
      componentType: DealerDetilsComponents.DealerAddress,
      isSelected: false,
    },
    {
      id: 3,
      title: 'Customer',
      className: 'dealer__management__btn-customer',
      componentType: DealerDetilsComponents.DealerStores,
      isSelected: false,
    },
  ];

  const [menu, setMenu] = useState(menuItem);
  const changeSelectedMenuItem = (id: number) => {
    const updateMenu = menu.map((item) => {
      item.isSelected = false;
      if (item.id === id) {
        item.isSelected = true;
      }
      return item;
    });
    setMenu(updateMenu);
  };

  return (
    <div className="dealer__management">
      {menu.map((item) => (
        <Label
          key={item.id}
          styles={labelStyle}
          className={`${
            item.isSelected && isOpenPanelWithDealerDetails ? 'selected' : ''
          }`}
        >
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              changeSelectedMenuItem(item.id);
              const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
              openDetailsArgs.isOpen = true;
              openDetailsArgs.componentType = item.componentType;

              dispatch(
                dealerAction.isOpenPanelWithDealerDetails(openDetailsArgs)
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

export default ManagementOptions;
