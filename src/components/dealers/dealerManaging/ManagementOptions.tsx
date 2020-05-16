import React from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';

import * as dealerAction from '../../../redux/actions/dealer.actions';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/reducers/dealer.reducer';
import { useDispatch } from 'react-redux';
import './management-options.scss';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';

const ManagementOptions: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="dealer__management">
      <Label styles={labelStyle}>
        <PrimaryButton
          styles={btnMenuStyle}
          className="dealer__management__btn-add"
          onClick={() => {
            const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
            openDetailsArgs.isOpen = true;
            openDetailsArgs.componentType = DealerDetilsComponents.DealerStores;

            dispatch(
              dealerAction.isOpenPanelWithDealerDetails(openDetailsArgs)
            );
          }}
          allowDisabledFocus
        />
        Stores
      </Label>
      <Label styles={labelStyle}>
        <PrimaryButton
          className="dealer__management__btn-detail"
          styles={btnMenuStyle}
          onClick={() => {
            const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
            openDetailsArgs.isOpen = true;
            openDetailsArgs.componentType =
              DealerDetilsComponents.DealerDetails;

            dispatch(
              dealerAction.isOpenPanelWithDealerDetails(openDetailsArgs)
            );
          }}
          allowDisabledFocus
        />
        Details
      </Label>
      <Label styles={labelStyle}>
        <PrimaryButton
          styles={btnMenuStyle}
          className="dealer__management__btn-address"
          onClick={() => {
            const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
            openDetailsArgs.isOpen = true;
            openDetailsArgs.componentType =
              DealerDetilsComponents.DealerAddress;

            dispatch(
              dealerAction.isOpenPanelWithDealerDetails(openDetailsArgs)
            );
          }}
          allowDisabledFocus
        />
        Address
      </Label>
      <Label styles={labelStyle}>
        <PrimaryButton
          styles={btnMenuStyle}
          className="dealer__management__btn-customer"
          onClick={() => {
            // const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
            // openDetailsArgs.isOpen = true;
            // openDetailsArgs.componentType = DealerDetilsComponents.DealerStores;
            // dispatch(
            //   dealerAction.isOpenPanelWithDealerDetails(openDetailsArgs)
            // );
          }}
          allowDisabledFocus
        />
        Customer
      </Label>
    </div>
  );
};

export default ManagementOptions;
