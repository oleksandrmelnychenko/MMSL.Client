import React, { useState } from 'react';
import './dealers.scss';
import {
  DefaultButton,
  SearchBox,
  ActionButton,
  Stack,
  Panel,
  PanelType,
  PrimaryButton,
  Text,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import DealerDetails from './DealerDetails';
import DealerStores from './DealerStores';
import DealerList from './DealerList';
import * as dealerActions from '../../redux/actions/dealer.actions';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings,
  mergeStyleSets,
} from 'office-ui-fabric-react';

export const Dealers: React.FC = (props: any) => {
  const [formikReference] = useState({
    formik: {},
  });

  const dispatch = useDispatch();

  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );

  const isAddDealerOpen = useSelector<IApplicationState, boolean>(
    (state) => state.dealer.manageDealerForm.isFormVisible
  );

  const languageCode = getActiveLanguage(localize).code;

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
      <div className="dealers__root">
        <div className="dealers__header">
          <div className="dealers__header__top">
            <Stack horizontal>
              <div className="dealers__header__top__title">Dealers</div>
              <div className="dealers__header__top__controls">
                <Stack horizontal>
                  <div className="dealers__header__top__controls__control">
                    <DatePicker
                      className="dealersDate"
                      firstDayOfWeek={DayOfWeek.Monday}
                      strings={DayPickerStrings}
                      placeholder="Select a date..."
                      ariaLabel="Select a date"
                    />
                  </div>
                  <div className="dealers__header__top__controls__control">
                    <SearchBox
                      className="dealerSearch"
                      styles={{ root: { width: 200 } }}
                    />
                  </div>
                  <div className="dealers__header__top__controls__control">
                    <ActionButton
                      className="dealerAdd"
                      onClick={() =>
                        dispatch(dealerActions.toggleNewDealerForm(true))
                      }
                      iconProps={{ iconName: 'Add' }}
                    >
                      Add dealer
                    </ActionButton>
                  </div>
                </Stack>
              </div>
            </Stack>
          </div>
        </div>

        <div>
          <DealerList />
        </div>

        <Panel
          isOpen={isAddDealerOpen}
          type={PanelType.custom}
          customWidth={'1300px'}
          onDismiss={() => {
            dispatch(dealerActions.toggleNewDealerForm(false));
          }}
          onRenderHeader={() => {
            return (
              <Stack horizontal className="dealerPanelHeader">
                <Text className="dealerPanelHeader__title">Add Dealer</Text>
                <PrimaryButton
                  className="dealerPanelHeader__save"
                  onClick={() => {
                    let formik: any = formikReference.formik;

                    if (formik !== undefined && formik !== null) {
                      formik.submitForm();
                    }
                  }}
                >
                  Save
                </PrimaryButton>
              </Stack>
            );
          }}
          closeButtonAriaLabel="Close"
        >
          <DealerDetails formikReference={formikReference} />
        </Panel>
      </div>
    </div>
  );
};

export default Dealers;
