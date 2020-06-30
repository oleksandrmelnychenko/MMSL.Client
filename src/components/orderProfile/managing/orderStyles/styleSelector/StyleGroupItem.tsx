import React from 'react';
import { Stack, Separator, Text } from 'office-ui-fabric-react';
import StyleUnitItem, { IStyleUnitModel } from './StyleUnitItem';

export interface IStyleGroupItemProps {
  groupId: number;
  groupName: string;
  unitModels: IStyleUnitModel[];
  formik: any;
}

export const StyleGroupItem: React.FC<IStyleGroupItemProps> = (
  props: IStyleGroupItemProps
) => {
  return (
    <div className="styleGroupItem">
      <Stack tokens={{ childrenGap: 9 }}>
        <Stack.Item align="start">
          <Text>{props.groupName}</Text>
        </Stack.Item>

        {props.unitModels && props.unitModels.length > 0 ? (
          <Stack.Item align="start">
            <Stack wrap={true} horizontal tokens={{ childrenGap: 20 }}>
              {props.unitModels.map((item: IStyleUnitModel, index: number) => (
                <StyleUnitItem
                  key={index}
                  formik={props.formik}
                  unitModel={item}
                />
              ))}
            </Stack>
          </Stack.Item>
        ) : null}

        <Separator />
      </Stack>
    </div>
  );
};

export default StyleGroupItem;
