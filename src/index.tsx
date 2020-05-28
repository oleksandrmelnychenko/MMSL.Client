import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import * as serviceWorker from './serviceWorker';
import { initStore } from './redux/store/store.config';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  LocalizeProvider,
  initialize,
  setActiveLanguage,
  Language,
} from 'react-localize-redux';

import './assets/styles/App.scss';
import { IApplicationState } from './redux/reducers';
import { default as Routing } from './components/Routing';
import globalTranslations from './assets/translation/translations.json';
import { TokenHelper } from './helpers/token.helper';
import StoreHelper from './helpers/store.helper';
import { authActions } from './redux/slices/auth.slice';

import { loadTheme, createTheme, ITheme } from 'office-ui-fabric-react';
import { initializeIcons } from 'office-ui-fabric-react';
import { push } from 'react-router-redux';

const mmslTheme: ITheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  },
  fonts: {
    medium: {
      fontFamily: '"Segoe-UI", sans-serif',
    },
  },
});

loadTheme(mmslTheme);
initializeIcons();

const history = createBrowserHistory();
const store = initStore(history);
StoreHelper.init(store);

store.dispatch(
  initialize({
    languages: [{ name: 'English', code: 'en' }],
    translation: globalTranslations,
    options: {
      renderToStaticMarkup,
      defaultLanguage: 'en',
    },
  })
);

let language = (store.getState() as IApplicationState).localize.languages[0]
  .code;
let localizationFromQuery = window.location.pathname.substr(1).split('/')[0];

const checkLocalization: number = (store.getState() as IApplicationState).localize.languages
  .map((languages: Language) => languages.code)
  .indexOf(localizationFromQuery);

if (checkLocalization !== -1) {
  const index = checkLocalization;
  language = (store.getState() as IApplicationState).localize.languages[index]
    .code;
}

store.dispatch(setActiveLanguage(language));

const onInit = ({ store }: { store: any; language: string }) => {
  if (TokenHelper.isAuthenticated()) {
    store.dispatch(authActions.authSuccessSignInAction(true));
  } else {
    store.dispatch(push('/'));
  }
};

ReactDOM.render(
  <Provider store={store}>
    <LocalizeProvider store={store}>
      <Router history={history}>
        <Routing onEnter={onInit({ store, language })} />
      </Router>
    </LocalizeProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
