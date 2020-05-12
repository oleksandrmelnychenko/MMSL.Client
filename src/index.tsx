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
import * as authAction from './redux/actions/auth.actions';

import { loadTheme, createTheme, ITheme } from 'office-ui-fabric-react';
import { initializeIcons } from 'office-ui-fabric-react';

const mmslTheme: ITheme = createTheme({
  palette: {
    themePrimary: '#403f3d',
    themeLighterAlt: '#fafcf4',
    themeLighter: '#eaf4d2',
    themeLight: '#d9ebae',
    themeTertiary: '#b6d767',
    themeSecondary: '#97c52e',
    themeDarkAlt: '#7eaa16',
    themeDark: '#6a8f13',
    themeDarker: '#4e6a0e',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#000000',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  },
  fonts: {
    medium: {
      fontFamily: '"Montserrat", sans-serif',
    },
  },
});

loadTheme(mmslTheme);
initializeIcons();

const history = createBrowserHistory();
const store = initStore(history);

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
    store.dispatch(authAction.authSuccessSignInAction(true));
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
