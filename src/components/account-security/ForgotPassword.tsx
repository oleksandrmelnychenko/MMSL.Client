import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Translate,
  getTranslate,
  LocalizeState,
  getActiveLanguage,
} from 'react-localize-redux';

import './account.scss';
import { IApplicationState } from '../../redux/reducers';
import * as authAction from '../../redux/actions/auth.actions';
import { PreloaderModule } from '../../common/preloader/preloader.module/Preloader.module';

export const ForgotPassword: React.FC = () => {
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
          <Translate id="titleForgotPassword" />
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
            setIsActiveForm(true);
            console.log(values);
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
                  onFocus={handleClearErrorMessages}
                />
                {errors.email && touched.email ? (
                  <div className="form-group__error-message-validate">
                    {errors.email}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isActiveForm}>
                <Translate id="SendEmail" />
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

export default ForgotPassword;
