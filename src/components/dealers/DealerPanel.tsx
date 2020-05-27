import React, { useEffect } from 'react';
import './dealers.scss';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import DealerStores from './store/DealerStores';
import { dealerActions } from '../../redux/slices/dealer.slice';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../redux/slices/dealer.slice';
import DealerDetails from './DealerDetails';
import AddressDetails from './address/AddressDetails';
import DealerCustomers from './customer/DealerCustomers';
import { panelStyle } from '../../common/fabric-styles/styles';

export const DealerPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails: ToggleDealerPanelWithDetails = useSelector<
    IApplicationState,
    ToggleDealerPanelWithDetails
  >((state) => state.dealer.isOpenPanelWithDealerDetails);

  let panelContent: any = null;
  let customWidth: string = '700px';

  useEffect(() => {
    if (isOpenPanelWithDealerDetails && !isOpenPanelWithDealerDetails.isOpen) {
      dispatch(dealerActions.setDealerStores([]));
      dispatch(dealerActions.updateTargetStoreCustomersList([]));
    }
  }, [isOpenPanelWithDealerDetails, dispatch]);

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
    } else if (
      isOpenPanelWithDealerDetails.componentType ===
      DealerDetilsComponents.DealerCustomers
    ) {
      customWidth = '1200px';
      panelContent = <DealerCustomers />;
    } else {
      panelContent = null;
    }
  }

  return (
    <Panel
      onOuterClick={() => {}}
      styles={panelStyle}
      isOpen={isOpenPanelWithDealerDetails.isOpen}
      type={PanelType.custom}
      customWidth={customWidth}
      onDismiss={(ev) => {
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

export default DealerPanel;
