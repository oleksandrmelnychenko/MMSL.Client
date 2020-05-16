import { FontWeights } from 'office-ui-fabric-react';

export const panelStyle = {
  main: {
    margin: '16px',
    'border-radius': '6px',
    boxShadow:
      ' 0 25.6px 57.6px rgba(0,0,0,.22), 0 4.8px 14.4px rgba(0,0,0,.18)',
  },
};

export const btnMenuStyle = {
  root: {
    minWidth: '90px',
    width: '90px',
    height: '70px',
    paddingRight: '0px',
    paddingLeft: '0px',
    border: 'none',
    background: '#faf9f8',
    rootHovered: {
      border: 'none',
    },
    selectors: {
      'root:hover': { background: '#faf9f8' },
    },
  },
};

export const labelStyle = {
  root: {
    width: '90px',
    fontSize: '14px',
    textAlign: 'center',
    'font-weight': 400,
    cursor: 'pointer',
    transition: 'all 0.3s ease',

    selectors: {
      '&:hover': {
        background: '#faf9f8',
        textDecoration: 'underline',
      },
    },
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

export const datePickerStyles = {
  styles: {
    subComponentStyles: {
      label: {
        root: {
          fontWeight: FontWeights.regular,
          paddingTop: '15px',
          paddingBottom: '5px',
        },
      },
    },
  },
};

export const commandBarStyles = {
  root: {
    background: '#f0f0f0',
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
    paddingTop: '13px',
    paddingBottom: '0',
  },
  title: {},
};

export const toggleStyles = {
  root: {
    paddingTop: '10px',
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
