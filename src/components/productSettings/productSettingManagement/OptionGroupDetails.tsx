import React, { useEffect, useState, Children } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Text,
  Selection,
  Stack,
  IconButton,
  MarqueeSelection,
  IDetailsHeaderProps,
  IRenderFunction,
  DetailsHeader,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import * as customerActions from '../../../redux/actions/customer.actions';
import * as controlActions from '../../../redux/actions/control.actions';
import { assignPendingActions } from '../../../helpers/action.helper';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../../redux/reducers/productSettings.reducer';
import { OptionGroup, OptionUnit } from '../../../interfaces';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

export const OptionGroupDetails: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        /// TODO: important
        // if (selection.count > 0) {
        //   dealerSelection();
        // } else {
        //   dealerUnSelection();
        // }
      },
    })
  );

  const outionUnits: OptionUnit[] = useSelector<
    IApplicationState,
    OptionUnit[]
  >((state) => state.productSettings.managingOptionUnitsState.optionUnits);

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
  }, [dispatch]);

  const customerColumns: IColumn[] = [
    {
      key: 'index',
      name: '#',
      minWidth: 16,
      maxWidth: 24,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        return (
          <Text>{index !== null && index !== undefined ? index + 1 : -1}</Text>
        );
      },
    },
    {
      key: 'value',
      name: 'Value',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.value}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'isAllowed',
      name: 'Is Allowed',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.isAllowed}</Text>;
      },
      isPadded: true,
    },
    // {
    //   key: 'actions',
    //   name: 'Actions',
    //   minWidth: 70,
    //   isResizable: true,
    //   isCollapsible: true,
    //   data: 'string',
    //   onRender: (item: any) => {
    //     return (
    //       <Stack horizontal disableShrink>
    //         <IconButton
    //           styles={_columnIconButtonStyle}
    //           height={20}
    //           iconProps={{ iconName: 'Settings' }}
    //           title="Settings"
    //           ariaLabel="Settings"
    //           onClick={() => {
    //             dispatch(
    //               productSettingsActions.managingPanelContent(
    //                 ManagingPanelComponent.ManageUnits
    //               )
    //             );
    //           }}
    //         />
    //       </Stack>
    //     );
    //   },
    //   isPadded: true,
    // },
  ];

  return (
    <div className="customerList">
      <MarqueeSelection selection={selection}>
        <DetailsList columns={customerColumns} items={outionUnits} />
      </MarqueeSelection>
    </div>
  );
};

export default OptionGroupDetails;
