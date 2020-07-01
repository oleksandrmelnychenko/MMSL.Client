import React from 'react';
import { Label, Stack } from 'office-ui-fabric-react';
import StyleGroupItem from './StyleGroupItem';
import { List } from 'linq-typescript';
import { IStyleUnitModel } from './StyleUnitItem';

export interface IStyleSelectorInputProps {
  formik: any;
}

const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

export const StyleSelectorInput: React.FC<IStyleSelectorInputProps> = (
  props: IStyleSelectorInputProps
) => {
  const groupedItems = new List(props.formik.values.productStyleValues)
    .groupBy((item: any) => item.groupId)
    .toArray();

  return (
    <>
      <Stack tokens={{ childrenGap: 9 }}>
        {groupedItems.length > 0
          ? groupedItems.map((item: any, index: number) => {
              const units: IStyleUnitModel[] = item.value.toArray();

              return (
                <StyleGroupItem
                  key={index}
                  groupId={item.key}
                  groupName={units.length > 0 ? units[0].groupName : ''}
                  unitModels={units}
                  formik={props.formik}
                />
              );
            })
          : _renderHintLable(
              'There are no available styles for this product. Contact with your manufacturer'
            )}
      </Stack>
    </>
  );
};

export default StyleSelectorInput;
