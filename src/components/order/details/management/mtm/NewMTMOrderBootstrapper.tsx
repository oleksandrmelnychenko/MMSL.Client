import React, { useEffect } from 'react';
import NewMeetToMeasureOrder from './NewMeetToMeasureOrder';
import { infoPanelActions } from '../../../../../redux/slices/infoPanel.slice';
import { useDispatch } from 'react-redux';
import ManageOrderOptionsPanel, {
  onDismissManageOrderOptionsPanel,
} from '../../../options/details/management/ManageOrderOptionsPanel';

export const NewMTMOrderBootstrapper: React.FC = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      infoPanelActions.openInfoPanelWithComponent({
        component: ManageOrderOptionsPanel,
        onDismisPendingAction: () => {
          onDismissManageOrderOptionsPanel().forEach((action) =>
            dispatch(action)
          );
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <NewMeetToMeasureOrder />;
};

export default NewMTMOrderBootstrapper;
