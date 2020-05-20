import React from 'react';
import { useSelector } from 'react-redux';

import './status-bar.scss';

import { IApplicationState } from '../../redux/reducers';

export interface IStatusBarProps {
  activateStatusBar?: boolean;
  message?: string;
}

export const StatusBar: React.FC<IStatusBarProps> = () => {
  const message = useSelector<IApplicationState, string>(
    (state) => state.control.infoMessage
  );

  const activateStatusBar = useSelector<IApplicationState, boolean>(
    (state) => state.control.isActivateStatusBar
  );

  return (
    <>
      <div className={`status-bar ${activateStatusBar && 'active'}`}></div>
      <div className={`status-message ${message && 'active'}`}>{message}</div>
    </>
  );
};

export default StatusBar;
