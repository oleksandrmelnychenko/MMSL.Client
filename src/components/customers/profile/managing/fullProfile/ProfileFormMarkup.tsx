import React from 'react';
import { Measurement } from '../../../../../interfaces/measurements';
import { ProfileTypes } from '../../../../../interfaces/orderProfile';
import { ProductCategory } from '../../../../../interfaces/products';
import { StoreCustomer } from '../../../../../interfaces/storeCustomer';
import { Stack, Text, ScrollablePane } from 'office-ui-fabric-react';
import ProductCustomerDetails from './ProductCustomerDetails';
import EntityInput from './EntityInput';
import ProfileTypeInput from '../orderMeasurements/ProfileTypeInput';
import MeasurementInput from '../orderMeasurements/MeasurementInput';
import FreshMeasurementInput from '../orderMeasurements/valueMeasurementInputs/FreshMeasurementInput';
import BaseMeasurementInput from '../orderMeasurements/valueMeasurementInputs/BaseMeasurementInput';
import BodyMeasurementInput from '../orderMeasurements/valueMeasurementInputs/BodyMeasurementInput';
import StyleSelectorInput from '../orderStyles/styleSelector/StyleSelectorInput';
import { scrollablePaneStyleForDetailList } from '../../../../../common/fabric-styles/styles';

export interface IProfileFormMarkupProps {
  measurements: Measurement[];
  product: ProductCategory;
  customer: StoreCustomer;
  formik: any;
}

export const ProfileFormMarkup: React.FC<IProfileFormMarkupProps> = (
  props: IProfileFormMarkupProps
) => {
  return (
    <ScrollablePane
      styles={{
        ...scrollablePaneStyleForDetailList,
        root: { ...scrollablePaneStyleForDetailList.root, top: '0px' },
      }}
    >
      <Stack horizontal tokens={{ childrenGap: '24px' }}>
        <ProductCustomerDetails
          customer={props.customer}
          product={props.product}
        />

        <Stack horizontal tokens={{ childrenGap: '24px' }}>
          <Stack tokens={{ childrenGap: '12px' }}>
            <EntityInput formik={props.formik} />

            <Stack tokens={{ childrenGap: '12px' }}>
              <ProfileTypeInput
                formik={props.formik}
                availableMeasurements={props.measurements}
                orderProfile={null}
              />

              <MeasurementInput
                measurements={props.measurements}
                formik={props.formik}
                orderProfile={null}
              />

              <FreshMeasurementInput
                formik={props.formik}
                orderProfile={null}
              />

              <BaseMeasurementInput formik={props.formik} orderProfile={null} />

              <BodyMeasurementInput formik={props.formik} orderProfile={null} />

              {props.formik.values.profileType === ProfileTypes.Reference ? (
                <Text
                  block
                  styles={{
                    root: {
                      marginTop: '15px !important',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: '#a19f9d',
                    },
                  }}
                >
                  {'Customer should provide fit shirt to replicate measurement'}
                </Text>
              ) : null}
            </Stack>

            <Stack>
              <StyleSelectorInput formik={props.formik} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </ScrollablePane>
  );
};

export default ProfileFormMarkup;
