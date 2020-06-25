import React from 'react';
import {
  Stack,
  TextField,
  Dropdown,
  Text,
  IDropdownOption,
} from 'office-ui-fabric-react';
import '../../../../dealers/managing/dealerManaging/manageDealerForm.scss';
import { OptionUnit, OptionGroup } from '../../../../../interfaces/options';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import { useSelector } from 'react-redux';
import { List } from 'linq-typescript';
import { IApplicationState } from '../../../../../redux/reducers';
import { CurrencyType } from '../../../../../interfaces/currencyTypes';
import './priceInput.scss';

const _resolveDefaultSelectedOptionKey = (
  options: IDropdownOption[],
  initCurrencyId: number
) => {
  let defaultSelectKey: string = '';

  const optionToSelect = new List(options).firstOrDefault(
    (option) => option.key === `${initCurrencyId}`
  );

  if (optionToSelect) {
    defaultSelectKey = `${optionToSelect.key}`;
  } else {
    if (options.length > 0) defaultSelectKey = `${options[0].key}`;
  }

  return defaultSelectKey;
};

const _resolveIsPriceInputVisible = (
  optionGroup: OptionGroup | null | undefined,
  optionUnit: OptionUnit | null | undefined
) => {
  let isAvailableResult = false;

  if (optionUnit) {
    isAvailableResult = optionUnit.canDeclareOwnPrice;
  } else {
    isAvailableResult = optionGroup ? !optionGroup.currentPrice : false;
  }

  return isAvailableResult;
};

const _buildStubPriceText = (optionGroup: OptionGroup | null | undefined) => {
  let resultText: string = 'Included to the style price';

  if (
    optionGroup &&
    optionGroup.currentPrice &&
    optionGroup.currentPrice.currencyType
  ) {
    let priceValue = ` (${optionGroup.currentPrice.price} ${optionGroup.currentPrice.currencyType.name})`;

    resultText += ` ${priceValue}`;
  }

  return resultText;
};

export interface IUnitPriceInputProps {
  formik: any;
  optionGroup: OptionGroup | null | undefined;
  editingUnit: OptionUnit | null | undefined;
}

export const UnitPriceInput: React.FC<IUnitPriceInputProps> = (
  props: IUnitPriceInputProps
) => {
  const currencies: CurrencyType[] = useSelector<
    IApplicationState,
    CurrencyType[]
  >((state) => state.units.сurrencies);

  const options = currencies.map((currency: CurrencyType) => {
    return {
      key: `${currency.id}`,
      text: currency.name,
      currency: currency,
      isSelected: currency.id === props.formik.values.priceCurrencyId,
    } as IDropdownOption;
  });

  return (
    <div className={'priceInput'}>
      {_resolveIsPriceInputVisible(props.optionGroup, props.editingUnit) ? (
        <Stack horizontal tokens={{ childrenGap: '9px' }}>
          <Stack.Item grow={1}>
            <TextField
              type="number"
              step="0.01"
              value={`${props.formik.values.priceValue}`}
              styles={fabricStyles.textFildLabelStyles}
              className="form__group__field"
              label="Price"
              onChange={(args: any) => {
                let value = args.target.value;

                let parsedValue = parseFloat(value);

                if (isNaN(parsedValue)) parsedValue = 0;

                props.formik.setFieldValue('priceValue', parsedValue);
                props.formik.setFieldTouched('priceValue');
              }}
              errorMessage={
                props.formik.errors.priceValue &&
                props.formik.touched.priceValue ? (
                  <span className="form__group__error">
                    {props.formik.errors.priceValue}
                  </span>
                ) : (
                  ''
                )
              }
            />
          </Stack.Item>

          <Stack.Item align="end">
            <Dropdown
              defaultSelectedKey={_resolveDefaultSelectedOptionKey(
                options,
                props.formik.values.priceCurrencyId
              )}
              placeholder="Currency"
              options={options}
              styles={{
                ...fabricStyles.comboBoxStyles,
                root: { width: '96px' },
              }}
              onChange={(
                event: React.FormEvent<HTMLDivElement>,
                option?: IDropdownOption,
                index?: number
              ) => {
                if (option) {
                  props.formik.setFieldValue(
                    'priceCurrencyId',
                    parseInt((option as any).currency.id)
                  );
                  props.formik.setFieldTouched('priceCurrencyId');
                }
              }}
            />
          </Stack.Item>
        </Stack>
      ) : (
        <div className={'priceInput__unitPriceDescription'}>
          <Text block>
            {_buildStubPriceText(
              props.optionGroup
                ? props.optionGroup
                : props.editingUnit?.optionGroup
            )}
          </Text>
        </div>
      )}
    </div>
  );
};

export default UnitPriceInput;
