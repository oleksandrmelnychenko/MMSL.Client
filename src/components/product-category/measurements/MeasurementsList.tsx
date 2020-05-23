import React, { useEffect } from 'react';
import {
  Text,
  ShimmeredDetailsList,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react';
import { detailsListStyle } from '../../../common/fabric-styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import * as controlActions from '../../../redux/actions/control.actions';

const MeasurementsList: React.FC = () => {
  const dispatch = useDispatch();

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _customerColumns: IColumn[] = [
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
      key: 'userName',
      name: 'User Name',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.userName}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'email',
      name: 'Email',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.email}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'customer',
      name: 'Customer Name',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.customerName}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'store',
      name: 'Store',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.store ? item.store.name : ''}</Text>;
      },
      isPadded: true,
    },
  ];
  return (
    <div>
      <ShimmeredDetailsList
        enableShimmer={shimmer}
        styles={detailsListStyle}
        items={[]}
        //   selection={selection}
        selectionMode={SelectionMode.single}
        columns={_customerColumns}
      />
    </div>
  );
};

export default MeasurementsList;
