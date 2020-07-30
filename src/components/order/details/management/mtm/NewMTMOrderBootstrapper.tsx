import React from 'react';
import NewMeetToMeasureOrder from './NewMeetToMeasureOrder';
import { infoPanelActions } from '../../../../../redux/slices/infoPanel.slice';
import { useDispatch } from 'react-redux';
import ManageProfileOptiosPanel from '../../../../customers/options/ManageProfileOptiosPanel';
import { onDismissManageOrderOptionsPanel } from '../../../options/details/management/ManageOrderOptionsPanel';

export const NewMTMOrderBootstrapper: React.FC = (props: any) => {
  const dispatch = useDispatch();

  // dispatch(
  //   infoPanelActions.openInfoPanelWithComponent({
  //     component: ManageProfileOptiosPanel,
  //     onDismisPendingAction: () => {
  //       onDismissManageOrderOptionsPanel().forEach((action) =>
  //         dispatch(action)
  //       );
  //     },
  //   })
  // );

  return <NewMeetToMeasureOrder />;
};

export default NewMTMOrderBootstrapper;
