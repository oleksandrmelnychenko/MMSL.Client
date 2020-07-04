import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import { CUSTOMERS_PATH } from '../CustomersBootstrapper';
import { useHistory } from 'react-router-dom';
import CustomerProfileOptiosPanel, {
  onDismisActionsCustomerProfileOptiosPanel,
} from './CustomerProfileOptiosPanel';
import {
  profileManagingActions,
  ICommand,
} from '../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { IApplicationState } from '../../../redux/reducers';
import { RoleType } from '../../../interfaces/identity';

import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';

export const onDismissManageProfileOptiosPanel = () => {
  return [profileManagingActions.stopManaging()];
};

export const onBackFromProfileManaging = (dispatch: any, history: any) => {
  dispatch(
    controlActions.openInfoPanelWithComponent({
      component: CustomerProfileOptiosPanel,
      onDismisPendingAction: () => {
        history.push(CUSTOMERS_PATH);
        onDismisActionsCustomerProfileOptiosPanel().forEach((action) => {
          dispatch(action);
        });
      },
    })
  );

  onDismissManageProfileOptiosPanel().forEach((action) => {
    dispatch(action);
  });
};

const ManageProfileOptiosPanel: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const commands: ICommand[] = useSelector<IApplicationState, ICommand[]>(
    (state) => state.profileManaging.commands
  );

  const menuItem: IInfoPanelMenuItem[] = [
    {
      allowedRoles: [
        RoleType.Administrator,
        RoleType.Manufacturer,
        RoleType.Dealer,
      ],
      title: 'Back',
      className: 'management__btn-back_measurement',
      isDisabled: false,
      tooltip: 'Go back to customers',
      onClickFunc: () => {
        onBackFromProfileManaging(dispatch, history);
      },
    },
  ];

  commands.forEach((command: ICommand) => {
    menuItem.push({
      allowedRoles: [RoleType.Dealer],
      title: command.name,
      className: command.className,
      isDisabled: command.isDisabled,
      tooltip: '',
      onClickFunc: () => command.onClick(),
    });
  });

  return <>{renderMenuItem(menuItem)}</>;
};

export default ManageProfileOptiosPanel;
