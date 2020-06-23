import React from 'react';
import { useSelector } from 'react-redux';

import './status-bar.scss';

import { IApplicationState } from '../../redux/reducers';
import { InfoMessage, InfoMessageType } from '../../redux/slices/control.slice';

export interface IStatusBarProps {
  activateStatusBar?: boolean;
  message?: string;
}

export const StatusBar: React.FC<IStatusBarProps> = () => {
  const message: InfoMessage | null | undefined = useSelector<
    IApplicationState,
    InfoMessage | null | undefined
  >((state) => state.control.infoMessage);

  const activateStatusBar = useSelector<IApplicationState, boolean>(
    (state) => state.control.isActivateStatusBar
  );

  return (
    <>
      {message ? (
        <>
          <div className={`status-bar ${activateStatusBar && 'active'}`}></div>
          <div
            className={`status-message ${message && 'active'} ${
              message.messageType === InfoMessageType.Warning && 'warning'
            }`}
          >
            {message.message}
          </div>
        </>
      ) : null}
    </>
  );
};

export default StatusBar;
