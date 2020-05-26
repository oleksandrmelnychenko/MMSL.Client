import React, { useEffect, useState } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  MarqueeSelection,
  Stack,
  IconButton,
  Text,
  Selection,
  IDetailsRowProps,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { controlActions } from '../../redux/slices/control';
import ReactPaginate from 'react-paginate';
import { DealerAccount, PaginationInfo } from '../../interfaces';
import DealersPagination from './DealersPagination';
import { assignPendingActions } from '../../helpers/action.helper';
import { List } from 'linq-typescript';

export class TableProps {
  constructor() {
    this.columns = [];
    this.itemsSource = [];
    this.pageNumberSource = 0;
    this.invokeRequest = () => {};
  }

  itemsSource: any[];
  columns: IColumn[];
  pageNumberSource: number;
  invokeRequest: () => void;
}

export const DealersTable: React.FC<TableProps> = (props: TableProps) => {
  const [selection] = useState<Selection>(
    new Selection({ onSelectionChanged: () => {} })
  );

  return (
    <div>
      {/* <MarqueeSelection selection={selection}>
        <DetailsList
          items={fitems}
          selectionMode={SelectionMode.single}
          columns={props.columns}
          onRenderMissingItem={(
            index?: number,
            rowProps?: IDetailsRowProps
          ) => {
            if (lastRequest !== index) {
              setLastRequest(index ? index : -1);
              props.invokeRequest();
            }
            return null;
          }}
        />
      </MarqueeSelection> */}
    </div>
  );
};

export default DealersTable;
