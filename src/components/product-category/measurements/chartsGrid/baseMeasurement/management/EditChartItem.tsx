import React, { useEffect, useState } from 'react';
import { Stack, TextField, IconButton, Text } from 'office-ui-fabric-react';
import './editChartItem.scss';

export class ChartItemInitPayload {
  constructor() {
    this.name = '';
    this.isDeleted = false;
    this.orderIndex = 0;
    this.rawSource = null;
  }

  name: string;
  isDeleted: boolean;
  orderIndex: number;
  rawSource: any;
}

export interface IChartItemInputState {
  name: string;
  isRemoved: boolean;
}

export class EditChartItemProps {
  constructor() {
    this.payload = new ChartItemInitPayload();
    this.isDirtyCheck = () => false;
    this.onEditCompleted = (inputState: IChartItemInputState) => {};
  }

  innerRef?: any;
  payload: ChartItemInitPayload;
  isDirtyCheck: () => boolean;
  onEditCompleted: (inputState: IChartItemInputState) => void;
}

export const EditChartItem: React.FC<EditChartItemProps> = (
  props: EditChartItemProps
) => {
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [inputEditRef] = useState<any>(React.createRef());
  const [nameInput, setNameInput] = useState<string>('');
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  useEffect(() => {}, []);

  return (
    <div ref={props.innerRef} className="editChartItem">
      <div
        className={
          props.isDirtyCheck()
            ? 'measurementsForm__definitionItem isDirty'
            : 'measurementsForm__definitionItem'
        }
      >
        <div className="measurementsForm__definitionItem__options">
          <Stack
            tokens={{ childrenGap: '5px' }}
            styles={{ root: { margin: '6px' } }}
            horizontal
            horizontalAlign="end"
          >
            <IconButton
              onClick={() => {
                setIsInEditMode(true);
                setNameInput(props.payload.name);
              }}
              styles={{
                root: {
                  height: '27px',
                  width: '27px',
                  border: '1px solid rgba(199,224,244,1)',
                },
              }}
              iconProps={{
                iconName: 'EditSolid12',
                styles: {
                  root: {
                    fontSize: '14px',
                  },
                },
              }}
              title="Edit name"
            />
            <IconButton
              onClick={() => {
                setIsRemoved(true);

                props.onEditCompleted({
                  name: props.payload.name,
                  isRemoved: true,
                });
              }}
              styles={{
                root: {
                  height: '27px',
                  width: '27px',
                  border: '1px solid rgba(199,224,244,1)',
                },
              }}
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
              title="Delete"
            />
          </Stack>
        </div>

        {isInEditMode ? (
          <div className="measurementsForm__definitionItem__editNameInput">
            <TextField
              autoFocus
              componentRef={inputEditRef}
              borderless
              value={nameInput}
              onKeyPress={(args: any) => {
                if (args) {
                  if (args.charCode === 13) {
                    setIsInEditMode(false);

                    props.onEditCompleted({
                      name: nameInput,
                      isRemoved: isRemoved,
                    });
                  }
                }
              }}
              onChange={(args: any) => {
                setNameInput(args.target.value);
              }}
              onBlur={(args: any) => {
                setIsInEditMode(false);

                props.onEditCompleted({
                  name: nameInput,
                  isRemoved: isRemoved,
                });
              }}
            />
          </div>
        ) : (
          <Text nowrap block styles={{ root: { maxWidth: '250px' } }}>
            {props.payload.name}
          </Text>
        )}
      </div>
    </div>
  );
};

export default EditChartItem;
