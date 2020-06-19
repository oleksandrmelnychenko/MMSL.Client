import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import {
  Text,
  IDropdownOption,
  Dropdown,
  IDropdown,
  IKeytipProps,
  ICalloutProps,
} from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../../interfaces/measurements';
import { ProductCategory } from '../../../../../interfaces/products';
import '../baseMeasurement/chartGridCell.scss';
import {
  FittingType,
  MeasurementUnit,
} from '../../../../../interfaces/fittingTypes';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';
import { IApplicationState } from '../../../../../redux/reducers';
import { List } from 'linq-typescript';

export interface IBodySizeUnitsCellProps {
  fittingType: FittingType;
  measurementChart: Measurement | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const _resolveDefaultSelectedOptionKey = (
  options: IDropdownOption[],
  fittingTypeForEdit?: FittingType | null | undefined
) => {
  let defaultSelectKey: string = '';

  if (fittingTypeForEdit) {
    defaultSelectKey = `${fittingTypeForEdit.measurementUnitId}`;
  } else {
    defaultSelectKey = options.length > 0 ? `${options[0].key}` : '';
  }

  return defaultSelectKey;
};

const BodySizeUnitsCell: React.FC<IBodySizeUnitsCellProps> = (
  props: IBodySizeUnitsCellProps
) => {
  const dispatch = useDispatch();

  const [inputEditRef] = useState<any>(React.createRef<IDropdown>());
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [sizeUnit, setSizeUnit] = useState<MeasurementUnit | null | undefined>(
    null
  );
  const [unitOptions, setUnitOptions] = useState<IDropdownOption[]>([]);

  const unitsOfMeasurement = useSelector<IApplicationState, MeasurementUnit[]>(
    (state) => state.unitsOfMeasurement.unitsOfMeasurement
  );

  const fittingTypes = useSelector<IApplicationState, FittingType[]>(
    (state) => state.fittingTypes.fittingTypes
  );

  useEffect(() => {
    setUnitOptions(
      unitsOfMeasurement.map((unit: MeasurementUnit, index: number) => {
        return {
          key: `${unit.id}`,
          text: unit.description,
          // isSelected: index === 0,
          unitOfMeasurement: unit,
        } as IDropdownOption;
      })
    );
  }, [unitsOfMeasurement]);

  if (sizeUnit?.id !== props?.fittingType?.measurementUnitId) {
    setSizeUnit(props?.fittingType?.measurementUnit);
  }

  useEffect(() => {
    if (isInEditMode && inputEditRef && inputEditRef.current) {
      inputEditRef.current!.focus();
    }
  }, [isInEditMode, inputEditRef, sizeUnit]);

  const onCompleteEditing = (input: MeasurementUnit | null | undefined) => {
    if (
      input &&
      props.fittingType &&
      props.measurementChart &&
      input.id !== props.fittingType.measurementUnitId
    ) {
      const payload = {
        id: props.fittingType.id,
        type: props.fittingType.type,
        measurementUnitId: input.id,
        measurementUnit: { ...input },
        measurementId: props.fittingType.measurementId,
        measurementMapValues: [],
      };
      dispatch(
        assignPendingActions(
          fittingTypesActions.apiUpdateFittingType(payload),
          [],
          [],
          (args: any) => {
            setIsInEditMode(false);

            dispatch(
              fittingTypesActions.changeFittingTypes(
                new List(fittingTypes)
                  .select((item) => {
                    let selectResult = item;

                    if (item.id === args.body.id) selectResult = args.body;

                    return selectResult;
                  })
                  .toArray()
              )
            );
          },
          (args: any) => {}
        )
      );
    } else {
      setIsInEditMode(false);
    }
  };

  let init = {
    sizeUnit: sizeUnit,
  };

  return (
    <div className="chartGridCell">
      {isInEditMode ? (
        <Formik
          validationSchema={Yup.object().shape({
            sizeUnit: Yup.object().nullable(),
          })}
          initialValues={init}
          onSubmit={(values: any) => {}}
        >
          {(formik) => {
            return (
              <Form>
                <Field name="sizeUnit">
                  {() => (
                    <Dropdown
                      styles={{
                        root: {
                          position: 'absolute',
                          top: '6px',
                          width: 'calc(100% - 20px)',
                          border: '0px solid #0179d4',
                        },
                        title: {
                          border: '2px solid #0179d4',
                          borderColor: '#0179d4 !important',
                        },
                      }}
                      notifyOnReselect={true}
                      defaultSelectedKey={_resolveDefaultSelectedOptionKey(
                        unitOptions,
                        props.fittingType
                      )}
                      componentRef={inputEditRef}
                      placeholder="Choose Unit of Measurement"
                      options={unitOptions}
                      openOnKeyboardFocus={true}
                      onDismiss={() => {
                        onCompleteEditing(
                          formik.values.sizeUnit ? formik.values.sizeUnit : null
                        );
                      }}
                      onChange={(
                        event: React.FormEvent<HTMLDivElement>,
                        option?: IDropdownOption,
                        index?: number
                      ) => {
                        if (option) {
                          formik.setFieldValue(
                            'sizeUnit',
                            (option as any).unitOfMeasurement
                          );
                          formik.setFieldTouched('sizeUnit');
                        }
                        onCompleteEditing((option as any).unitOfMeasurement);
                      }}
                      onKeyPress={(args: any) => {
                        if (args) {
                          if (args.charCode === 13) {
                            onCompleteEditing(
                              formik.values.sizeUnit
                                ? formik.values.sizeUnit
                                : null
                            );
                          }
                        }
                      }}
                      onBlur={(args: any) =>
                        onCompleteEditing(
                          formik.values.sizeUnit ? formik.values.sizeUnit : null
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
            {sizeUnit ? sizeUnit.description : ''}
          </Text>
        </div>
      )}
    </div>
  );
};

export default BodySizeUnitsCell;
