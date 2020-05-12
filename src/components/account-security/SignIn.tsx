import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import {
  Translate,
  getTranslate,
  LocalizeState,
  getActiveLanguage,
} from 'react-localize-redux';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './account.scss';
import { IApplicationState } from '../../redux/reducers';
import * as authAction from '../../redux/actions/auth.actions';
import { PreloaderModule } from '../../common/preloader/preloader.module/Preloader.module';
import { IAuthentication } from '../../interfaces';

export const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const errorMessage = useSelector<IApplicationState, string>(
    (state) => state.auth.errorMessage
  );
  const translate = getTranslate(localize);

  const languageCode = getActiveLanguage(localize).code;
  const [isActiveForm, setIsActiveForm] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsActiveForm(false);
    }
  }, [errorMessage]);

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email(() => translate('emailIsNotCorrect'))
      .required(() => translate('emailIsRequired')),
    password: Yup.string()
      .min(8, () => translate('passwordLength'))
      .required(() => translate('passwordRequired')),
  });

  const handleClearErrorMessages = () =>
    errorMessage && dispatch(authAction.clearErrorMessage());

  return (
    <div className="container-flex-center">
      {isActiveForm && <PreloaderModule />}

      <div className="account__form">
        <div className="account__logo"></div>
        <div className="account__form-title">
          <Translate id="titleSignIn" />
        </div>
        {errorMessage && (
          <div className="error-body">
            <div className="error-message">
              <Translate id={errorMessage} />
            </div>
          </div>
        )}
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validateOnBlur={false}
          validationSchema={SignInSchema}
          onSubmit={(values) => {
            handleClearErrorMessages();
            setIsActiveForm(true);
            const data: IAuthentication = {
              email: values.email,
              password: values.password,
            };

            dispatch(authAction.signInAction(data));
          }}>
          {({ errors, touched }) => (
            <Form>
              <div className="form-group">
                <Field
                  name="email"
                  type="text"
                  placeholder={translate('enterEmail')}
                  spellCheck="false"
                  className="form-group__field"
                  autoComplete="off"
                  onFocus={handleClearErrorMessages}
                />
                {errors.email && touched.email ? (
                  <div className="form-group__error-message-validate">
                    {errors.email}
                  </div>
                ) : null}
              </div>
              <div className="form-group">
                <Field
                  name="password"
                  type="password"
                  spellCheck="false"
                  placeholder={translate('enterPassword')}
                  className="form-group__field"
                  onFocus={handleClearErrorMessages}
                  autoComplete="new-password"
                />
                {errors.password && touched.password ? (
                  <div className="form-group__error-message-validate">
                    {errors.password}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isActiveForm}>
                <Translate id="signIn" />
              </button>
            </Form>
          )}
        </Formik>
        <Link
          to={`/${languageCode}/account-security/forgot-password`}
          className="account__forgot-psw"
          onClick={handleClearErrorMessages}>
          <Translate id="forgotPassword" />
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
