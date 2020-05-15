import React from 'react';
import { Text, Stack, ActionButton } from 'office-ui-fabric-react';

import './panelTitle.scss';

class PanelTitleProps {
  constructor() {
    this.onSaveClick = () => {};
    this.title = '';
  }

  title: string;
  onSaveClick?: () => void;
}

export const PanelTitle: React.FC<PanelTitleProps> = (
  props: PanelTitleProps
) => {
  return (
    <div className="panelTitle">
      <Stack
        tokens={{ childrenGap: 20 }}
        horizontal
        className="panelTitle__panelHeader">
        <Text className="panelTitle__title">{props.title}</Text>

        {/* <ActionButton
          styles={{ root: { marginTop: '-3px' } }}
          iconProps={{ iconName: 'Save' }}
          allowDisabledFocus
          onClick={() => {
              props.onSaveClick();
          }}>
          Save
        </ActionButton> */}
      </Stack>
    </div>
  );
};

export default PanelTitle;
