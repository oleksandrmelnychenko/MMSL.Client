import React from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';

import * as dealerAction from '../../../redux/actions/dealer.actions';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/reducers/dealer.reducer';
import { useDispatch } from 'react-redux';
import './management-options.scss';

const ManagementOptions: React.FC = () => {
  const dispatch = useDispatch();

  const btnStyle = {
    root: {
      minWidth: '90px',
      width: '90px',
      height: '90px',
      paddingRight: '0px',
      border: 'none',
      rootHovered: {
        border: 'none',
      },
    },
  };

  const labelStyle = {
    root: {
      width: '90px',
      fontSize: '14px',
      textAlign: 'center',
      'font-weight': 400,
      cursor: 'pointer',
      transition: 'all 0.3s ease',

      selectors: {
        '&:hover': {
          background: '#faf9f8',
          textDecoration: 'underline',
        },
      },
    },
  };
  return (
    <div className="dealer__management">
      <Label styles={labelStyle}>
        <PrimaryButton
          styles={btnStyle}
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
          styles={btnStyle}
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
          styles={btnStyle}
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
        Address
      </Label>
      <Label styles={labelStyle}>
        <PrimaryButton
          styles={btnStyle}
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
        Customer
      </Label>
    </div>
  );
};

export default ManagementOptions;
