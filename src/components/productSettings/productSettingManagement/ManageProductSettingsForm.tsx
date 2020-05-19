import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  MaskedTextField,
  DatePicker,
  ComboBox,
  Text,
  DayOfWeek,
  IComboBoxOption,
  List,
  DetailsList,
  Selection,
  IColumn,
  IconButton,
  IDragDropContext,
  mergeStyles,
  getTheme,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import { useDispatch } from 'react-redux';

export class OptionItem {
  constructor() {
    this.name = '';
    this.imageSource = '';
    this.orderIndex = 0;
  }

  name: string;
  imageSource: string;
  orderIndex: number;
}

export class CreateProductSettingsFormInitValues {
  constructor() {
    this.name = '';
    this.optionUnits = [];
  }

  name: string;
  optionUnits: OptionItem[];
}

/// TODO:
const buildNewEntity = (values: any, sourceEntity?: any) => {
  let newAccount: any = {};

  /// TODO:

  return newAccount;
};

/// TODO:
const initDefaultValues = (sourceEntity?: any | null) => {
  const initValues = new CreateProductSettingsFormInitValues();

  /// TODO:

  return initValues;
};

const _columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

const _columns: IColumn[] = [
  {
    key: 'index',
    name: '#',
    minWidth: 16,
    maxWidth: 24,
    onColumnClick: () => {},
    onRender: (item: any, index?: number) => {
      return (
        <Text>{index !== null && index !== undefined ? index + 1 : -1}</Text>
      );
    },
  },
  {
    key: 'userName',
    name: 'User Name',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text>{item.name}</Text>;
    },
    isPadded: true,
  },
  {
    key: 'email',
    name: 'Email',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text>{item.email}</Text>;
    },
    isPadded: true,
  },
  {
    key: 'actions',
    name: 'Actions',
    minWidth: 70,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return (
        <Stack horizontal disableShrink>
          <IconButton
            styles={_columnIconButtonStyle}
            height={20}
            iconProps={{ iconName: 'Settings' }}
            title="Settings"
            ariaLabel="Settings"
          />
        </Stack>
      );
    },
    isPadded: true,
  },
];

class ManageProductSettingsFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.productSetting = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  productSetting?: any | null;
  submitAction: (args: any) => void;
}

export const ManageProductSettingsForm: React.FC<ManageProductSettingsFormProps> = (
  props: ManageProductSettingsFormProps
) => {
  const [draggedItem, setDraggedItem] = useState<any | null | undefined>();
  const [draggedIndex, setDraggedIndex] = useState<number>(-1);
  const [selection] = useState<Selection>(new Selection());
  const [HARDCODED_ITEMS, setHARDCODED_ITEMS] = useState<any[]>([
    { name: 'option 1 ' },
    { name: 'option 2 ' },
    { name: 'option 3 ' },
    { name: 'option 4 ' },
  ]);

  const initValues = initDefaultValues(props.productSetting);

  const theme = getTheme();
  const dragEnterClass = mergeStyles({
    backgroundColor: theme.palette.neutralLight,
  });

  const _insertBeforeItem = (item: any) => {
    const draggedItems = selection.isIndexSelected(draggedIndex)
      ? (selection.getSelection() as any[])
      : [draggedItem!];

    const insertIndex = HARDCODED_ITEMS.indexOf(item);
    const items = HARDCODED_ITEMS.filter(
      (itm) => draggedItems.indexOf(itm) === -1
    );

    items.splice(insertIndex, 0, ...draggedItems);

    setHARDCODED_ITEMS(items);
  };

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string().required(() => 'Name is required'),
          optionUnits: Yup.object()
            .nullable()
            .required(() => `Option units are required`),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          //   props.submitAction(
          //     buildNewStoreCustomerAccount(
          //       values,
          //       props.customer as StoreCustomer
          //     )
          //   );
        }}
        validateOnBlur={false}
      >
        {(formik) => {
          props.formikReference.formik = formik;
          if (props.formikReference.isDirtyFunc)
            props.formikReference.isDirtyFunc(formik.dirty);

          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field name="name">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.name}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Name"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('name', value);
                              formik.setFieldTouched('name');
                            }}
                            errorMessage={
                              formik.errors.name && formik.touched.name ? (
                                <span className="form__group__error">
                                  {formik.errors.name}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <DetailsList
                      selection={selection}
                      dragDropEvents={{
                        canDrop: (
                          dropContext?: IDragDropContext,
                          dragContext?: IDragDropContext
                        ) => {
                          return true;
                        },
                        canDrag: (item?: any) => {
                          return true;
                        },
                        onDragEnter: (item?: any, event?: DragEvent) => {
                          // return string is the css classes that will be added to the entering element.
                          return dragEnterClass;
                        },
                        onDragLeave: (item?: any, event?: DragEvent) => {
                          return;
                        },
                        onDrop: (item?: any, event?: DragEvent) => {
                          if (draggedItem) {
                            _insertBeforeItem(item);
                          }
                        },
                        onDragStart: (
                          item?: any,
                          itemIndex?: number,
                          selectedItems?: any[],
                          event?: MouseEvent
                        ) => {
                          setDraggedItem(item);
                          setDraggedIndex(itemIndex!);
                        },
                        onDragEnd: (item?: any, event?: DragEvent) => {
                          setDraggedItem(undefined);
                          setDraggedIndex(-1);
                        },
                      }}
                      columns={_columns}
                      isHeaderVisible={false}
                      items={HARDCODED_ITEMS}
                    ></DetailsList>
                  </Stack>
                </Stack>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ManageProductSettingsForm;
