import React from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { useDispatch } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import { CUSTOMERS_PATH } from '../CustomersBootstrapper';
import { useHistory } from 'react-router-dom';
import CustomerProfileOptiosPanel, {
  onDismisActionsCustomerProfileOptiosPanel,
} from './CustomerProfileOptiosPanel';
import { profileManagingActions } from '../../../redux/slices/customer/orderProfile/profileManaging.slice';

export const onDismissManageProfileOptiosPanel = () => {
  return [profileManagingActions.stopManaging()];
};

const ManageProfileOptiosPanel: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const menuItem: IInfoPanelMenuItem[] = [
    {
      title: 'Back',
      className: 'management__btn-back_measurement',
      isDisabled: false,
      tooltip: 'Go back to customers',
      onClickFunc: () => {
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
      },
    },
  ];

  return (
    <div className="management">
      {menuItem.map((item, index) => (
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
      ))}
    </div>
  );
};

export default ManageProfileOptiosPanel;
