import React, { useEffect } from 'react';
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
import { rightPanelActions } from '../../../redux/slices/rightPanel.slice';
import ManageDealerForm from '../managing/dealerManaging/ManageDealerForm';

const DealerOptions: React.FC = () => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails = useSelector<
    IApplicationState,
    ToggleDealerPanelWithDetails
  >((state) => state.dealer.isOpenPanelWithDealerDetails);

  useEffect(() => {
    return () => {
      dispatch(dealerActions.setSelectedDealer(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          rightPanelActions.openRightPanel({
            title: 'Edit dealer',
            width: '600px',
            closeFunctions: () => {
              dispatch(rightPanelActions.closeRightPanel());
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

  return (
    <div className="management">
      {menuItem.map((item, index) => (
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
              if (
                item.componentType === DealerDetilsComponents.DealerDetails ||
                item.componentType === DealerDetilsComponents.DealerProducts
              ) {
                if (item.onClickAction) item.onClickAction();
              } else {
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

export default DealerOptions;
