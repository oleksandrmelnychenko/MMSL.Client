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
import CustomersOptionsPanel from './CustomersOptionsPanel';
import { useHistory } from 'react-router-dom';

export const onDismisActionsCustomerProfileOptiosPanel = () => {
  return [];
};

const CustomerProfileOptiosPanel: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

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
      isDisabled: true ? false : true,
      tooltip: 'Delete profile',
      onClickFunc: () => {
        // if (selectedCustomer) {
        //   dispatch(
        //     controlActions.toggleCommonDialogVisibility(
        //       new DialogArgs(
        //         CommonDialogType.Delete,
        //         'Delete customer',
        //         `Are you sure you want to delete ${selectedCustomer.customerName}?`,
        //         () => {
        //           if (selectedCustomer) {
        //             dispatch(
        //               assignPendingActions(
        //                 customerActions.apiDeleteCustomerById(
        //                   selectedCustomer.id
        //                 ),
        //                 [],
        //                 [],
        //                 (args: any) => {
        //                   dispatch(
        //                     customerActions.updateCustomersList(
        //                       new List(customersList)
        //                         .where(
        //                           (item) => item.id !== selectedCustomer.id
        //                         )
        //                         .toArray()
        //                     )
        //                   );
        //                   dispatch(customerActions.selectedCustomer(null));
        //                   dispatch(
        //                     controlActions.closeInfoPanelWithComponent()
        //                   );
        //                 },
        //                 (args: any) => {}
        //               )
        //             );
        //           }
        //         },
        //         () => {}
        //       )
        //     )
        //   );
        // }
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
