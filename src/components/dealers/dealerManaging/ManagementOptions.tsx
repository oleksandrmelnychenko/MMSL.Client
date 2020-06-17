import React, { useState, useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/slices/dealer.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import { ImenuItem } from '../../../interfaces';
import { controlActions } from '../../../redux/slices/control.slice';
import ManageDealerForm from './ManageDealerForm';
import { dealerAccountActions } from '../../../redux/slices/dealerAccount.slice';

const ManagementOptions: React.FC = () => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails = useSelector<
    IApplicationState,
    ToggleDealerPanelWithDetails
  >((state) => state.dealer.isOpenPanelWithDealerDetails);

  const menuItem: ImenuItem[] = [
    {
      title: 'Stores',
      className: 'management__btn-add',
      componentType: DealerDetilsComponents.DealerStores,
      onClickAction: () => {},
      isSelected: false,
    },
    {
      title: 'Details',
      className: 'management__btn-detail',
      componentType: DealerDetilsComponents.DealerDetails,
      onClickAction: () => {
        dispatch(
          controlActions.openRightPanel({
            title: 'Edit dealer',
            width: '600px',
            closeFunctions: () => {
              dispatch(controlActions.closeRightPanel());
            },
            component: ManageDealerForm,
          })
        );
      },
      isSelected: false,
    },
    {
      title: 'Address',
      className: 'management__btn-address',
      componentType: DealerDetilsComponents.DealerAddress,
      onClickAction: () => {},
      isSelected: false,
    },
    {
      title: 'Customer',
      className: 'management__btn-customer',
      componentType: DealerDetilsComponents.DealerCustomers,
      onClickAction: () => {},
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
    return () => {
      dispatch(dealerAccountActions.changeTargetDealer(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    changeSelectedMenuItem(isOpenPanelWithDealerDetails.componentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenPanelWithDealerDetails]);

  return (
    <div className="management">
      {menu.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={`${
            item.isSelected && isOpenPanelWithDealerDetails ? 'selected' : ''
          }`}
        >
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              if (item.componentType === DealerDetilsComponents.DealerDetails) {
                if (item.onClickAction) item.onClickAction();
              } else {
                changeSelectedMenuItem(item.componentType);
                const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
                openDetailsArgs.isOpen = true;
                openDetailsArgs.componentType = item.componentType;

                dispatch(
                  dealerActions.isOpenPanelWithDealerDetails(openDetailsArgs)
                );
              }
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
