import React, { useState } from 'react';
import {
  CommandBar,
  ICommandBarItemProps,
  values,
} from 'office-ui-fabric-react';
import {
  commandBarStyles,
  commandBarButtonStyles,
} from '../../common/fabric-styles/styles';
import { FormicReference } from '../../interfaces';
import ReportsForm from './ReportsForm';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Reports: React.FC = () => {
  const initValues = { userName: '' };

  const _items: ICommandBarItemProps[] = [
    {
      key: 'Save',
      text: 'Save',
      //   disabled: !isDirtyForm,
      iconProps: { iconName: 'Save' },
      onClick: () => {
        // let formik: any = formikReference.formik;
        // if (formik !== undefined && formik !== null) {
        //   formik.submitForm();
        // }
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Reset',
      text: 'Reset',
      //   disabled: !isDirtyForm,
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        // formikReference.formik.resetForm();
      },
      buttonStyles: commandBarButtonStyles,
    },
  ];
  return (
    <div></div>
    // <Formik
    //   initialValues={{ name: 'jared' }}
    //   onSubmit={(values, actions) => {
    //     setTimeout(() => {
    //       alert(JSON.stringify(values, null, 2));
    //       actions.setSubmitting(false);
    //     }, 1000);
    //   }}>
    //   {(props) => {
    //     console.log(props);
    //     return (
    // <ReportsForm props={props} />
    //   <form onSubmit={props.handleSubmit}>
    //     <input
    //       type="text"
    //       onChange={props.handleChange}
    //       onBlur={props.handleBlur}
    //       value={props.values.name}
    //       name="name"
    //     />
    //     {props.errors.name && <div id="feedback">{props.errors.name}</div>}
    //     <button type="submit">Submit</button>
    //   </form>
    // );
    // }}
    // </Formik>
  );
};

export default Reports;
