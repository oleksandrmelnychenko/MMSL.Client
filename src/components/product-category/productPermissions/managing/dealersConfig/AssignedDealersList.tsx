import React from 'react';
import { Stack, Text, Label } from 'office-ui-fabric-react';
import { DealerAccount } from '../../../../../interfaces/dealer';
import './assignedDealersList.scss';

/// Build single hint lable
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

export class AssignedDealersListProps {
  constructor() {
    this.selectedDealer = null;
    this.dealers = [];

    this.onSelectDealerCallback = (
      dealer: DealerAccount | null | undefined
    ) => {};
  }

  selectedDealer: DealerAccount | null | undefined;
  dealers: DealerAccount[];
  onSelectDealerCallback: (dealer: DealerAccount | null | undefined) => void;
}

export const AssignedDealersList: React.FC<AssignedDealersListProps> = (
  props: AssignedDealersListProps
) => {
  const renderDealer = (dealer: DealerAccount, dealerIndex: number) => {
    return (
      <div
        className={
          dealer.id === props.selectedDealer?.id
            ? 'assignedDealersList__dealer selected'
            : 'assignedDealersList__dealer'
        }
        key={dealerIndex}
        onClick={() => {
          if (props.selectedDealer !== dealer) {
            props.onSelectDealerCallback(dealer);
          }
        }}
      >
        <Stack tokens={{ childrenGap: 0 }}>
          <Text className="assignedDealersList__dealer__title">
            {dealer.companyName}
          </Text>
          <Text className="assignedDealersList__dealer__subTitle">
            {dealer.name}
          </Text>
        </Stack>
      </div>
    );
  };

  return (
    <div className="assignedDealersList">
      {props.dealers.length > 0 ? (
        <Stack>
          {props.dealers.map((dealer: DealerAccount, index: number) =>
            renderDealer(dealer, index)
          )}
        </Stack>
      ) : (
        _renderHintLable(
          'There are no allowed dealers for current style permission.'
        )
      )}
    </div>
  );
};

export default AssignedDealersList;
