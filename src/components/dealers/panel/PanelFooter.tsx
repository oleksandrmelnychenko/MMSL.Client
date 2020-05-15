import React from 'react';
import { ActionButton } from 'office-ui-fabric-react';

import './panel-footer.scss';

class PanelFooterProps {
  constructor() {
    this.onSaveClick = () => {};
  }

  onSaveClick?: () => void;
}

export const PanelFooter: React.FC<PanelFooterProps> = (
  props: PanelFooterProps
) => {
  return (
    <div className="panel__footer">
      <ActionButton
        iconProps={{ iconName: 'Save' }}
        allowDisabledFocus
        onClick={() => {
          if (props.onSaveClick) {
            props.onSaveClick();
          }
        }}
      >
        Save
      </ActionButton>
    </div>
  );
};

export default PanelFooter;
