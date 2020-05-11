import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Translate,
  getTranslate,
  getActiveLanguage,
  LocalizeState,
} from 'react-localize-redux';

import './account.scss';
import { IApplicationState } from '../../redux/reducers';
import * as authAction from '../../redux/actions/auth.actions';
import { PreloaderModule } from '../../common/preloader/preloader.module/Preloader.module';
import { IAuthentication } from '../../interfaces';

const SignUp: React.FC = () => {
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

  const handleClearErrorMessages = () =>
    errorMessage && dispatch(authAction.clearErrorMessage());

  const RegistrationSchema = Yup.object().shape({
    email: Yup.string()
      .email(() => translate('emailIsNotCorrect'))
      .required(() => translate('emailIsRequired')),
    password: Yup.string()
      .min(8, () => translate('passwordLength'))
      .required(() => translate('passwordRequired')),
    repeatedPassword: Yup.string()
      .required(() => translate('repeatPasswordRequired'))
      .test(
        'passwords-match',
        () => translate('passwordMatch'),
        function (value) {
          return this.parent.password === value;
        }
      ),
  });

  return (
    <div className="container-flex-center bg-auth">
      {isActiveForm && <PreloaderModule />}
      <div className="account__form">
        <div className="account__logo"></div>
        <div className="account__form-title">
          <Translate id="titleSignUp" />
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
            repeatedPassword: '',
          }}
          validateOnBlur={false}
          validationSchema={RegistrationSchema}
          onSubmit={(values) => {
            handleClearErrorMessages();
            setIsActiveForm(true);
            const data: IAuthentication = {
              email: values.email,
              password: values.password,
            };
            dispatch(authAction.signUpAction(data));
          }}>
          {({ errors, touched }) => (
            <Form>
              <div className="form-group">
                <Field
                  name="email"
                  type="email"
                  spellCheck="false"
                  placeholder={translate('enterEmail')}
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
              <div className="form-group">
                <Field
                  name="repeatedPassword"
                  type="password"
                  spellCheck="false"
                  placeholder={translate('enterRepeatedPassword')}
                  className="form-group__field"
                  onFocus={handleClearErrorMessages}
                  autoComplete="new-password"
                />
                {errors.repeatedPassword && touched.repeatedPassword ? (
                  <div className="form-group__error-message-validate">
                    {errors.repeatedPassword}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isActiveForm}>
                <Translate id="Registred" />
              </button>
            </Form>
          )}
        </Formik>
        <hr />
        <Link
          to={`/${languageCode}/account-security/sign-in`}
          className="btn btn-link"
          onClick={handleClearErrorMessages}>
          <Translate id="signIn" />
        </Link>
        <div className="copyright">
          <Translate id="copyright" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
