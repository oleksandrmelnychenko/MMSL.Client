import React, { useState } from 'react';
import {
  Stack,
  Label,
  ComboBox,
  IComboBox,
  IComboBoxOption,
  Text,
} from 'office-ui-fabric-react';
import { DealerAccount, ProductCategory } from '../../../../../interfaces';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import './assignedDealersList.scss';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productStylePermissionsActions } from '../../../../../redux/slices/productStylePermissions.slice';
import { List } from 'linq-typescript';

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

const _buidComboOption: (dealer: DealerAccount) => IComboBoxOption = (
  dealer: DealerAccount
) => {
  return {
    key: `${dealer.id}`,
    text: dealer.companyName,
    dealer: dealer,
  } as IComboBoxOption;
};

const _buildReadOnlyModel = (dealer: DealerAccount | null | undefined) => {
  let result = {};

  if (dealer) {
    result = { ...dealer };
  }

  return result;
};

const _onRenderPartialDetail = (title: string, content: string) => {
  let result = null;

  if (content && content.length > 0) {
    result = (
      <Stack horizontal tokens={{ childrenGap: 6 }}>
        <Text
          block
          styles={{
            root: { fontSize: '12px', color: '#a19f9d', marginTop: '2px' },
          }}
        >{`${title}:`}</Text>
        <Text
          block
          styles={{ root: { fontSize: '14px', color: 'rgb(50, 49, 48)' } }}
        >
          {content}
        </Text>
      </Stack>
    );
  }

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
    this.product = null;

    this.onBeginSearchCallback = () => {};
    this.onChooseSuggestionDealerCallback = (
      dealer: DealerAccount | null | undefined
    ) => {};
  }

  dealer: DealerAccount | null | undefined;
  state: DealerDetailsState;
  product: ProductCategory | null | undefined;

  onBeginSearchCallback: () => void;
  onChooseSuggestionDealerCallback: (
    dealer: DealerAccount | null | undefined
  ) => void;
}

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  const dispatch = useDispatch();

  const [dealerSuggestions, setDealerSuggestions] = useState<DealerAccount[]>(
    []
  );
  const [selectedDealerSuggestion, setSelectedDealerSuggestion] = useState<
    DealerAccount | null | undefined
  >(null);

  let comboOptions: IComboBoxOption[] = [];
  let selectedOptionKey: string | number | null | undefined;
  let readOnlyModel: any = {};

  if (DealerDetailsState.Exploring === props.state) {
    if (props.dealer) {
      comboOptions = [_buidComboOption(props.dealer)];
      selectedOptionKey = comboOptions[0].key;
    }

    readOnlyModel = _buildReadOnlyModel(props.dealer);

    if (dealerSuggestions.length > 0) setDealerSuggestions([]);
    if (selectedDealerSuggestion) setSelectedDealerSuggestion(null);
  } else if (DealerDetailsState.Assigning === props.state) {
    comboOptions = new List(dealerSuggestions)
      .select((suggestedDealer) => {
        return _buidComboOption(suggestedDealer);
      })
      .toArray();

    if (selectedDealerSuggestion)
      selectedOptionKey = _buidComboOption(selectedDealerSuggestion).key;

    readOnlyModel = _buildReadOnlyModel(selectedDealerSuggestion);
  } else if (DealerDetailsState.NotTouched === props.state) {
    if (dealerSuggestions.length > 0) setDealerSuggestions([]);
    if (selectedDealerSuggestion) setSelectedDealerSuggestion(null);

    readOnlyModel = _buildReadOnlyModel(null);
  }

  return (
    <div className="dealerDetails">
      {props.state !== DealerDetailsState.NotTouched ? (
        <Stack tokens={{ childrenGap: 18 }}>
          <ComboBox
            selectedKey={selectedOptionKey}
            allowFreeform={true}
            label="Dealer Company Name"
            autoComplete={true ? 'on' : 'off'}
            options={comboOptions}
            useComboBoxAsMenuWidth={true}
            styles={{
              ...fabricStyles.comboBoxStyles,
              label: {
                ...fabricStyles.comboBoxStyles.label,
                paddingTop: '0px',
              },
            }}
            onChange={(
              event: React.FormEvent<IComboBox>,
              option?: IComboBoxOption,
              index?: number,
              value?: string
            ) => {
              if (DealerDetailsState.Assigning === props.state) {
                if (option) {
                  const dealer = (option as any).dealer;

                  setSelectedDealerSuggestion(dealer);
                  setDealerSuggestions([dealer]);

                  props.onChooseSuggestionDealerCallback(dealer);
                } else {
                  setSelectedDealerSuggestion(null);
                  setDealerSuggestions([]);

                  props.onChooseSuggestionDealerCallback(null);
                }
              } else {
                setSelectedDealerSuggestion(null);
                setDealerSuggestions([]);

                props.onChooseSuggestionDealerCallback(null);
              }
            }}
            onPendingValueChanged={(
              option?: IComboBoxOption,
              index?: number,
              value?: string
            ) => {
              if (props.product && value) {
                props.onBeginSearchCallback();

                dispatch(
                  assignPendingActions(
                    productStylePermissionsActions.apiSearchDealersByPermissionProductId(
                      { searchWord: value, productId: props.product.id }
                    ),
                    [],
                    [],
                    (args: any) => {
                      setDealerSuggestions(args);
                    },
                    (args: any) => {
                      setDealerSuggestions([]);
                    }
                  )
                );
              }
            }}
          />

          <Stack tokens={{ childrenGap: 3 }}>
            {_onRenderPartialDetail('Name', readOnlyModel.name)}
            {_onRenderPartialDetail('Email', readOnlyModel.email)}
            {_onRenderPartialDetail(
              'Alternative Email',
              readOnlyModel.alternateEmail
            )}
            {_onRenderPartialDetail('Phone Number', readOnlyModel.phoneNumber)}
            {_onRenderPartialDetail('Tax Number', readOnlyModel.taxNumber)}
            {_onRenderPartialDetail(
              'Address 1',
              readOnlyModel.billingAddress?.addressLine1
            )}
            {_onRenderPartialDetail(
              'Address 2',
              readOnlyModel.billingAddress?.addressLine2
            )}
            {_onRenderPartialDetail('City', readOnlyModel.billingAddress?.city)}
            {_onRenderPartialDetail(
              'State',
              readOnlyModel.billingAddress?.state
            )}
            {_onRenderPartialDetail(
              'Country',
              readOnlyModel.billingAddress?.country
            )}
            {_onRenderPartialDetail(
              'Zip',
              readOnlyModel.billingAddress?.zipCode
            )}
          </Stack>
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
