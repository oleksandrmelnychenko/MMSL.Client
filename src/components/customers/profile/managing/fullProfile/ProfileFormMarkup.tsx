import React from 'react';
import { Measurement } from '../../../../../interfaces/measurements';
import {
  ProfileTypes,
  CustomerProductProfile,
} from '../../../../../interfaces/orderProfile';
import { ProductCategory } from '../../../../../interfaces/products';
import { StoreCustomer } from '../../../../../interfaces/storeCustomer';
import { Stack, Text, ScrollablePane } from 'office-ui-fabric-react';
import ProductCustomerDetails from './ProductCustomerDetails';
import EntityInput from './inputs/EntityInput';
import ProfileTypeInput from './inputs/productMeasurement/ProfileTypeInput';
import MeasurementInput from './inputs/productMeasurement/MeasurementInput';
import FreshMeasurementInput from './inputs/productMeasurement/chartBulkInputs/FreshMeasurementInput';
import BaseMeasurementInput from './inputs/productMeasurement/chartBulkInputs/BaseMeasurementInput';
import BodyMeasurementInput from './inputs/productMeasurement/chartBulkInputs/BodyMeasurementInput';
import StyleSelectorInput from './inputs/productStyle/StyleSelectorInput';
import './profileFormMarkup.scss';
import SizeSelectorInput from './inputs/productMeasurement/SizeSelectorInput';
import FittingTypeInput from './inputs/productMeasurement/FittingTypeInput';
import { mainTitleHintContent } from '../../../../../common/fabric-styles/styles';

export interface IProfileFormMarkupProps {
  measurements: Measurement[];
  product: ProductCategory;
  customer: StoreCustomer;
  formik: any;
  profileForEdit: CustomerProductProfile | null | undefined;
}

export const ProfileFormMarkup: React.FC<IProfileFormMarkupProps> = (
  props: IProfileFormMarkupProps
) => {
  return (
    <Stack
      className="profileFormMarkup"
      horizontal
      tokens={{ childrenGap: '24px' }}
    >
      <Stack
        tokens={{ childrenGap: '24px' }}
        styles={{ root: { minWidth: '300px' } }}
      >
        <Stack.Item className="profileFormMarkup__formBox">
          <EntityInput formik={props.formik} />
        </Stack.Item>

        <Stack.Item className="profileFormMarkup__formBox">
          <ProductCustomerDetails
            customer={props.customer}
            product={props.product}
          />
        </Stack.Item>
      </Stack>

      <ScrollablePane className="profileFormMarkup__formScrollablePane">
        <Stack
          tokens={{ childrenGap: '24px' }}
          style={{ paddingRight: '6px', paddingBottom: '24px' }}
        >
          <Stack.Item align="stretch">
            <Stack
              className="profileFormMarkup__formBox"
              tokens={{ childrenGap: '24px' }}
            >
              <Stack>
                <Text variant="mediumPlus" styles={mainTitleHintContent}>
                  {'Measurements'}
                </Text>
                <Stack horizontal tokens={{ childrenGap: '12px' }}>
                  <ProfileTypeInput
                    formik={props.formik}
                    availableMeasurements={props.measurements}
                    orderProfile={props.profileForEdit}
                  />

                  <MeasurementInput
                    measurements={props.measurements}
                    formik={props.formik}
                    orderProfile={props.profileForEdit}
                  />

                  <SizeSelectorInput
                    formik={props.formik}
                    orderProfile={props.profileForEdit}
                  />

                  <FittingTypeInput formik={props.formik} />
                </Stack>
              </Stack>

              <Stack horizontal>
                <FreshMeasurementInput
                  formik={props.formik}
                  orderProfile={props.profileForEdit}
                />

                <BaseMeasurementInput
                  formik={props.formik}
                  orderProfile={props.profileForEdit}
                />

                <BodyMeasurementInput
                  formik={props.formik}
                  orderProfile={props.profileForEdit}
                />

                {props.formik.values.profileType === ProfileTypes.Reference ? (
                  <Text
                    block
                    styles={{
                      root: {
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#a19f9d',
                      },
                    }}
                  >
                    {
                      'Customer should provide fit shirt to replicate measurement'
                    }
                  </Text>
                ) : null}
              </Stack>
            </Stack>
          </Stack.Item>

          <Stack
            className="profileFormMarkup__formBox"
            tokens={{ childrenGap: '15px' }}
          >
            <Text variant="mediumPlus" styles={mainTitleHintContent}>
              {'Styles'}
            </Text>
            <StyleSelectorInput formik={props.formik} />
          </Stack>
        </Stack>
      </ScrollablePane>
    </Stack>
  );
};

export default ProfileFormMarkup;
