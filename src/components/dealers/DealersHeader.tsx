import React, { useEffect, useState } from 'react';
import './dealers.scss';
import { SearchBox, ActionButton, Stack, Text } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react';
import * as fabricControlSettings from '../../common/fabric-control-settings/fabricControlSettings';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  columnIconButtonStyle,
} from '../../common/fabric-styles/styles';
import { controlActions } from '../../redux/slices/control.slice';
import ManageDealerForm from './dealerManaging/ManageDealerForm';
import { dealerAccountActions } from '../../redux/slices/dealerAccount.slice';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

const _datePickerWidth = { root: { width: '150px' } };

export const DealersHeader: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [searchBoxSubject] = useState<Subject<any>>(new Subject());

  const { toDate, fromDate }: any = useSelector<IApplicationState, any>(
    (state) => state.dealerAccount.filter
  );

  useEffect(() => {
    searchBoxSubject.pipe(debounceTime(1500)).subscribe((value: any) => {
      dispatch(dealerAccountActions.changeFilterSearchWord(value));
    });

    return () => {
      dispatch(dealerAccountActions.changeFilterFromDate(undefined));
      dispatch(dealerAccountActions.changeFilterToDate(undefined));
      dispatch(dealerAccountActions.changeFilterSearchWord(''));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
            dispatch(
              controlActions.openRightPanel({
                title: 'Add dealer',
                width: '600px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
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
          styles={_datePickerWidth}
          className="dealersDate"
          allowTextInput={true}
          value={fromDate}
          firstDayOfWeek={DayOfWeek.Monday}
          strings={fabricControlSettings.dayPickerStrings}
          placeholder="From date"
          ariaLabel="Select a date"
          onSelectDate={(date: Date | null | undefined) => {
            dispatch(
              dealerAccountActions.changeFilterFromDate(date ? date : undefined)
            );
          }}
        />
        <DatePicker
          formatDate={fabricControlSettings.onFormatDate}
          styles={_datePickerWidth}
          className="dealersDate"
          allowTextInput={true}
          value={toDate}
          firstDayOfWeek={DayOfWeek.Monday}
          strings={fabricControlSettings.dayPickerStrings}
          placeholder="To date"
          ariaLabel="Select a date"
          onSelectDate={(date: Date | null | undefined) => {
            dispatch(
              dealerAccountActions.changeFilterToDate(date ? date : undefined)
            );
          }}
        />
        <SearchBox
          className="dealerSearch"
          placeholder="Find dealer"
          styles={{ root: { width: 200 } }}
          onChange={(args: any) => {
            searchBoxSubject.next(args?.target ? args.target.value : '');
          }}
        />
      </Stack>
    </div>
  );
};

export default DealersHeader;
