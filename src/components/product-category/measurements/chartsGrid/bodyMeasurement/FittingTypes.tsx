import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';
import { IApplicationState } from '../../../../../redux/reducers';
import { Measurement } from '../../../../../interfaces/measurements';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { FittingType } from '../../../../../interfaces/fittingTypes';
import { CommandBarButton, FontWeights } from 'office-ui-fabric-react';
import FittinTypeGrid from './FittinTypeGrid';
import FittingTypeForm from './management/FittingTypeForm';
import { controlActions } from '../../../../../redux/slices/control.slice';

export const CREATE_YOUR_FIRST_FITTING_TYPE: string =
  'Create your first fitting type';
export const CREATE_FITTING_TYPE: string = 'Create fitting type';

const _addFirstFittingTypeButtonStyle = {
  root: {
    marginTop: '72px',
    marginLeft: '32px',
    height: '35px',
    background: '#f0f0f0',
    borderRadius: '2px',
    padding: '0 12px',
  },
  label: {
    fontWeight: FontWeights.regular,
  },
  rootHovered: {
    background: '#e5e5e5',
  },
};

const FittingTypes: React.FC = () => {
  const dispatch = useDispatch();

  const targetMeasurement: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const fittingTypes: FittingType[] = useSelector<
    IApplicationState,
    FittingType[]
  >((state) => state.fittingTypes.fittingTypes);

  useEffect(() => {
    if (targetMeasurement) {
      dispatch(
        assignPendingActions(
          fittingTypesActions.apiGetFittingTypesByMeasurementId(
            targetMeasurement.id
          ),
          [],
          [],
          (args: any) => {
            dispatch(fittingTypesActions.changeFittingTypes([]));
          },
          (args: any) => {}
        )
      );
    } else {
      dispatch(fittingTypesActions.changeFittingTypes([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMeasurement]);

  const addNewFittingType = () => {
    /// TODO:

    if (targetMeasurement) {
      dispatch(
        controlActions.openRightPanel({
          title: 'Add fitting type',
          width: '400px',
          closeFunctions: () => {
            dispatch(controlActions.closeRightPanel());
          },
          component: FittingTypeForm,
        })
      );
    }
  };

  return (
    <div className="fittingTypes">
      <FittinTypeGrid />

      {fittingTypes && fittingTypes.length < 1 ? (
        <CommandBarButton
          onClick={() => addNewFittingType()}
          height={20}
          styles={_addFirstFittingTypeButtonStyle}
          iconProps={{ iconName: 'Add' }}
          text="Add first fitting type"
        />
      ) : null}
    </div>
  );
};

export default FittingTypes;
