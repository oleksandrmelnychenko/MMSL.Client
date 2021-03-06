import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IInfoPanelMenuItem } from '../../../redux/slices/control.slice';
import {
  infoPanelActions,
  ICommand,
} from '../../../redux/slices/infoPanel.slice';
import { useHistory } from 'react-router-dom';
import CustomerProfileOptiosPanel, {
  onDismisActionsCustomerProfileOptiosPanel,
} from './CustomerProfileOptiosPanel';
import { profileManagingActions } from '../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { IApplicationState } from '../../../redux/reducers';
import { RoleType } from '../../../interfaces/identity';

import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';
import { CUSTOMERS_PATH } from '../../../common/environment/appPaths';

export const onDismissManageProfileOptiosPanel = () => {
  return [profileManagingActions.stopManaging()];
};

export const onBackFromProfileManaging = (dispatch: any, history: any) => {
  dispatch(
    infoPanelActions.openInfoPanelWithComponent({
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
    (state) => state.infoPanel.commands
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
      className: command.isDisabled
        ? `${command.className} management__btn-disabled`
        : command.className,
      isDisabled: command.isDisabled,
      tooltip: '',
      onClickFunc: () => command.onClick(),
    });
  });

  return <>{renderMenuItem(menuItem)}</>;
};

export default ManageProfileOptiosPanel;
