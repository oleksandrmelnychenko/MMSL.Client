import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IInfoPanelMenuItem } from '../../../../../redux/slices/control.slice';
import {
  infoPanelActions,
  ICommand,
} from '../../../../../redux/slices/infoPanel.slice';
import { useHistory } from 'react-router-dom';
import { RoleType } from '../../../../../interfaces/identity';
import { IApplicationState } from '../../../../../redux/reducers';
import { renderMenuItem } from '../../../../master/DashboardLeftMenuPanel';
import { APP_ORDER_LIST } from '../../../../../common/environment/appPaths/order';

export const onDismissManageOrderOptionsPanel = () => {
  return [];
};

export const onBackFromProfileManaging = (dispatch: any, history: any) => {
  dispatch(infoPanelActions.closeInfoPanelWithComponent());
  history.push(APP_ORDER_LIST);

  onDismissManageOrderOptionsPanel().forEach((action) => {
    dispatch(action);
  });
};

const ManageOrderOptionsPanel: React.FC = () => {
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
      tooltip: 'Go back to orders',
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

export default ManageOrderOptionsPanel;
