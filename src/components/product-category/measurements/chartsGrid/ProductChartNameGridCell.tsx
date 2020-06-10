import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField, Text } from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../common/fabric-styles/styles';
import { Measurement, MeasurementMapSize } from '../../../../interfaces';
import { ProductCategory } from '../../../../interfaces/products';
import { measurementActions } from '../../../../redux/slices/measurement.slice';
import { assignPendingActions } from '../../../../helpers/action.helper';
import './chartGridCell.scss';

export interface IProductChartNameGridCellProps {
  mapSize: MeasurementMapSize | null | undefined;
  measurementChart: Measurement | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const CELL_VALUE_STUB = '-';

const ProductChartNameGridCell: React.FC<IProductChartNameGridCellProps> = (
  props: IProductChartNameGridCellProps
) => {
  const dispatch = useDispatch();

  const [inputEditRef] = useState<any>(React.createRef());
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [sizeName, setSizeName] = useState<string | null | undefined>(null);
  const [outputValue, setOutputValue] = useState<string | undefined>();

  if (sizeName !== props?.mapSize?.measurementSize?.name) {
    setSizeName(props?.mapSize?.measurementSize?.name);
  }

  useEffect(() => {
    if (sizeName) {
      if (sizeName !== '') {
        setOutputValue(sizeName);
      } else {
        setOutputValue(CELL_VALUE_STUB);
      }
    } else {
      setOutputValue(CELL_VALUE_STUB);
    }
  }, [sizeName]);

  useEffect(() => {
    if (
      isInEditMode &&
      inputEditRef &&
      inputEditRef.current &&
      inputEditRef.focus
    ) {
      inputEditRef.current.focus();
    }
  }, [isInEditMode, inputEditRef, outputValue]);

  const init = {
    sizeName: outputValue,
  };

  return (
    <div className="chartGridCell">
      {isInEditMode ? (
        <Formik
          validationSchema={Yup.object().shape({
            sizeName: Yup.string().nullable(),
          })}
          initialValues={init}
          onSubmit={(values: any) => {}}
        >
          {(formik) => {
            return (
              <Form>
                <Field name="sizeName">
                  {() => (
                    <TextField
                      styles={{ root: { position: 'absolute', top: '6px' } }}
                      autoFocus
                      componentRef={inputEditRef}
                      value={formik.values.sizeName}
                      onChange={(args: any) => {
                        let value = args.target.value;

                        formik.setFieldValue('sizeName', value);
                        formik.setFieldTouched('sizeName');
                      }}
                      onBlur={(args: any) => {
                        let normalizedOutputValue =
                          outputValue !== CELL_VALUE_STUB ? outputValue : '';
                        if (
                          normalizedOutputValue !== formik.values.sizeName &&
                          props.mapSize &&
                          props.mapSize.measurementSize &&
                          props.measurementChart
                        ) {
                          const sizePayload: any = {
                            id: props.mapSize.measurementSizeId,
                            name: formik.values.sizeName,
                            description:
                              props.mapSize.measurementSize.description,
                            measurementId: props.measurementChart.id,
                            valueDataContracts: [],
                          };

                          let action = assignPendingActions(
                            measurementActions.apiUpdateMeasurementSize(
                              sizePayload
                            ),
                            [],
                            [],
                            (args: any) => {
                              setOutputValue(formik.values.sizeName);
                              setIsInEditMode(false);
                            },
                            (args: any) => {}
                          );

                          dispatch(action);
                        } else {
                          setIsInEditMode(false);
                        }
                      }}
                    />
                  )}
                </Field>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <Text
          block
          onDoubleClick={() => setIsInEditMode(true)}
          style={defaultCellStyle}
        >
          {outputValue}
        </Text>
      )}
    </div>
  );
};

export default ProductChartNameGridCell;
