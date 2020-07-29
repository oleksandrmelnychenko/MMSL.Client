import React from 'react';
import NewMeetToMeasureOrder from './NewMeetToMeasureOrder';
import { controlActions } from '../../../../../redux/slices/control.slice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as orderPaths from '../../../../../common/environment/appPaths/order';
import ManageProfileOptiosPanel from '../../../../customers/options/ManageProfileOptiosPanel';

export const NewMTMOrderBootstrapper: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const history = useHistory();

  dispatch(
    controlActions.openInfoPanelWithComponent({
      component: ManageProfileOptiosPanel,
      onDismisPendingAction: () => {
        history.push(orderPaths.APP_ORDER_LIST);
      },
    })
  );

  return <NewMeetToMeasureOrder />;
};

export default NewMTMOrderBootstrapper;
