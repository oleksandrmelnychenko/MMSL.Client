import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField, Text } from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../../interfaces/measurements';
import { ProductCategory } from '../../../../../interfaces/products';
import '../baseMeasurement/chartGridCell.scss';
import { FittingType } from '../../../../../interfaces/fittingTypes';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';

export interface IBodySizeValueCellProps {
  fittingType: FittingType | null | undefined;
  measurementChart: Measurement | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const CELL_VALUE_STUB = '';

const BodySizeTypeCell: React.FC<IBodySizeValueCellProps> = (
  props: IBodySizeValueCellProps
) => {
  const dispatch = useDispatch();

  const [inputEditRef] = useState<any>(React.createRef());
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [sizeType, setSizeType] = useState<string | null | undefined>(null);
  const [outputValue, setOutputValue] = useState<string | undefined>();

  if (sizeType !== props?.fittingType?.type) {
    setSizeType(props?.fittingType?.type);
  }

  useEffect(() => {
    if (sizeType) {
      if (sizeType !== '') {
        setOutputValue(sizeType);
      } else {
        setOutputValue(CELL_VALUE_STUB);
      }
    } else {
      setOutputValue(CELL_VALUE_STUB);
    }
  }, [sizeType]);

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
    if (input !== outputValue && props.fittingType && props.measurementChart) {
      const payload = {
        id: props.fittingType.id,
        type: input,
        measurementUnitId: props.fittingType.measurementUnitId,
        measurementId: props.fittingType.measurementId,
        measurementMapValues: [],
      };

      dispatch(
        assignPendingActions(
          fittingTypesActions.apiUpdateFittingType(payload),
          [],
          [],
          (args: any) => {
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

  let init = {
    sizeType: outputValue,
  };

  return (
    <div className="chartGridCell">
      {isInEditMode ? (
        <Formik
          validationSchema={Yup.object().shape({
            sizeType: Yup.string().nullable(),
          })}
          initialValues={init}
          onSubmit={(values: any) => {}}
        >
          {(formik) => {
            return (
              <Form>
                <Field name="sizeType">
                  {() => (
                    <TextField
                      styles={{
                        root: {
                          position: 'absolute',
                          top: '6px',
                          marginRight: '9px',
                        },
                      }}
                      autoFocus
                      componentRef={inputEditRef}
                      value={formik.values.sizeType}
                      onKeyPress={(args: any) => {
                        if (args) {
                          if (args.charCode === 13) {
                            onCompleteEditing(
                              formik.values.sizeType
                                ? formik.values.sizeType
                                : ''
                            );
                          }
                        }
                      }}
                      onChange={(args: any) => {
                        let value = args.target.value;

                        formik.setFieldValue('sizeType', value);
                        formik.setFieldTouched('sizeType');
                      }}
                      onBlur={(args: any) =>
                        onCompleteEditing(
                          formik.values.sizeType ? formik.values.sizeType : ''
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

export default BodySizeTypeCell;
