import React, { useEffect } from 'react';
import './dealers.scss';
import { SearchBox, ActionButton, Stack } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import CreateDealerPanel from './dealerManaging/CreateDealerPanel';
import DealerList from './DealerList';
import { dealerActions } from '../../redux/slices/dealer.slice';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react';
import DealerPanel from './DealerPanel';
import * as fabricControlSettings from '../../common/fabric-control-settings/fabricControlSettings';

export const Dealers: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchText = useSelector<IApplicationState, string>(
    (state) => state.dealer.dealerState.search
  );

  const fromDate: Date | undefined = useSelector<
    IApplicationState,
    Date | undefined
  >((state) => state.dealer.dealerState.fromDate);

  const toDate: Date | undefined = useSelector<
    IApplicationState,
    Date | undefined
  >((state) => state.dealer.dealerState.toDate);

  useEffect(() => {
    dispatch(dealerActions.getDealersListPaginated());
  }, [fromDate, toDate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(dealerActions.clearDealersList());
    };
  }, []);

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
                          formatDate={fabricControlSettings.onFormatDate}
                          styles={datePickerWidth}
                          className="dealersDate"
                          allowTextInput={true}
                          value={fromDate}
                          firstDayOfWeek={DayOfWeek.Monday}
                          strings={fabricControlSettings.dayPickerStrings}
                          placeholder="From date"
                          ariaLabel="Select a date"
                          onSelectDate={(date: Date | null | undefined) => {
                            dispatch(
                              dealerActions.dealeFromDate(
                                date ? date : undefined
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="dealers__header__top__controls__control">
                        <DatePicker
                          formatDate={fabricControlSettings.onFormatDate}
                          styles={datePickerWidth}
                          className="dealersDate"
                          allowTextInput={true}
                          value={toDate}
                          firstDayOfWeek={DayOfWeek.Monday}
                          strings={fabricControlSettings.dayPickerStrings}
                          placeholder="To date"
                          ariaLabel="Select a date"
                          onSelectDate={(date: Date | null | undefined) => {
                            dispatch(
                              dealerActions.dealeToDate(date ? date : undefined)
                            );
                          }}
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
        <DealerPanel />
      </div>
    </div>
  );
};

export default Dealers;
