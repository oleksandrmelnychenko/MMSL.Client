import React from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import {
  controlActions,
  IInfoPanelMenuItem,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { CUSTOMERS_PATH } from '../CustomersBootstrapper';
import CustomersOptionsPanel from './CustomersOptionsPanel';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers';
import { CustomerProductProfile } from '../../../interfaces/orderProfile';
import { assignPendingActions } from '../../../helpers/action.helper';
import { orderProfileActions } from '../../../redux/slices/customer/orderProfile/orderProfile.slice';
import { List } from 'linq-typescript';

export const onDismisActionsCustomerProfileOptiosPanel = () => {
  return [];
};

const CustomerProfileOptiosPanel: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { targetOrderProfile, orderProfiles } = useSelector<
    IApplicationState,
    any
  >((state) => state.orderProfile);

  const menuItem: IInfoPanelMenuItem[] = [
    {
      title: 'Back',
      className: 'management__btn-back_measurement',
      isDisabled: false,
      tooltip: 'Go back to customers',
      onClickFunc: () => {
        history.push(CUSTOMERS_PATH);
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: CustomersOptionsPanel,
            onDismisPendingAction: () => {},
          })
        );

        onDismisActionsCustomerProfileOptiosPanel().forEach((action) => {
          dispatch(action);
        });
      },
    },
    {
      title: 'Delete',
      className: false
        ? 'management__btn-delete_measurement'
        : 'management__btn-delete_measurement management__btn-disabled',
      isDisabled: targetOrderProfile ? false : true,
      tooltip: 'Delete profile',
      onClickFunc: () => {
        if (targetOrderProfile) {
          dispatch(
            controlActions.toggleCommonDialogVisibility(
              new DialogArgs(
                CommonDialogType.Delete,
                'Delete profile',
                `Are you sure you want to delete ${targetOrderProfile.name}?`,
                () => {
                  if (targetOrderProfile) {
                    dispatch(
                      assignPendingActions(
                        orderProfileActions.apiDeleteOrderProfileById(
                          targetOrderProfile.id
                        ),
                        [],
                        [],
                        (args: any) => {
                          dispatch(
                            orderProfileActions.changeOrderProfiles(
                              new List<CustomerProductProfile>(orderProfiles)
                                .where(
                                  (orderProfiles) =>
                                    targetOrderProfile.id !== args.body.id
                                )
                                .toArray()
                            )
                          );
                          if (
                            targetOrderProfile &&
                            targetOrderProfile.id === args.body.id
                          )
                            dispatch(
                              orderProfileActions.changeTargetOrderProfile(null)
                            );
                        },
                        (args: any) => {}
                      )
                    );
                  }
                },
                () => {}
              )
            )
          );
        }
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

export default CustomerProfileOptiosPanel;
