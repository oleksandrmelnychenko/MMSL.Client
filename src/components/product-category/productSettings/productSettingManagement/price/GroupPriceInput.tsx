import React from 'react';
import {
  Stack,
  TextField,
  Dropdown,
  IDropdownOption,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import { OptionGroup } from '../../../../../interfaces/options';
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

const _renderPriceWarning = (
  isInputEnabled: boolean,
  optionGroup: OptionGroup | null | undefined
) => {
  let resultContent = null;

  if (
    isInputEnabled &&
    optionGroup &&
    optionGroup.canDeclareOwnPrice === false
  ) {
    resultContent = (
      <div className="priceInput__priceWarning">
        <TooltipHost
          id={`canDeclareOwnPriceTooltip_${optionGroup.id}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.bottomCenter}
          styles={{ root: { display: 'inline-block' } }}
          content={'The price of some options of this style will be disabled.'}
        >
          <FontIcon
            style={{ cursor: 'default' }}
            iconName="Warning"
            className={mergeStyles({
              fontSize: 19,
              position: 'relative',
              top: '2px',
              color: '#d83b01',
            })}
          />
        </TooltipHost>
      </div>
    );
  }

  return resultContent;
};

export interface IGroupPriceInputProps {
  formik: any;
  editingGroup: OptionGroup | null | undefined;
  isEnabled: boolean;
}

export const GroupPriceInput: React.FC<IGroupPriceInputProps> = (
  props: IGroupPriceInputProps
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
    <div className={props.isEnabled ? 'priceInput' : 'priceInput dissabled'}>
      {_renderPriceWarning(props.isEnabled, props.editingGroup)}
      <Stack horizontal tokens={{ childrenGap: '9px' }}>
        <Stack.Item grow={1}>
          <TextField
            disabled={!props.isEnabled}
            type="number"
            step="0.01"
            value={props.isEnabled ? `${props.formik.values.priceValue}` : '0'}
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
            disabled={!props.isEnabled}
            defaultSelectedKey={_resolveDefaultSelectedOptionKey(
              options,
              props.formik.values.priceCurrencyId
            )}
            placeholder="Currency"
            options={options}
            styles={{ ...fabricStyles.comboBoxStyles, root: { width: '96px' } }}
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
    </div>
  );
};

export default GroupPriceInput;
