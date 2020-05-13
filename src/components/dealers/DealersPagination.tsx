import React, { useEffect } from 'react';
import './dealersPagination.scss';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import ReactPaginate from 'react-paginate';
import { DealerAccount, PaginationInfo } from '../../interfaces';
import { Stack } from 'office-ui-fabric-react';
import { assignPendingActions } from '../../helpers/action.helper';

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
            onPageChange={(args: any) => {
              let paginationInfo = { ...pagination };
              paginationInfo.pageNumber = args.selected + 1;

              dispatch(
                dealerActions.updateDealerListPagination(paginationInfo)
              );

              dispatch(
                assignPendingActions(dealerActions.getDealersListPaginated())
              );
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default DealersPagination;
