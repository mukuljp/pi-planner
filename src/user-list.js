import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  2: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  1: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

export default function LetterAvatars() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar>H</Avatar>
      <Avatar  className={classes[2]} >N</Avatar>
      <Avatar className={classes[1]}>OP</Avatar>  
      <Avatar className={classes[1]}>OP</Avatar>  
    </div>
  );
}