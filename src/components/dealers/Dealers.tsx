import React from 'react';
import './dealers.scss';
import { DefaultButton, SearchBox, ActionButton } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import DealerDetails from './DealerDetails';
import DealerStores from './DealerStores';
import DealerList from './DealerList';
import { DealerView } from '../../redux/reducers/dealer.reducer';
import * as dealerActions from '../../redux/actions/dealer.actions';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings,
  mergeStyleSets,
} from 'office-ui-fabric-react';

export const Dealers: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const languageCode = getActiveLanguage(localize).code;

  const dealerView = useSelector<IApplicationState, DealerView>(
    (state) => state.dealer.selectedView
  );

  let content: any = null;

  if (dealerView === DealerView.List) content = <DealerList />;
  else if (dealerView === DealerView.Details) content = <DealerDetails />;
  else if (dealerView === DealerView.Stores) content = <DealerStores />;

  const controlClass = mergeStyleSets({
    control: {
      margin: '0 0 15px 0',
      maxWidth: '300px',
    },
  });

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

  return (
    <div className="dealers">
      <div className="dealers__header">
        <div className="dealers__header__top">
          <div className="dealers__header__top__title">Dealers</div>
          <div className="dealers__header__top__controls">
            <div className="dealers__header__top__controls__control">
              <DatePicker
                className={controlClass.control}
                firstDayOfWeek={DayOfWeek.Monday}
                strings={DayPickerStrings}
                placeholder="Select a date..."
                ariaLabel="Select a date"
              />
            </div>
            <div className="dealers__header__top__controls__control">
              <SearchBox styles={{ root: { width: 200 } }} />
            </div>
            <div className="dealers__header__top__controls__control">
              <ActionButton iconProps={{ iconName: 'Add' }}>
                Add dealer
              </ActionButton>
            </div>
          </div>
        </div>

        <div className="dealers__navigation">
          <ul>
            <li className={dealerView === DealerView.List ? 'selected ' : ''}>
              <DefaultButton
                text="List"
                allowDisabledFocus
                onClick={() =>
                  dispatch(dealerActions.changeDealerView(DealerView.List))
                }
              />
            </li>
            <li
              className={dealerView === DealerView.Details ? 'selected ' : ''}
            >
              <DefaultButton
                text="Dealer details"
                allowDisabledFocus
                onClick={() =>
                  dispatch(dealerActions.changeDealerView(DealerView.Details))
                }
              />
            </li>
            <li className={dealerView === DealerView.Stores ? 'selected ' : ''}>
              <DefaultButton
                text="Dealer stores"
                allowDisabledFocus
                onClick={() =>
                  dispatch(dealerActions.changeDealerView(DealerView.Stores))
                }
              />
            </li>
          </ul>
        </div>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default Dealers;
