import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './status-bar.scss';

import * as controlAction from '../../redux/actions/control.actions';
import { IApplicationState } from '../../redux/reducers';

export interface IStatusBarProps {
  activateStatusBar?: boolean;
  message?: string;
}

export const StatusBar: React.FC<IStatusBarProps> = () => {
  const dispatch = useDispatch();
  const message = useSelector<IApplicationState, string>(
    (state) => state.control.infoMessage
  );

  const activateStatusBar = useSelector<IApplicationState, boolean>(
    (state) => state.control.isActivateStatusBar
  );

  const delayDisplayMessage = () => {
    if (message !== '') {
      setTimeout(() => {
        dispatch(controlAction.clearInfoMessage());
      }, 2200);
    }
  };
  message && delayDisplayMessage();

  return (
    <>
      <div className={`status-bar ${activateStatusBar && 'active'}`}></div>
      <div className={`status-message ${message && 'active'}`}>{message}</div>
    </>
  );
};

export default StatusBar;
