import React, { useState, useEffect } from 'react';
import {
  DefaultButton,
  ISearchBoxStyles,
  IContextualMenuItem,
  TextField,
  Text,
  Stack,
  IconButton,
} from 'office-ui-fabric-react';
import { OptionUnit, UnitValue } from '../../../../interfaces/options';
import { List } from 'linq-typescript';

export interface IUnitValuesInputProps {
  optionUnit: OptionUnit | null | undefined;
  onCallback: (
    dirtyUnitValues: UnitValueModel[],
    dirtyValuesToDelete: UnitValueModel[]
  ) => void;
}

export class UnitValueModel {
  private _initValueNumber: number;
  private _unitValue: UnitValue;
  private _isStub: boolean;

  constructor(unitValue: UnitValue, isStub?: boolean) {
    this._initValueNumber = unitValue.value;
    this._unitValue = unitValue;

    this.isDeleted = false;
    this.index = 0;

    this.text = `${unitValue.value}`;

    if (isStub !== null && isStub !== undefined) {
      this._isStub = isStub;
      this.text = 'Add unit values';
    } else {
      this._isStub = false;
    }
  }

  isDeleted: boolean;
  index: number;

  resolveIsStub = () => this._isStub;

  resolveIsDirty: () => boolean = () => {
    let isDirty = false;

    if (!this.resolveIsStub()) {
      if (this._unitValue.id === 0) {
        isDirty = true;
      } else {
        if (
          this.isDeleted !== this._unitValue.isDeleted ||
          this.text !== `${this._unitValue.value}`
        ) {
          isDirty = true;
        }
      }
    }

    return isDirty;
  };

  getUnitValueId: () => number = () =>
    this._unitValue ? this._unitValue.id : 0;

  text: string;
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
        .concat(buildUnitValueModels(props.optionUnit))
        .toArray()
    );
    setDeletedValues([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.optionUnit]);

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

  const buildUnitValueModels = (optionUnit: OptionUnit | null | undefined) => {
    let result: UnitValueModel[] = [];

    if (optionUnit) {
      result = new List(optionUnit.unitValues)
        .select((unitValue: UnitValue) => {
          let selectResult = new UnitValueModel(unitValue);

          return selectResult;
        })
        .toArray();
    }

    return result;
  };

  const buildNewUnitValueModel = (valueInput: string) => {
    const unitValue = new UnitValue();
    unitValue.optionUnit = props.optionUnit;
    unitValue.optionUnitId = props.optionUnit ? props.optionUnit.id : 0;
    unitValue.value = parseFloat(valueInput);

    if (isNaN(unitValue.value)) {
      unitValue.value = 0;
    }

    const unitValueModel = new UnitValueModel(unitValue);

    return unitValueModel;
  };

  const onRenderUnitValueItem = (item: any, dismissMenu: any) => {
    let contentResult = <div style={{ height: '0px', width: '0px' }}></div>;

    if (item && item.unitValueModel) {
      if (!item.unitValueModel.resolveIsStub()) {
        contentResult = (
          <Stack horizontal horizontalAlign="space-between">
            <Text>{item.text}</Text>
            <IconButton
              iconProps={{
                iconName: 'Settings',
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
      <div>
        <div>
          <TextField
            type="number"
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
        </div>

        {defaultRender(menuListProps)}
      </div>
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
    <DefaultButton
      onRenderText={(props?: any) => {
        let textOutput = '';

        values.forEach((item: UnitValueModel, index: number) => {
          if (values.length > 1) {
            if (!item.resolveIsStub()) {
              textOutput += `${item.text}`;
              if (index !== values.length - 1) {
                textOutput += ', ';
              }
            }
          } else {
            textOutput += `${item.text}`;
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
        flexContainer: { justifyContent: 'flex-start' },
        menuIcon: { display: 'none' },
      }}
      menuProps={{
        styles: {
          root: {
            margin: '6px',
          },
          list: {
            marginTop: '12px',
          },
        },
        onRenderMenuList: onRenderMenuList,
        shouldFocusOnMount: true,
        items: values.map((item, index) => {
          return {
            key: `${index}`,
            text: item.text,
            index: index,
            onRender: onRenderUnitValueItem,
            unitValueModel: item,
          } as IContextualMenuItem;
        }),
        useTargetWidth: true,
      }}
    />
  );
};

export default UnitValuesInput;
