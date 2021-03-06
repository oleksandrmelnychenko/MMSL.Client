import React, { useState, useEffect } from 'react';
import {
  DefaultButton,
  IContextualMenuItem,
  TextField,
  Text,
  Stack,
  IconButton,
  Separator,
} from 'office-ui-fabric-react';
import { OptionUnit, UnitValue } from '../../../../interfaces/options';
import { List } from 'linq-typescript';

export interface IUnitValuesInputProps {
  optionUnit: OptionUnit | null | undefined;
  unitValues: UnitValue[];
  onCallback: (
    dirtyUnitValues: UnitValueModel[],
    dirtyValuesToDelete: UnitValueModel[]
  ) => void;
}

export class UnitValueModel {
  private _initValue: string;
  private _unitValue: UnitValue;
  private _isStub: boolean;

  constructor(unitValue: UnitValue, isStub?: boolean) {
    this._initValue = unitValue.value;
    this._unitValue = unitValue;

    this.isDeleted = false;
    this.index = 0;

    this.value = `${unitValue.value}`;

    if (isStub !== null && isStub !== undefined) {
      this._isStub = isStub;
      this.value = '';
    } else {
      this._isStub = false;
    }
  }

  isDeleted: boolean;
  index: number;

  value: string;

  resolveIsStub = () => this._isStub;

  resolveIsDirty: () => boolean = () => {
    let isDirty = false;

    if (!this.resolveIsStub()) {
      if (this._unitValue.id === 0) {
        isDirty = true;
      } else {
        if (
          this.isDeleted !== this._unitValue.isDeleted ||
          this.value !== `${this._unitValue.value}`
        ) {
          isDirty = true;
        }
      }
    }

    return isDirty;
  };

  getUnitValueId: () => number = () =>
    this._unitValue ? this._unitValue.id : 0;
}

const _buildStubValueModel = () => new UnitValueModel(new UnitValue(), true);

const UnitValuesInput: React.FC<IUnitValuesInputProps> = (
  props: IUnitValuesInputProps
) => {
  const [values, setValues] = useState<UnitValueModel[]>([
    _buildStubValueModel(),
  ]);
  const [deletedValues, setDeletedValues] = useState<UnitValueModel[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    setValues(
      new List([_buildStubValueModel()])
        .concat(buildUnitValueModels(props.unitValues))
        .toArray()
    );
    setDeletedValues([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.unitValues]);

  useEffect(() => {
    props.onCallback(
      new List(values)
        .where((valueItem) => valueItem.resolveIsDirty())
        .toArray(),
      new List(deletedValues)
        .where((valueItem) => valueItem.resolveIsDirty())
        .toArray()
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, deletedValues]);

  const buildUnitValueModels = (unitValues: UnitValue[]) => {
    let result: UnitValueModel[] = [];

    result = new List(unitValues)
      .select((unitValue: UnitValue) => {
        let selectResult = new UnitValueModel(unitValue);

        return selectResult;
      })
      .toArray();

    return result;
  };

  const buildNewUnitValueModel = (valueInput: string) => {
    const unitValue = new UnitValue();
    unitValue.optionUnit = props.optionUnit;
    unitValue.optionUnitId = props.optionUnit ? props.optionUnit.id : 0;
    unitValue.value = valueInput;

    const unitValueModel = new UnitValueModel(unitValue);

    return unitValueModel;
  };

  const onRenderUnitValueItem = (item: any, dismissMenu: any) => {
    let contentResult = <div style={{ height: '0px', width: '0px' }}></div>;

    if (item && item.unitValueModel) {
      if (!item.unitValueModel.resolveIsStub()) {
        contentResult = (
          <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
            styles={{ root: { margin: '0px 2px' } }}
          >
            <Text>{item.text}</Text>
            <IconButton
              iconProps={{
                iconName: 'Cancel',
                styles: {
                  root: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#a4373a',
                  },
                },
              }}
              onClick={() => {
                if (item && item.unitValueModel && item.index < values.length) {
                  const valuesList = new List(values);
                  valuesList.removeAt(item.index);

                  if (item.unitValueModel.getUnitValueId() !== 0) {
                    if (
                      !new List(deletedValues).any(
                        (deletedItem) =>
                          deletedItem.getUnitValueId() ===
                          item.unitValueModel.getUnitValueId()
                      )
                    ) {
                      item.unitValueModel.isDeleted = true;
                      setDeletedValues(
                        new List(deletedValues)
                          .concat([item.unitValueModel])
                          .toArray()
                      );
                    }
                  }

                  setValues(valuesList.toArray());
                }
              }}
            />
          </Stack>
        );
      }
    }

    return contentResult;
  };

  const onRenderMenuList = (menuListProps: any, defaultRender: any) => {
    return (
      <Stack>
        <TextField
          autoFocus
          styles={{
            fieldGroup: {
              border: '1px solid rgb(240, 240, 240)',
              borderColor: 'rgb(240, 240, 240) !important',
              background: 'rgb(240, 240, 240)',
            },
          }}
          value={input}
          placeholder="Enter new unit value"
          onAbort={() => {}}
          onChange={(args: any) => {
            setInput(args?.target?.value ? args.target.value : '');
          }}
          onKeyPress={(args: any) => {
            if (args) {
              if (args.charCode === 13) {
                onReleaseInput();
              }
            }
          }}
          onBlur={(args: any) => {
            onReleaseInput();
          }}
        />

        <Separator />

        {menuListProps.items.length === 1 &&
        menuListProps.items[0].unitValueModel.resolveIsStub() ? (
          <Text
            styles={{
              root: {
                fontWeight: 400,
                fontSize: '12px',
                color: '#a19f9d',
                textAlign: 'center',
              },
            }}
          >
            {'No values'}
          </Text>
        ) : null}

        {defaultRender(menuListProps)}
      </Stack>
    );
  };

  const onReleaseInput: () => void = () => {
    if (input && input.length > 0) {
      const newunitValueModel = buildNewUnitValueModel(input);

      setValues(new List(values).concat([newunitValueModel]).toArray());
    }

    setInput('');
  };

  return (
    <Stack tokens={{ childrenGap: '4px' }}>
      <Text styles={{ root: { cursor: 'default' } }}>Values</Text>

      <DefaultButton
        onRenderText={(props?: any) => {
          let textOutput = '';

          values.forEach((item: UnitValueModel, index: number) => {
            if (values.length > 1) {
              if (!item.resolveIsStub()) {
                textOutput += `${item.value}`;
                if (index !== values.length - 1) {
                  textOutput += ', ';
                }
              }
            } else {
              textOutput += `${item.value}`;
            }
          });

          return (
            <Text
              key="0"
              block
              nowrap
              styles={{
                root: { textAlign: 'left' },
              }}
            >
              {textOutput}
            </Text>
          );
        }}
        styles={{
          icon: { display: 'none' },
          root: { padding: '0px 9px' },
          rootHovered: {
            cursor: 'text',
            background: 'white',
          },
          flexContainer: { justifyContent: 'flex-start' },
          menuIcon: { display: 'none' },
        }}
        menuProps={{
          styles: {
            root: {
              margin: '9px',
            },
            list: {
              marginTop: '12px',
            },
          },
          onRenderMenuList: onRenderMenuList,
          items: values.map((item, index) => {
            return {
              key: `${index}`,
              text: item.value,
              index: index,
              onRender: onRenderUnitValueItem,
              unitValueModel: item,
            } as IContextualMenuItem;
          }),
          shouldFocusOnMount: true,
          useTargetWidth: true,
        }}
      />
    </Stack>
  );
};

export default UnitValuesInput;
