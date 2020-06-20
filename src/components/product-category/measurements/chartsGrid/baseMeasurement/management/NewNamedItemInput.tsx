import React, { useState, useEffect } from 'react';
import { Stack, TextField, ActionButton } from 'office-ui-fabric-react';
import './newNamedItemInput.scss';

export class NewNamedItemInputProps {
  constructor() {
    this.label = '';
    this.onReleaseInputCallback = (input: string) => {};
  }

  label: string;
  onReleaseInputCallback: (input: string) => void;
}

export const NewNamedItemInput: React.FC<NewNamedItemInputProps> = (
  props: NewNamedItemInputProps
) => {
  const [isRowInputVisible, setIsRowInputVisible] = useState(false);
  const [input, setInput] = useState<string>('');
  const [inputRef] = useState<any>(React.createRef());

  /// Efect to focus on new "main" row item input
  useEffect(() => {
    if (isRowInputVisible && inputRef && inputRef.current && inputRef.focus) {
      inputRef.focus();
    }
  }, [isRowInputVisible, inputRef]);

  const onReleaseInput: () => void = () => {
    if (input && input.length > 0 && props.onReleaseInputCallback) {
      props.onReleaseInputCallback(input);
    }

    setInput('');
  };

  return (
    <div className="newNamedItemInput">
      <Stack>
        <ActionButton
          onClick={() => {
            setIsRowInputVisible(!isRowInputVisible);
            onReleaseInput();
          }}
          iconProps={{
            iconName: 'BoxAdditionSolid',
            styles: {
              root: {
                fontSize: '20px',
              },
            },
          }}
          styles={{
            root: {
              position: 'relative',
              left: '-9px',
            },
          }}
          allowDisabledFocus
        >
          {props.label}
        </ActionButton>

        <Stack tokens={{ childrenGap: '12px' }}>
          {isRowInputVisible ? (
            <Stack.Item>
              <div className="measurementsForm__rowInput">
                <div className="measurementsForm__rowInput__innerBorder">
                  <TextField
                    autoFocus
                    componentRef={inputRef}
                    value={input}
                    onKeyPress={(args: any) => {
                      if (args) {
                        if (args.charCode === 13) {
                          onReleaseInput();

                          setIsRowInputVisible(false);
                        }
                      }
                    }}
                    onChange={(args: any) => {
                      setInput(args.target.value ? args.target.value : '');
                    }}
                    onFocus={(args: any) => {}}
                    onBlur={(args: any) => {
                      onReleaseInput();

                      setIsRowInputVisible(false);
                    }}
                    borderless={true}
                    resizable={false}
                  />
                </div>
              </div>
            </Stack.Item>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};

export default NewNamedItemInput;
