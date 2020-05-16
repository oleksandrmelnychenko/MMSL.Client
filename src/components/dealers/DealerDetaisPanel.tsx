import React from 'react';
import './dealers.scss';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import DealerStores from './store/DealerStores';
import * as dealerActions from '../../redux/actions/dealer.actions';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../redux/reducers/dealer.reducer';
import DealerDetails from './DealerDetails';
import AddressDetails from './address/AddressDetails';
import PanelFooter from './panel/PanelFooter';
import { panelStyle } from '../../common/fabric-styles/styles';

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
      customWidth = '800px';
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
      styles={panelStyle}
      isOpen={isOpenPanelWithDealerDetails.isOpen}
      type={PanelType.custom}
      customWidth={customWidth}
      onDismiss={(ev) => {
        debugger;
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
