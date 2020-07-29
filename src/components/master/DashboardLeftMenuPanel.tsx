import React from 'react';
import './dashboard.scss';
import { useLocation, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import {
  Panel,
  PanelType,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  Label,
  PrimaryButton,
} from 'office-ui-fabric-react';
import { IInfoPanelMenuItem } from '../../redux/slices/control.slice';
import {
  infoPanelActions,
  IInfoPanelState,
} from '../../redux/slices/infoPanel.slice';
import {
  stylesPanelInfo,
  labelStyle,
  btnMenuStyle,
} from '../../common/fabric-styles/styles';
import { List } from 'linq-typescript';
import { TokenHelper } from '../../helpers/token.helper';
import { RoleType } from '../../interfaces/identity';

export const renderMenuItem = (menuItem: IInfoPanelMenuItem[]) => {
  let renderResult: any = null;

  if (menuItem && menuItem.length > 0) {
    const rolesList = new List(TokenHelper.extractRolesFromJWT());
    renderResult = (
      <div className="management">
        {menuItem.map((item, index) => {
          let mapResult: any = null;

          if (
            new List(item.allowedRoles).any((allowedRole: RoleType) =>
              rolesList.contains(RoleType[allowedRole])
            )
          )
            mapResult = (
              <TooltipHost
                key={index}
                id={`{${index}__optionTooltip}`}
                calloutProps={{ gapSpace: 0 }}
                delay={TooltipDelay.zero}
                directionalHint={DirectionalHint.rightCenter}
                styles={{ root: { display: 'inline-block' } }}
                content={(item as any).tooltip}
              >
                <Label
                  key={index}
                  styles={labelStyle}
                  className={false ? 'selected' : ''}
                >
                  <PrimaryButton
                    styles={btnMenuStyle}
                    className={item.className}
                    onClick={() => item.onClickFunc()}
                    allowDisabledFocus
                  />
                  {item.title}
                </Label>
              </TooltipHost>
            );

          return mapResult;
        })}
      </div>
    );
  }

  return renderResult;
};

const DashboardLeftMenuPanel: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const panelInfo: IInfoPanelState = useSelector<
    IApplicationState,
    IInfoPanelState
  >((state) => state.infoPanel);

  const dismissPanelInfo = () => {
    if (panelInfo.onDismisPendingAction) {
      panelInfo.onDismisPendingAction();
    }

    dispatch(infoPanelActions.closeInfoPanelWithComponent());
  };

  return (
    <>
      <Panel
        type={PanelType.smallFixedNear}
        isBlocking={false}
        hasCloseButton={panelInfo.hasCloseButton}
        styles={stylesPanelInfo}
        isOpen={panelInfo.isOpenPanelInfo}
        onDismiss={(args: any) => {
          if (args && args?.key === 'Escape') {
          } else {
            dismissPanelInfo();
          }
        }}
      >
        <Route
          path={location.pathname}
          component={panelInfo.componentInPanelInfo}
        />
      </Panel>
    </>
  );
};

export default DashboardLeftMenuPanel;
