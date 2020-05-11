import React from 'react';
import './dealers.scss';
import { DefaultButton } from 'office-ui-fabric-react';
import { Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import DealerDetails from './DealerDetails';
import DealerStores from './DealerStores';
import DealerList from './DealerList';
import { DealerView } from '../../redux/reducers/dealer.reducer';
import * as dealerActions from '../../redux/actions/dealer.actions';

export const Dealers: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const languageCode = getActiveLanguage(localize).code;

  const dealerView = useSelector<IApplicationState, DealerView>(
    (state) => state.dealer.selectedView
  );

  let content: any = null;

  if (dealerView === DealerView.List) content = <DealerList />;
  else if (dealerView === DealerView.Details) content = <DealerDetails />;
  else if (dealerView === DealerView.Stores) content = <DealerStores />;

  return (
    <div className="dealers">
      <div className="dealers__header">
        <div className="dealers__title">Dealer</div>
        <div className="dealers__navigation">
          <ul>
            <li>
              <DefaultButton
                text="List"
                allowDisabledFocus
                onClick={() =>
                  dispatch(dealerActions.changeDealerView(DealerView.List))
                }
              />
            </li>
            <li>
              <DefaultButton
                text="Dealer details"
                allowDisabledFocus
                onClick={() =>
                  dispatch(dealerActions.changeDealerView(DealerView.Details))
                }
              />
            </li>
            <li>
              {' '}
              <DefaultButton
                text="Dealer stores"
                allowDisabledFocus
                onClick={() =>
                  dispatch(dealerActions.changeDealerView(DealerView.Stores))
                }
              />
            </li>
          </ul>
        </div>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default Dealers;
