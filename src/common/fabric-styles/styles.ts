import { FontWeights } from 'office-ui-fabric-react';

export const panelStyle = {
  main: {
    margin: '16px',
    'border-radius': '6px',
    boxShadow:
      ' 0 25.6px 57.6px rgba(0,0,0,.22), 0 4.8px 14.4px rgba(0,0,0,.18)',
  },
};

export const textFildLabelStyles = {
  subComponentStyles: {
    label: {
      root: {
        fontWeight: FontWeights.semibold,
        paddingTop: '15px',
        paddingBottom: '5px',
      },
    },
  },
};

export const dropDownStyles = {
  // dropdown: { width: 300 },
  label: {
    fontWeight: FontWeights.semibold,
    paddingBottom: '2px',
  },
  title: {},
};

export const toggleStyles = {
  root: {
    margin: '2px',
    'justify-content': 'space-between',
  },
  label: {
    fontWeight: FontWeights.semibold,
  },
};

export const btnStyle = {
  root: {
    marginTop: '20px',
    float: 'right',
  },
};
