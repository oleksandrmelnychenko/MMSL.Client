import React, { useEffect } from 'react';
import './dealersPagination.scss';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import ReactPaginate from 'react-paginate';
import { DealerAccount, PaginationInfo } from '../../interfaces';
import { Stack } from 'office-ui-fabric-react';

export const DealersPagination: React.FC = () => {
  const dispatch = useDispatch();

  const pagination: PaginationInfo = useSelector<
    IApplicationState,
    PaginationInfo
  >((state) => state.dealer.dealerState.pagination.paginationInfo);

  return (
    <div className="dealersPagination">
      <div className="paginationScope">
        <Stack>
          <ReactPaginate
            containerClassName={'pagination'}
            pageCount={pagination.pagesCount}
            pageRangeDisplayed={10}
            marginPagesDisplayed={3}
            onPageChange={(args1: any) => {
              debugger;
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default DealersPagination;
