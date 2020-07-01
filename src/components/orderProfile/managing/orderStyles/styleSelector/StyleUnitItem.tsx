import React from 'react';
import { OptionUnit, UnitValue } from '../../../../../interfaces/options';
import UnitValueSelectorInput from './UnitValueSelectorInput';
import './styleUnitItem.scss';
import {
  ProductCategory,
  ProductCategoryMapOptionGroup,
} from '../../../../../interfaces/products';
import {
  CustomerProductProfile,
  CustomerProfileStyleConfiguration,
} from '../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import {
  Stack,
  Image,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  Text,
} from 'office-ui-fabric-react';
import { STYLE_UNITS_VALUES_FORM_FIELD } from '../OrderStylesForm';

export const initUnitItems = (
  productCategory: ProductCategory | null | undefined,
  sourceEntity: CustomerProductProfile | null | undefined
) => {
  let result: IStyleUnitModel[] = [];

  if (productCategory?.optionGroupMaps) {
    result = new List(productCategory.optionGroupMaps)
      .selectMany((groupMap: ProductCategoryMapOptionGroup) => {
        let selectResult: OptionUnit[] = [];

        if (groupMap.optionGroup?.optionUnits) {
          groupMap.optionGroup.optionUnits.forEach(
            (unit) => (unit.optionGroup = groupMap.optionGroup)
          );
          selectResult = groupMap.optionGroup.optionUnits;
        }

        return selectResult;
      })
      .select<IStyleUnitModel>((optionUnit: OptionUnit) => {
        const resultItem: IStyleUnitModel = {
          id: 0,
          isDeleted: false,
          optionUnitId: optionUnit.id,
          optionUnitName: optionUnit.value,
          optionUnitImageUrl: optionUnit.imageUrl,
          selectedStyleValueId: 0,
          possibleValues: optionUnit.unitValues,
          groupName: optionUnit.optionGroup ? optionUnit.optionGroup.name : '',
          groupId: optionUnit.optionGroupId ? optionUnit.optionGroupId : 0,
          index: 0,
          isChecked: false,
          isDirty: false,
        };

        if (sourceEntity?.customerProfileStyleConfigurations) {
          const profileValue:
            | CustomerProfileStyleConfiguration
            | null
            | undefined = new List<CustomerProfileStyleConfiguration>(
            sourceEntity.customerProfileStyleConfigurations
          ).firstOrDefault(
            (valueItem: CustomerProfileStyleConfiguration) =>
              valueItem.optionUnitId === optionUnit.id
          );

          if (profileValue) {
            resultItem.id = profileValue.id;
            resultItem.isDeleted = profileValue.isDeleted;
            resultItem.selectedStyleValueId = profileValue.unitValueId
              ? profileValue.unitValueId
              : 0;
            resultItem.isChecked = true;
          }
        }

        if (
          resultItem.selectedStyleValueId === 0 &&
          resultItem.possibleValues.length > 0
        )
          resultItem.selectedStyleValueId = optionUnit.unitValues[0].id;

        return resultItem;
      })
      .toArray();
  }

  result.forEach((item: IStyleUnitModel, index: number) => {
    item.index = index;
  });

  return result;
};

export const updateIsUnitDirty = (
  updatedUnit: IStyleUnitModel,
  formik: any
) => {
  const initModel: any = new List(
    formik.values.productStyleValuesDefaultsHelper
  ).firstOrDefault(
    (item: any) => item.optionUnitId === updatedUnit.optionUnitId
  );
  if (initModel) {
    let isDirty = false;
    if (updatedUnit.id === 0) {
      isDirty = updatedUnit.isChecked;
    } else {
      if (updatedUnit.isChecked) {
        isDirty =
          updatedUnit.selectedStyleValueId !== initModel.selectedStyleValueId;
        updatedUnit.isDeleted = false;
      } else {
        isDirty = true;
        updatedUnit.isDeleted = true;
      }
    }

    updatedUnit.isDirty = isDirty;
  }
};

export interface IStyleUnitModel {
  id: number;
  isDeleted: boolean;
  selectedStyleValueId: number;
  optionUnitId: number;
  optionUnitName: string;
  optionUnitImageUrl: string;
  possibleValues: UnitValue[];
  groupName: string;
  groupId: number;
  index: number;
  isChecked: boolean;
  isDirty: boolean;
}

export interface IStyleUnitItemProps {
  unitModel: IStyleUnitModel;
  formik: any;
}

export const StyleUnitItem: React.FC<IStyleUnitItemProps> = (
  props: IStyleUnitItemProps
) => {
  return (
    <div
      className={
        props.unitModel.isChecked ? 'styleUnitItem checked' : 'styleUnitItem'
      }
    >
      <Stack tokens={{ childrenGap: '9px' }}>
        <Stack
          tokens={{ childrenGap: '9px' }}
          onClick={() => {
            props.unitModel.isChecked = !props.unitModel.isChecked;
            updateIsUnitDirty(props.unitModel, props.formik);

            props.formik.setFieldValue(`${STYLE_UNITS_VALUES_FORM_FIELD}`, [
              ...props.formik.values.productStyleValues,
            ]);
            props.formik.setFieldTouched(
              `${STYLE_UNITS_VALUES_FORM_FIELD}[${props.unitModel.index}]`
            );
          }}
        >
          <Stack horizontal>
            <TooltipHost
              id={`unitValue_${props.unitModel.groupId}`}
              calloutProps={{ gapSpace: 0 }}
              delay={TooltipDelay.zero}
              directionalHint={DirectionalHint.bottomCenter}
              styles={{ root: { display: 'inline-block' } }}
              content={props.unitModel.optionUnitName}
            >
              <Text
                style={{ cursor: 'default', maxWidth: '60px' }}
                block
                nowrap
              >
                {props.unitModel.optionUnitName}
              </Text>
            </TooltipHost>
          </Stack>
          <Image
            className={'styleUnitItem__image'}
            src={props.unitModel.optionUnitImageUrl}
            imageFit={0}
          ></Image>
        </Stack>
        <UnitValueSelectorInput
          formik={props.formik}
          unitModel={props.unitModel}
        />
      </Stack>
    </div>
  );
};

export default StyleUnitItem;
