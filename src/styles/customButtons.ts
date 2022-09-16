import * as React from 'react';
import { styled } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import {theme} from './base';

export const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #fdd835 30%, #fbc02d 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: '#222',
  height: 48,
  padding: '0 30px',
});

export const ModalConfirmButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  color: theme.palette.primary.contrastText,
  width: 150,
  height: 50,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
  }
});

export const ModalCancelButton = styled(Button)({
  backgroundColor: '#ececec',
  borderWidth: 1,
  borderColor: '#ececec',
  borderRadius: 3,
  color: '#222',
  width: 150,
  height: 50,
  boxShadow: 'none',

  '&:hover': {
    backgroundColor: '#d6d6d6',
    borderColor: '#d6d6d6',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: '#c5c5c5',
    borderColor: '#c5c5c5',
    boxShadow: 'none',
  }
});