import React from 'react';
import './dealers.scss';
import { SearchBox, ActionButton, Stack } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import CreateDealerPanel from './dealerManaging/CreateDealerPanel';
import DealerList from './DealerList';
import * as dealerActions from '../../redux/actions/dealer.actions';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings,
} from 'office-ui-fabric-react';
import DealerDetailsPanel from './DealerDetaisPanel';

export const Dealers: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchText = useSelector<IApplicationState, string>(
    (state) => state.dealer.dealerState.search
  );

  const DayPickerStrings: IDatePickerStrings = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],

    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],

    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],

    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker',
  };

  const datePickerWidth = { root: { width: '150px' } };

  return (
    <div className="dealers">
      <div className="dealers__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="dealers__header">
              <div className="dealers__header__top">
                <Stack horizontal>
                  <div className="dealers__header__top__title">Dealers</div>
                  <div className="dealers__header__top__controls">
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                      <div className="dealers__header__top__controls__control">
                        <ActionButton
                          className="dealerAdd"
                          onClick={() =>
                            dispatch(dealerActions.toggleNewDealerForm(true))
                          }
                          iconProps={{ iconName: 'Add' }}>
                          New dealer
                        </ActionButton>
                      </div>
                      <div className="dealers__header__top__controls__control">
                        <DatePicker
                          styles={datePickerWidth}
                          className="dealersDate"
                          firstDayOfWeek={DayOfWeek.Monday}
                          strings={DayPickerStrings}
                          placeholder="From date"
                          ariaLabel="Select a date"
                        />
                      </div>
                      <div className="dealers__header__top__controls__control">
                        <DatePicker
                          styles={datePickerWidth}
                          className="dealersDate"
                          firstDayOfWeek={DayOfWeek.Monday}
                          strings={DayPickerStrings}
                          placeholder="To date"
                          ariaLabel="Select a date"
                        />
                      </div>
                      <div className="dealers__header__top__controls__control">
                        <SearchBox
                          className="dealerSearch"
                          value={searchText}
                          styles={{ root: { width: 200 } }}
                          onChange={(args: any) => {
                            if (args) {
                              let value = args.target.value;
                              dispatch(dealerActions.searchDealer(value));
                              dispatch(dealerActions.getDealersListPaginated());
                            } else {
                              dispatch(dealerActions.searchDealer(''));
                              dispatch(dealerActions.getDealersListPaginated());
                            }
                          }}
                        />
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </div>
            </div>
          </Stack.Item>
          <Stack.Item>
            <DealerList />
          </Stack.Item>
        </Stack>

        {/* Create new dealer panel */}
        <CreateDealerPanel />

        {/* Dealer details panel */}
        <DealerDetailsPanel />
      </div>
    </div>
  );
};

export default Dealers;
