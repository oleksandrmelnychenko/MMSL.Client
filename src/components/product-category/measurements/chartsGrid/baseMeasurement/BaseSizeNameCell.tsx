import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField, Text } from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../../common/fabric-styles/styles';
import {
  Measurement,
  MeasurementMapSize,
} from '../../../../../interfaces/measurements';
import { ProductCategory } from '../../../../../interfaces/products';
import { measurementActions } from '../../../../../redux/slices/measurements/measurement.slice';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import './chartGridCell.scss';

export interface IBaseSizeNameCellProps {
  mapSize: MeasurementMapSize | null | undefined;
  measurementChart: Measurement | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const CELL_VALUE_STUB = '-';

const BaseSizeNameCell: React.FC<IBaseSizeNameCellProps> = (
  props: IBaseSizeNameCellProps
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

  const onCompleteEditing = (input: string) => {
    if (
      input !== outputValue &&
      input &&
      input.length > 0 &&
      props.mapSize &&
      props.mapSize.measurementSize &&
      props.measurementChart
    ) {
      const sizePayload: any = {
        id: props.mapSize.measurementSizeId,
        name: input,
        description: props.mapSize.measurementSize.description,
        measurementId: props.measurementChart.id,
        valueDataContracts: [],
      };

      dispatch(
        assignPendingActions(
          measurementActions.apiUpdateMeasurementSize(sizePayload),
          [],
          [],
          (args: any) => {
            if (props?.mapSize?.measurementSize) {
              props.mapSize.measurementSize.name = input ? input : '';
            }

            setOutputValue(input);
            setIsInEditMode(false);
          },
          (args: any) => {}
        )
      );
    } else {
      setIsInEditMode(false);
    }
  };

  const init = {
    sizeName: outputValue,
  };

  return (
    <div className="chartGridCell">
      {isInEditMode ? (
        <Formik
          validationSchema={Yup.object().shape({
            sizeName: Yup.string().required(() => 'Size name is required'),
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
                      onKeyPress={(args: any) => {
                        if (args) {
                          if (args.charCode === 13) {
                            onCompleteEditing(
                              formik.values.sizeName
                                ? formik.values.sizeName
                                : ''
                            );
                          }
                        }
                      }}
                      onChange={(args: any) => {
                        let value = args.target.value;

                        formik.setFieldValue('sizeName', value);
                        formik.setFieldTouched('sizeName');
                      }}
                      onBlur={(args: any) =>
                        onCompleteEditing(
                          formik.values.sizeName ? formik.values.sizeName : ''
                        )
                      }
                    />
                  )}
                </Field>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <div
          className="chartGridCell__readonlyContainer"
          onDoubleClick={() => setIsInEditMode(true)}
        >
          <Text block style={defaultCellStyle}>
            {outputValue}
          </Text>
        </div>
      )}
    </div>
  );
};

export default BaseSizeNameCell;
