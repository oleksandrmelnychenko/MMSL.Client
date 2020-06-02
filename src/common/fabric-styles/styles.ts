import {
  FontWeights,
  ITextStyles,
  IStackTokens,
  mergeStyles,
  IImageProps,
} from 'office-ui-fabric-react';
import {
  ICardSectionTokens,
  ICardSectionStyles,
  ICardTokens,
} from '@uifabric/react-cards';

export const panelStyle = {
  main: {
    margin: '16px',
    'border-radius': '6px',
    boxShadow:
      ' 0 25.6px 57.6px rgba(0,0,0,.22), 0 4.8px 14.4px rgba(0,0,0,.18)',
  },
};

export const detailsListStyle = {};

export const imageProps: Partial<IImageProps> = {
  styles: {
    root: {
      margin: '0 auto',
    },
  },
};

export const stylesPanelInfo = {
  main: {
    left: '45px',
    top: '51px',
    width: '138px',
    height: 'calc(100vh - 76px)',
    borderRight: '1px solid #e8e8e8',
    boxShadow: 'none',
  },
};

export const scrollablePaneStyleForDetailList = {
  root: {
    top: '77px',
    bottom: '12px',
  },
};

export const scrollablePaneStyleForDetailListWithDoubleHeader = {
  root: {
    top: '90px',
    bottom: '10px',
  },
};

export const scrollablePaneStyleForStylesList = {
  root: {
    top: '77px',
    bottom: '12px',
    paddingLeft: '18px',
  },
};

export const scrollablePaneStyleForDetailList_Dealers = {
  root: {
    bottom: '12px',
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

export const btnUploadStyle = {
  root: {
    width: '100%',
    background: '#fff',
    color: 'rgb(0, 120, 212)',
    border: '1px dashed rgb(0, 120, 212)',
    transition: 'all 0.3s ease 0.3s',
  },
  rootHovered: {
    background: '#fff',
    borderStyle: 'solid',
    color: 'rgb(0, 120, 212)',
  },
  label: {
    fontWeight: FontWeights.regular,
  },
};

export const columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

export const labelStyle = {
  root: {
    width: '90px',
    paddingBottom: '20px',
    fontSize: '12px',
    lineHeight: '14px',
    textAlign: 'center',
    'font-weight': 400,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',

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

export const textFildUnderlineLabelStyles = {
  wrapper: {
    padding: '0px',
    borderColor: '#f0f0f0',
  },
  subComponentStyles: {
    label: {
      root: {
        fontWeight: FontWeights.regular,
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

export const comboBoxStyles = {
  label: {
    fontWeight: FontWeights.regular,
    paddingTop: '15px',
    paddingBottom: '5px',
  },
  optionsContainer: {
    maxHeight: '30vh',
  },
};

export const cellStyle = {
  paddingLeft: '7px',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  color: '#000',
};
export const defaultCellStyle = {
  color: '#000',
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

export const textStyles: ITextStyles = {
  root: {
    color: '#505050',
    fontWeight: 400,
  },
};

export const footerCardSectionStyles: ICardSectionStyles = {
  root: {
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingBottom: '5px',
    borderTop: '1px solid #F3F2F1',
  },
};

export const footerCardSectionTokens: ICardSectionTokens = {
  padding: '12px 0px 0px',
};

export const cardTokens: ICardTokens = {
  childrenGap: '12px',
  maxWidth: '200px',
  maxHeight: '200px',
  height: '200px',
};

export const mainTitleContent = {
  root: {
    color: '#484848',
  },
};

export const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 20,
  padding: '5px 10px 5px 6px',
};

export const searchBoxStyles = { root: { width: 200 } };

export const editCardIcon = {
  root: {
    color: '#fff',
  },
};

export const deleteIconRedColor = {
  root: {
    color: '#fff',
  },
};

export const cardIcon = mergeStyles({
  fontSize: 16,
  paddingRight: '5px',
  cursor: 'default',
  display: 'inline-block',
});

export const cardText = {
  root: {
    color: '#484848',
    fontWeight: FontWeights.regular,
    width: '120px',
  },
};

export const cardStyle = {
  root: {
    minWidth: '200px',
    padding: '9px',
    borderRadius: '6px',
  },
};

export const marginImageCenter = {
  root: { margin: '0 auto', height: '140px' },
};

export const stackStyleList = {
  root: {
    height: '40px',
    borderBottom: '1px solid #dfdfdf',
    borderTop: '1px solid #dfdfdf',
    paddingTop: '5px',
    paddingBottom: '5px',
    marginBottom: '15px',
    marginTop: '15px',
  },
};
export const textStackStyle = {
  root: {
    fontSize: '16px',
  },
};
