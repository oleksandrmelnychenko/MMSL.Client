import React from 'react';
import './dealers.scss';
import { DefaultButton, Panel, PanelType } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import DealerStores from './store/DealerStores';
import * as dealerActions from '../../redux/actions/dealer.actions';

import { useConstCallback } from '@uifabric/react-hooks';
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

  const onRenderFooterContent = useConstCallback(() => (
    <div>
      <DefaultButton onClick={() => {}}>Save</DefaultButton>
    </div>
  ));

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
      }}>
      {/* TODO */}
      {panelContent}
    </Panel>
  );
};

export default DealerDetailsPanel;
