import React from 'react';
import './hintStub.scss';
import {
  Stack,
  Image,
  Label,
  IImageProps,
  PrimaryButton,
} from 'office-ui-fabric-react';
import NoMeasurementImg from '../../../assets/images/no-objects/noneMeasurement.svg';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { DashboardHintStubProps } from '../../../redux/slices/control.slice';

const HintStub: React.FC = () => {
  const dashboardStubHint = useSelector<
    IApplicationState,
    DashboardHintStubProps
  >((state) => state.control.dashboardHintStub);

  const imageProps: Partial<IImageProps> = {
    styles: {
      root: {
        margin: '0 auto',
      },
    },
  };

  return (
    <div className="hintStub">
      <div className="hintStub__centeredContainer">
        <Stack>
          <Image {...imageProps} src={NoMeasurementImg} />
          <Label
            styles={{
              root: {
                color: '#484848',
                fontSize: '18px',
              },
            }}
          >
            {dashboardStubHint?.title}
          </Label>
          {dashboardStubHint.isButtonAvailable ? (
            <Stack.Item align={'center'}>
              <PrimaryButton
                text={dashboardStubHint?.buttonLabel}
                onClick={() => {
                  if (dashboardStubHint?.buttonAction) {
                    dashboardStubHint.buttonAction();
                  }
                }}
              />
            </Stack.Item>
          ) : null}
        </Stack>
      </div>
    </div>
  );
};

export default HintStub;
