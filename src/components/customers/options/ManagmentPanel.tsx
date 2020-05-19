import React, { useState, useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';

import * as dealerAction from '../../../redux/actions/dealer.actions';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/reducers/dealer.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';

interface ImenuItem {
  id: number;
  title: string;
  className: string;
  componentType: DealerDetilsComponents;
  isSelected: boolean;
}

const ManagementPanel: React.FC = () => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails = useSelector<
    IApplicationState,
    ToggleDealerPanelWithDetails
  >((state) => state.dealer.isOpenPanelWithDealerDetails);

  const menuItem: ImenuItem[] = [
    {
      id: 0,
      title: 'Stores',
      className: 'management__btn-add',
      componentType: DealerDetilsComponents.DealerStores,
      isSelected: false,
    },
    {
      id: 1,
      title: 'Details',
      className: 'management__btn-detail',
      componentType: DealerDetilsComponents.DealerDetails,
      isSelected: false,
    },
  ];

  const [menu, setMenu] = useState(menuItem);
  const changeSelectedMenuItem = (componentType: number) => {
    const updateMenu = menu.map((item) => {
      item.isSelected = false;
      if (item.componentType === componentType) {
        item.isSelected = true;
      }
      return item;
    });

    setMenu(updateMenu);
  };

  useEffect(() => {
    changeSelectedMenuItem(isOpenPanelWithDealerDetails.componentType);
  }, [isOpenPanelWithDealerDetails]);

  return (
    <div className="management">
      {menu.map((item) => (
        <Label
          key={item.id}
          styles={labelStyle}
          className={`${
            item.isSelected && isOpenPanelWithDealerDetails ? 'selected' : ''
          }`}>
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              changeSelectedMenuItem(item.componentType);
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

export default ManagementPanel;
