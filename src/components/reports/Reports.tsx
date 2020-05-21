import React, { useState } from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react';
import {
  commandBarStyles,
  commandBarButtonStyles,
} from '../../common/fabric-styles/styles';
import ReportsForm from './ReportsForm';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Reports: React.FC = () => {
  const initValues = { userName: 'TEST' };

  // const _items: ICommandBarItemProps[] = ;
  return (
    <Formik
      initialValues={initValues}
      onSubmit={(values, actions) => {
        console.log(values, 'SUbmit');
      }}>
      {(props) => {
        console.log(props);
        return (
          <>
            <div>
              <CommandBar
                styles={commandBarStyles}
                items={[
                  {
                    key: 'Save',
                    text: 'Save',
                    disabled: !props.dirty,
                    iconProps: { iconName: 'Save' },
                    onClick: () => {
                      props.handleSubmit();
                    },
                    buttonStyles: commandBarButtonStyles,
                  },
                  {
                    key: 'Reset',
                    text: 'Reset',
                    disabled: !props.dirty,
                    iconProps: { iconName: 'Refresh' },
                    onClick: () => {
                      props.resetForm();
                    },
                    buttonStyles: commandBarButtonStyles,
                  },
                ]}
                className="dealers__store__controls"
              />
            </div>
            <ReportsForm formik={props} />
          </>
        );
      }}
    </Formik>
  );
};

export default Reports;
