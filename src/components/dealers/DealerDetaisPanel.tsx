import React, { useState } from 'react';
import './dealers.scss';
import {
  DefaultButton,
  SearchBox,
  ActionButton,
  Stack,
  Panel,
  PanelType,
  PrimaryButton,
  Text,
  Label,
  getId,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import DealerStores from './DealerStores';
import DealerList from './DealerList';
import * as dealerActions from '../../redux/actions/dealer.actions';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings,
  mergeStyleSets,
} from 'office-ui-fabric-react';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../redux/reducers/dealer.reducer';
import DealerDetails from './DealerDetails';
import AddressDetails from './address/AddressDetails';

export const DealerDetailsPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails: ToggleDealerPanelWithDetails = useSelector<
    IApplicationState,
    ToggleDealerPanelWithDetails
  >((state) => state.dealer.isOpenPanelWithDealerDetails);

  let panelContent: any = null;
  let customWidth: string = '700px';

  if (isOpenPanelWithDealerDetails) {
    if (
      isOpenPanelWithDealerDetails.componentType ===
      DealerDetilsComponents.DealerDetails
    ) {
      customWidth = '600px';
      panelContent = <DealerDetails />;
    } else if (
      isOpenPanelWithDealerDetails.componentType ===
      DealerDetilsComponents.DealerStores
    ) {
      panelContent = <DealerStores />;
    } else if (
      isOpenPanelWithDealerDetails.componentType ===
      DealerDetilsComponents.DealerAddress
    ) {
      panelContent = <AddressDetails />;
    }
  }

  return (
    <Panel
      isOpen={isOpenPanelWithDealerDetails.isOpen}
      type={PanelType.custom}
      customWidth={customWidth}
      onDismiss={() => {
        dispatch(
          dealerActions.isOpenPanelWithDealerDetails(
            new ToggleDealerPanelWithDetails()
          )
        );
      }}
    >
      {/* TODO */}
      {panelContent}
    </Panel>
  );
};

export default DealerDetailsPanel;
