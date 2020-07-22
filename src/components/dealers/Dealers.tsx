import React, { useEffect } from 'react';
import './dealers.scss';
import { SearchBox, ActionButton, Stack, Text } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import CreateDealerPanel from './dealerManaging/CreateDealerPanel';
import DealerList from './DealerList';
import { dealerActions } from '../../redux/slices/dealer.slice';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react';
import DealerPanel from './DealerPanel';
import * as fabricControlSettings from '../../common/fabric-control-settings/fabricControlSettings';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  columnIconButtonStyle,
} from '../../common/fabric-styles/styles';
import { controlActions } from '../../redux/slices/control.slice';
import {
  rightPanelActions,
  RightPanelType,
} from '../../redux/slices/rightPanel.slice';
import ManageDealerForm from './managing/dealerManaging/ManageDealerForm';

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
    dispatch(dealerActions.apiGetDealersListPaginated());
  }, [fromDate, toDate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(dealerActions.clearDealersList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const datePickerWidth = { root: { width: '150px' } };

  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <Stack
                horizontal
                verticalAlign="center"
                tokens={horizontalGapStackTokens}
              >
                <Text variant="xLarge" block styles={mainTitleContent}>
                  Dealers
                </Text>
                <ActionButton
                  styles={columnIconButtonStyle}
                  iconProps={{ iconName: 'Add' }}
                  onClick={() => {
                    dispatch(dealerActions.setSelectedDealer(null));
                    dispatch(controlActions.closeInfoPanelWithComponent());
                    dispatch(
                      rightPanelActions.openRightPanel({
                        title: 'Add dealer',
                        width: '600px',
                        panelType: RightPanelType.Form,
                        closeFunctions: () => {
                          dispatch(rightPanelActions.closeRightPanel());
                        },
                        component: ManageDealerForm,
                      })
                    );
                  }}
                >
                  New dealer
                </ActionButton>
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
                      dealerActions.dealeFromDate(date ? date : undefined)
                    );
                  }}
                />
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
                <SearchBox
                  className="dealerSearch"
                  value={searchText}
                  placeholder="Find dealer"
                  styles={{ root: { width: 200 } }}
                  onChange={(args: any) => {
                    if (args) {
                      let value = args.target.value;
                      dispatch(dealerActions.searchDealer(value));
                      dispatch(
                        dealerActions.apiDebounceGetDealersListPaginated()
                      );
                    } else {
                      dispatch(dealerActions.searchDealer(''));
                      dispatch(
                        dealerActions.apiDebounceGetDealersListPaginated()
                      );
                    }
                  }}
                />
              </Stack>
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <DealerList />
        </Stack.Item>
      </Stack>
      <CreateDealerPanel />

      <DealerPanel />
    </div>
  );
};

export default Dealers;
