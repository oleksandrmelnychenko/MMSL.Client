import React, { useEffect, useState } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Stack,
  IconButton,
  Text,
  Selection,
  IDetailsRowProps,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlActions from '../../redux/actions/control.actions';
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
  const dispatch = useDispatch();
  let [fitems, setfitems] = useState<any[]>([]);
  let [pageNumber, setpageNumber] = useState<number>(0);
  let [lastRequest, setLastRequest] = useState<number>(-1);

  if (pageNumber !== props.pageNumberSource && props.itemsSource.length > 0) {
    const list = new List<any>(fitems).where((item) => item !== null);

    const last = list.lastOrDefault();
    const lastSource = new List(props.itemsSource).lastOrDefault();

    const flow = () => {
      let result = list.concat(props.itemsSource).concat([null]).toArray();

      setpageNumber(props.pageNumberSource);
      setfitems(result);
    };

    if ((last === undefined || last === null) && lastSource) {
      flow();
    } else {
      if (last && lastSource && last.id !== lastSource.id) {
        flow();
      }
    }
  }

  return (
    <div>
      <DetailsList
        items={fitems}
        selectionMode={SelectionMode.single}
        columns={props.columns}
        onRenderMissingItem={(index?: number, rowProps?: IDetailsRowProps) => {
          if (lastRequest !== index) {
            console.log(`render ${index}`);
            setLastRequest(index ? index : -1);
            props.invokeRequest();
          }
          return null;
        }}
      />
    </div>
  );
};

export default DealersTable;
