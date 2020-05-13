import React, { useEffect } from 'react';
import './dealersPagination.scss';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import ReactPaginate from 'react-paginate';
import { DealerAccount, PaginationInfo, Pagination } from '../../interfaces';
import { Stack, FontWeights, Dropdown } from 'office-ui-fabric-react';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { assignPendingActions } from '../../helpers/action.helper';

/// TOODO: resolve with Linq
const resolveDefaultLimitSelect = (limitOptions: any[], initLimit: number) => {
  let result;
  limitOptions.forEach((option) => {
    if (option.key === `${initLimit}`) {
      result = option;
    }
  });

  if (result === undefined || null) {
    result = limitOptions[0];
  }

  return result;
};

export const DealersPagination: React.FC = () => {
  const dispatch = useDispatch();

  const pagination: Pagination = useSelector<IApplicationState, Pagination>(
    (state) => state.dealer.dealerState.pagination
  );

  const limitOptions = [
    { key: '4', text: '4' },
    { key: '10', text: '10' },
    { key: '15', text: '15' },
    { key: '20', text: '20' },
  ];

  let defaultLimitSelection = resolveDefaultLimitSelect(
    limitOptions,
    pagination.limit
  );

  const dropDownStyles = {
    dropdown: { width: 300 },
    label: {
      fontWeight: FontWeights.light,
      paddingBottom: '2px',
    },
    title: {
      letterSpacing: '1px',
    },
  };

  return (
    <div className="dealersPagination">
      <div className="paginationScope">
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <Text
              block
            >{`Total count: ${pagination.paginationInfo.totalItems}`}</Text>
            <Dropdown
              options={limitOptions}
              defaultSelectedKey={defaultLimitSelection.key}
              styles={dropDownStyles}
              onChange={(event: React.FormEvent<HTMLDivElement>, item: any) => {
                let updatedPagination = { ...pagination };
                updatedPagination.limit = parseInt(item.text);

                dispatch(
                  dealerActions.updateDealerListPagination(updatedPagination)
                );

                dispatch(
                  assignPendingActions(dealerActions.getDealersListPaginated())
                );
              }}
            />
          </Stack>
          <Stack.Item>
            <ReactPaginate
              containerClassName={'pagination'}
              pageCount={pagination.paginationInfo.pagesCount}
              pageRangeDisplayed={10}
              marginPagesDisplayed={3}
              onPageChange={(args: any) => {
                let updatedPagination = { ...pagination };
                updatedPagination.paginationInfo = {
                  ...pagination.paginationInfo,
                };
                updatedPagination.paginationInfo.pageNumber = args.selected + 1;

                dispatch(
                  dealerActions.updateDealerListPagination(updatedPagination)
                );

                dispatch(
                  assignPendingActions(dealerActions.getDealersListPaginated())
                );
              }}
            />
          </Stack.Item>
          <Stack.Item>
            <Text block>Foo</Text>
          </Stack.Item>
        </Stack>
      </div>
    </div>
  );
};

export default DealersPagination;
