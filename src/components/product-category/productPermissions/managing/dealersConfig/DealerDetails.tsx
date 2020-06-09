import React from 'react';
import {
  Stack,
  Label,
  ComboBox,
  IComboBox,
  IComboBoxOption,
} from 'office-ui-fabric-react';
import { DealerAccount } from '../../../../../interfaces';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import './assignedDealersList.scss';

/// Build single hint lable
const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

export enum DealerDetailsState {
  NotTouched,
  Exploring,
  Assigning,
}

export class DealerDetailsProps {
  constructor() {
    this.dealer = null;
    this.state = DealerDetailsState.NotTouched;
  }

  dealer: DealerAccount | null | undefined;
  state: DealerDetailsState;
}

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  let comboOptions: IComboBoxOption[] = [];
  let selectedOptionKey: string | number | null | undefined;

  if (DealerDetailsState.Exploring === props.state) {
    if (props.dealer) {
      comboOptions = [
        {
          key: `${props.dealer.id}`,
          text: props.dealer.companyName,
          dealer: props.dealer,
        } as IComboBoxOption,
      ];
      selectedOptionKey = comboOptions[0].key;
    }
  } else if (DealerDetailsState.Assigning === props.state) {
  } else if (DealerDetailsState.NotTouched === props.state) {
  }

  return (
    <div className="dealerDetails">
      {props.state !== DealerDetailsState.NotTouched ? (
        <Stack>
          <ComboBox
            selectedKey={selectedOptionKey}
            allowFreeform={true}
            label="Dealer Company Name"
            autoComplete={true ? 'on' : 'off'}
            options={comboOptions}
            useComboBoxAsMenuWidth={true}
            styles={{
              ...fabricStyles.comboBoxStyles,
            }}
            onChange={(
              event: React.FormEvent<IComboBox>,
              option?: IComboBoxOption,
              index?: number,
              value?: string
            ) => {}}
          />
        </Stack>
      ) : (
        _renderHintLable(
          'Select and explore or find and assign new dealer for current style permission.'
        )
      )}
    </div>
  );
};

export default DealerDetails;
