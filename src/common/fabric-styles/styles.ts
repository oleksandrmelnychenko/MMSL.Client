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
        fontWeight: FontWeights.regular,
        paddingTop: '15px',
        paddingBottom: '5px',
      },
      selectors: {
        '&:after': {
          content: '',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '1px',
          height: '1px',
          background: 'red',
        },
      },
    },
  },
};

export const commandBarStyles = {
  root: {
    background: '#edebe9',
    borderRadius: '6px',
    marginBottom: '30px',
  },
  primarySet: {
    color: '#323130',
    'justify-content': 'flex-end',
  },
};

export const commandBarButtonStyles = {
  root: {
    background: 'transparent',
    margin: '0 5px',
  },
};

export const dropDownStyles = {
  label: {
    fontWeight: FontWeights.regular,
    paddingBottom: '2px',
  },
  root: {
    paddingTop: '15px',
    paddingBottom: '5px',
  },
  title: {},
};

export const toggleStyles = {
  root: {
    paddingTop: '15px',
    paddingBottom: '5px',
    margin: '2px',
    'justify-content': 'space-between',
  },
  label: {
    fontWeight: FontWeights.regular,
  },
};

export const btnStyle = {
  root: {
    marginTop: '20px',
    float: 'right',
  },
};
