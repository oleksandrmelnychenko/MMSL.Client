import React from 'react';
import { Text, Stack } from 'office-ui-fabric-react';

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
        className="panelTitle__panelHeader"
      >
        <Text className="panelTitle__title">{props.title}</Text>
      </Stack>
    </div>
  );
};

export default PanelTitle;
